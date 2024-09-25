// /routes/checklistRoutes.js
const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');

// POST: Create a checklist
router.post('/checklist', checklistController.createChecklist);

// GET: Fetch a checklist
router.get('/checklist/:courseCode/:courseRun/:checklistId', checklistController.getChecklist);

// PUT: Update checklist checks
router.put('/checklist/:courseCode/:courseRun/:checklistId', checklistController.updateChecklist);

// GET: Fetch all checklists by CourseCode for admin
router.get('/admin/get-all/:courseCode', checklistController.getAllChecklistsByCourseCode);

// PUT: Update checklist questions
router.put('/checklist/:courseCode/:courseRun/:checklistId/questions', checklistController.updateChecklistQuestions);

// DELETE: Delete a checklist
router.delete('/checklist/:checklistId', checklistController.deleteChecklist);

module.exports = router;