import React, { useState } from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernMicroCommitment.css';

interface ModernMicroCommitmentProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const MICRO_COMMITMENT_EXAMPLES = [
  '10-minute walk',
  'Drink water',
  'Meditate',
  'Journal',
  'Call a friend',
  'Cook meal',
  'Stretch',
  'Read',
];

export const ModernMicroCommitment: React.FC<ModernMicroCommitmentProps> = ({ value, onChange }) => {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="modern-micro-commitment">
      <div className="micro-header">
        <div>
          <h3>Micro Commitment</h3>
          <p>One small step you'll take today</p>
        </div>
        <div className="micro-display">
          <div className="micro-icon">
            <IconWrapper Icon={Icons.Target} size={36} color="#1F9E9E" />
          </div>
          <div className="micro-status">
            <div className="micro-status-text">{value ? 'Set' : 'Optional'}</div>
          </div>
        </div>
      </div>

      <div className="micro-input-container">
        <input
          type="text"
          placeholder="E.g., 10-minute walk, journal, meditate..."
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="micro-input"
          onFocus={() => setShowExamples(true)}
          onBlur={() => setTimeout(() => setShowExamples(false), 100)}
        />
        <button
          className="micro-clear"
          onClick={() => onChange('')}
          style={{ opacity: value ? 1 : 0.3, pointerEvents: value ? 'auto' : 'none' }}
        >
          <IconWrapper Icon={Icons.Close} size={18} color="#999" />
        </button>
      </div>

      {showExamples && (
        <div className="micro-examples">
          <div className="examples-label">Try one of these:</div>
          <div className="examples-grid">
            {MICRO_COMMITMENT_EXAMPLES.map((example) => (
              <button
                key={example}
                className="example-chip"
                onClick={() => {
                  onChange(example);
                  setShowExamples(false);
                }}
              >
                <IconWrapper Icon={Icons.Plus} size={14} color="#1F9E9E" />
                <span>{example}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
