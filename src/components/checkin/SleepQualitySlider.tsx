import React from 'react';
import { Icons } from '../../utils/icons';
import './styles/sleepQualitySlider.css';

interface SleepQualitySliderProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

const SLEEP_LABELS = ['Poor', 'Fair', 'Okay', 'Good', 'Great'];

export const SleepQualitySlider: React.FC<SleepQualitySliderProps> = ({ value, onChange }) => {
  const currentValue = value ?? 3;

  return (
    <div className="sleep-quality-slider">
      <div className="slider-header">
        <h3>Sleep Quality</h3>
        <span className="slider-value">{SLEEP_LABELS[currentValue - 1]}</span>
      </div>
      <div className="slider-control">
        <input
          type="range"
          min={1}
          max={5}
          value={currentValue}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="range-input"
        />
        <div className="slider-icons">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icons.Moon
              key={index}
              size={18}
              className={index < currentValue ? 'icon active' : 'icon'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
