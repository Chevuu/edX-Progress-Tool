// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ percentage }) => {
  const getProgressStyle = () => {
    return {
      width: `${percentage}%`,
      backgroundColor: 'var(--tu-delft-blue)',  // Always blue-ish
      color: 'white',  // White text for better visibility
    };
  };

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={getProgressStyle()}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressBar;