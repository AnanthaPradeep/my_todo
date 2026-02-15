import React from 'react';
import type { MoodProductivity } from '../../utils/taskMoodAnalytics';
import './styles/taskMoodDashboard.css';

interface MoodProductivityChartProps {
  data: MoodProductivity[];
}

export const MoodProductivityChart: React.FC<MoodProductivityChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="chart-placeholder">No mood data yet</div>;
  }

  const maxRate = 100;

  return (
    <div className="productivity-chart">
      <h3 className="chart-title">Mood-Completion Correlation</h3>
      <div className="chart-bars">
        {data.map((mood) => (
          <div key={mood.mood} className="chart-bar-container">
            <div className="bar-label">{mood.label}</div>
            <div className="bar-wrapper">
              <div
                className="bar-fill"
                style={{
                  width: `${(mood.completionRate / maxRate) * 100}%`,
                  backgroundColor: mood.color,
                }}
              />
              <span className="bar-value">{mood.completionRate}%</span>
            </div>
            <div className="bar-meta">{mood.occurrences} days</div>
          </div>
        ))}
      </div>
    </div>
  );
};
