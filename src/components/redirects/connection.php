<?php

// require_once __DIR__ . '/../../../vendor/autoload.php'; // Adjust path

// use Dotenv\Dotenv; // Correct namespace

// // Debug: Print current working directory
// echo "Current Working Directory: " . getcwd() . "\n";
// echo "Path to .env.local: " . realpath('C:/Users/Wietsegaming/Documents/Development/ppl-solutions-website/.env.local') . "\n";

// // Load .env.local explicitly
// $dotenv = Dotenv::createImmutable('C:/Users/Wietsegaming/Documents/Development/ppl-solutions-website', '.env.local');
// $dotenv->load();

// // Debug: Dump environment variables
// var_dump(getenv('POSTGRES_URL'));

// echo "All environment variables:\n";
// var_dump($_ENV);


// $database_url = $_ENV['POSTGRES_URL'] ?? null;

// if (!$database_url) {
//     die("Error: Database URL not found in environment variables.");
// } else {
//     echo "Database URL: " . $database_url . "\n";
// }

// No need to load .env.local in Vercel

// Debug: Check environment variables
var_dump($_ENV);

// Fetch the database URL from environment variables
$database_url = $_ENV['POSTGRES_URL'] ?? null;

if (!$database_url) {
    die("Error: Database URL not found in environment variables.");
} else {
    echo "Database URL: " . $database_url . "\n";
}

?>
