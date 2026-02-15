import React from 'react';
import './styles/checkinComponents.css';

interface EnergySliderProps {
  value?: number;
  onChange: (value: number) => void;
}

const getEnergyColor = (value: number): string => {
  if (value <= 2) return '#E76F51'; // Red - low
  if (value <= 4) return '#F4A261'; // Orange - low-medium
  if (value <= 6) return '#FFD93D'; // Yellow - medium
  if (value <= 8) return '#4FC7BC'; // Teal - medium-high
  return '#1F9E9E'; // Deep teal - high
};

export const EnergySlider: React.FC<EnergySliderProps> = ({ value = 5, onChange }) => {
  const energyColor = getEnergyColor(value);

  const getEnergyLabel = (val: number): string => {
    if (val <= 2) return 'Low';
    if (val <= 4) return 'Low-Medium';
    if (val <= 6) return 'Medium';
    if (val <= 8) return 'Medium-High';
    return 'High';
  };

  return (
    <div className="energy-slider">
      <div className="energy-header">
        <label className="energy-label">Energy Level</label>
        <div className="energy-display">
          <span className="energy-value">{value}</span>
          <span className="energy-level-text">{getEnergyLabel(value)}</span>
        </div>
      </div>

      <div className="slider-track" style={{ backgroundColor: `${energyColor}20` }}>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider-input"
          style={{
            '--slider-fill': energyColor,
          } as React.CSSProperties}
        />
        <div
          className="slider-fill"
          style={{
            width: `${(value / 10) * 100}%`,
            backgroundColor: energyColor,
          }}
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
