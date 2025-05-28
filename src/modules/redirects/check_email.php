<?php

$connectionPath = realpath(__DIR__ . "/connection.php");
echo "Resolved Path: " . $connectionPath;

if ($connectionPath) {
    include $connectionPath;
} else {
    die("Error: connection.php file not found.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    $stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo 'exists';
    } else {
        echo 'not exists';
    }

    $stmt->close();
    $conn->close();
}
?>