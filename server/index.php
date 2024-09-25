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
    case 'getAllChecklistsByCourseCode':
        getAllChecklistsByCourseCode($mysqli);
        break;
    case 'deleteChecklist':
        deleteChecklist($mysqli);
        break;
    case 'updateChecklistQuestions':
        updateChecklistQuestions($mysqli);
        break;
    case 'createChecklist':
        createChecklist($mysqli);
        break;
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

function getAllChecklistsByCourseCode($mysqli) {
    $courseCode = isset($_GET['courseCode']) ? $mysqli->real_escape_string($_GET['courseCode']) : null;

    if (!$courseCode) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing courseCode parameter']);
        return;
    }

    $query = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND UserID = 0";
    $result = $mysqli->query($query);

    if ($result) {
        $checklists = [];
        while ($row = $result->fetch_assoc()) {
            $checklists[] = $row;
        }
        if (empty($checklists)) {
            http_response_code(404);
            echo json_encode(['message' => 'No checklists found for the specified course code']);
        } else {
            echo json_encode($checklists);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching checklists: ' . $mysqli->error]);
    }
}

function deleteChecklist($mysqli) {
    $checklistID = isset($_REQUEST['checklistID']) ? $mysqli->real_escape_string($_REQUEST['checklistID']) : null;

    if (!$checklistID) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing checklistID parameter']);
        return;
    }

    $query = "DELETE FROM checklist WHERE ChecklistID = '$checklistID' AND UserID = 0";
    if ($mysqli->query($query)) {
        echo json_encode(['message' => 'Checklist deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting checklist: ' . $mysqli->error]);
    }
}

function updateChecklistQuestions($mysqli) {
    $input = json_decode(file_get_contents('php://input'), true);

    $courseCode = isset($input['courseCode']) ? $mysqli->real_escape_string($input['courseCode']) : null;
    $courseRun = isset($input['courseRun']) ? $mysqli->real_escape_string($input['courseRun']) : null;
    $checklistID = isset($input['checklistID']) ? $mysqli->real_escape_string($input['checklistID']) : null;
    $Questions = isset($input['Questions']) ? $input['Questions'] : null;

    if (!$courseCode || !$courseRun || !$checklistID || $Questions === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        return;
    }

    // Convert the Questions array to JSON string
    $QuestionsJSON = json_encode($Questions);

    // Prepare the SQL query
    $query = "UPDATE checklist SET Questions = '$QuestionsJSON' WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND UserID = 0 AND ChecklistID = '$checklistID'";

    if ($mysqli->query($query)) {
        echo json_encode(['message' => 'Checklist questions updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating checklist questions: ' . $mysqli->error]);
    }
}

function createChecklist($mysqli) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }

    $CourseRun = isset($input['CourseRun']) ? $mysqli->real_escape_string($input['CourseRun']) : null;
    $CourseCode = isset($input['CourseCode']) ? $mysqli->real_escape_string($input['CourseCode']) : null;
    $Questions = isset($input['Questions']) ? $input['Questions'] : null;
    $ChecklistID = isset($input['ChecklistID']) ? $mysqli->real_escape_string($input['ChecklistID']) : null;

    if (!$CourseRun || !$CourseCode || !$Questions || !$ChecklistID) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        return;
    }

    $QuestionsJSON = json_encode($Questions);
    $Checks = json_encode(array_fill(0, count($Questions), false));

    $query = "INSERT INTO checklist (CourseRun, CourseCode, UserID, Questions, Checks, ChecklistID) VALUES ('$CourseRun', '$CourseCode', 0, '$QuestionsJSON', '$Checks', '$ChecklistID')";

    if ($mysqli->query($query)) {
        echo json_encode(['message' => 'Checklist created successfully', 'Id' => $mysqli->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error saving checklist: ' . $mysqli->error]);
    }
}
?>