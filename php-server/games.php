<?php

require __DIR__ . "/kernel.php";

if (
    !($result = mysqli()->query("SELECT * FROM dolanyuk_games"))
) {
    http_response_code(500);
    exit;
}

echo json_encode(
    $result->fetch_all(MYSQLI_ASSOC)
);
