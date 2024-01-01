<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$game_id = (int) request()->input("game");
$title = request()->input("title");
$datetime = request()->input("datetime");
$location = request()->input("location");

$mysqli = mysqli();

$insert_event_sql = <<<SQL
    INSERT INTO dolanyuk_events (game, title, datetime, location) VALUES (?, ?, ?, ?)
SQL;

$insert_participation_sql = <<<SQL
    INSERT INTO dolanyuk_participants (user, event) VALUES ($user_id, ?)
SQL;

if (
    !$mysqli->begin_transaction()

    ||

    !($statement = $mysqli->prepare($insert_event_sql)) ||

    !$statement->bind_param("isss", $game_id, $title, $datetime, $location) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0 ||

    ($event_id = $mysqli->insert_id) === 0

    ||

    !($statement = $mysqli->prepare($insert_participation_sql)) ||

    !$statement->bind_param("i", $event_id) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0

    ||

    !$mysqli->commit()
) {
    $mysqli->rollback();

    http_response_code(500);
    exit;
}

$select_event_sql = <<<SQL
    SELECT
        dolanyuk_events.*,
        dolanyuk_games.name,
        dolanyuk_games.min_players,
        dolanyuk_games.image

    FROM dolanyuk_events

    JOIN dolanyuk_games
        ON dolanyuk_games.id = dolanyuk_events.game

    WHERE dolanyuk_events.id = $event_id
SQL;

if (
    !($result = $mysqli->query($select_event_sql)) ||

    !($event = $result->fetch_object())
) {
    http_response_code(204);
    exit;
}

$event->game = (object) [
    "name" => $event->name,
    "min_players" => $event->min_players,
    "image" => $event->image,
];
$event->players = 1;

unset($event->name, $event->min_players, $event->image);

echo json_encode($event, JSON_NUMERIC_CHECK);
