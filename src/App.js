import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Checklist from './components/Checklist';
import './App.css';
import './styles/admin.css';
import './styles/modal.css';

function ChecklistPage() {
  const { courseCode, courseRun, checklistID } = useParams();

  return (
    <Checklist courseCode={courseCode} courseRun={courseRun} checklistID={checklistID} />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route with parameters */}
        <Route path="/:courseCode/:courseRun/:checklistID" element={<ChecklistPage />} />
        {/* Other routes can go here */}
      </Routes>
    </Router>
  );
}

export default App;