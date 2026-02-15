import React from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernStressLevel.css';

interface ModernStressLevelProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

const getStresslabel = (value: number): string => {
  if (value <= 2) return 'Very Low';
  if (value <= 4) return 'Low';
  if (value <= 6) return 'Moderate';
  if (value <= 8) return 'High';
  return 'Very High';
};

const getStressIcon = (value: number) => {
  if (value <= 3) return Icons.CheckIn;
  if (value <= 6) return Icons.Dot;
  return Icons.Error;
};

export const ModernStressLevel: React.FC<ModernStressLevelProps> = ({ value, onChange }) => {
  const currentValue = value ?? 5;
  const percentage = (currentValue / 10) * 100;
  const Icon = getStressIcon(currentValue);
  const label = getStresslabel(currentValue);

  return (
    <div className="modern-stress-level">
      <div className="stress-header">
        <div>
          <h3>Stress Level</h3>
          <p>How stressed are you right now?</p>
        </div>
        <div className="stress-display">
          <div className="stress-icon">
            <IconWrapper Icon={Icon} size={40} color="#E76F51" />
          </div>
          <div className="stress-info">
            <div className="stress-value">{currentValue}/10</div>
            <div className="stress-label">{label}</div>
          </div>
        </div>
      </div>

      <div className="stress-gauge">
        <div className="gauge-outer">
          <div
            className="gauge-inner"
            style={{
              background: `conic-gradient(
                from 0deg,
                #4FC7BC 0deg,
                #1F9E9E 90deg,
                #FFD93D 180deg,
                #FF6B6B ${percentage * 3.6}deg,
                var(--bg-primary) ${percentage * 3.6}deg
              )`,
            }}
          >
            <div className="gauge-center">
              <div className="gauge-value">{currentValue}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stress-slider-container">
        <div className="stress-track">
          <div
            className="stress-fill"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, #4FC7BC 0%, #1F9E9E 40%, #FFD93D 70%, #FF6B6B 100%)`,
            }}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={currentValue}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="stress-input"
        />
      </div>

      <div className="stress-labels">
        <span>Calm</span>
        <span>Moderate</span>
        <span>Stressed</span>
      </div>
    </div>
  );
};
