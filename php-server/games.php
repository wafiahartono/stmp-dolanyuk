<?php

require_once __DIR__ . "/_app/kernel.php";

$method = request()->method();

if ($method === "GET") {
    require __DIR__ . "/games/index.php";

} else {
    http_response_code(405);
    exit;
}
