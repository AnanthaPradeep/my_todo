import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useCheckInStore } from '../store/checkInStore';
import { useChecklistStore } from '../store/checklistStore';
import { useSettingsStore } from '../store/settingsStore';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { TaskList } from '../components/task/TaskList';
import { TaskForm } from '../components/task/TaskForm';
import { TaskDetailsModal } from '../components/task/TaskDetailsModal';
import { Footer } from '../components/layout/Footer';
import { CalendarPage } from '../components/calendar/CalendarPage';
import { DailyCheckInPage } from './DailyCheckInPage';
import { SettingsPage } from './SettingsPage';
import { analyzeTaskMoodPatterns } from '../utils/taskMoodAnalytics';
import { TaskMoodDashboard } from '../components/checkin/TaskMoodDashboard';
import { ChecklistSection, LifeScoreCard, ChecklistStreakBadge, TodaysChecklistCard } from '../components/checklist';
import type { Task } from '../types/task';
import { dateUtils } from '../utils/dateUtils';
import { Icons } from '../utils/icons';

type PageType = 'dashboard' | 'tasks' | 'calendar' | 'checkin' | 'settings';

export const Dashboard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, getCompletedTasksCount, getTotalTasksCount } = useTaskStore();
  const { checkIns } = useCheckInStore();
  const { showProductivityInsights } = useSettingsStore();
  const { 
    toggleItem, 
    deleteItem, 
    getItemsByFrequency, 
    getProgress, 
    getOverallProgress, 
    streak 
  } = useChecklistStore();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  
  // Task modals state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [taskDraft, setTaskDraft] = useState<{ date?: string; startTime?: string }>({});

  // Listen for calendar events and sync with task details/form
  useEffect(() => {
    const handleOpenTaskForm = (event?: CustomEvent<{ date?: string; startTime?: string }>) => {
      setSelectedTask(undefined);
      setTaskDraft({
        date: event?.detail?.date,
        startTime: event?.detail?.startTime,
      });
      setIsDetailsModalOpen(false);
      setIsEditFormOpen(true);
    };

    const handleViewTaskDetails = (event: CustomEvent<Task>) => {
      setSelectedTask(event.detail);
      setIsDetailsModalOpen(true);
      setIsEditFormOpen(false);
    };

    window.addEventListener('openTaskForm', handleOpenTaskForm as EventListener);
    window.addEventListener('viewTaskDetails', handleViewTaskDetails as EventListener);

    return () => {
      window.removeEventListener('openTaskForm', handleOpenTaskForm as EventListener);
      window.removeEventListener('viewTaskDetails', handleViewTaskDetails as EventListener);
    };
  }, []);

  useEffect(() => {
    const shouldLockScroll = isDetailsModalOpen || isEditFormOpen;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDetailsModalOpen, isEditFormOpen]);

  const todayTasks = tasks.filter((task) => {
    // Use primary date field with fallback to dueDate for backward compatibility
    const taskDate = task.date || task.dueDate;
    if (!taskDate) return false;
    return dateUtils.isSameDay(taskDate, new Date());
  });

  const completedCount = getCompletedTasksCount();
  const totalCount = getTotalTasksCount();
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDraft({});
    setIsDetailsModalOpen(false);
    setIsEditFormOpen(true);
  };

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsEditFormOpen(false);
    setSelectedTask(undefined);
    setTaskDraft({});
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setSelectedTask(undefined);
    setTaskDraft({});
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTask(undefined);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setIsDetailsModalOpen(false);
    setSelectedTask(undefined);
  };

  const handleToggleComplete = (taskId: string) => {
    toggleTask(taskId);
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
    setIsEditFormOpen(false);
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      icon: <Icons.Dashboard size={20} />,
      label: 'Dashboard',
      isActive: currentPage === 'dashboard',
      onClick: () => setCurrentPage('dashboard'),
    },
    {
      id: 'tasks',
      icon: <Icons.Tasks size={20} />,
      label: 'Tasks',
      isActive: currentPage === 'tasks',
      onClick: () => setCurrentPage('tasks'),
    },
    {
      id: 'calendar',
      icon: <Icons.Calendar size={20} />,
      label: 'Calendar',
      isActive: currentPage === 'calendar',
      onClick: () => setCurrentPage('calendar'),
    },
    {
      id: 'checkin',
      icon: <Icons.CheckIn size={20} />,
      label: 'Check-In',
      isActive: currentPage === 'checkin',
      onClick: () => setCurrentPage('checkin'),
    },
    {
      id: 'settings',
      icon: <Icons.Settings size={20} />,
      label: 'Settings',
      isActive: currentPage === 'settings',
      onClick: () => setCurrentPage('settings'),
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        // Get checklist data
        const dailyItems = getItemsByFrequency('daily');
        const weeklyItems = getItemsByFrequency('weekly');
        const monthlyItems = getItemsByFrequency('monthly');
        const yearlyItems = getItemsByFrequency('yearly');
        
        const dailyProgress = getProgress('daily');
        const weeklyProgress = getProgress('weekly');
        const monthlyProgress = getProgress('monthly');
        const yearlyProgress = getProgress('yearly');
        const overallProgress = getOverallProgress();

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {/* Header Section */}
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
                Dashboard
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>Track your progress and stay organized</p>
            </div>

            {/* Life Score Card */}
            <LifeScoreCard 
              overallProgress={overallProgress}
              dailyProgress={dailyProgress}
              weeklyProgress={weeklyProgress}
              monthlyProgress={monthlyProgress}
              yearlyProgress={yearlyProgress}
            />

            {/* Streak Badge */}
            <ChecklistStreakBadge streak={streak} />

            {/* Checklist Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <ChecklistSection
                frequency="daily"
                title="Daily Checklist"
                subtitle="Reset every day at midnight"
                Icon={Icons.Sun}
                items={dailyItems}
                onToggle={toggleItem}
                onDelete={deleteItem}
                defaultExpanded={true}
              />
              
              <ChecklistSection
                frequency="weekly"
                title="Weekly Checklist"
                subtitle="Reset every Sunday"
                Icon={Icons.Calendar}
                items={weeklyItems}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
              
              <ChecklistSection
                frequency="monthly"
                title="Monthly Checklist"
                subtitle="Reset on the 1st of each month"
                Icon={Icons.Calendar}
                items={monthlyItems}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
              
              <ChecklistSection
                frequency="yearly"
                title="Yearly Checklist"
                subtitle="Reset every January 1st"
                Icon={Icons.Calendar}
                items={yearlyItems}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-3-col">
              {/* Total Tasks Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <div>
                    <p className="stat-card-label">Total Tasks</p>
                    <div className="stat-card-value">{totalCount}</div>
                  </div>
                  <div className="stat-card-icon">
                    <Icons.Tasks size={24} />
                  </div>
                </div>
                <p className="stat-card-footer">Tasks across all categories</p>
              </div>

              {/* Completed Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <div>
                    <p className="stat-card-label">Completed</p>
                    <div className="stat-card-value" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {completedCount}
                    </div>
                  </div>
                  <div className="stat-card-icon success">
                    <Icons.Success size={24} />
                  </div>
                </div>
                <p className="stat-card-footer">{completionPercentage}% completion rate</p>
              </div>

              {/* Completion Rate Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <div>
                    <p className="stat-card-label">Completion Rate</p>
                    <div className="stat-card-value" style={{ color: '#f59e0b' }}>
                      {completionPercentage}%
                    </div>
                  </div>
                  <div className="stat-card-icon accent">
                    <Icons.CheckIn size={24} />
                  </div>
                </div>
                <p className="stat-card-footer">Based on completed tasks</p>
              </div>
            </div>

            {/* Progress Bar - Enhanced */}
            <div className="progress-container">
              <div className="progress-header">
                <h2 className="progress-title">Overall Progress</h2>
                <span className="progress-percentage">{completionPercentage}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="progress-footer">{completedCount} of {totalCount} tasks completed</p>
            </div>

            {/* Mood-Productivity Analytics */}
            {showProductivityInsights && (
              <div>
                <TaskMoodDashboard analytics={analyzeTaskMoodPatterns(checkIns, tasks)} />
              </div>
            )}

            {/* Today's Tasks */}
            <div className="card">
              <div className="flex justify-between items-center mb-lg">
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Today's Tasks
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                    {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''} scheduled
                  </p>
                </div>
              </div>
              <TaskList
                tasks={todayTasks}
                onEdit={handleViewTaskDetails}
                onDelete={deleteTask}
                onToggleComplete={toggleTask}
                emptyMessage="No tasks scheduled for today. Great job!"
              />
            </div>
          </div>
        );

      case 'tasks':
        const tasksDailyItems = getItemsByFrequency('daily');
        const tasksDailyProgress = getProgress('daily');
        
        return (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
              <div>
                <h1 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
                  All Tasks
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-md)' }}>
                  Manage and track all your tasks in one place
                </p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => {
                  setSelectedTask(undefined);
                  setTaskDraft({});
                  setIsEditFormOpen(true);
                }}
                size="lg"
              >
                <Icons.Plus size={20} />
                <span>New Task</span>
              </Button>
            </div>

            {/* Today's Daily Checklist */}
            <TodaysChecklistCard
              items={tasksDailyItems}
              onToggle={toggleItem}
              completedCount={tasksDailyProgress.completed}
              totalCount={tasksDailyProgress.total}
            />

            <TaskList
              tasks={tasks}
              onEdit={handleViewTaskDetails}
              onDelete={deleteTask}
              onToggleComplete={toggleTask}
            />
          </div>
        );

      case 'calendar':
        return <CalendarPage />;

      case 'checkin':
        return <DailyCheckInPage />;

      case 'settings':
        return <SettingsPage />;

      default:
        return null;
    }
  };

  return (
    <Layout
      sidebar={<Sidebar items={sidebarItems} />}
      header={
        <Header
          title=""
          subtitle=""
        />
      }
      footer={<Footer />}
    >
      {renderPage()}

        {/* Task Details Modal - View Mode */}
        <TaskDetailsModal
          isOpen={isDetailsModalOpen}
          task={selectedTask || null}
          onClose={handleCloseDetailsModal}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />

        {/* Task Form Modal - Edit/Create Mode */}
        <Modal
          isOpen={isEditFormOpen}
          onClose={handleCloseEditForm}
          title={selectedTask ? 'Edit Task' : 'Create New Task'}
          size="md"
        >
          <TaskForm
            mode={selectedTask ? 'edit' : 'add'}
            task={selectedTask}
            initialValues={taskDraft}
            onSubmit={handleSubmitTask}
            onCancel={handleCloseEditForm}
          />
        </Modal>
      </Layout>
  );
};

export default Dashboard;
