import React from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernEnergySlider.css';

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const getEnergyLabel = (value: number): string => {
  if (value <= 2) return 'Very Low';
  if (value <= 4) return 'Low';
  if (value <= 6) return 'Moderate';
  if (value <= 8) return 'High';
  return 'Very High';
};

const getEnergyIcon = (value: number) => {
  if (value <= 3) return Icons.Moon;
  if (value <= 6) return Icons.Circle;
  return Icons.Zap;
};

export const ModernEnergySlider: React.FC<EnergySliderProps> = ({ value, onChange }) => {
  const Icon = getEnergyIcon(value);
  const label = getEnergyLabel(value);
  const percentage = (value / 10) * 100;

  return (
    <div className="modern-energy-slider">
      <div className="energy-header">
        <div>
          <h3>Energy Level</h3>
          <p>How much energy do you have right now?</p>
        </div>
        <div className="energy-display">
          <div className="energy-icon-wrapper">
            <IconWrapper Icon={Icon} size={40} color="#1F9E9E" />
          </div>
          <div className="energy-value">
            <div className="value-number">{value}</div>
            <div className="value-label">{label}</div>
          </div>
        </div>
      </div>

      <div className="slider-container">
        <div className="slider-track">
          <div
            className="slider-fill"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, #A8DADC 0%, #1F9E9E 50%, #FF6B6B 100%)`,
            }}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="slider-input"
        />
      </div>

      <div className="slider-labels">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};
