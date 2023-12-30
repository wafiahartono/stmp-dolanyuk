<?php

require __DIR__ . "/kernel.php";

$event_id = (int) request()->input("event");
$text = request()->input("text");

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

    !($row = $result->fetch_array())
) {
    http_response_code(500);
    exit;
}

if ($row[0] === 0) {
    http_response_code(401);
    exit;
}

$insert_chat_sql = <<<SQL
    INSERT INTO dolanyuk_chats (event, user, text) VALUES (?, $user_id, ?)
SQL;

if (
    !($statement = $mysqli->prepare($insert_chat_sql)) ||

    !$statement->bind_param("is", $event_id, $text) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0 ||

    ($chat_id = $mysqli->insert_id) === 0
) {
    http_response_code(500);
    exit;
}

$select_chat_sql = <<<SQL
    SELECT * FROM dolanyuk_chats WHERE id = $chat_id
SQL;

if (
    !($result = $mysqli->query($select_chat_sql)) ||
    !($chat = $result->fetch_assoc())
) {
    http_response_code(204);
    exit;
}

echo json_encode($chat, JSON_NUMERIC_CHECK);
