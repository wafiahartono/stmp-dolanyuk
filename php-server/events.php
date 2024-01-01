<?php

require_once __DIR__ . "/_app/kernel.php";

$method = request()->method();

if ($method === "GET") {
    require __DIR__ . "/events/index.php";

} else if ($method === "POST") {
    require __DIR__ . "/events/store.php";

} else {
    http_response_code(405);
    exit;
}
