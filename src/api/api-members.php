<?php

$input = json_decode(file_get_contents('php://input'), true);

header('Content-Type: application/json');

$api_url = "https://api.truckershub.in/v1/drivers";

// Set up the headers
$options = [
    "http" => [
        "header" => "Authorization: spka11nWRYdd5weIu0gWlMSdeYS7xAWwULv8b7VJ\r\n",
        "method" => "GET"
    ]
];

// Create a context with the options
$context = stream_context_create($options);

// Fetch the API response
$response = file_get_contents($api_url, false, $context);

if (!$response) {
    echo json_encode(["error" => "Empty response from API"]);
    exit;
}


if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch members"]);
    exit;
}

echo $response;
?>
