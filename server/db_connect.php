<?php

// Include the configuration file
$config = require __DIR__ . '/server/config.php';

// Use the configuration to connect to the database
$mysqli = new mysqli($config['host'], $config['user'], $config['password'], $config['database']);

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to database: ' . $mysqli->connect_error]);
    exit();
}
?>