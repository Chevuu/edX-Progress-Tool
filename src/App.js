import React, { useState, useEffect } from 'react';

function App() {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    fetch('getData.php')
      .then(response => response.json())
      .then(data => {
        setEntry(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  if (!entry) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Checklist Entry</h1>
      <ul>
        <li><strong>ID:</strong> {entry.id}</li>
        <li><strong>CourseRun:</strong> {entry.CourseRun}</li>
        <li><strong>CourseCode:</strong> {entry.CourseCode}</li>
        <li><strong>UserID:</strong> {entry.UserID}</li>
        <li><strong>Questions:</strong> {entry.Questions}</li>
        <li><strong>Checks:</strong> {entry.Checks}</li>
        <li><strong>ChecklistID:</strong> {entry.ChecklistID}</li>
      </ul>
    </div>
  );
}

export default App;