import React from 'react';
import './styles/timeOfDayToggle.css';

interface TimeOfDayToggleProps {
  value: 'morning' | 'evening' | undefined;
  onChange: (value: 'morning' | 'evening') => void;
}

export const TimeOfDayToggle: React.FC<TimeOfDayToggleProps> = ({ value, onChange }) => {
  return (
    <div className="time-of-day-toggle">
      <h3>When are you checking in?</h3>
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${value === 'morning' ? 'active' : ''}`}
          onClick={() => onChange('morning')}
        >
          Morning
        </button>
        <button
          className={`toggle-btn ${value === 'evening' ? 'active' : ''}`}
          onClick={() => onChange('evening')}
        >
          Evening
        </button>
      </div>
    </div>
  );
};
