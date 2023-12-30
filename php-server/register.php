<?php

require __DIR__ . "/kernel.php";

$email = request()->input("email");
$password = request()->input("password");
$name = request()->input("name");

$insert_user_sql = <<<SQL
    INSERT INTO dolanyuk_users (email, password, name) VALUES (?, ?, ?)
SQL;

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

if (
    !($statement = mysqli()->prepare($insert_user_sql)) ||

    !$statement->bind_param("sss", $email, $hashed_password, $name) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0
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

$user = [
    "id" => $mysqli->insert_id,
    "email" => $email,
    "name" => $name,
    "picture" => null,
];

echo json_encode([
    "user" => $user,
    "token" => create_auth_token($user["id"]),
]);
