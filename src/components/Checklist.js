import React, { useState, useEffect } from 'react';
import ChecklistItem from './ChecklistItem';
import ProgressBar from './ProgressBar';

const Checklist = ({ items, courseCode, courseRun, checklistID }) => {
  const [checklistItems, setChecklistItems] = useState(items);
  const [progress, setProgress] = useState(0);

  const handleCheck = (id, isChecked) => {
    const updatedItems = checklistItems.map(item =>
      item.id === id ? { ...item, isChecked } : item
    );
    setChecklistItems(updatedItems);

    // After updating the state locally, make an API call to update the backend
    const updatedChecks = updatedItems.map(item => item.isChecked);
    updateChecksInDatabase(updatedChecks);
  };

  const updateChecksInDatabase = (updatedChecks) => {
    fetch(`/api/checklist/${courseCode}/${courseRun}/${checklistID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Checks: updatedChecks }),
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

  useEffect(() => {
    const checkedItems = checklistItems.filter(item => item.isChecked).length;
    const totalItems = checklistItems.length;
    const percentage = Math.round((checkedItems / totalItems) * 100);
    setProgress(percentage);
  }, [checklistItems]);

  return (
    <div className="checklist-container">
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