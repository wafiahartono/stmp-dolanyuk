<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$event_id = (int) request()->query("event");

ensure_user_is_event_participant($user_id, $event_id);

$sql = <<<SQL
    SELECT
        dolanyuk_chats.*,
        dolanyuk_users.id AS user_id,
        dolanyuk_users.name AS user_name,
        dolanyuk_users.picture AS user_picture,
        dolanyuk_chats.user = $user_id AS self

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

    if ($chat->self === 1) {
        $user = (object) ["self" => true];

    } else {
        $user = (object) [
            "id" => $chat->user_id,
            "name" => $chat->user_name,
            "picture" => $chat->user_picture,
            "self" => false,
        ];

        $user->picture = $user->picture
            ? url("storage/$user->picture")
            : null;
    }

    $chat->user = $user;

    unset(
        $chat->user_id,
        $chat->user_name,
        $chat->user_picture,
        $chat->self,
    );

    $chats[] = $chat;
}

echo json_encode($chats ?? []);
