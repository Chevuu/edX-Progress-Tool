<?php
require_once('../config/config.php'); // Include database and model setup
use src\model\Checklist;

$checklistModel = new Checklist($db);

// Check if necessary parameters are passed
if (isset($_GET['courseCode']) && isset($_GET['courseRun']) && isset($_GET['checklistID'])) {
    $courseCode = $_GET['courseCode'];
    $courseRun = $_GET['courseRun'];
    $checklistID = $_GET['checklistID'];

    $checklist = $checklistModel->getChecklist($courseCode, $courseRun, $checklistID);

    if ($checklist) {
        header('Content-Type: application/json');
        echo json_encode($checklist);
    } else {
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['message' => 'Checklist not found']);
    }
} else {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['message' => 'Missing parameters']);
}
?>