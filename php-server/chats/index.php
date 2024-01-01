<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$event_id = (int) request()->query("event");

ensure_user_is_event_participant($user_id, $event_id);

$sql = <<<SQL
    SELECT
        dolanyuk_chats.*,
        dolanyuk_users.id,
        dolanyuk_users.name,
        dolanyuk_users.picture,
        (
            dolanyuk_chats.user = $user_id
        ) AS self

    FROM dolanyuk_chats

    JOIN dolanyuk_users
        ON dolanyuk_users.id = dolanyuk_chats.user

    WHERE dolanyuk_chats.event = ?

    ORDER BY dolanyuk_chats.timestamp
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

while ($chat = $result->fetch_object()) {
    $chat->user = (object) [
        "id" => $chat->user,
        "name" => $chat->name,
        "picture" => $chat->picture,
        "self" => $chat->self === 1,
    ];

    unset($chat->name, $chat->picture, $chat->self);

    $chats[] = $chat;
}

echo json_encode($chats ?? []);
