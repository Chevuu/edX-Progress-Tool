<?php
namespace src\controller;

class ChecklistController
{
    private $checklistModel;

    public function __construct($checklistModel)
    {
        $this->checklistModel = $checklistModel;
    }

    public function createChecklist()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        return $this->checklistModel->createChecklist(
            $input['CourseRun'], 
            $input['CourseCode'], 
            $input['Questions'], 
            $input['ChecklistID']
        );
    }

    public function getChecklist($courseCode, $courseRun, $checklistID)
    {
        return $this->checklistModel->getChecklist($courseCode, $courseRun, $checklistID);
    }

    public function updateChecklist($courseCode, $courseRun, $checklistID)
    {
        $input = json_decode(file_get_contents('php://input'), true);
        return $this->checklistModel->updateChecklist(
            $courseCode, 
            $courseRun, 
            $checklistID, 
            $input['Checks']
        );
    }

    public function getAllChecklistsByCourseCode($courseCode)
    {
        return $this->checklistModel->getAllChecklistsByCourseCode($courseCode);
    }

    public function deleteChecklist($checklistID)
    {
        return $this->checklistModel->deleteChecklist($checklistID);
    }
}
?>