import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Icons } from '../../utils/icons';

export const TaskPreferencesSection: React.FC = () => {
  const settings = useSettingsStore();

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title-wrapper">
          <Icons.CheckCircle size={22} />
          <h2 className="settings-section-title">Task Preferences</h2>
        </div>
        <p className="settings-section-description">Set defaults for task creation</p>
      </div>

      <div className="settings-section-content">
        {/* Default Task Duration */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label htmlFor="task-duration" className="settings-label">Default Task Duration</label>
            <p className="settings-description">Minutes for new tasks</p>
          </div>
          <div className="settings-number-input-wrapper">
            <input
              id="task-duration"
              type="number"
              min="5"
              max="480"
              step="5"
              value={settings.defaultTaskDuration}
              onChange={(e) => settings.setDefaultTaskDuration(Math.max(5, parseInt(e.target.value)))}
              className="settings-number-input"
            />
            <span className="settings-number-unit">minutes</span>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Default Priority */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Default Priority</label>
            <p className="settings-description">Priority level for new tasks</p>
          </div>
          <div className="settings-button-group">
            <button
              className={`settings-button-group-item ${
                settings.defaultPriority === 'low' ? 'active' : ''
              }`}
              onClick={() => settings.setDefaultPriority('low')}
              aria-pressed={settings.defaultPriority === 'low'}
            >
              Low
            </button>
            <button
              className={`settings-button-group-item ${
                settings.defaultPriority === 'medium' ? 'active' : ''
              }`}
              onClick={() => settings.setDefaultPriority('medium')}
              aria-pressed={settings.defaultPriority === 'medium'}
            >
              Medium
            </button>
            <button
              className={`settings-button-group-item ${
                settings.defaultPriority === 'high' ? 'active' : ''
              }`}
              onClick={() => settings.setDefaultPriority('high')}
              aria-pressed={settings.defaultPriority === 'high'}
            >
              High
            </button>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Show Task Duration */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="show-duration" className="settings-label">Show Task Duration</label>
            <p className="settings-description">Display time estimates in task lists</p>
          </div>
          <button
            id="show-duration"
            className={`settings-toggle ${settings.showTaskDuration ? 'active' : ''}`}
            onClick={() => settings.setShowTaskDuration(!settings.showTaskDuration)}
            role="switch"
            aria-checked={settings.showTaskDuration}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Enable Time Blocking */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="time-blocking" className="settings-label">Time Blocking</label>
            <p className="settings-description">Allow tasks to block specific time slots</p>
          </div>
          <button
            id="time-blocking"
            className={`settings-toggle ${settings.enableTimeBlocking ? 'active' : ''}`}
            onClick={() => settings.setEnableTimeBlocking(!settings.enableTimeBlocking)}
            role="switch"
            aria-checked={settings.enableTimeBlocking}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Auto-Complete Overdue */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="auto-complete" className="settings-label">Auto-Complete Overdue Tasks</label>
            <p className="settings-description">
              Automatically mark severely overdue tasks as completed
            </p>
          </div>
          <button
            id="auto-complete"
            className={`settings-toggle ${settings.autoCompleteOverdue ? 'active' : ''}`}
            onClick={() => settings.setAutoCompleteOverdue(!settings.autoCompleteOverdue)}
            role="switch"
            aria-checked={settings.autoCompleteOverdue}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>
      </div>
    </div>
  );
};
