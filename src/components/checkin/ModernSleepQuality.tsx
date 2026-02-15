import React from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernSleepQuality.css';

interface ModernSleepQualityProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

const SLEEP_LEVELS = [
  { value: 1, label: 'Poor', icon: Icons.Error },
  { value: 2, label: 'Fair', icon: Icons.Circle },
  { value: 3, label: 'OK', icon: Icons.Dot },
  { value: 4, label: 'Great', icon: Icons.CheckMark },
  { value: 5, label: 'Perfect', icon: Icons.Heart },
];

export const ModernSleepQuality: React.FC<ModernSleepQualityProps> = ({ value, onChange }) => {
  const currentValue = value ?? 3;

  return (
    <div className="modern-sleep-quality">
      <div className="sleep-header">
        <div>
          <h3>Sleep Quality</h3>
          <p>How well did you sleep last night?</p>
        </div>
        <div className="sleep-display">
          <div className="sleep-icon">
            <IconWrapper Icon={Icons.Moon} size={40} color="#B8B8D1" />
          </div>
          <div className="sleep-value">{currentValue}/5</div>
        </div>
      </div>

      <div className="sleep-buttons">
        {SLEEP_LEVELS.map((level) => {
          const isSelected = currentValue === level.value;
          return (
            <button
              key={level.value}
              className={`sleep-level-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(level.value)}
              title={level.label}
            >
              <div className="sleep-btn-icon">
                <IconWrapper
                  Icon={level.icon}
                  size={20}
                  color={isSelected ? '#B8B8D1' : 'var(--text-secondary)'}
                />
              </div>
              <span>{level.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sleep-descriptions">
        {SLEEP_LEVELS.map((level) => (
          <div key={level.value} className={`description ${currentValue === level.value ? 'active' : ''}`}>
            {level.label === 'Poor' && 'Restless, frequent waking'}
            {level.label === 'Fair' && 'Okay sleep, some interruptions'}
            {level.label === 'Good' && 'Solid, refreshing sleep'}
            {level.label === 'Great' && 'Very well rested'}
            {level.label === 'Perfect' && 'Amazing, completely refreshed'}
          </div>
        ))}
      </div>
    </div>
  );
};
