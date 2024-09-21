import React, { useState } from 'react';

const ChecklistItem = ({ item, handleCheck }) => {
  const [isChecked, setIsChecked] = useState(item.isChecked);

  const handleChange = () => {
    setIsChecked(!isChecked);
    handleCheck(item.id, !isChecked);
  };

  return (
    <div className="checklist-item" onClick={handleChange} style={{ cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        style={{ pointerEvents: 'none' }}
      />
      <label>{item.task}</label>
    </div>
  );
};

export default ChecklistItem;