import React, { useState } from 'react';

const AddChecklistModal = ({ onClose, onAddChecklist, courseCode }) => {
  const [courseRun, setCourseRun] = useState('');
  const [checklistID, setChecklistID] = useState('');
  const [instruction, setInstruction] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to add new question
  const handleAddQuestion = () => {
    console.log("Adding a new question...");
    setQuestions([...questions, '']);
    console.log("Current questions state:", questions);
  };

  // Function to handle question input change
  const handleQuestionChange = (index, newQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = newQuestion;
    setQuestions(updatedQuestions);
    console.log("Updated questions state:", updatedQuestions);
  };

  // Function to handle API call for creating checklist
  const handleCreateChecklist = () => {
    console.log("Create Checklist button clicked");
  
    // Validation: Check if required fields are filled
    if (!courseRun || !checklistID) {
      setError("Course Run and Checklist ID are required.");
      return;
    }
  
    setLoading(true);
    console.log("Loading state set to true");
  
    const newChecklistToSend = {
      CourseRun: courseRun,
      ChecklistID: checklistID,
      Instruction: instruction,
      CourseCode: courseCode,
      Questions: questions,
    };
  
    // Send the POST request
    const url = `/progress-tool/edX-Progress-Tool/server/index.php?method=createChecklist`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newChecklistToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error creating checklist');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Checklist created successfully:", data);
        const newChecklist = {
          CourseRun: courseRun,
          ChecklistID: checklistID,
          Instruction: instruction,
          CourseCode: courseCode,
          Questions: questions,
        };
        onAddChecklist(newChecklist);
        setLoading(false);
        onClose();
      })
      .catch((error) => {
        console.error("Error occurred while creating checklist:", error);
        setError('Failed to create checklist. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Checklist</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>
          Course Run:
          <input
            type="text"
            value={courseRun}
            onChange={(e) => setCourseRun(e.target.value)}
            placeholder="Enter course run"
            required
          />
        </label>
        <label>
          Checklist ID:
          <input
            type="text"
            value={checklistID}
            onChange={(e) => setChecklistID(e.target.value)}
            placeholder="Enter checklist ID"
            required
          />
        </label>
        <label>
          Instruction:
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Enter instruction"
            required
          />
        </label>
        <label>Questions:</label>
        {questions.map((question, index) => (
          <input
            key={index}
            type="text"
            value={question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder={`Question ${index + 1}`}
            required
          />
        ))}
        <button type="button" onClick={handleAddQuestion}>+ Add Question</button>
        <div className="modal-buttons">
          <button 
            className="submit-btn" 
            onClick={handleCreateChecklist} 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Checklist'}
          </button>
          <button 
            className="close-btn" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChecklistModal;