<?php

require __DIR__ . "/kernel.php";

$game = (int) request()->input("game");
$title = request()->input("title");
$datetime = request()->input("datetime");
$location = request()->input("location");

$mysqli = mysqli();

$insert_event_sql = <<<SQL
    INSERT INTO dolanyuk_events (game, title, datetime, location) VALUES (?, ?, ?, ?)
SQL;

$insert_attendance_sql = <<<SQL
    INSERT INTO dolanyuk_attendances (user, event) VALUES (?, ?)
SQL;

if (
    !$mysqli->begin_transaction()

    ||

    !($statement = $mysqli->prepare($insert_event_sql)) ||

    !$statement->bind_param("isss", $game, $title, $datetime, $location) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0 ||

    ($event_id = $mysqli->insert_id) === 0 ||

    !$statement->close()

    ||

    !($statement = $mysqli->prepare($insert_attendance_sql)) ||

    !$statement->bind_param("ii", request()->user()->id, $event_id) ||

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
        dolanyuk_games.name AS game_name,
        dolanyuk_games.min_players,
        dolanyuk_games.image

    FROM `dolanyuk_events`

    JOIN dolanyuk_games
        ON dolanyuk_events.game = dolanyuk_games.id

    WHERE dolanyuk_events.id = $event_id
SQL;

if (
    !($result = $mysqli->query($select_event_sql)) ||
    !($event = $result->fetch_assoc())
) {
    http_response_code(204);
    exit;
}

$event["players"] = 1;

echo json_encode($event, JSON_NUMERIC_CHECK);
