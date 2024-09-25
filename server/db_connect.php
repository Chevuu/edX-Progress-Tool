<?php

$host = 'localhost';
$user = 'vukroot';
$password = 'Aeghe+i1';
$database = 'map';

$mysqli = new mysqli($host, $user, $password, $database);

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to database: ' . $mysqli->connect_error]);
    exit();
}
?>