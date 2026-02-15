import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useCheckInStore } from '../store/checkInStore';
import { dateUtils } from '../utils/dateUtils';
import { MOOD_ICON_MAP } from '../utils/moodIcons';
import type { MoodType } from '../utils/moodIcons';
import { analyzeTaskMoodPatterns } from '../utils/taskMoodAnalytics';
import { CheckInHeader } from '../components/checkin/CheckInHeader';
import { MoodSelector } from '../components/checkin/MoodSelector';
import { ModernEnergySlider } from '../components/checkin/ModernEnergySlider';
import { ModernFocusRating } from '../components/checkin/ModernFocusRating';
import { ModernReflectionSection } from '../components/checkin/ModernReflectionSection';
import { WeeklyTrendPreview } from '../components/checkin/WeeklyTrendPreview';
import { TaskMoodDashboard } from '../components/checkin/TaskMoodDashboard';
import { ModernActivityTags } from '../components/checkin/ModernActivityTags';
import { QuickTemplates } from '../components/checkin/QuickTemplates';
import { CheckInSteps } from '../components/checkin/CheckInSteps';
import { ModernSleepQuality } from '../components/checkin/ModernSleepQuality';
import { ModernStressLevel } from '../components/checkin/ModernStressLevel';
import { ModernTimeOfDay } from '../components/checkin/ModernTimeOfDay';
import { ModernMicroCommitment } from '../components/checkin/ModernMicroCommitment';
import { PostCheckInCelebration } from '../components/checkin/PostCheckInCelebration';
import { CelebrationModal } from '../components/checkin/CelebrationModal';
import { IconWrapper } from '../components/icons/IconWrapper';
import { Icons } from '../utils/icons';
import type { CheckIn } from '../types/checkIn';
import { MOOD_OPTIONS } from '../types/checkIn';
import type { Task } from '../types/task';
import './styles/dailyCheckIn.css';

export const DailyCheckInPage: React.FC = () => {
  const { tasks } = useTaskStore();
  const { 
    getTodayCheckIn, 
    addCheckIn, 
    updateCheckIn, 
    getStats, 
    getCurrentStreak, 
    getLongestStreak,
    checkIns
  } = useCheckInStore();

  const [todayCheckIn, setTodayCheckIn] = useState<CheckIn | undefined>(getTodayCheckIn());
  const [isEditing, setIsEditing] = useState(!todayCheckIn);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const totalSteps = 3;

  // Form state - Core fields
  const [mood, setMood] = useState<string>(todayCheckIn?.mood || '');
  const [energy, setEnergy] = useState(todayCheckIn?.energy || 5);
  const [focus, setFocus] = useState(todayCheckIn?.focus || 3);
  const [reflection, setReflection] = useState(todayCheckIn?.reflection || '');

  // Form state - Enhanced fields
  const [activities, setActivities] = useState<string[]>(todayCheckIn?.activities || []);
  const [sleepQuality, setSleepQuality] = useState<number | undefined>(todayCheckIn?.sleepQuality);
  const [stress, setStress] = useState<number | undefined>(todayCheckIn?.stress);
  const [timeOfDay, setTimeOfDay] = useState<string | undefined>(todayCheckIn?.timeOfDay);
  const [microCommitment, setMicroCommitment] = useState<string>(todayCheckIn?.microCommitment || '');

  const stats = getStats();
  const streak = getCurrentStreak();
  const longestStreak = getLongestStreak();
  const today = dateUtils.getToday();

  // Analytics
  const analytics = analyzeTaskMoodPatterns(checkIns, tasks);

  // Get today's task stats
  const todayTasks = tasks.filter((task: Task) => task.date === today);
  const completedTasks = todayTasks.filter((task: Task) => task.completed);
  const missedTasks = todayTasks.filter((task: Task) => !task.completed);



  const handleQuickTemplate = (templateData: {
    mood: string;
    energy: number;
    focus: number;
    reflection: string;
  }) => {
    setMood(templateData.mood);
    setEnergy(templateData.energy);
    setFocus(templateData.focus);
    setReflection(templateData.reflection);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkipStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleSubmit = () => {
    const checkInData: any = {
      date: today,
      mood: mood as CheckIn['mood'],
      energy,
      focus,
      reflection,
      gratitude: todayCheckIn?.gratitude ?? [],
      completedTasksCount: completedTasks.length,
      missedTasksCount: missedTasks.length,
    };

    // Add optional enhanced fields if they have values
    if (activities.length > 0) checkInData.activities = activities;
    if (sleepQuality !== undefined) checkInData.sleepQuality = sleepQuality;
    if (stress !== undefined) checkInData.stress = stress;
    if (timeOfDay) checkInData.timeOfDay = timeOfDay;
    if (microCommitment) checkInData.microCommitment = microCommitment;

    if (todayCheckIn) {
      updateCheckIn(todayCheckIn.id, checkInData);
    } else {
      addCheckIn(checkInData);
    }

    const updated = getTodayCheckIn();
    setTodayCheckIn(updated);
    setIsEditing(false);
    setShowCelebration(true);
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setCurrentStep(0);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setCurrentStep(0);
  };

  // Generate insight based on data
  const generateInsight = (): string => {
    if (energy <= 3 && focus <= 2) {
      return "You're low on energy and focus – consider rest this evening. Your wellbeing comes first.";
    }
    if (energy >= 8 && focus <= 2) {
      return "High energy but low focus? Your day might benefit from better prioritization.";
    }
    if (completedTasks.length === 0 && todayTasks.length > 0) {
      return 'Sometimes days don\'t go as planned. Be kind to yourself – tomorrow is a fresh start.';
    }
    if (completedTasks.length === todayTasks.length && todayTasks.length > 0) {
      return 'You completed all your tasks! That\'s excellent focus and discipline.';
    }
    if (focus >= 4 && energy >= 7) {
      return "You're in flow! This is the state where great things happen.";
    }
    return 'Every check-in brings self-awareness. Keep building this healthy habit.';
  };

  return (
    <div className="daily-checkin-page">
      <div className="checkin-container">
        {/* Header */}
        <CheckInHeader streak={streak} hasCheckInToday={!!todayCheckIn} />

        {/* Main form or summary */}
        {isEditing ? (
          <div className="checkin-form">
            <CheckInSteps currentStep={currentStep} totalSteps={totalSteps} />

            {currentStep === 0 && (
              <div className="step-section">
                <div className="form-section">
                  <h3>Quick Start</h3>
                  <QuickTemplates onSelectTemplate={handleQuickTemplate} />
                </div>

                <div className="form-section">
                  <MoodSelector selectedMood={mood} onChange={setMood} />
                </div>

                <div className="form-section">
                  <ModernEnergySlider value={energy} onChange={setEnergy} />
                </div>

                <div className="form-section">
                  <ModernTimeOfDay value={timeOfDay} onChange={setTimeOfDay} />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="step-section">
                <div className="form-section">
                  <ModernFocusRating value={focus} onChange={setFocus} />
                </div>

                <div className="form-section">
                  <ModernSleepQuality value={sleepQuality} onChange={setSleepQuality} />
                </div>

                <div className="form-section">
                  <ModernStressLevel value={stress} onChange={setStress} />
                </div>

                <div className="form-section">
                  <ModernActivityTags value={activities} onChange={setActivities} />
                </div>

                {todayTasks.length > 0 && (
                  <div className="form-section task-summary">
                    <h3>Today's Tasks</h3>
                    <div className="task-stats">
                      <div className="task-stat">
                        <span className="stat-badge completed">{completedTasks.length}</span>
                        <span>Completed</span>
                      </div>
                      <div className="task-stat">
                        <span className="stat-badge pending">{missedTasks.length}</span>
                        <span>Remaining</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-section">
                <div className="form-section">
                  <ModernReflectionSection
                    value={reflection}
                    onChange={setReflection}
                    mood={mood}
                    energy={energy}
                  />
                </div>

                <div className="form-section">
                  <ModernMicroCommitment value={microCommitment} onChange={setMicroCommitment} />
                </div>
              </div>
            )}

            <div className="form-navigation">
              {currentStep > 0 && (
                <button className="btn btn-secondary" onClick={handlePrevStep}>
                  Back
                </button>
              )}
              {currentStep < totalSteps - 1 ? (
                <>
                  <button className="btn btn-primary" onClick={handleNextStep}>
                    Continue
                  </button>
                  <button className="btn btn-tertiary" onClick={handleSkipStep}>
                    Skip for now
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Save Check-In
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="checkin-summary">
            <PostCheckInCelebration
              streak={streak}
              longestStreak={longestStreak}
              stats={stats}
            />

            {/* Summary cards */}
            <div className="summary-grid">
              {/* Mood */}
              <div className="summary-card mood-card">
                <h4>Mood</h4>
                <div className="summary-content">
                  {todayCheckIn && (
                    <>
                      <div className="summary-icon">
                        <IconWrapper
                          Icon={MOOD_ICON_MAP[todayCheckIn.mood as MoodType]}
                          size={40}
                          color={MOOD_OPTIONS.find(m => m.id === todayCheckIn.mood)?.color}
                        />
                      </div>
                      <span className="summary-label">
                        {todayCheckIn.mood.charAt(0).toUpperCase() + todayCheckIn.mood.slice(1)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Energy */}
              <div className="summary-card energy-card">
                <h4>Energy</h4>
                <div className="summary-content">
                  <span className="summary-value">{todayCheckIn?.energy}/10</span>
                  <div className="summary-bar">
                    <div
                      className="summary-bar-fill"
                      style={{ width: `${((todayCheckIn?.energy || 5) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Focus */}
              <div className="summary-card focus-card">
                <h4>Focus</h4>
                <div className="summary-content">
                  <span className="summary-value">{todayCheckIn?.focus}/5</span>
                  <div className="summary-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icons.Star
                        key={i}
                        size={20}
                        fill={i < (todayCheckIn?.focus || 0) ? 'currentColor' : 'none'}
                        className={i < (todayCheckIn?.focus || 0) ? 'star filled' : 'star'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Insight */}
            {todayCheckIn && (
              <div className="insight-box">
                <h4>Today's Insight</h4>
                <p>{generateInsight()}</p>
              </div>
            )}

            {/* Activities display */}
            {todayCheckIn && todayCheckIn.activities && todayCheckIn.activities.length > 0 && (
              <div className="activities-display">
                <h4>Today's Activities</h4>
                <div className="activity-tags-readonly">
                  {todayCheckIn.activities.map((activity: string, index: number) => (
                    <span key={index} className="activity-badge">{activity}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reflection display */}
            {todayCheckIn?.reflection && (
              <div className="reflection-display">
                <h4>Reflection</h4>
                <p>{todayCheckIn.reflection}</p>
              </div>
            )}

            {/* Gratitude display */}
            {todayCheckIn && todayCheckIn.gratitude.length > 0 && (
              <div className="gratitude-display">
                <h4>Grateful For</h4>
                <ul>
                  {todayCheckIn.gratitude.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(todayCheckIn?.sleepQuality !== undefined || todayCheckIn?.stress !== undefined || todayCheckIn?.timeOfDay || todayCheckIn?.microCommitment) && (
              <div className="checkin-metrics">
                <h4>Daily Signals</h4>
                <div className="metrics-grid">
                  {todayCheckIn?.sleepQuality !== undefined && (
                    <div className="metric-card">
                      <span className="metric-label">Sleep</span>
                      <span className="metric-value">{todayCheckIn.sleepQuality}/5</span>
                    </div>
                  )}
                  {todayCheckIn?.stress !== undefined && (
                    <div className="metric-card">
                      <span className="metric-label">Stress</span>
                      <span className="metric-value">{todayCheckIn.stress}/10</span>
                    </div>
                  )}
                  {todayCheckIn?.timeOfDay && (
                    <div className="metric-card">
                      <span className="metric-label">Time</span>
                      <span className="metric-value">
                        {todayCheckIn.timeOfDay.charAt(0).toUpperCase() + todayCheckIn.timeOfDay.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
                {todayCheckIn?.microCommitment && (
                  <div className="micro-commitment-display">
                    <span className="metric-label">Micro-Commitment</span>
                    <p>{todayCheckIn.microCommitment}</p>
                  </div>
                )}
              </div>
            )}

            {/* Performance Analytics Dashboard */}
            <TaskMoodDashboard analytics={analytics} />

            {/* Edit button */}
            <div className="summary-actions">
              <button className="btn btn-secondary" onClick={handleEdit}>
                Edit Check-In
              </button>
            </div>
          </div>
        )}

        {/* Weekly summary */}
        <div className="checkin-section">
          <WeeklyTrendPreview stats={stats} totalCheckInsAllTime={checkIns.length} />
        </div>

        {/* Celebration Modal */}
        <CelebrationModal
          isOpen={showCelebration}
          onClose={handleCloseCelebration}
          streak={streak}
          longestStreak={longestStreak}
          stats={stats}
          microCommitment={todayCheckIn?.microCommitment}
        />
      </div>
    </div>
  );
};
