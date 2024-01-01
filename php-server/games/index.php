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

echo json_encode(
    $result->fetch_all(MYSQLI_ASSOC)
);
