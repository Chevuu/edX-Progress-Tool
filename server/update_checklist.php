<?php
require_once('../config/config.php');
use src\model\Checklist;

$checklistModel = new Checklist($db);

// Fetch the necessary parameters from the URL and the request body
if (isset($_GET['courseCode'], $_GET['courseRun'], $_GET['checklistID'])) {
    $courseCode = $_GET['courseCode'];
    $courseRun = $_GET['courseRun'];
    $checklistID = $_GET['checklistID'];
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['Checks'])) {
        $result = $checklistModel->updateChecklist($courseCode, $courseRun, $checklistID, $input['Checks']);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['message' => 'Missing checklist checks data']);
    }
} else {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['message' => 'Missing parameters']);
}
?>