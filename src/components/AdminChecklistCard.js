import React, { useState } from 'react';

const AdminChecklistCard = ({ checklist, handleDelete }) => {
  const initialQuestions = (() => {
    if (Array.isArray(checklist.Questions)) {
      return checklist.Questions;
    } else {
      try {
        const parsed = JSON.parse(checklist.Questions);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
  })();

  const [questions, setQuestions] = useState(initialQuestions);
  const [instruction, setInstruction] = useState(checklist.Instruction || '');
  const [isEditing, setIsEditing] = useState(false);


  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index, newQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = newQuestion;
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSave = () => {
    const url = `/edX-Progress-Tool/server/index.php?method=updateChecklistQuestions`;
    const payload = {
      courseCode: checklist.CourseCode,
      courseRun: checklist.CourseRun,
      instruction: instruction,
      checklistID: checklist.ChecklistID,
      Questions: questions,
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating checklist');
        }
        return response.json();
      })
      .then(() => {
        setIsEditing(false);
        console.log('Checklist updated successfully');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this checklist?")) {
      handleDelete(checklist.ChecklistID);
    }
  };

  return (
    <div className="admin-checklist-card">
      <div className="admin-checklist-content">
        <button className="delete-btn-top-right" onClick={handleConfirmDelete}>
          Delete
        </button>
        <h2>Course Run: {checklist.CourseRun}</h2>
        <p className="label">Checklist ID: {checklist.ChecklistID}</p>
        {isEditing ? (
          <div className="instruction-edit">
            <label htmlFor="instruction-input"><strong>Instruction:</strong></label>
            <textarea
              id="instruction-input"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
            />
          </div>
        ) : (
          instruction && <p className="instruction-text">
            <strong>Instruction:</strong> {instruction}
          </p>
        )}
        <p className="label">Questions:</p>
        <div className="questions">
          <ul>
            {questions.map((question, index) => (
              <li key={index}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                    />
                    <button className="delete-question-btn" onClick={() => handleDeleteQuestion(index)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <span>{question}</span>
                )}
              </li>
            ))}
          </ul>
          {isEditing && (
            <button className="add-question-btn" onClick={handleAddQuestion}>
              + Add Question
            </button>
          )}
        </div>
        <div className="admin-checklist-buttons">
          <button className="edit-btn" onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}>
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChecklistCard;