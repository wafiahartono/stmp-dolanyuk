<?php

require __DIR__ . "/kernel.php";

$query = request()->query("query") ?? "";
$attended = boolval(request()->query("attended")) ? 1 : 0;

$user_id = request()->user()->id;

$select_event_sql = <<<SQL
    SELECT
        dolanyuk_events.*,

        (
            SELECT COUNT(*)
            FROM dolanyuk_attendances
            WHERE dolanyuk_attendances.event = dolanyuk_events.id
        ) AS players,

        dolanyuk_games.name AS game_name,
        dolanyuk_games.min_players,
        dolanyuk_games.image

    FROM dolanyuk_events

    JOIN dolanyuk_attendances
        ON dolanyuk_attendances.event = dolanyuk_events.id

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
            ($attended = 1 AND dolanyuk_attendances.user = $user_id)
            OR
            ($attended = 0 AND 1)
        )

    GROUP BY dolanyuk_events.id

    ORDER BY dolanyuk_events.datetime
SQL;

$query_pattern = "%$query%";

if (
    !($statement = mysqli()->prepare($select_event_sql)) ||

    !$statement->bind_param("sss", $query_pattern, $query_pattern, $query_pattern) ||

    !$statement->execute() ||

    !($result = $statement->get_result())
) {
    http_response_code(500);
    exit;
}

echo json_encode(
    $result->fetch_all(MYSQLI_ASSOC)
);
