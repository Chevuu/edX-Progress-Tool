import React from 'react';
import { HashRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Checklist from './components/Checklist';
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard
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
        <Route path="/:courseCode/:courseRun/:checklistID" element={<ChecklistPage />} />
        <Route path="/admin/:courseCode" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;