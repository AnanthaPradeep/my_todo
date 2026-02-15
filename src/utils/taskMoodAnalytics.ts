/**
 * Task-Mood Analytics Utility
 * Analyzes correlation between mood and task completion rates
 * Generates insights and recommendations based on patterns
 */

import type { CheckIn } from '../types/checkIn';
import type { Task } from '../types/task';
import { dateUtils } from './dateUtils';
import { Icons } from './icons';
import type { IconType } from './icons';

export interface MoodProductivity {
  mood: string;
  completionRate: number; // 0-100
  avgTasks: number;
  avgEnergy: number;
  avgFocus: number;
  occurrences: number;
  label: string;
  color: string;
}

export interface TaskPerformance {
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  completionRate: number;
  mood?: string;
  energy?: number;
  focus?: number;
}

export interface PerformanceInsight {
  type: 'success' | 'warning' | 'info' | 'alert';
  title: string;
  message: string;
  recommendation?: string;
  icon: IconType;
}

export interface TaskMoodAnalytics {
  moodProductivity: MoodProductivity[];
  bestMood: MoodProductivity | null;
  worstMood: MoodProductivity | null;
  weeklyPerformance: TaskPerformance[];
  avgCompletionRate: number;
  weeklyTrend: 'improving' | 'declining' | 'stable';
  insights: PerformanceInsight[];
}

/**
 * Calculate task completion rate by mood type
 */
export const analyzeMoodProductivity = (
  checkIns: CheckIn[]
): MoodProductivity[] => {
  const moodMap = new Map<string, {
    completions: number;
    totals: number;
    energies: number[];
    focuses: number[];
    count: number;
  }>();

  // Initialize mood buckets
  const moodLabels: Record<string, { label: string; color: string }> = {
    happy: { label: 'Happy', color: '#FFD93D' },
    excited: { label: 'Excited', color: '#FF6B6B' },
    calm: { label: 'Calm', color: '#1F9E9E' },
    productive: { label: 'Productive', color: '#4FC7BC' },
    neutral: { label: 'Neutral', color: '#A8DADC' },
    tired: { label: 'Tired', color: '#F1FAEE' },
    stressed: { label: 'Stressed', color: '#E76F51' },
  };

  for (const mood of Object.keys(moodLabels)) {
    moodMap.set(mood, { completions: 0, totals: 0, energies: [], focuses: [], count: 0 });
  }

  // Analyze each check-in
  checkIns.forEach((checkIn) => {
    const bucket = moodMap.get(checkIn.mood);
    if (bucket) {
      bucket.completions += checkIn.completedTasksCount;
      bucket.totals += checkIn.completedTasksCount + checkIn.missedTasksCount;
      bucket.energies.push(checkIn.energy);
      bucket.focuses.push(checkIn.focus);
      bucket.count += 1;
    }
  });

  // Calculate rates and convert to array
  const results: MoodProductivity[] = [];
  moodMap.forEach((bucket, mood) => {
    if (bucket.count > 0) {
      const completionRate = bucket.totals > 0 ? (bucket.completions / bucket.totals) * 100 : 0;
      const avgEnergy = bucket.energies.reduce((a, b) => a + b, 0) / bucket.count;
      const avgFocus = bucket.focuses.reduce((a, b) => a + b, 0) / bucket.count;
      const avgTasks = bucket.totals / bucket.count;

      results.push({
        mood,
        completionRate: Math.round(completionRate),
        avgTasks: Math.round(avgTasks * 10) / 10,
        avgEnergy: Math.round(avgEnergy * 10) / 10,
        avgFocus: Math.round(avgFocus * 10) / 10,
        occurrences: bucket.count,
        label: moodLabels[mood as keyof typeof moodLabels].label,
        color: moodLabels[mood as keyof typeof moodLabels].color,
      });
    }
  });

  return results.sort((a, b) => b.completionRate - a.completionRate);
};

/**
 * Calculate weekly task performance
 */
export const calculateWeeklyPerformance = (
  checkIns: CheckIn[],
  tasks: Task[]
): TaskPerformance[] => {
  const performance: TaskPerformance[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = dateUtils.formatDateISO(date);

    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const completed = dayTasks.filter((t) => t.completed).length;
    const total = dayTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const checkIn = checkIns.find((c) => c.date === dateStr);

    performance.push({
      date: dateStr,
      tasksCompleted: completed,
      tasksTotal: total,
      completionRate,
      mood: checkIn?.mood,
      energy: checkIn?.energy,
      focus: checkIn?.focus,
    });
  }

  return performance;
};

/**
 * Generate actionable insights
 */
export const generateInsights = (
  analytics: TaskMoodAnalytics
): PerformanceInsight[] => {
  const insights: PerformanceInsight[] = [];

  // Beginner insights for users with limited data
  if (analytics.moodProductivity.length === 0) {
    insights.push({
      type: 'info',
      title: 'Start tracking your productivity',
      message: 'Complete daily check-ins to unlock personalized insights.',
      recommendation: 'Track your mood, energy, and tasks for 3 days to see patterns.',
      icon: Icons.BarChart,
    });
    return insights;
  }

  // Single check-in insights
  if (analytics.moodProductivity.length === 1) {
    const mood = analytics.moodProductivity[0];
    insights.push({
      type: 'info',
      title: 'Great start!',
      message: `Your ${mood.label} mood shows ${mood.avgEnergy}/10 energy with ${mood.completionRate}% task completion.`,
      recommendation: 'Add 2 more check-ins to unlock trend analysis and recommendations.',
      icon: Icons.Sparkles,
    });
    return insights;
  }

  // Peak productivity insight
  if (analytics.bestMood) {
    insights.push({
      type: 'success',
      title: `Peak productivity: ${analytics.bestMood.label}`,
      message: `${analytics.bestMood.completionRate}% task completion when you feel ${analytics.bestMood.label.toLowerCase()}.`,
      recommendation: `Schedule your most important tasks when feeling this way.`,
      icon: Icons.TrendingUp,
    });
  }

  // Challenge mood warning (relaxed threshold from 50% to 70%)
  if (analytics.worstMood && analytics.worstMood.completionRate < 70) {
    insights.push({
      type: 'warning',
      title: `Challenge mood: ${analytics.worstMood.label}`,
      message: `${analytics.worstMood.completionRate}% completion when you feel ${analytics.worstMood.label.toLowerCase()}.`,
      recommendation: `Consider lighter tasks or breaks during ${analytics.worstMood.label.toLowerCase()} days.`,
      icon: Icons.AlertTriangle,
    });
  }

  // Weekly trend insights (relaxed - works with just 2 data points)
  if (analytics.weeklyPerformance.length >= 2) {
    const lastDay = analytics.weeklyPerformance[analytics.weeklyPerformance.length - 1];
    const firstDay = analytics.weeklyPerformance[0];
    const trendChange = lastDay.completionRate - firstDay.completionRate;

    if (trendChange > 10) {
      insights.push({
        type: 'success',
        title: 'Improving momentum',
        message: `Your completion rate improved by ${trendChange}% this week.`,
        recommendation: 'Keep up this positive momentum!',
        icon: Icons.TrendingUp,
      });
    } else if (trendChange < -10) {
      insights.push({
        type: 'alert',
        title: 'Declining performance',
        message: `Your completion rate dropped by ${Math.abs(trendChange)}% this week.`,
        recommendation: 'Consider reducing workload or taking a rest day.',
        icon: Icons.AlertTriangle,
      });
    } else if (analytics.avgCompletionRate > 80) {
      insights.push({
        type: 'success',
        title: 'Consistent performer',
        message: `You're maintaining a strong ${analytics.avgCompletionRate}% completion rate.`,
        recommendation: 'Your consistency is key to long-term success!',
        icon: Icons.Sparkles,
      });
    }
  }

  // Energy-productivity correlation
  if (analytics.moodProductivity.length > 0) {
    const highEnergyMoods = analytics.moodProductivity.filter((m) => m.avgEnergy >= 7);
    const lowEnergyMoods = analytics.moodProductivity.filter((m) => m.avgEnergy <= 4);

    if (highEnergyMoods.length > 0 && lowEnergyMoods.length > 0) {
      const highAvg = highEnergyMoods.reduce((a, b) => a + b.completionRate, 0) / highEnergyMoods.length;
      const lowAvg = lowEnergyMoods.reduce((a, b) => a + b.completionRate, 0) / lowEnergyMoods.length;
      const diff = Math.round(highAvg - lowAvg);

      if (diff > 15) {
        insights.push({
          type: 'info',
          title: 'Energy drives productivity',
          message: `High-energy days show ${diff}% better task completion than low-energy days.`,
          recommendation: 'Prioritize sleep, breaks, and exercise to maintain energy.',
          icon: Icons.Zap,
        });
      }
    } else if (highEnergyMoods.length > 0) {
      // Only high energy moods tracked
      insights.push({
        type: 'info',
        title: 'Energy tracking started',
        message: `Your high-energy days average ${Math.round(highEnergyMoods[0].avgEnergy)}/10 energy.`,
        recommendation: 'Track a few more days to see complete energy patterns.',
        icon: Icons.Zap,
      });
    }
  }

  // Fallback insight if no other insights generated
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Building your profile',
      message: 'Continue tracking to unlock personalized recommendations.',
      recommendation: 'Complete your daily check-in with task updates for better insights.',
      icon: Icons.BarChart,
    });
  }

  return insights;
};

/**
 * Main analysis function
 */
export const analyzeTaskMoodPatterns = (
  checkIns: CheckIn[],
  tasks: Task[]
): TaskMoodAnalytics => {
  try {
    // Filter out check-ins with invalid or missing data
    const validCheckIns = checkIns.filter(
      (checkIn) =>
        checkIn.mood &&
        typeof checkIn.energy === 'number' &&
        typeof checkIn.focus === 'number'
    );

    const moodProductivity = analyzeMoodProductivity(validCheckIns);
    const weeklyPerformance = calculateWeeklyPerformance(validCheckIns, tasks);

    const totalCompleted = weeklyPerformance.reduce((a, b) => a + b.tasksCompleted, 0);
    const totalTasks = weeklyPerformance.reduce((a, b) => a + b.tasksTotal, 0);
    const avgCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    let weeklyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (weeklyPerformance.length >= 2) {
      const firstHalf = weeklyPerformance.slice(0, Math.floor(weeklyPerformance.length / 2));
      const secondHalf = weeklyPerformance.slice(Math.floor(weeklyPerformance.length / 2));

      const firstAvg = firstHalf.reduce((a, b) => a + b.completionRate, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b.completionRate, 0) / secondHalf.length;

      if (secondAvg > firstAvg + 5) weeklyTrend = 'improving';
      else if (secondAvg < firstAvg - 5) weeklyTrend = 'declining';
    }

    const analytics: TaskMoodAnalytics = {
      moodProductivity,
      bestMood: moodProductivity.length > 0 ? moodProductivity[0] : null,
      worstMood: moodProductivity.length > 0 ? moodProductivity[moodProductivity.length - 1] : null,
      weeklyPerformance,
      avgCompletionRate,
      weeklyTrend,
      insights: [],
    };

    // Generate insights with error handling
    try {
      analytics.insights = generateInsights(analytics);
    } catch (error) {
      console.error('Error generating insights:', error);
      // Provide fallback insight on error
      analytics.insights = [
        {
          type: 'info',
          title: 'Keep tracking',
          message: 'Continue your daily check-ins to see personalized insights.',
          recommendation: 'Track mood, energy, and tasks regularly for best results.',
          icon: Icons.BarChart,
        },
      ];
    }

    return analytics;
  } catch (error) {
    console.error('Error analyzing task-mood patterns:', error);
    // Return safe default analytics on error
    return {
      moodProductivity: [],
      bestMood: null,
      worstMood: null,
      weeklyPerformance: [],
      avgCompletionRate: 0,
      weeklyTrend: 'stable',
      insights: [
        {
          type: 'info',
          title: 'Getting started',
          message: 'Complete your first check-in to start tracking productivity patterns.',
          recommendation: 'Daily check-ins help identify your peak performance times.',
          icon: Icons.TrendingUp,
        },
      ],
    };
  }
};
