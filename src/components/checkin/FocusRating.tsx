import React from 'react';
import './styles/checkinComponents.css';

interface FocusRatingProps {
  value?: number;
  onChange: (value: number) => void;
}

const getFocusColor = (value: number): string => {
  if (value === 1) return '#E76F51';
  if (value === 2) return '#F4A261';
  if (value === 3) return '#FFD93D';
  if (value === 4) return '#4FC7BC';
  return '#1F9E9E';
};

const getFocusLabel = (value: number): string => {
  const labels = ['', 'Distracted', 'Unfocused', 'Focused', 'Very Focused', 'Laser Focused'];
  return labels[value] || 'Select...';
};

export const FocusRating: React.FC<FocusRatingProps> = ({ value = 3, onChange }) => {
  return (
    <div className="focus-rating">
      <label className="focus-label">Focus Level</label>
      <div className="focus-display">
        <span className="focus-level-text">{getFocusLabel(value)}</span>
      </div>
      <div className="rating-buttons">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            className={`rating-btn ${value === rating ? 'selected' : ''}`}
            onClick={() => onChange(rating)}
            style={{
              backgroundColor: value === rating ? getFocusColor(rating) : 'var(--bg-tertiary)',
              color: value === rating ? 'white' : 'var(--text-secondary)',
            }}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
};
