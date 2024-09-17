// /controllers/checklistController.js
const db = require('../config/db');

// Create a new checklist
exports.createChecklist = (req, res) => {
  const { CourseRun, CourseCode, Questions, Checks, ChecklistID } = req.body;
  
  const query = `INSERT INTO Checklist (CourseRun, CourseCode, UserID, Questions, Checks, ChecklistID) VALUES (?, ?, 0, ?, ?, ?)`;
  db.query(query, [CourseRun, CourseCode, JSON.stringify(Questions), JSON.stringify(Checks), ChecklistID], (err, result) => {
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