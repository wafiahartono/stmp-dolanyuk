<?php

require __DIR__ . "/kernel.php";

$event = (int) request()->input("event");

$insert_attendance_sql = <<<SQL
    INSERT INTO dolanyuk_attendances (user, event) VALUES (?, ?)
SQL;

if (
    !($statement = mysqli()->prepare($insert_attendance_sql)) ||

    !$statement->bind_param("ii", request()->user()->id, $event) ||

    !$statement->execute() ||

    $statement->affected_rows <= 0
) {
    http_response_code(500);
    exit;
}
