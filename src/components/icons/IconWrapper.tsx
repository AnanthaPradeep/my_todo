/**
 * IconWrapper Component
 * Standardized wrapper for all icons with consistent styling
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './IconWrapper.css';

export interface IconWrapperProps {
  Icon: LucideIcon;
  size?: number;
  className?: string;
  color?: string;
  title?: string;
  onClick?: () => void;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  Icon,
  size = 24,
  className = '',
  color = 'currentColor',
  title,
  onClick,
}) => {
  return (
    <span title={title} className={`icon-wrapper ${onClick ? 'interactive' : ''}`}>
      <Icon
        size={size}
        className={`icon ${className}`}
        style={{ color }}
        onClick={onClick}
      />
    </span>
  );
};

export default IconWrapper;
