import React from 'react';
import type { TaskPerformance } from '../../utils/taskMoodAnalytics';
import './styles/taskMoodDashboard.css';

interface WeeklyPerformanceChartProps {
  data: TaskPerformance[];
}

export const WeeklyPerformanceChart: React.FC<WeeklyPerformanceChartProps> = ({ data }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="weekly-chart">
      <h3 className="chart-title">Weekly Task Completion</h3>
      <div className="chart-points">
        {data.map((perf) => {
          const date = new Date(perf.date);
          const dayLabel = days[date.getDay()];
          const barColor =
            perf.completionRate >= 75 ? '#22c55e' : perf.completionRate >= 50 ? '#f59e0b' : '#ef4444';

          return (
            <div key={perf.date} className="chart-point">
              <div className="point-bar">
                <div
                  className="point-bar-fill"
                  style={{
                    height: `${Math.max(perf.completionRate, 10)}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              <p className="point-label">{dayLabel}</p>
              <p className="point-rate">{perf.completionRate}%</p>
              {perf.mood && <p className="point-mood">{perf.mood}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
