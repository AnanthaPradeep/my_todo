import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Icons } from '../../utils/icons';

export const ProductivitySection: React.FC = () => {
  const settings = useSettingsStore();

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title-wrapper">
          <Icons.Zap size={22} />
          <h2 className="settings-section-title">Productivity</h2>
        </div>
        <p className="settings-section-description">Configure your productivity features</p>
      </div>

      <div className="settings-section-content">
        {/* Focus Mode */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="focus-mode" className="settings-label">Focus Mode</label>
            <p className="settings-description">Hide distractions and minimize UI</p>
          </div>
          <button
            id="focus-mode"
            className={`settings-toggle ${settings.focusModeEnabled ? 'active' : ''}`}
            onClick={() => settings.setFocusModeEnabled(!settings.focusModeEnabled)}
            role="switch"
            aria-checked={settings.focusModeEnabled}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Streak Tracking */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="streak-tracking" className="settings-label">Streak Tracking</label>
            <p className="settings-description">Track your daily check-in streaks</p>
          </div>
          <button
            id="streak-tracking"
            className={`settings-toggle ${settings.streakTrackingEnabled ? 'active' : ''}`}
            onClick={() => settings.setStreakTrackingEnabled(!settings.streakTrackingEnabled)}
            role="switch"
            aria-checked={settings.streakTrackingEnabled}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Daily Goal */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="daily-goal" className="settings-label">Daily Goal</label>
            <p className="settings-description">Set and track a daily task completion goal</p>
          </div>
          <button
            id="daily-goal"
            className={`settings-toggle ${settings.enableDailyGoal ? 'active' : ''}`}
            onClick={() => settings.setEnableDailyGoal(!settings.enableDailyGoal)}
            role="switch"
            aria-checked={settings.enableDailyGoal}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Show Productivity Insights */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="productivity-insights" className="settings-label">Productivity Insights</label>
            <p className="settings-description">Display mood-productivity correlation analytics</p>
          </div>
          <button
            id="productivity-insights"
            className={`settings-toggle ${settings.showProductivityInsights ? 'active' : ''}`}
            onClick={() => settings.setShowProductivityInsights(!settings.showProductivityInsights)}
            role="switch"
            aria-checked={settings.showProductivityInsights}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Auto-Hide Completed Tasks */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="auto-hide-completed" className="settings-label">Auto-Hide Completed Tasks</label>
            <p className="settings-description">Automatically collapse finished tasks</p>
          </div>
          <button
            id="auto-hide-completed"
            className={`settings-toggle ${settings.autoHideCompletedTasks ? 'active' : ''}`}
            onClick={() => settings.setAutoHideCompletedTasks(!settings.autoHideCompletedTasks)}
            role="switch"
            aria-checked={settings.autoHideCompletedTasks}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>
      </div>
    </div>
  );
};
