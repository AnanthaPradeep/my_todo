import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './styles/taskMoodDashboard.css';

interface PerformanceCardProps {
  Icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string | React.ReactNode;
  color?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  Icon,
  label,
  value,
  subtitle,
  color = '#1F9E9E',
}) => {
  return (
    <div className="performance-card" style={{ borderLeftColor: color }}>
      <div className="card-icon">
        <Icon size={32} style={{ color }} />
      </div>
      <div className="card-content">
        <p className="card-label">{label}</p>
        <p className="card-value" style={{ color }}>
          {value}
        </p>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};
