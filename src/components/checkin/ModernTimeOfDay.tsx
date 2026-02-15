import React from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernTimeOfDay.css';

interface ModernTimeOfDayProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const TIME_OPTIONS = [
  { id: 'morning', label: 'Morning', icon: Icons.Sun, description: 'Early riser', color: '#FFB347' },
  { id: 'afternoon', label: 'Afternoon', icon: Icons.Sunrise, description: 'Midday peak', color: '#1F9E9E' },
  { id: 'evening', label: 'Evening', icon: Icons.Moon, description: 'Night owl', color: '#6C5CE7' },
];

export const ModernTimeOfDay: React.FC<ModernTimeOfDayProps> = ({ value, onChange }) => {
  const selected = TIME_OPTIONS.find((t) => t.id === value);
  const selectedColor = selected?.color ?? '#4FC7BC';

  return (
    <div className="modern-time-of-day">
      <div className="time-header">
        <div>
          <h3>Time of Day</h3>
          <p>When are you checking in?</p>
        </div>
        {selected && (
          <div className="time-display">
            <div className="time-icon" style={{ color: selectedColor }}>
              <IconWrapper Icon={selected.icon} size={36} color={selectedColor} />
            </div>
            <div className="time-info">
              <div className="time-value">{selected.label}</div>
              <div className="time-desc">{selected.description}</div>
            </div>
          </div>
        )}
      </div>

      <div className="time-options">
        {TIME_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={`time-option ${value === option.id ? 'selected' : ''}`}
            onClick={() => onChange(option.id)}
            style={value === option.id ? { borderColor: option.color } : {}}
          >
            <div className="time-option-icon">
              <IconWrapper Icon={option.icon} size={32} color={option.color} />
            </div>
            <div className="time-option-label">{option.label}</div>
            <div className="time-option-desc">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
