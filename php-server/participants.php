<?php

require_once __DIR__ . "/_app/kernel.php";

$method = request()->method();

if ($method === "GET") {
    require __DIR__ . "/participants/index.php";

} else if ($method === "POST") {
    require __DIR__ . "/participants/store.php";

} else {
    http_response_code(405);
    exit;
}
