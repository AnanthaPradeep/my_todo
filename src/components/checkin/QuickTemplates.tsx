/**
 * Quick Templates Component
 * Preset templates for quick check-ins
 */

import React from 'react';
import { Icons } from '../../utils/icons';
import type { IconType } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/quickTemplates.css';

interface QuickTemplate {
  id: string;
  label: string;
  Icon: IconType;
  mood: string;
  energy: number;
  focus: number;
  reflection: string;
}

interface QuickTemplatesProps {
  onSelectTemplate: (template: Omit<QuickTemplate, 'id' | 'label' | 'Icon'>) => void;
}

const TEMPLATES: QuickTemplate[] = [
  {
    id: 'great',
    label: 'Great Day',
    Icon: Icons.Sparkles,
    mood: 'happy',
    energy: 8,
    focus: 4,
    reflection: 'Feeling productive and positive today!',
  },
  {
    id: 'tough',
    label: 'Tough Day',
    Icon: Icons.AlertTriangle,
    mood: 'stressed',
    energy: 3,
    focus: 2,
    reflection: 'Today was challenging, but I\'m being kind to myself.',
  },
  {
    id: 'okay',
    label: 'Just Okay',
    Icon: Icons.Circle,
    mood: 'neutral',
    energy: 5,
    focus: 3,
    reflection: 'An average day. Tomorrow is a fresh start.',
  },
];

export const QuickTemplates: React.FC<QuickTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="quick-templates">
      <p className="quick-templates-label">Quick Start:</p>
      <div className="quick-templates-grid">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`quick-template-btn ${template.id}`}
            onClick={() => {
              const { id, label, Icon, ...data } = template;
              onSelectTemplate(data);
            }}
          >
            <span className="template-icon">
              <IconWrapper Icon={template.Icon} size={18} color="currentColor" />
            </span>
            <span className="template-label">{template.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
