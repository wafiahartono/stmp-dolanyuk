<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$query = request()->query("query") ?? "";
$participant = request()->query("participant") === "true" ? 1 : 0;

$sql = <<<SQL
    SELECT
        dolanyuk_events.*,
        dolanyuk_games.name AS game_name,
        dolanyuk_games.min_players AS game_min_players,
        dolanyuk_games.image AS game_image,
        (
            SELECT COUNT(*)
            FROM dolanyuk_participants
            WHERE dolanyuk_participants.event = dolanyuk_events.id
        )
        AS participants,
        (
            EXISTS (
                SELECT *
                FROM dolanyuk_participants
                WHERE
                    dolanyuk_participants.event = dolanyuk_events.id AND
                    dolanyuk_participants.user = $user_id
            )
        )
        AS participant

    FROM dolanyuk_events

    LEFT JOIN dolanyuk_participants
        ON dolanyuk_participants.event = dolanyuk_events.id

    JOIN dolanyuk_games
        ON dolanyuk_games.id = dolanyuk_events.game

    WHERE
        (
            dolanyuk_games.name LIKE ? OR
            dolanyuk_events.title LIKE ? OR
            dolanyuk_events.location LIKE ?
        )
        AND
        (
            ($participant = TRUE AND dolanyuk_participants.user = $user_id)
            OR
            ($participant = FALSE AND TRUE)
        )

    GROUP BY dolanyuk_events.id

    ORDER BY dolanyuk_events.datetime
SQL;

$query = "%$query%";

if (
    !($statement = mysqli()->prepare($sql)) ||

    !$statement->bind_param("sss", $query, $query, $query) ||

    !$statement->execute() ||

    !($result = $statement->get_result())
) {
    http_response_code(500);
    exit;
}

while ($event = $result->fetch_object()) {
    $event->game = (object) [
        "id" => $event->game,
        "name" => $event->game_name,
        "minPlayers" => $event->game_min_players,
        "image" => $event->game_image,
    ];

    $location = explode(";", $event->location);

    $event->location = (object) [
        "place" => $location[0],
        "address" => $location[1],
    ];

    $event->participant = $event->participant === 1;

    unset($event->game_name, $event->game_min_players, $event->game_image);

    $events[] = $event;
}

echo json_encode($events ?? []);
