import React from 'react';
import type { TaskMoodAnalytics } from '../../utils/taskMoodAnalytics';
import { MoodProductivityChart } from './MoodProductivityChart';
import { PerformanceCard } from './PerformanceCard';
import { InsightCard } from './InsightCard';
import { WeeklyPerformanceChart } from './WeeklyPerformanceChart';
import { Icons } from '../../utils/icons';
import './styles/taskMoodDashboard.css';

interface TaskMoodDashboardProps {
  analytics: TaskMoodAnalytics;
}

const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
  if (trend === 'improving') return Icons.TrendingUp;
  if (trend === 'declining') return Icons.TrendingDown;
  return Icons.BarChart;
};

const getTrendLabel = (trend: 'improving' | 'declining' | 'stable') => {
  if (trend === 'improving') return 'Improving';
  if (trend === 'declining') return 'Declining';
  return 'Stable';
};

export const TaskMoodDashboard: React.FC<TaskMoodDashboardProps> = ({ analytics }) => {
  const TrendIcon = getTrendIcon(analytics.weeklyTrend);
  
  return (
    <div className="task-mood-dashboard">
      <h2 className="dashboard-title">Performance Insights</h2>

      {/* Main Metrics */}
      <div className="metrics-grid">
        <PerformanceCard
          Icon={Icons.BarChart}
          label="Weekly Completion"
          value={`${analytics.avgCompletionRate}%`}
          subtitle={
            <>
              <TrendIcon size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
              {getTrendLabel(analytics.weeklyTrend)}
            </>
          }
          color={
            analytics.weeklyTrend === 'improving'
              ? '#22c55e'
              : analytics.weeklyTrend === 'declining'
                ? '#ef4444'
                : '#8b5cf6'
          }
        />
        <PerformanceCard
          Icon={Icons.Trophy}
          label="Best Mood"
          value={analytics.bestMood?.label || 'N/A'}
          subtitle={`${analytics.bestMood?.completionRate || 0}% completion`}
          color={analytics.bestMood?.color || '#64748b'}
        />
        <PerformanceCard
          Icon={Icons.AlertTriangle}
          label="Challenge"
          value={analytics.worstMood?.label || 'N/A'}
          subtitle={`${analytics.worstMood?.completionRate || 0}% completion`}
          color={analytics.worstMood?.color || '#64748b'}
        />
      </div>

      {/* Charts */}
      <div className="charts-section">
        <MoodProductivityChart data={analytics.moodProductivity} />
        <WeeklyPerformanceChart data={analytics.weeklyPerformance} />
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h3 className="insights-title">Smart Recommendations</h3>
        <div className="insights-grid">
          {analytics.insights.length > 0 ? (
            analytics.insights.map((insight, idx) => <InsightCard key={idx} insight={insight} />)
          ) : (
            <p className="no-insights">Add more check-ins to see personalized insights.</p>
          )}
        </div>
      </div>
    </div>
  );
};
