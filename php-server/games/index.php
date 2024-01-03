<?php

require_once __DIR__ . "/../_app/kernel.php";

$sql = <<<SQL
    SELECT * FROM dolanyuk_games
SQL;

if (
    !($result = mysqli()->query($sql))
) {
    http_response_code(500);
    exit;
}

while ($game = $result->fetch_object()) {
    $game->minPlayers = $game->min_players;

    unset($game->min_players);

    $games[] = $game;
}

echo json_encode($games ?? []);
