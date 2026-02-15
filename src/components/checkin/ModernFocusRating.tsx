import React from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernFocusRating.css';

interface ModernFocusRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const getFocusLabel = (value: number): string => {
  const labels = ['', 'Scattered', 'Distracted', 'Focused', 'Very Focused', 'Laser Focus'];
  return labels[value] || 'Not Set';
};

export const ModernFocusRating: React.FC<ModernFocusRatingProps> = ({ value, onChange }) => {
  return (
    <div className="modern-focus-rating">
      <div className="focus-header">
        <div>
          <h3>Focus Level</h3>
          <p>How focused were you today?</p>
        </div>
        <div className="focus-display">
          <div className="focus-icon">
            <IconWrapper Icon={Icons.Target} size={40} color="#4FC7BC" />
          </div>
          <div className="focus-info">
            <div className="focus-value">{value}/5</div>
            <div className="focus-label">{getFocusLabel(value)}</div>
          </div>
        </div>
      </div>

      <div className="focus-buttons">
        {Array.from({ length: 5 }).map((_, i) => {
          const rating = i + 1;
          const isSelected = value === rating;
          return (
            <button
              key={rating}
              className={`focus-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(rating)}
              title={getFocusLabel(rating)}
            >
              <IconWrapper
                Icon={Icons.Target}
                size={24}
                color={isSelected ? '#4FC7BC' : 'var(--text-secondary)'}
              />
              <span>{rating}</span>
            </button>
          );
        })}
      </div>

      <div className="focus-scale">
        <span>Not Focused</span>
        <span>Laser Focus</span>
      </div>
    </div>
  );
};
