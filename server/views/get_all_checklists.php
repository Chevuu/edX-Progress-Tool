<?php
require_once('../config/config.php'); // Database and model setup

use src\model\Checklist;

$checklistModel = new Checklist($db);

if (isset($_GET['courseCode'])) {
    $courseCode = $_GET['courseCode'];

    // Fetch all checklists for the given courseCode
    $checklists = $checklistModel->getAllChecklistsByCourseCode($courseCode);

    if ($checklists) {
        header('Content-Type: application/json');
        echo json_encode($checklists);
    } else {
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['message' => 'No checklists found for this course code']);
    }
} else {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['message' => 'Missing course code']);
}
?>