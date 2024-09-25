<?php
// index.php

header('Content-Type: application/json');

// Include database connection
require 'db_connect.php';

// Determine the HTTP method and requested action
$httpMethod = $_SERVER['REQUEST_METHOD'];
$action = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';

switch ($action) {
    case 'getChecklist':
        getChecklist($mysqli);
        break;
    case 'updateChecklist':
        updateChecklist($mysqli);
        break;
    // Add other cases as needed
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or missing method parameter']);
        break;
}

$mysqli->close();

// Function to get a specific checklist
function getChecklist($mysqli) {
    $courseCode = isset($_GET['courseCode']) ? $mysqli->real_escape_string($_GET['courseCode']) : null;
    $courseRun = isset($_GET['courseRun']) ? $mysqli->real_escape_string($_GET['courseRun']) : null;
    $checklistID = isset($_GET['checklistID']) ? $mysqli->real_escape_string($_GET['checklistID']) : null;

    if (!$courseCode || !$courseRun || !$checklistID) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        return;
    }

    $query = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND UserID = 0 AND ChecklistID = '$checklistID'";
    $result = $mysqli->query($query);

    if ($result) {
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Checklist not found']);
        } else {
            $data = $result->fetch_assoc();
            echo json_encode($data);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching checklist: ' . $mysqli->error]);
    }
}

// Function to update a checklist's checks
function updateChecklist($mysqli) {
    // Read the JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    $courseCode = isset($input['courseCode']) ? $mysqli->real_escape_string($input['courseCode']) : null;
    $courseRun = isset($input['courseRun']) ? $mysqli->real_escape_string($input['courseRun']) : null;
    $checklistID = isset($input['checklistID']) ? $mysqli->real_escape_string($input['checklistID']) : null;
    $Checks = isset($input['Checks']) ? $input['Checks'] : null;

    if (!$courseCode || !$courseRun || !$checklistID || $Checks === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        return;
    }

    // Convert the Checks array to JSON string
    $ChecksJSON = json_encode($Checks);

    // Prepare the SQL query
    $query = "UPDATE checklist SET Checks = '$ChecksJSON' WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND UserID = 0 AND ChecklistID = '$checklistID'";

    if ($mysqli->query($query)) {
        echo json_encode(['message' => 'Checklist updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating checklist: ' . $mysqli->error]);
    }
}
?>

// Additional functions (createChecklist, deleteChecklist, etc.) can be added similarly.

// function deleteChecklist($mysqli, $checklistId) {
//     $checklistId = $mysqli->real_escape_string($checklistId);

//     $query = "DELETE FROM checklist WHERE ChecklistID = '$checklistId' AND UserID = 0";

//     if ($mysqli->query($query)) {
//         echo json_encode(['message' => 'Checklist deleted successfully']);
//     } else {
//         http_response_code(500);
//         echo json_encode(['error' => 'Error deleting checklist: ' . $mysqli->error]);
//     }
// }

// function createChecklist($mysqli) {
//     $input = json_decode(file_get_contents('php://input'), true);
//     if (!$input) {
//         http_response_code(400);
//         echo json_encode(['error' => 'Invalid JSON input']);
//         return;
//     }

//     $CourseRun = $mysqli->real_escape_string($input['CourseRun']);
//     $CourseCode = $mysqli->real_escape_string($input['CourseCode']);
//     $Questions = json_encode($input['Questions']);
//     $ChecklistID = $mysqli->real_escape_string($input['ChecklistID']);
//     $Checks = json_encode(array_fill(0, count($input['Questions']), false));

//     $query = "INSERT INTO Checklist (CourseRun, CourseCode, UserID, Questions, Checks, ChecklistID) 
//               VALUES ('$CourseRun', '$CourseCode', 0, '$Questions', '$Checks', '$ChecklistID')";

//     if ($mysqli->query($query)) {
//         echo json_encode(['message' => 'Checklist created successfully', 'Id' => $mysqli->insert_id]);
//     } else {
//         http_response_code(500);
//         echo json_encode(['error' => 'Error saving checklist: ' . $mysqli->error]);
//     }
// }