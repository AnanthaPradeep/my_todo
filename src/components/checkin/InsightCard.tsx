import React from 'react';
import type { PerformanceInsight } from '../../utils/taskMoodAnalytics';
import { Icons } from '../../utils/icons';
import { IconWrapper } from '../icons/IconWrapper';
import './styles/taskMoodDashboard.css';

interface InsightCardProps {
  insight: PerformanceInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const bgColor =
    insight.type === 'success'
      ? '#d1fae5'
      : insight.type === 'warning'
        ? '#fef3c7'
        : insight.type === 'alert'
          ? '#fee2e2'
          : '#dbeafe';

  const textColor =
    insight.type === 'success'
      ? '#065f46'
      : insight.type === 'warning'
        ? '#92400e'
        : insight.type === 'alert'
          ? '#7f1d1d'
          : '#1e40af';

  return (
    <div className="insight-card" style={{ backgroundColor: bgColor, borderColor: textColor }}>
      <div className="insight-icon">
        <IconWrapper Icon={insight.icon} size={20} color={textColor} />
      </div>
      <div className="insight-content">
        <h4 className="insight-title" style={{ color: textColor }}>
          {insight.title}
        </h4>
        <p className="insight-message">{insight.message}</p>
        {insight.recommendation && (
          <p className="insight-recommendation" style={{ color: textColor }}>
            <Icons.Lightbulb size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
            {insight.recommendation}
          </p>
        )}
      </div>
    </div>
  );
};
