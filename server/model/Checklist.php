<?php
namespace src\model;

class Checklist
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function createChecklist($courseRun, $courseCode, $questions, $checklistID)
    {
        $checks = json_encode(array_fill(0, count($questions), false));
        $questions = json_encode($questions);
        $query = "INSERT INTO checklist (CourseRun, CourseCode, UserID, Questions, Checks, ChecklistID) VALUES (?, ?, 0, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $this->db->execute($stmt, [$courseRun, $courseCode, $questions, $checks, $checklistID]);
        return ['message' => 'Checklist created successfully', 'Id' => $this->db->insert_id()];
    }

    public function getChecklist($courseCode, $courseRun, $checklistID)
    {
        $query = "SELECT * FROM Ccecklist WHERE CourseCode = ? AND CourseRun = ? AND UserID = 0 AND ChecklistID = ?";
        $stmt = $this->db->prepare($query);
        $this->db->execute($stmt, [$courseCode, $courseRun, $checklistID]);
        return $this->db->fetch_assoc($stmt);
    }

    public function updateChecklist($courseCode, $courseRun, $checklistID, $checks)
    {
        $checks = json_encode($checks);
        $query = "UPDATE checklist SET Checks = ? WHERE CourseCode = ? AND CourseRun = ? AND UserID = 0 AND ChecklistID = ?";
        $stmt = $this->db->prepare($query);
        $this->db->execute($stmt, [$checks, $courseCode, $courseRun, $checklistID]);
        return ['message' => 'Checklist updated successfully'];
    }

    public function getAllChecklistsByCourseCode($courseCode)
    {
        $query = "SELECT * FROM Checklist WHERE CourseCode = ? AND UserID = 0";
        $stmt = $this->db->prepare($query);
        $this->db->execute($stmt, [$courseCode]);
        return $this->db->fetch_assoc($stmt);
    }

    public function deleteChecklist($checklistID)
    {
        $query = "DELETE FROM Checklist WHERE ChecklistID = ? AND UserID = 0";
        $stmt = $this->db->prepare($query);
        $this->db->execute($stmt, [$checklistID]);
        return ['message' => 'Checklist deleted successfully'];
    }
}
?>