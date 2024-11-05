import React, { useState } from 'react';
import '../styles/faq.css';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const questionsAnswers = [
    {
      question: 'How do I create a new checklist?',
      answer: 'To create a new checklist, click on the "Add Checklist" button on the admin dashboard.',
    },
    {
      question: 'How can I view the data reports?',
      answer: 'You can view data reports by clicking on the "Data" button on the admin dashboard.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click on "Forgot Password".',
    },
    {
      question: 'How can I toggle dark mode?',
      answer: 'Click on the moon/sun icon in the top right corner to toggle dark mode.',
    },
    {
      question: 'How do I log out?',
      answer: 'Click on the "Logout" button in the top navigation bar to log out.',
    },
  ];

  const toggleQuestion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="faq-container">
      <h1>FAQ</h1>
      <div className="faq-list">
        {questionsAnswers.map((item, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <div
              className="faq-question"
              onClick={() => toggleQuestion(index)}
            >
              {item.question}
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;