<?php

require_once __DIR__ . "/_app/kernel.php";

$email = request()->input("email");
$password = request()->input("password");
$name = request()->input("name");

$insert_user_sql = <<<SQL
    INSERT INTO dolanyuk_users (email, password, name) VALUES (?, ?, ?)
SQL;

$password = password_hash($password, PASSWORD_BCRYPT);

if (
    !($statement = mysqli()->prepare($insert_user_sql)) ||

    !$statement->bind_param("sss", $email, $password, $name) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0 ||

    ($user_id = $mysqli->insert_id) === 0
) {
    if ($statement->errno === 1062) {
        echo json_encode([
            "errors" => [
                "email" => "The email address has already been taken"
            ]
        ]);

        $code = 422;
    }

    http_response_code($code ?? 500);
    exit;
}

$select_user_sql = <<<SQL
    SELECT * FROM dolanyuk_users WHERE id = $user_id
SQL;

if (
    !($result = $mysqli->query($select_user_sql)) ||

    !($user = $result->fetch_object())
) {
    http_response_code(500);
    exit;
}

unset($user->password);

echo json_encode([
    "user" => $user,
    "token" => create_auth_token($user->id),
]);
