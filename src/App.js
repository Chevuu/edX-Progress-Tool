import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Checklist from './components/Checklist';
import './App.css';

function ChecklistPage() {
  const { courseCode, courseRun, checklistID } = useParams(); // Get parameters from URL
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/checklist/${courseCode}/${courseRun}/${checklistID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching checklist');
        }
        return response.json();
      })
      .then(data => {
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Define a route with dynamic parameters for courseCode, courseRun, and checklistID */}
        <Route path="/:courseCode/:courseRun/:checklistID" element={<ChecklistPage />} />
      </Routes>
    </Router>
  );
}

export default App;