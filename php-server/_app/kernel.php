<?php

require_once __DIR__ . "/.env.php";

function env(string $key)
{
    return $_ENV[$key];
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (
    env("APP_DEBUG") ||
    $_GET["debug"] ?? null === env("REMOTE_DEBUG_KEY")
) {
    ini_set("display_errors", 1);
    error_reporting(E_ALL);

    mysqli_report(MYSQLI_REPORT_ALL);
}

class Request
{
    public ?User $user = null;

    public function method(): string
    {
        return $_SERVER["REQUEST_METHOD"];
    }

    public function input(string $key)
    {
        return $_POST[$key] ?? null;
    }

    public function file(string $key)
    {
        return $_FILES[$key] ?? null;
    }

    public function query(string $key)
    {
        return $_GET[$key] ?? null;
    }

    function user(): ?User
    {
        return $this->user;
    }
}

class User
{
    public int $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }
}

function request(): Request
{
    global $app;

    return $app["request"];
}

function url(string $path): string
{
    return env("APP_URL") . $path;
}

function storage_put(string $path, array $file)
{
    $filename = $path . DIRECTORY_SEPARATOR .
        uniqid() . "." . pathinfo($file["name"], PATHINFO_EXTENSION);

    $destination = __DIR__ . DIRECTORY_SEPARATOR .
        "storage" . DIRECTORY_SEPARATOR .
        $filename;

    if (
        $file["error"] !== UPLOAD_ERR_OK ||

        !move_uploaded_file($file["tmp_name"], $destination)
    ) {
        return false;
    }

    return $filename;
}

function storage_delete(string $path): bool
{
    return unlink(__DIR__ . DIRECTORY_SEPARATOR . "storage" . DIRECTORY_SEPARATOR . $path);
}

function mysqli(): mysqli
{
    global $mysqli;

    if (isset($mysqli)) {
        return $mysqli;
    }

    $mysqli = new mysqli(
        env("DB_HOST"),
        env("DB_USERNAME"),
        env("DB_PASSWORD"),
        env("DB_DATABASE"),
    );

    if ($mysqli->connect_error) {
        http_response_code(500);
        exit;
    }

    return $mysqli;
}

function create_auth_token(int $user_id): string
{
    $payload = base64_encode(
        json_encode(["user_id" => $user_id])
    );

    $signature = hash_hmac("sha256", $payload, env("APP_KEY"));

    return "$payload.$signature";
}

function ensure_user_is_event_participant(int $user_id, int $event_id)
{
    $sql = <<<SQL
        SELECT COUNT(*) FROM dolanyuk_participants WHERE event = ? AND user = $user_id
    SQL;

    if (
        !($statement = mysqli()->prepare($sql)) ||

        !$statement->bind_param("i", $event_id) ||

        !$statement->execute() ||

        !($result = $statement->get_result()) ||

        !($row = $result->fetch_array())
    ) {
        http_response_code(500);
        exit;
    }

    if ($row[0] === 0) {
        http_response_code(401);
        exit;
    }
}

$app["request"] = new Request;

if ($bearer = $_SERVER["HTTP_AUTHORIZATION"]) {
    $token = explode(".", substr($bearer, 7));

    if (
        !hash_equals(
            hash_hmac("sha256", $token[0], env("APP_KEY")),
            $token[1],
        )
    ) {
        http_response_code(401);
        exit;
    }

    $payload = json_decode(
        base64_decode($token[0])
    );

    $app["request"]->user = new User($payload->user_id);
}

$route = pathinfo(
    basename($_SERVER["REQUEST_URI"]),
    PATHINFO_FILENAME,
);

$guest_routes = ["auth", "register"];

if (
    !in_array($route, $guest_routes) &&

    !request()->user()
) {
    http_response_code(401);
    exit;
}
