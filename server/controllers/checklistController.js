// /controllers/checklistController.js
const db = require('../config/db');

// Create a new checklist
exports.createChecklist = (req, res) => {
  const { CourseRun, CourseCode, Questions, ChecklistID } = req.body;
  
  const query = `INSERT INTO Checklist (CourseRun, CourseCode, UserID, Questions, Checks, ChecklistID) VALUES (?, ?, 0, ?, ?, ?)`;
  db.query(query, [CourseRun, CourseCode, JSON.stringify(Questions), JSON.stringify(new Array(Questions.length).fill(false)), ChecklistID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving checklist' });
    }
    res.json({ message: 'Checklist created successfully', Id: result.insertId });
  });
};

// Get a specific checklist
exports.getChecklist = (req, res) => {
  const { courseCode, courseRun, checklistId } = req.params;

  const query = `SELECT * FROM Checklist WHERE CourseCode = ? AND CourseRun = ? AND UserID = 0 AND ChecklistID = ?`;
  db.query(query, [courseCode, courseRun, checklistId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching checklist' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    res.json(results[0]);
  });
};

// Update checklist checks
exports.updateChecklist = (req, res) => {
  const { courseCode, courseRun, checklistId } = req.params;
  const { Checks } = req.body;

  const query = `UPDATE Checklist SET Checks = ? WHERE CourseCode = ? AND CourseRun = ? AND UserID = 0 AND ChecklistID = ?`;
  db.query(query, [JSON.stringify(Checks), courseCode, courseRun, checklistId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating checklist' });
    }
    res.json({ message: 'Checklist updated successfully' });
  });
};

// Fetch all checklists by CourseCode where UserID = 0
exports.getAllChecklistsByCourseCode = (req, res) => {
  const { courseCode } = req.params;

  const query = `SELECT * FROM Checklist WHERE CourseCode = ? AND UserID = 0`;
  db.query(query, [courseCode], (err, results) => {
    if (err) {
      console.error('Error executing query:', err); 
      return res.status(500).json({ error: 'Error fetching checklists' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No checklists found for the specified course code' });
    }

    res.json(results);
  });
};

// Update checklist questions
exports.updateChecklistQuestions = (req, res) => {
  const { courseCode, courseRun, checklistId } = req.params;
  const { Questions } = req.body;

  const query = `UPDATE Checklist SET Questions = ? WHERE CourseCode = ? AND CourseRun = ? AND UserID = 0 AND ChecklistID = ?`;
  db.query(query, [JSON.stringify(Questions), courseCode, courseRun, checklistId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating checklist questions' });
    }
    res.json({ message: 'Checklist questions updated successfully' });
  });
};

// Delete checklist
exports.deleteChecklist = (req, res) => {
  const { checklistId } = req.params;

  const query = `DELETE FROM Checklist WHERE ChecklistID = ? AND UserID = 0`;
  db.query(query, [checklistId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting checklist' });
    }
    res.json({ message: 'Checklist deleted successfully' });
  });
};