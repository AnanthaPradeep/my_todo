import React from 'react';
import { MICRO_COMMITMENT_EXAMPLES } from '../../types/checkIn';
import './styles/microCommitment.css';

interface MicroCommitmentProps {
  value: string;
  onChange: (value: string) => void;
}

export const MicroCommitment: React.FC<MicroCommitmentProps> = ({ value, onChange }) => {
  return (
    <div className="micro-commitment">
      <div className="micro-header">
        <h3>Micro-Commitment</h3>
        <p>One small action for tomorrow that supports you.</p>
      </div>
      <input
        type="text"
        className="micro-input"
        placeholder="e.g., 10-minute walk, write 1 page"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="micro-examples">
        {MICRO_COMMITMENT_EXAMPLES.map((example) => (
          <button
            key={example}
            className="micro-chip"
            onClick={() => onChange(example)}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};
