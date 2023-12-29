<?php

require __DIR__ . "/kernel.php";

$email = request()->input("email");
$password = request()->input("password");
$name = request()->input("name");

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$statement = mysqli()->prepare(
    "INSERT INTO dolanyuk_users (email, password, name) VALUES (?, ?, ?)"
);

if (
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

        http_response_code(422);
    } else {
        http_response_code(500);
    }

    exit;
}

$user = [
    "id" => $mysqli->insert_id,
    "email" => $email,
    "name" => $name,
    "picture" => null,
];

$payload = base64_encode(json_encode(["id" => $user["id"]]));
$signature = hash_hmac("sha256", $payload, $_ENV["APP_KEY"]);

echo json_encode([
    "user" => $user,
    "token" => "$payload.$signature",
]);
