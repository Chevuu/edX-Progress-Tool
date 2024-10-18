import React, { useState, useEffect } from 'react';
import ChecklistItem from './ChecklistItem';
import ProgressBar from './ProgressBar';

const Checklist = ({ courseCode, courseRun, checklistID, user_id }) => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the checklist data
  useEffect(() => {
    // Construct the URL with query parameters
    const url = `/edX-Progress-Tool/server/index.php?method=getChecklist&courseCode=${courseCode}&courseRun=${courseRun}&checklistID=${checklistID}&user_id=${user_id}`;

    fetch(url)
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
        setChecklistItems(parsedQuestions);
        setInstruction(data.Instruction);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [courseCode, courseRun, checklistID, user_id]);

  // Handle checking/unchecking an item
  const handleCheck = (id, isChecked) => {
    const updatedItems = checklistItems.map(item =>
      item.id === id ? { ...item, isChecked } : item
    );
    setChecklistItems(updatedItems);

    // Update the database
    const updatedChecks = updatedItems.map(item => item.isChecked);
    updateChecksInDatabase(updatedChecks);
  };

  // Update checks in the database
  const updateChecksInDatabase = (updatedChecks) => {
    // Construct the URL with method parameter
    const url = `/edX-Progress-Tool/server/index.php?method=updateChecklist`;

    // Prepare the payload
    const payload = {
      courseCode,
      courseRun,
      checklistID,
      user_id,
      Checks: updatedChecks,
    };

    fetch(url, {
      method: 'POST', // Use POST for updates
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update checklist');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  // Calculate progress
  useEffect(() => {
    const checkedItems = checklistItems.filter(item => item.isChecked).length;
    const totalItems = checklistItems.length;
    const percentage = totalItems ? Math.round((checkedItems / totalItems) * 100) : 0;
    setProgress(percentage);
  }, [checklistItems]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="checklist-container">
      {instruction && <p className="user-instruction-text">{instruction}</p>}
      {checklistItems.map(item => (
        <ChecklistItem
          key={item.id}
          item={item}
          handleCheck={handleCheck}
        />
      ))}
      <ProgressBar percentage={progress} />
    </div>
  );
};

export default Checklist;