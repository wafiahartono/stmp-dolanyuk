<?php

require __DIR__ . "/kernel.php";

$event_id = (int) request()->query("event");

$select_user_sql = <<<SQL
    SELECT
        name,
        picture

    FROM dolanyuk_users

    JOIN dolanyuk_attendances
        ON dolanyuk_attendances.user = dolanyuk_users.id

    WHERE dolanyuk_attendances.event = ?
SQL;

if (
    !($statement = mysqli()->prepare($select_user_sql)) ||

    !$statement->bind_param("i", $event_id) ||

    !$statement->execute() ||

    !($result = $statement->get_result())
) {
    http_response_code(500);
    exit;
}

echo json_encode(
    $result->fetch_all(MYSQLI_ASSOC)
);
