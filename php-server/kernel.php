<?php

require __DIR__ . "/.env.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_ENV["APP_DEBUG"]) {
    ini_set("display_errors", 1);
    error_reporting(E_ALL);
    mysqli_report(MYSQLI_REPORT_ALL);
}

class Request
{
    private array $data;

    public function __construct()
    {
        $this->data = $_POST;
    }

    public function input(string $key)
    {
        return $this->data[$key] ?? null;
    }

    function user(): User
    {
        global $user;

        if (!isset($user)) {
            $user = null;
        }

        return $user;
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

function request()
{
    global $request;

    if (isset($request)) {
        return $request;
    }

    $request = new Request;

    return $request;
}

function mysqli(): mysqli
{
    global $mysqli;

    if (isset($mysqli)) {
        return $mysqli;
    }

    $mysqli = new mysqli(
        $_ENV["DB_HOST"], $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"], $_ENV["DB_DATABASE"]
    );

    if ($mysqli->connect_error) {
        http_response_code(500);
        exit;
    }

    return $mysqli;
}

$route = basename($_SERVER["REQUEST_URI"]);

$guest_routes = ["auth.php", "register.php"];

if (!in_array($route, $guest_routes)) {
    if (!$authorization = $_SERVER["HTTP_AUTHORIZATION"] ?? null) {
        http_response_code(401);
        exit;
    }

    $token = substr($authorization, 7);
    $parts = explode(".", $token);

    if (!hash_equals(hash_hmac("sha256", $parts[0], $_ENV["APP_KEY"]), $parts[1])) {
        http_response_code(401);
        exit;
    }

    global $user;

    $user = new User(json_decode(base64_decode($parts[0]))->id);
}
