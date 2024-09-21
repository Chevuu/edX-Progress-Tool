const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;
const checklistRoutes = require('./routes/checklistRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../build')));

// Use checklist routes (API endpoints)
app.use('/api', checklistRoutes);

// Catch-all route for serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});