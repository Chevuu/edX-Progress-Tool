<?php
// Database credentials
$host = 'localhost';
$user = 'vukroot';
$password = 'Aeghe+i1';
$database = 'map';

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get one entry
$sql = "SELECT * FROM checklist LIMIT 1";
$result = $conn->query($sql);

// Check if data is available
if ($result->num_rows > 0) {
    // Fetch the first row
    $row = $result->fetch_assoc();
    // Set header to output JSON
    header('Content-Type: application/json');
    echo json_encode($row);
} else {
    echo json_encode(array('error' => 'No data found'));
}

// Close the connection
$conn->close();
?>