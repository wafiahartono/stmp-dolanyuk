<?php

require __DIR__ . "/kernel.php";

$email = request()->input("email");
$password = request()->input("password");

$select_user_sql = <<<SQL
    SELECT * FROM dolanyuk_users WHERE email = ?
SQL;

if (
    !($statement = mysqli()->prepare($select_user_sql)) ||

    !$statement->bind_param("s", $email) ||

    !$statement->execute() ||

    !($result = $statement->get_result()) ||

    ($user = $result->fetch_assoc()) === false
) {
    http_response_code(500);
    exit;
}

if (
    $user === null ||
    !password_verify($password, $user["password"])
) {
    http_response_code(401);
    exit;
}

unset($user["password"]);

echo json_encode([
    "user" => $user,
    "token" => create_auth_token($user["id"]),
]);
