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
    case 'register':
        registerUser($mysqli);
        break;
    case 'login':
        loginUser($mysqli);
        break;
    case 'getChecklistStats':
        getChecklistStats($mysqli);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or missing method parameter']);
        break;
}

$mysqli->close();

function registerUser($mysqli) {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? $input['password'] : '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password are required.']);
        return;
    }

    // Check if username exists
    $stmt = $mysqli->prepare("SELECT id FROM users WHERE username = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $mysqli->error]);
        return;
    }
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Username already exists.']);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Hash password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $mysqli->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $mysqli->error]);
        return;
    }
    $stmt->bind_param('ss', $username, $password_hash);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'User registered successfully.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error registering user: ' . $stmt->error]);
    }
    $stmt->close();
}

function loginUser($mysqli) {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? $input['password'] : '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password are required.']);
        return;
    }

    // Retrieve user
    $stmt = $mysqli->prepare("SELECT id, password_hash FROM users WHERE username = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $mysqli->error]);
        return;
    }
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($user_id, $password_hash);
    if ($stmt->fetch()) {
        // Verify password
        if (password_verify($password, $password_hash)) {
            echo json_encode(['message' => 'Login successful.']);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid username or password.']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password.']);
    }
    $stmt->close();
}

// Function to get a specific checklist
function getChecklist($mysqli) {
    $courseCode_sanitized = filter_var($_GET['courseCode'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $courseCode = htmlspecialchars($courseCode_sanitized, ENT_QUOTES, 'UTF-8', false);

    $courseRun_sanitized = filter_var($_GET['courseRun'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $courseRun = htmlspecialchars($courseRun_sanitized, ENT_QUOTES, 'UTF-8', false);

    $checklistID_sanitized = filter_var($_GET['checklistID'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $checklistID = htmlspecialchars($checklistID_sanitized, ENT_QUOTES, 'UTF-8', false);

    $user_id_sanitized = filter_var($_GET['user_id'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $user_id = htmlspecialchars($user_id_sanitized, ENT_QUOTES, 'UTF-8', false);

    if (!$courseCode || !$courseRun || !$checklistID || !$user_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        return;
    }

    // Check if a checklist exists for the given user
    $query = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND ChecklistID = '$checklistID' AND UserID = '$user_id'";
    $result = $mysqli->query($query);

    if ($result) {
        if ($result->num_rows === 0) {
            // If not, create a copy from the default checklist (UserID = 0)
            $defaultQuery = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND ChecklistID = '$checklistID' AND UserID = '0'";
            $defaultResult = $mysqli->query($defaultQuery);

            if ($defaultResult && $defaultResult->num_rows > 0) {
                $defaultData = $defaultResult->fetch_assoc();
                $Questions = $defaultData['Questions'];
                $Checks = $defaultData['Checks'];
                $Instruction = $defaultData['Instruction'] ?? ''; // Handle NULL Instruction

                // Insert a new checklist for the user including Instruction
                $insertQuery = "INSERT INTO checklist (CourseRun, CourseCode, UserID, Questions, Checks, ChecklistID, Instruction) 
                                VALUES ('$courseRun', '$courseCode', '$user_id', '$Questions', '$Checks', '$checklistID', '$Instruction')";
                if ($mysqli->query($insertQuery)) {
                    // Retrieve the newly created checklist
                    $newChecklistQuery = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND ChecklistID = '$checklistID' AND UserID = '$user_id'";
                    $newResult = $mysqli->query($newChecklistQuery);
                    if ($newResult && $newResult->num_rows > 0) {
                        $data = $newResult->fetch_assoc();
                        echo json_encode($data);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Error retrieving new checklist: ' . $mysqli->error]);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Error creating user checklist: ' . $mysqli->error]);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Default checklist not found']);
            }
        } else {
            // Checklist exists for the user, return it
            $data = $result->fetch_assoc();
            $data['Instruction'] = $data['Instruction'] ?? ''; // Handle NULL Instruction
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
    $user_id = isset($input['user_id']) ? $mysqli->real_escape_string($input['user_id']) : null;
    $Checks = isset($input['Checks']) ? $input['Checks'] : null;

    if (!$courseCode || !$courseRun || !$checklistID || !$user_id || $Checks === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        return;
    }

    // Convert the Checks array to JSON string
    $ChecksJSON = json_encode($Checks);

    // Prepare the SQL query
    $query = "UPDATE checklist SET Checks = '$ChecksJSON' WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND UserID = '$user_id' AND ChecklistID = '$checklistID'";

    if ($mysqli->query($query)) {
        echo json_encode(['message' => 'Checklist updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating checklist: ' . $mysqli->error]);
    }
}

// Get all checklists from the course
// We filter by UserID = 0 to not get repetitions
function getAllChecklistsByCourseCode($mysqli) {
    $courseCode = isset($_GET['courseCode']) ? $mysqli->real_escape_string($_GET['courseCode']) : null;

    if (!$courseCode) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing courseCode parameter']);
        return;
    }

    $query = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND UserID = '0'";
    $result = $mysqli->query($query);

    if ($result) {
        $checklists = [];
        while ($row = $result->fetch_assoc()) {
            $checklists[] = $row;
        }
        // Always return a 200 OK status with the checklists array (empty or not)
        echo json_encode($checklists);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching checklists: ' . $mysqli->error]);
    }
}

function deleteChecklist($mysqli) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Invalid HTTP method']);
        return;
    }

    $checklistID = isset($_REQUEST['checklistID']) ? $mysqli->real_escape_string($_REQUEST['checklistID']) : null;
    $courseCode = isset($_REQUEST['courseCode']) ? $mysqli->real_escape_string($_REQUEST['courseCode']) : null;
    $courseRun = isset($_REQUEST['courseRun']) ? $mysqli->real_escape_string($_REQUEST['courseRun']) : null;

    if (!$checklistID || !$courseCode || !$courseRun) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required parameters']);
        return;
    }

    $query = "DELETE FROM checklist WHERE ChecklistID = '$checklistID' AND CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND UserID = '0'";
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

    // Fetch all checklists with matching CourseCode, CourseRun, and ChecklistID
    $selectQuery = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND ChecklistID = '$checklistID'";
    $result = $mysqli->query($selectQuery);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $UserID = $row['UserID'];
            $currentChecks = json_decode($row['Checks'], true);

            // Adjust the Checks array to match the new Questions array
            $newChecks = $currentChecks;
            $diff = count($Questions) - count($currentChecks);

            if ($diff > 0) {
                // New questions added
                for ($i = 0; $i < $diff; $i++) {
                    $newChecks[] = false;
                }
            } elseif ($diff < 0) {
                // Questions removed
                $newChecks = array_slice($currentChecks, 0, count($Questions));
            }

            // Prepare data for update
            $QuestionsJSON = $mysqli->real_escape_string(json_encode($Questions));
            $ChecksJSON = $mysqli->real_escape_string(json_encode($newChecks));

            $updateQuery = "UPDATE checklist SET Questions = '$QuestionsJSON', Checks = '$ChecksJSON' WHERE CourseCode = '$courseCode' AND CourseRun = '$courseRun' AND ChecklistID = '$checklistID' AND UserID = '$UserID'";

            if (!$mysqli->query($updateQuery)) {
                http_response_code(500);
                echo json_encode(['error' => 'Error updating checklist for UserID ' . $UserID . ': ' . $mysqli->error]);
                return;
            }
        }
        echo json_encode(['message' => 'Checklist questions updated successfully for all users']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching checklists: ' . $mysqli->error]);
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
    $Instruction = isset($input['Instruction']) ? $mysqli->real_escape_string($input['Instruction']) : null;
    $Questions = isset($input['Questions']) ? $input['Questions'] : null;
    $ChecklistID = isset($input['ChecklistID']) ? $mysqli->real_escape_string($input['ChecklistID']) : null;

    if (!$CourseRun || !$CourseCode || !$Instruction || !$Questions || !$ChecklistID) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing parameters']);
        return;
    }

    $QuestionsJSON = json_encode($Questions);
    $Checks = json_encode(array_fill(0, count($Questions), false));

    $query = "INSERT INTO checklist (CourseRun, CourseCode, UserID, Questions, Checks, Instruction, ChecklistID) VALUES ('$CourseRun', '$CourseCode', 0, '$QuestionsJSON', '$Checks', '$Instruction', '$ChecklistID')";

    if ($mysqli->query($query)) {
        echo json_encode(['message' => 'Checklist created successfully', 'Id' => $mysqli->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error saving checklist: ' . $mysqli->error]);
    }
}

function getChecklistStats($mysqli) {
    $courseCode = isset($_GET['courseCode']) ? $mysqli->real_escape_string($_GET['courseCode']) : null;

    if (!$courseCode) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing courseCode parameter']);
        return;
    }

    // Get all checklists for the course where UserID != 0
    $query = "SELECT * FROM checklist WHERE CourseCode = '$courseCode' AND UserID != '0'";
    $result = $mysqli->query($query);

    if ($result) {
        $stats = [];

        while ($row = $result->fetch_assoc()) {
            $checklistID = $row['ChecklistID'];
            $userID = $row['UserID'];
            $questions = json_decode($row['Questions'], true);
            $checks = json_decode($row['Checks'], true);

            if (!isset($stats[$checklistID])) {
                $stats[$checklistID] = [
                    'ChecklistID' => $checklistID,
                    'CourseRun' => $row['CourseRun'],
                    'Instruction' => $row['Instruction'],
                    'Questions' => $questions,
                    'Answers' => array_fill(0, count($questions), ['count' => 0]),
                    'TotalSubmissions' => 0,
                ];
            }

            $stats[$checklistID]['TotalSubmissions'] += 1;

            // Count answers
            foreach ($checks as $index => $checked) {
                if ($checked) {
                    $stats[$checklistID]['Answers'][$index]['count'] += 1;
                }
            }
        }

        // Convert stats to an array
        $statsArray = array_values($stats);

        echo json_encode($statsArray);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching stats: ' . $mysqli->error]);
    }
}
?>