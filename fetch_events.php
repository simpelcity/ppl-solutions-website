<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all domains (for development only)

$api_url = "https://api.truckersmp.com/v2/vtc/74455/events/attending";

$response = file_get_contents($api_url);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch events"]);
    exit;
}

echo $response;
?>
