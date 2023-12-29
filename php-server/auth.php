<?php

require __DIR__ . "/kernel.php";

$email = request()->input("email");
$password = request()->input("password");

$statement = mysqli()->prepare("SELECT * FROM dolanyuk_users WHERE email = ?");

if (
    !$statement->bind_param("s", $email) ||
    !$statement->execute() ||
    !($result = $statement->get_result()) ||
    ($user = $result->fetch_assoc()) === false
) {
    http_response_code(500);
    exit;
}

if ($user === null || !password_verify($password, $user["password"])) {
    http_response_code(401);
    exit;
}

unset($user["password"]);

$payload = base64_encode(json_encode(["id" => $user["id"]]));
$signature = hash_hmac("sha256", $payload, $_ENV["APP_KEY"]);

echo json_encode([
    "user" => $user,
    "token" => "$payload.$signature",
]);
