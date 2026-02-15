import React from 'react';
import './styles/stressLevelSlider.css';

interface StressLevelSliderProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

const STRESS_LABELS = ['Very Low', 'Low', 'Mild', 'Moderate', 'High', 'Very High'];

export const StressLevelSlider: React.FC<StressLevelSliderProps> = ({ value, onChange }) => {
  const currentValue = value ?? 3;
  const labelIndex = Math.min(Math.ceil(currentValue / 2) - 1, STRESS_LABELS.length - 1);

  return (
    <div className="stress-level-slider">
      <div className="slider-header">
        <h3>Stress Level</h3>
        <span className="slider-value">{STRESS_LABELS[labelIndex]}</span>
      </div>
      <div className="slider-control">
        <input
          type="range"
          min={1}
          max={10}
          value={currentValue}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="range-input"
        />
        <div className="stress-scale">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};
