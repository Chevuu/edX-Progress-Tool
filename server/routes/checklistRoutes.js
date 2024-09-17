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

module.exports = router;