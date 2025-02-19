<?php

// require_once __DIR__ . '/../../../vendor/autoload.php';  // Ensure correct path

// use Dotenv\Dotenv;

// // Load .env.local explicitly
// $dotenv = Dotenv::createImmutable(__DIR__ . '/../../../', '.env.local');
// $dotenv->load();

// // Fetch the database URL from environment variables (directly from $_ENV)
// $database_url = $_ENV['POSTGRES_URL'] ?? null;  // Directly from $_ENV


// if ($database_url) {
//     // Remove the 'postgres://' prefix if it's there
//     $database_url = str_replace('postgres://', '', $database_url);

//     // Updated regex to account for missing port and better match the format
//     if (preg_match('/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/(.+)/', $database_url, $matches)) {
//         $user = $matches[1];
//         $password = $matches[2];
//         $host = $matches[3];
//         $port = 5432;  // Default port to 5432 if not present
//         $dbname = $matches[5];

//         // DSN (Data Source Name) for PDO connection
//         $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

//         try {
//             // Create a PDO instance and establish a connection to the database
//             $pdo = new PDO($dsn, $user, $password);
            
//             // Set PDO error mode to exception for easier debugging
//             $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//         } catch (PDOException $e) {
//             // Catch and display any errors
//             die("Error: " . $e->getMessage());
//         }
//     } else {
//         die("Error: Invalid database URL format.");
//     }
// } else {
//     die("Error: POSTGRES_URL is not set or empty.");
// }

// No need to load .env.local in Vercel

// Fetch the database URL from environment variables (directly from $_ENV)
$database_url = $_ENV['POSTGRES_URL'] ?? null;

if ($database_url) {
    // Remove the 'postgres://' prefix if it's there
    $database_url = str_replace('postgres://', '', $database_url);

    // Updated regex to account for missing port and better match the format
    if (preg_match('/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/(.+)/', $database_url, $matches)) {
        $user = $matches[1];
        $password = $matches[2];
        $host = $matches[3];
        $port = 5432;  // Default port to 5432 if not present
        $dbname = $matches[5];

        // DSN (Data Source Name) for PDO connection
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

        try {
            // Create a PDO instance and establish a connection to the database
            $pdo = new PDO($dsn, $user, $password);
            
            // Set PDO error mode to exception for easier debugging
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // Catch and display any errors
            die("Error: " . $e->getMessage());
        }
    } else {
        die("Error: Invalid database URL format.");
    }
} else {
    die("Error: POSTGRES_URL is not set or empty.");
}

?>
