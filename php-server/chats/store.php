<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$event_id = (int) request()->input("event");
$text = request()->input("text");

ensure_user_is_event_participant($user_id, $event_id);

$mysqli = mysqli();

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

    !($chat = $result->fetch_object())
) {
    http_response_code(204);
    exit;
}

$chat->user = (object) ["self" => true];

echo json_encode($chat, JSON_NUMERIC_CHECK);
