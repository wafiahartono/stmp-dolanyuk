<?php

require __DIR__ . "/kernel.php";

$event_id = (int) request()->query("event");

$user_id = request()->user()->id;

$mysqli = mysqli();

$count_attendance_sql = <<<SQL
    SELECT COUNT(*) FROM dolanyuk_attendances WHERE event = ? AND user = $user_id
SQL;

if (
    !($statement = $mysqli->prepare($count_attendance_sql)) ||

    !$statement->bind_param("i", $event_id) ||

    !$statement->execute() ||

    !($result = $statement->get_result()) ||

    !($row = $result->fetch_row())
) {
    http_response_code(500);
    exit;
}

if ($row[0] === 0) {
    http_response_code(401);
    exit;
}

$select_chat_sql = <<<SQL
    SELECT
        dolanyuk_chats.*,
        dolanyuk_users.name,
        dolanyuk_users.picture

    FROM dolanyuk_chats

    JOIN dolanyuk_users
        ON dolanyuk_users.id = dolanyuk_chats.user

    WHERE dolanyuk_chats.event = ?

    ORDER BY dolanyuk_chats.timestamp
SQL;

if (
    !($statement = $mysqli->prepare($select_chat_sql)) ||

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
