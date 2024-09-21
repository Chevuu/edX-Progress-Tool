import React from 'react';

const ProgressBar = ({ percentage }) => {
  const getProgressStyle = () => {
    return {
      width: `${percentage}%`,
      backgroundColor: 'var(--tu-delft-blue)',
      color: 'white',
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