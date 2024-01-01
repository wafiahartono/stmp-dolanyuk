<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$event_id = (int) request()->input("event");

$sql = <<<SQL
    INSERT INTO dolanyuk_participants (event, user) VALUES (?, $user_id)
SQL;

if (
    !($statement = mysqli()->prepare($sql)) ||

    !$statement->bind_param("i", $event_id) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0
) {
    if ($statement->errno === 1062) {
        $code = 200;
    }

    http_response_code($code ?? 500);
    exit;
}
