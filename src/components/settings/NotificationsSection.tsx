import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Icons } from '../../utils/icons';

export const NotificationsSection: React.FC = () => {
  const settings = useSettingsStore();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);

  // Check notification permission status on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Update permission status when browser notifications are enabled
  const handleRequestBrowserNotifications = async () => {
    if (!('Notification' in window)) {
      alert('Your browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      settings.setBrowserNotificationsEnabled(true);
      setPermissionStatus('granted');
      return;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        if (permission === 'granted') {
          settings.setBrowserNotificationsEnabled(true);
          // Test notification
          new Notification('LifeOS', {
            body: 'Notifications enabled successfully!',
            icon: '/favicon.ico',
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title-wrapper">
          <Icons.Bell size={22} />
          <h2 className="settings-section-title">Notifications</h2>
        </div>
        <p className="settings-section-description">Control when and how you receive alerts</p>
      </div>

      <div className="settings-section-content">
        {/* Task Reminders */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="task-reminders" className="settings-label">
              Task Reminders
            </label>
            <p className="settings-description">Get reminded about upcoming tasks</p>
          </div>
          <button
            id="task-reminders"
            className={`settings-toggle ${settings.taskRemindersEnabled ? 'active' : ''}`}
            onClick={() => settings.setTaskRemindersEnabled(!settings.taskRemindersEnabled)}
            role="switch"
            aria-checked={settings.taskRemindersEnabled}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Daily Check-In Reminder */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="checkin-reminder" className="settings-label">
              Daily Check-In Reminder
            </label>
            <p className="settings-description">Remind me to complete my daily check-in</p>
          </div>
          <button
            id="checkin-reminder"
            className={`settings-toggle ${settings.dailyCheckInReminder ? 'active' : ''}`}
            onClick={() => settings.setDailyCheckInReminder(!settings.dailyCheckInReminder)}
            role="switch"
            aria-checked={settings.dailyCheckInReminder}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Sound */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label htmlFor="notification-sound" className="settings-label">
              Notification Sound
            </label>
            <p className="settings-description">Play sound for notifications</p>
          </div>
          <button
            id="notification-sound"
            className={`settings-toggle ${settings.soundEnabled ? 'active' : ''}`}
            onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
            role="switch"
            aria-checked={settings.soundEnabled}
          >
            <div className="settings-toggle-slider" />
          </button>
        </div>

        <div className="settings-divider" />

        {/* Quiet Hours */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Quiet Hours</label>
            <p className="settings-description">Pause notifications during these times</p>
          </div>

          <div className="settings-toggle-item" style={{ marginBottom: 'var(--space-md)' }}>
            <div className="settings-label-wrapper" style={{ flex: 1 }}>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Enable</span>
            </div>
            <button
              id="quiet-hours-toggle"
              className={`settings-toggle ${settings.quietHours.enabled ? 'active' : ''}`}
              onClick={() =>
                settings.setQuietHours({
                  ...settings.quietHours,
                  enabled: !settings.quietHours.enabled,
                })
              }
              role="switch"
              aria-checked={settings.quietHours.enabled}
            >
              <div className="settings-toggle-slider" />
            </button>
          </div>

          {settings.quietHours.enabled && (
            <div className="settings-time-grid">
              <div className="settings-time-input-wrapper">
                <label htmlFor="quiet-start" className="settings-time-label">
                  Start Time
                </label>
                <input
                  id="quiet-start"
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) =>
                    settings.setQuietHours({
                      ...settings.quietHours,
                      start: e.target.value,
                    })
                  }
                  className="settings-time-input"
                />
              </div>
              <div className="settings-time-input-wrapper">
                <label htmlFor="quiet-end" className="settings-time-label">
                  End Time
                </label>
                <input
                  id="quiet-end"
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) =>
                    settings.setQuietHours({
                      ...settings.quietHours,
                      end: e.target.value,
                    })
                  }
                  className="settings-time-input"
                />
              </div>
            </div>
          )}
        </div>

        <div className="settings-divider" />

        {/* Browser Notifications */}
        <div className="settings-toggle-item">
          <div className="settings-label-wrapper">
            <label className="settings-label">Browser Notifications</label>
            <p className="settings-description">
              {permissionStatus === 'granted'
                ? <>
                    <Icons.Check size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                    Enabled
                  </>
                : permissionStatus === 'denied'
                  ? <>
                      <Icons.Close size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                      Blocked by browser
                    </>
                  : 'Click button to request permission'}
            </p>
          </div>
          <button
            className={`settings-button ${
              permissionStatus === 'granted' ? 'secondary' : 'primary'
            }`}
            onClick={handleRequestBrowserNotifications}
            disabled={permissionStatus === 'granted' || permissionStatus === 'denied'}
          >
            {permissionStatus === 'granted' ? 'Enabled' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};
