import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from 'react-router-dom';
import Checklist from './components/Checklist';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import './styles/admin.css';
import './styles/modal.css';

function ChecklistPage() {
  const { courseCode, courseRun, checklistID } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch checklist data from PHP backend
    fetch(`/server/checklist.php?courseCode=${courseCode}&courseRun=${courseRun}&checklistID=${checklistID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching checklist');
        }
        return response.json();
      })
      .then(data => {
        // Parse the checklist data
        const parsedQuestions = JSON.parse(data.Questions).map((question, index) => ({
          id: index,
          task: question,
          isChecked: JSON.parse(data.Checks)[index],
        }));
        setChecklist(parsedQuestions);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [courseCode, courseRun, checklistID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      {checklist ? (
        <Checklist items={checklist} courseCode={courseCode} courseRun={courseRun} checklistID={checklistID} />
      ) : (
        <p>No checklist available</p>
      )}
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <Router basename="/progress-tool/edX-Progress-Tool">
      <Routes>
        {/* Redirect base path to /admin/get-all/1 */}
        <Route path="/" element={<Navigate to="/admin/get-all/1" replace />} />
        
        {/* Route for individual checklist */}
        <Route path="/:courseCode/:courseRun/:checklistID" element={<ChecklistPage />} />
        
        {/* Route for admin to view all checklists by course code */}
        <Route path="/admin/get-all/:courseCode" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;