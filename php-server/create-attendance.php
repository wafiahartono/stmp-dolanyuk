<?php

require __DIR__ . "/kernel.php";

$event_id = (int) request()->input("event");

$user_id = request()->user()->id;

$insert_attendance_sql = <<<SQL
    INSERT INTO dolanyuk_attendances (user, event) VALUES ($user_id, ?)
SQL;

if (
    !($statement = mysqli()->prepare($insert_attendance_sql)) ||

    !$statement->bind_param("i", $event_id) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0
) {
    http_response_code(500);
    exit;
}
