import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Checklist from './components/Checklist';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login'; // Import the Login component
import './App.css';
import './styles/admin.css';
import './styles/modal.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function ChecklistPage() {
    const { courseCode, courseRun, checklistID, user_id } = useParams();
  
    return (
      <Checklist courseCode={courseCode} courseRun={courseRun} checklistID={checklistID} user_id={user_id} />
    );
  }

  // Check localStorage to persist authentication state across refreshes
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    // Check if the session is still valid
    if (auth === 'true' && sessionExpiry) {
      const currentTime = new Date().getTime();

      // If the current time is less than the expiry time, keep the session active
      if (currentTime < sessionExpiry) {
        setIsAuthenticated(true);
      } else {
        // If the session has expired, clear the authentication
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('sessionExpiry');
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/admin/:courseCode" element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/:courseCode/:courseRun/:checklistID/:user_id" element={<ChecklistPage />} />
        {/* Redirect any unknown paths to the login page or a 404 page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;