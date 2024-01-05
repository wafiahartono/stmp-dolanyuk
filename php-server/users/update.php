<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$current_password = request()->input("current_password");
$new_password = request()->input("new_password");
$name = request()->input("name");
$picture = request()->file("picture");

if (
    (!$new_password && !$name && !$picture) ||
    ($new_password && !$current_password)
) {
    http_response_code(400);
    exit;
}

$mysqli = mysqli();

if ($new_password) {
    $select_user_sql = <<<SQL
        SELECT password FROM dolanyuk_users WHERE id = $user_id
    SQL;

    if (
        !($result = mysqli()->query($select_user_sql)) ||

        !($user = $result->fetch_object())
    ) {
        http_response_code(500);
        exit;
    }

    if (!password_verify($current_password, $user->password)) {
        http_response_code(401);
        exit;
    }
}

if ($picture) {
    $select_user_sql = <<<SQL
        SELECT picture FROM dolanyuk_users WHERE id = $user_id
    SQL;

    if (
        !($result = mysqli()->query($select_user_sql)) ||

        !($user = $result->fetch_object()) ||

        ($user->picture && !storage_delete($user->picture))
    ) {
        http_response_code(500);
        exit;
    }

    if (!($picture_filename = storage_put("avatars", $picture))) {
        http_response_code(500);
        exit;
    }
}

$update_user_sql = <<<SQL
    UPDATE dolanyuk_users SET
SQL;

if ($new_password) {
    $sql_args["column"][] = "password";
    $sql_args["arg"][] = password_hash($new_password, PASSWORD_BCRYPT);
    $sql_args["type"][] = "s";
}

if ($name) {
    $sql_args["column"][] = "name";
    $sql_args["arg"][] = $name;
    $sql_args["type"][] = "s";
}

if ($picture) {
    $sql_args["column"][] = "picture";
    $sql_args["arg"][] = $picture_filename;
    $sql_args["type"][] = "s";
}

$update_user_sql .=
    "" . join(", ", array_map(fn($x) => "$x = ?", $sql_args["column"])) . " " .

    "WHERE id = $user_id";

if (
    !($statement = mysqli()->prepare($update_user_sql)) ||

    !$statement->bind_param(
        join($sql_args["type"]),
        ...$sql_args["arg"],
    ) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0
) {
    http_response_code(500);
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

$user->picture = $user->picture
    ? url("storage/$user->picture")
    : null;

unset($user->password);

echo json_encode([
    "user" => $user,
    "token" => create_auth_token($user->id),
]);
