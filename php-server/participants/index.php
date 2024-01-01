<?php

require_once __DIR__ . "/../_app/kernel.php";

$event_id = (int) request()->query("event");

$sql = <<<SQL
    SELECT
        dolanyuk_users.id,
        dolanyuk_users.name,
        dolanyuk_users.picture

    FROM dolanyuk_participants

    JOIN dolanyuk_users
        ON dolanyuk_users.id = dolanyuk_participants.user

    WHERE dolanyuk_participants.event = ?
SQL;

if (
    !($statement = mysqli()->prepare($sql)) ||

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
