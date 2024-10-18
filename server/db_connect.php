<?php

$host = 'localhost';
$user = 'ptadmin';
$password = 'PT2024!U#';
$database = 'progress_tool';

$mysqli = new mysqli($host, $user, $password, $database);

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to database: ' . $mysqli->connect_error]);
    exit();
}
?>