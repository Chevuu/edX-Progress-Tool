import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/faq.css';
import { FaArrowLeft } from 'react-icons/fa';

function FAQ() {
  const { courseCode } = useParams();
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const questionsAnswers = [
    {
      question: 'How do I create an account?',
      answer: (
        <span>
          To create an account, navigate to the{' '}
          <a
            href="https://delftxtools.tudelft.nl/edX-Progress-Tool/build/index.html#/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            login page
          </a>{' '}
          and click on the "Create Account" hyperlink. Enter your course code as the username,
          ensuring the exact casing is used, and choose a password of your preference.
        </span>
      ),
    },
    {
      question: 'How do I reset my password?',
      answer:
        'To reset your password, simply create a new account using your existing username (course code) and a new password of your choice. This will update your password and allow you to log in with the new credentials.',
    },
    {
      question: 'How do I create a checklist?',
      answer:
        'To create a new checklist, go to the Dashboard and click on the "Add Checklist" button. Fill in the required information carefully. For the Checklist ID, we recommend using sequential numbers starting from 1. The "Instruction" field displays text above the learner\'s checklist; this field is optional. In the "Questions" section, you can add the checklist items (checks). While you can add as many as you like, we recommend keeping it under 15 for optimal display. If you need more, please contact Udo or V.Jurisic@tudelft.nl.',
    },
    {
      question: 'How do I edit a checklist?',
      answer:
        'To edit a checklist, click on the "Edit" button located below each checklist. You can modify the checklist items (checks) and the instruction text. Renaming items will not affect learners\' progress. However, deleting existing questions and adding new ones may negatively impact the learners\' experience. Therefore, we recommend only renaming existing items or adding new ones.',
    },
    {
      question: 'How do I add a checklist into a course?',
      answer: (
        <span>
          To add a checklist into your course, follow these steps:
          <ol>
            <li>
              <strong>Create a Raw HTML Component:</strong> In Studio mode, create a new Raw HTML
              component within your course content.
            </li>
            <li>
              <strong>Insert the Checklist Iframe Code:</strong> Paste the following code into the
              HTML editor:
              <pre className="code-block">
                {`<iframe 
  src="https://delftxtools.tudelft.nl/edX-Progress-Tool/build/index.html#/{Course Code}/{Course Run}/{Checklist ID}/%%USER_ID%%" 
  width="100%" 
  height="350px" 
  frameborder="0">
</iframe>`}
              </pre>
            </li>
            <li>
              <strong>Customize the Iframe Parameters:</strong> Replace the placeholders in the
              curly brackets with your actual course code, course run, and checklist ID.
              <br />
              <em>Example:</em>
              <pre className="code-block">
                {`<iframe 
  src="https://delftxtools.tudelft.nl/edX-Progress-Tool/build/index.html#/ABC123/2023Q1/1/%%USER_ID%%" 
  width="100%" 
  height="350px" 
  frameborder="0">
</iframe>`}
              </pre>
            </li>
            <li>
              <strong>Adjust the Iframe Height:</strong> Modify the <code>height</code> attribute to
              accommodate the number of questions in your checklist. The height is not automatically
              adjusted, so you may need to experiment to find the optimal height.
            </li>
          </ol>
          <strong>Note:</strong> The <code>%%USER_ID%%</code> token will be automatically replaced
          with the learner's user ID when the course is viewed.
        </span>
      ),
    },
    {
      question: 'How do I view statistics and usage data of the checklists?',
      answer:
        'You can view statistics by clicking the "Data" button located in the top right corner of the admin dashboard. On the data page, the buttons on the left represent each checklist. Click on a checklist button to view detailed statistics for that specific checklist. Below the buttons, you will see plotted graphs displaying aggregated data for all checklists in the course.\n\nPlease note that a checklist will only appear on the data page after at least one user has accessed it. These data visualizations help you understand how learners are interacting with the checklists.',
    },
    {
      question: 'How can I view a checklist I have just created?',
      answer: (
        <span>
          To preview a checklist you have just created, you can use an existing edX user ID for testing purposes. For this purpose, you can use the edX ID associated with <code>edx-ES@tudelft.nl</code>, which is:
          <br />
          <br />
          <code>e6af2ea68f545e0e910ced1ac27c92bb</code>
          <br />
          <br />
          Replace the <code>%%USER_ID%%</code> in the iframe URL with this ID to view your checklist.
          <br />
          <br />
          **Example URL:**
          <pre className="code-block">
            {`https://delftxtools.tudelft.nl/edX-Progress-Tool/build/index.html#/{Course Code}/{Course Run}/{Checklist ID}/e6af2ea68f545e0e910ced1ac27c92bb`}
          </pre>
          Be sure to replace <code>{'{Course Code}'}</code>, <code>{'{Course Run}'}</code>, and <code>{'{Checklist ID}'}</code> with your actual course code, course run, and checklist ID.
          <br />
          <br />
          This allows you to view and test your checklist as it would appear to a learner.
        </span>
      ),
    },
    {
      question: 'How do I log out?',
      answer:
        'Click on the "Logout" button in the top navigation bar to securely log out of your account.',
    },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setActiveIndex(null);
  };

  const filteredQuestions = questionsAnswers
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) =>
      item.question.toLowerCase().includes(searchQuery) ||
      (typeof item.answer === 'string'
        ? item.answer.toLowerCase().includes(searchQuery)
        : // If answer is JSX, convert it to string for searching
          (item.answer.props.children || '')
            .toString()
            .toLowerCase()
            .includes(searchQuery))
    )
    .sort((a, b) => {
      const aQuestion = a.question.toLowerCase();
      const bQuestion = b.question.toLowerCase();
      const aIncludes = aQuestion.includes(searchQuery);
      const bIncludes = bQuestion.includes(searchQuery);
      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;
      return a.originalIndex - b.originalIndex;
    });

    const toggleQuestion = (index) => {
      setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };
  
    const handleBack = () => {
      navigate(`/admin/${courseCode}`);
    };
  
    return (
      <div className="faq-container">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft className="back-icon" /> Back to Dashboard
        </button>
        <h1>FAQ</h1>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="faq-list">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              >
                <div className="faq-question" onClick={() => toggleQuestion(index)}>
                  {item.question}
                </div>
                {activeIndex === index && (
                  <div className="faq-answer">{item.answer}</div>
                )}
              </div>
            ))
          ) : (
            <p className="no-results">No FAQs match your search.</p>
          )}
        </div>
      </div>
    );
  }
  
  export default FAQ;