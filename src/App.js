import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Checklist from './components/Checklist';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login'; // Import the Login component
import './App.css';
import './styles/admin.css';
import './styles/modal.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function ChecklistPage() {
    const { courseCode, courseRun, checklistID } = useParams();
  
    return (
      <Checklist courseCode={courseCode} courseRun={courseRun} checklistID={checklistID} />
    );
  }

  // Check localStorage to persist authentication state across refreshes
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/admin/:courseCode" element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/:courseCode/:courseRun/:checklistID" element={<ChecklistPage />} />
        {/* Redirect any unknown paths to the login page or a 404 page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;