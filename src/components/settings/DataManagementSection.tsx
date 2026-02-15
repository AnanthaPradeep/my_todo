import React, { useRef, useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useCheckInStore } from '../../store/checkInStore';
import { useChecklistStore } from '../../store/checklistStore';
import { downloadAppData, importAppData } from '../../utils/dataUtils';
import {
  downloadDailyReport,
  downloadWeeklyReport,
  downloadMonthlyReport,
  downloadYearlyReport,
} from '../../utils/pdfExport';
import { Icons } from '../../utils/icons';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h3 className="settings-modal-title">{title}</h3>
        <p className="settings-modal-message">{message}</p>
        <div className="settings-modal-actions">
          <button className="settings-button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`settings-button ${isDangerous ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const DataManagementSection: React.FC = () => {
  const { tasks, clearCompleted, clearAllTasks } = useTaskStore();
  const { checkIns, clearAllCheckIns } = useCheckInStore();
  const { items: checklistItems, clearAllData: clearAllChecklists } = useChecklistStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isClearTasksModalOpen, setIsClearTasksModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleExport = () => {
    try {
      downloadAppData();
      setImportStatus({
        type: 'success',
        message: 'Data exported successfully!',
      });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to export data',
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importAppData(file);
      setImportStatus({
        type: 'success',
        message: 'Data imported successfully! Please refresh the page.',
      });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to import data';
      setImportStatus({
        type: 'error',
        message: errorMessage,
      });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearCompletedTasks = () => {
    clearCompleted();
  };

  const handleResetAll = () => {
    clearAllTasks();
    clearAllCheckIns();
    clearAllChecklists();
    setIsResetModalOpen(false);
    setImportStatus({
      type: 'success',
      message: 'All data has been reset.',
    });
    setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
  };

  const completedTaskCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title-wrapper">
          <Icons.Database size={22} />
          <h2 className="settings-section-title">Data Management</h2>
        </div>
        <p className="settings-section-description">Manage your data and backups</p>
      </div>

      <div className="settings-section-content">
        {/* Status Message */}
        {importStatus.type && (
          <div
            className={`settings-status-message ${
              importStatus.type === 'success' ? 'success' : 'error'
            }`}
          >
            <span>{importStatus.message}</span>
            <button
              className="settings-status-close"
              onClick={() => setImportStatus({ type: null, message: '' })}
            >
              <Icons.Close size={16} />
            </button>
          </div>
        )}

        {/* Export Data */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Export Data</label>
            <p className="settings-description">
              Download all your data as JSON (tasks, check-ins, checklists, settings)
            </p>
          </div>
          <button className="settings-button primary" onClick={handleExport}>
            <Icons.Download size={18} />
            <span>Export Backup</span>
          </button>
        </div>

        <div className="settings-divider" />

        {/* PDF Status Reports */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Download Status Reports</label>
            <p className="settings-description">
              Generate detailed PDF reports of your tasks, checklists, and well-being metrics
            </p>
          </div>
          <div className="settings-button-grid">
            <button
              className="settings-button secondary"
              onClick={() => {
                try {
                  downloadDailyReport();
                  setImportStatus({
                    type: 'success',
                    message: 'Daily report downloaded!',
                  });
                  setTimeout(() => setImportStatus({ type: null, message: '' }), 2000);
                } catch (error) {
                  setImportStatus({
                    type: 'error',
                    message: 'Failed to generate report',
                  });
                }
              }}
            >
              <Icons.Download size={16} />
              <span>Daily Report</span>
            </button>
            <button
              className="settings-button secondary"
              onClick={() => {
                try {
                  downloadWeeklyReport();
                  setImportStatus({
                    type: 'success',
                    message: 'Weekly report downloaded!',
                  });
                  setTimeout(() => setImportStatus({ type: null, message: '' }), 2000);
                } catch (error) {
                  setImportStatus({
                    type: 'error',
                    message: 'Failed to generate report',
                  });
                }
              }}
            >
              <Icons.Download size={16} />
              <span>Weekly Report</span>
            </button>
            <button
              className="settings-button secondary"
              onClick={() => {
                try {
                  downloadMonthlyReport();
                  setImportStatus({
                    type: 'success',
                    message: 'Monthly report downloaded!',
                  });
                  setTimeout(() => setImportStatus({ type: null, message: '' }), 2000);
                } catch (error) {
                  setImportStatus({
                    type: 'error',
                    message: 'Failed to generate report',
                  });
                }
              }}
            >
              <Icons.Download size={16} />
              <span>Monthly Report</span>
            </button>
            <button
              className="settings-button secondary"
              onClick={() => {
                try {
                  downloadYearlyReport();
                  setImportStatus({
                    type: 'success',
                    message: 'Yearly report downloaded!',
                  });
                  setTimeout(() => setImportStatus({ type: null, message: '' }), 2000);
                } catch (error) {
                  setImportStatus({
                    type: 'error',
                    message: 'Failed to generate report',
                  });
                }
              }}
            >
              <Icons.Download size={16} />
              <span>Yearly Report</span>
            </button>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Import Data */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Import Data</label>
            <p className="settings-description">
              Restore data from a previously exported backup
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
          <button className="settings-button primary" onClick={handleImportClick}>
            <Icons.Upload size={18} />
            <span>Import Backup</span>
          </button>
        </div>

        <div className="settings-divider" />

        {/* Backup Status  */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Backup Status</label>
            <p className="settings-description">Overview of your stored data</p>
          </div>
          <div className="settings-stats-grid">
            <div className="settings-stat-card">
              <div className="settings-stat-icon">
                <Icons.Tasks size={24} />
              </div>
              <div className="settings-stat-content">
                <div className="settings-stat-label">{tasks.length}</div>
                <div className="settings-stat-description">Tasks</div>
              </div>
            </div>
            <div className="settings-stat-card">
              <div className="settings-stat-icon">
                <Icons.CheckCircle size={24} />
              </div>
              <div className="settings-stat-content">
                <div className="settings-stat-label">{completedTaskCount}</div>
                <div className="settings-stat-description">Completed</div>
              </div>
            </div>
            <div className="settings-stat-card">
              <div className="settings-stat-icon">
                <Icons.BarChart size={24} />
              </div>
              <div className="settings-stat-content">
                <div className="settings-stat-label">{checkIns.length}</div>
                <div className="settings-stat-description">Check-Ins</div>
              </div>
            </div>
            <div className="settings-stat-card">
              <div className="settings-stat-icon">
                <Icons.CheckSquare size={24} />
              </div>
              <div className="settings-stat-content">
                <div className="settings-stat-label">{checklistItems.length}</div>
                <div className="settings-stat-description">Checklist Items</div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-divider" />

        {/* Clear Completed Tasks */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Clear Completed Tasks</label>
            <p className="settings-description">
              Permanently delete all completed tasks ({completedTaskCount} tasks)
            </p>
          </div>
          <button
            className="settings-button secondary"
            onClick={() => setIsClearTasksModalOpen(true)}
            disabled={completedTaskCount === 0}
          >
            Clear Completed
          </button>
        </div>

        <div className="settings-divider" />

        {/* Reset All Data */}
        <div className="settings-group">
          <div className="settings-label-wrapper">
            <label className="settings-label">Reset All Data</label>
            <p className="settings-description">
              Permanently delete all tasks, check-ins, checklists, and reset to defaults
            </p>
          </div>
          <button
            className="settings-button danger"
            onClick={() => setIsResetModalOpen(true)}
          >
            Reset Everything
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={isClearTasksModalOpen}
        title="Clear Completed Tasks?"
        message={`You are about to delete ${completedTaskCount} completed task${
          completedTaskCount !== 1 ? 's' : ''
        }. This action cannot be undone.`}
        confirmText="Clear"
        onConfirm={() => {
          handleClearCompletedTasks();
          setIsClearTasksModalOpen(false);
        }}
        onCancel={() => setIsClearTasksModalOpen(false)}
        isDangerous
      />

      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset All Data?"
        message="This will permanently delete all your tasks, check-ins, checklists, and reset all settings to defaults. This action cannot be undone."
        confirmText="Reset Everything"
        onConfirm={handleResetAll}
        onCancel={() => setIsResetModalOpen(false)}
        isDangerous
      />
    </div>
  );
};
