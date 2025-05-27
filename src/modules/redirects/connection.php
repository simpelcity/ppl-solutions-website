<?php
$host = '0ihc0.h.filess.io';
$port = 3307;
$dbname = 'pplsolutions_hearingtea';
$username = 'pplsolutions_hearingtea';
$password = '64d22f0537588ac8a6efd5204fdf35dc91c4af32';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
