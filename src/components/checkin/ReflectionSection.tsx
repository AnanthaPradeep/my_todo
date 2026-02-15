import React, { useEffect, useState } from 'react';
import { REFLECTION_PROMPTS } from '../../types/checkIn';
import { Icons } from '../../utils/icons';
import './styles/checkinComponents.css';

interface ReflectionSectionProps {
  reflection?: string;
  gratitude?: string[];
  mood?: string;
  energy?: number;
  focus?: number;
  date?: string;
  onChange: (reflection: string, gratitude: string[]) => void;
}

export const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  reflection = '',
  gratitude = [],
  mood,
  energy,
  focus,
  date,
  onChange,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [hasManualPrompt, setHasManualPrompt] = useState(false);
  const [localReflection, setLocalReflection] = useState(reflection);
  const [localGratitude, setLocalGratitude] = useState(gratitude);
  const [gratitudeInput, setGratitudeInput] = useState('');

  const currentPrompt = REFLECTION_PROMPTS[currentPromptIndex];

  const getSmartPromptIndex = () => {
    const promptCategories = new Set(REFLECTION_PROMPTS.map((prompt) => prompt.category));
    let category = 'general';

    if (date) {
      const day = new Date(date).getDay();
      if (day === 1 && promptCategories.has('monday')) category = 'monday';
      if (day === 5 && promptCategories.has('friday')) category = 'friday';
      if ((day === 0 || day === 6) && promptCategories.has('weekend')) category = 'weekend';
      if (day >= 2 && day <= 4 && promptCategories.has('weekday')) category = 'weekday';
    }

    if (energy !== undefined || focus !== undefined) {
      const energyValue = energy ?? 5;
      const focusValue = focus ?? 3;
      if (energyValue <= 3 || focusValue <= 2) {
        category = promptCategories.has('low-mood') ? 'low-mood' : category;
      }
      if (energyValue >= 8 && focusValue >= 4) {
        category = promptCategories.has('celebrate') ? 'celebrate' : category;
      }
    }

    if (mood && promptCategories.has('high-mood')) {
      const highMoodIds = ['happy', 'excited', 'confident', 'calm'];
      if (highMoodIds.includes(mood)) {
        category = 'high-mood';
      }
    }

    const categoryPrompts = REFLECTION_PROMPTS
      .map((prompt, index) => ({ prompt, index }))
      .filter(({ prompt }) => prompt.category === category);

    if (categoryPrompts.length === 0) {
      return 0;
    }

    const randomIndex = Math.floor(Math.random() * categoryPrompts.length);
    return categoryPrompts[randomIndex].index;
  };

  useEffect(() => {
    if (!hasManualPrompt) {
      setCurrentPromptIndex(getSmartPromptIndex());
    }
  }, [mood, energy, focus, date, hasManualPrompt]);

  useEffect(() => {
    setLocalReflection(reflection);
  }, [reflection]);

  useEffect(() => {
    setLocalGratitude(gratitude);
  }, [gratitude]);

  const handleReflectionChange = (text: string) => {
    setLocalReflection(text);
    onChange(text, localGratitude);
  };

  const handleAddGratitude = () => {
    if (gratitudeInput.trim()) {
      const updated = [...localGratitude, gratitudeInput.trim()];
      setLocalGratitude(updated);
      setGratitudeInput('');
      onChange(localReflection, updated);
    }
  };

  const handleRemoveGratitude = (index: number) => {
    const updated = localGratitude.filter((_, i) => i !== index);
    setLocalGratitude(updated);
    onChange(localReflection, updated);
  };

  return (
    <div className="reflection-section">
      <div className="reflection-container">
        <h3 className="reflection-title">Daily Reflection</h3>
        <div className="prompts-carousel">
          <div className="prompt-display">{currentPrompt.text}</div>
          <div className="prompt-nav">
            <button
              className="prompt-btn"
              onClick={() => {
                const prevIndex = currentPromptIndex === 0 ? REFLECTION_PROMPTS.length - 1 : currentPromptIndex - 1;
                setCurrentPromptIndex(prevIndex);
                setHasManualPrompt(true);
              }}
            >
              <Icons.ChevronLeft size={18} />
            </button>
            <button
              className="prompt-btn smart"
              onClick={() => {
                setCurrentPromptIndex(getSmartPromptIndex());
                setHasManualPrompt(false);
              }}
            >
              Smart
            </button>
            <button
              className="prompt-btn"
              onClick={() => {
                const nextIndex = (currentPromptIndex + 1) % REFLECTION_PROMPTS.length;
                setCurrentPromptIndex(nextIndex);
                setHasManualPrompt(true);
              }}
            >
              <Icons.ChevronRight size={18} />
            </button>
          </div>
        </div>

        <textarea
          className="reflection-input"
          placeholder="Write your thoughts here... Take your time."
          value={localReflection}
          onChange={(e) => handleReflectionChange(e.target.value)}
          rows={5}
        />

        <div className="gratitude-section">
          <h4 className="gratitude-title">Things I'm Grateful For</h4>
          <div className="gratitude-input-group">
            <input
              type="text"
              className="gratitude-input"
              placeholder="Add something you're grateful for..."
              value={gratitudeInput}
              onChange={(e) => setGratitudeInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddGratitude();
                }
              }}
            />
            <button className="gratitude-add-btn" onClick={handleAddGratitude}>
              Add
            </button>
          </div>

          {localGratitude.length > 0 && (
            <div className="gratitude-list">
              {localGratitude.map((item, index) => (
                <div key={index} className="gratitude-item">
                  <span>{item}</span>
                  <button
                    className="gratitude-remove-btn"
                    onClick={() => handleRemoveGratitude(index)}
                  >
                    <Icons.Close size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
