import React, { useState } from 'react';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/modernReflectionSection.css';

interface ModernReflectionSectionProps {
  value: string | undefined;
  onChange: (value: string) => void;
  mood?: string;
  energy?: number;
}

const REFLECTION_PROMPTS = {
  excited: [
    'What made you feel excited today?',
    'What achievement are you most proud of?',
    'What can you do more of to stay this energized?',
  ],
  happy: [
    'What brought joy to your day?',
    'Who made you smile today?',
    'What small moment made a big difference?',
  ],
  calm: [
    'What helped you feel peaceful?',
    'What activity was most restorative?',
    'How can you maintain this calm tomorrow?',
  ],
  productive: [
    'What did you accomplish today?',
    'What was your most productive moment?',
    'What barriers did you overcome?',
  ],
  neutral: [
    'What did you learn today?',
    'What went as expected?',
    'What are you grateful for?',
  ],
  tired: [
    'What drained your energy most?',
    'What rest do you need?',
    'What can help you recharge tomorrow?',
  ],
  stressed: [
    'What was stressing you out?',
    'What support do you need?',
    'What is one thing you can change?',
  ],
};

export const ModernReflectionSection: React.FC<ModernReflectionSectionProps> = ({
  value,
  onChange,
  mood,
}) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const prompts = mood && REFLECTION_PROMPTS[mood as keyof typeof REFLECTION_PROMPTS]
    ? REFLECTION_PROMPTS[mood as keyof typeof REFLECTION_PROMPTS]
    : REFLECTION_PROMPTS.neutral;

  const currentPrompt = prompts[refreshCount % prompts.length];

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="modern-reflection-section">
      <div className="reflection-header">
        <div>
          <h3>Reflection</h3>
          <p>How are you really feeling?</p>
        </div>
        <button className="refresh-button" onClick={handleRefresh} title="Get a new prompt">
          <IconWrapper Icon={Icons.Sunrise} size={20} color="#1F9E9E" />
        </button>
      </div>

      <div className="reflection-prompt">
        <div className="prompt-icon">
          <IconWrapper Icon={Icons.MessageSquare} size={20} color="#4FC7BC" />
        </div>
        <div className="prompt-text">{currentPrompt}</div>
      </div>

      <textarea
        placeholder="Write your thoughts..."
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="reflection-textarea"
      />

      <div className="reflection-footer">
        <div className="char-count">{(value ?? '').length} characters</div>
        <div className="reflection-tip">Take your time. There's no right answer.</div>
      </div>
    </div>
  );
};
