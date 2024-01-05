<?php

require_once __DIR__ . "/_app/kernel.php";

$method = request()->method();

if ($method === "POST") {
    require __DIR__ . "/users/update.php";

} else {
    http_response_code(405);
    exit;
}
