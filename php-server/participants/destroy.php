<?php

require_once __DIR__ . "/../_app/kernel.php";

$user_id = request()->user()->id;
$event_id = (int) request()->query("event");

$sql = <<<SQL
    DELETE FROM dolanyuk_participants WHERE event = ? AND user = $user_id
SQL;

if (
    !($statement = mysqli()->prepare($sql)) ||

    !$statement->bind_param("i", $event_id) ||

    !$statement->execute()
) {
    http_response_code($code ?? 500);
    exit;
}
