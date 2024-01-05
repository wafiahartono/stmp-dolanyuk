<?php

require_once __DIR__ . "/_app/kernel.php";

$email = request()->input("email");
$password = request()->input("password");

$sql = <<<SQL
    SELECT * FROM dolanyuk_users WHERE email = ?
SQL;

if (
    !($statement = mysqli()->prepare($sql)) ||

    !$statement->bind_param("s", $email) ||

    !$statement->execute() ||

    !($result = $statement->get_result()) ||

    ($user = $result->fetch_object()) === false
) {
    http_response_code(500);
    exit;
}

if (
    !isset($user->id) ||
    !password_verify($password, $user->password)
) {
    http_response_code(401);
    exit;
}

$user->picture = $user->picture
    ? url("storage/$user->picture")
    : null;

unset($user->password);

echo json_encode([
    "user" => $user,
    "token" => create_auth_token($user->id),
]);
