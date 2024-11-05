import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Checklist from './components/Checklist';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import DataDashboard from './components/DataDashboard';
import Register from './components/Register';
import FAQ from './components/FAQ';
import './App.css';
import './styles/admin.css';
import './styles/modal.css';

function DataDashboardPage() {
  const { courseCode } = useParams();
  return <DataDashboard courseCode={courseCode} />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  function ChecklistPage() {
    const { courseCode, courseRun, checklistID, user_id } = useParams();
  
    return (
      <Checklist courseCode={courseCode} courseRun={courseRun} checklistID={checklistID} user_id={user_id} />
    );
  }

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (auth === 'true' && sessionExpiry) {
      const currentTime = new Date().getTime();

      if (currentTime < Number(sessionExpiry)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('sessionExpiry');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    const darkModeSetting = localStorage.getItem('isDarkMode');
    if (darkModeSetting !== null) {
      setIsDarkMode(darkModeSetting === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/:courseCode/data" element={
            isAuthenticated ? <DataDashboardPage /> : <Navigate to="/login" replace />
          } />
          <Route path="/admin/:courseCode" element={
            isAuthenticated ? <AdminDashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/login" replace />
          } />
          <Route path="/:courseCode/:courseRun/:checklistID/:user_id" element={<ChecklistPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route
            path="/admin/:courseCode/faq"
            element={
              isAuthenticated ? <FAQ /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;