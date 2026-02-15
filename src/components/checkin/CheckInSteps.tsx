import React from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/checkInSteps.css';

interface CheckInStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const CheckInSteps: React.FC<CheckInStepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="checkin-steps">
      <div className="steps-container">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`step ${index < currentStep ? 'completed' : ''} ${
              index === currentStep ? 'active' : ''
            }`}
          >
            <div className="step-circle">
              {index < currentStep ? (
                <IconWrapper Icon={Icons.Check} size={18} color="currentColor" />
              ) : (
                index + 1
              )}
            </div>
            {index < totalSteps - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>
      <div className="step-label">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};
