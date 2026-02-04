import React from 'react';



const TimePicker = ({ value, onChange, disabled }) => {
  return (
    <input
      type="time"
      className="form-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      step="3600" // 15 minute increments
    />
  );
};

export default TimePicker;