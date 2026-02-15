/**
 * PDF Export Utility
 * Generate detailed status reports for daily, weekly, monthly, and yearly periods
 */

import jsPDF from 'jspdf';
import { useTaskStore } from '../store/taskStore';
import { useCheckInStore } from '../store/checkInStore';
import { useChecklistStore } from '../store/checklistStore';
import type { Task } from '../types/task';
import type { CheckIn } from '../types/checkIn';
import type { ChecklistItem, ChecklistFrequency } from '../types/checklist';

interface ReportPeriod {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
}

interface ReportData {
  tasks: Task[];
  checkIns: CheckIn[];
  checklists: ChecklistItem[];
  period: ReportPeriod;
}

/**
 * Calculate date ranges for different report periods
 */
export const getReportPeriod = (type: 'daily' | 'weekly' | 'monthly' | 'yearly'): ReportPeriod => {
  const now = new Date();
  const endDate = new Date(now);
  let startDate = new Date(now);

  switch (type) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      const dayOfWeek = now.getDay();
      startDate.setDate(now.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(endDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yearly':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;
  }

  return { type, startDate, endDate };
};

/**
 * Gather all data for the report
 */
const gatherReportData = (period: ReportPeriod): ReportData => {
  const taskState = useTaskStore.getState();
  const checkInState = useCheckInStore.getState();
  const checklistState = useChecklistStore.getState();

  // Filter tasks within period
  const tasks = taskState.tasks.filter((task) => {
    if (!task.date) return false;
    const taskDate = new Date(task.date);
    return taskDate >= period.startDate && taskDate <= period.endDate;
  });

  // Filter check-ins within period
  const checkIns = checkInState.checkIns.filter((checkIn) => {
    const checkInDate = new Date(checkIn.date);
    return checkInDate >= period.startDate && checkInDate <= period.endDate;
  });

  // Get relevant checklists
  const frequencyMap: Record<string, ChecklistFrequency> = {
    daily: 'daily',
    weekly: 'weekly',
    monthly: 'monthly',
    yearly: 'yearly',
  };
  const checklists = checklistState.items.filter(
    (item) => item.frequency === frequencyMap[period.type]
  );

  return { tasks, checkIns, checklists, period };
};

/**
 * Calculate statistics from report data
 */
const calculateStats = (data: ReportData) => {
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tasksByPriority = {
    high: data.tasks.filter((t) => t.priority === 'high').length,
    medium: data.tasks.filter((t) => t.priority === 'medium').length,
    low: data.tasks.filter((t) => t.priority === 'low').length,
  };

  const tasksByCategory: Record<string, number> = {};
  data.tasks.forEach((task) => {
    tasksByCategory[task.category] = (tasksByCategory[task.category] || 0) + 1;
  });

  const totalChecklists = data.checklists.length;
  const completedChecklists = data.checklists.filter((c) => c.completed).length;
  const checklistCompletionRate =
    totalChecklists > 0 ? Math.round((completedChecklists / totalChecklists) * 100) : 0;

  // Map mood strings to numeric values for averaging
  const moodScores: Record<string, number> = {
    happy: 5,
    excited: 5,
    calm: 4,
    productive: 4,
    neutral: 3,
    tired: 2,
    stressed: 1,
  };

  const avgMoodScore =
    data.checkIns.length > 0
      ? Math.round(
          data.checkIns.reduce((sum, c) => sum + (moodScores[c.mood] || 3), 0) / data.checkIns.length
        )
      : 0;
  const avgEnergy =
    data.checkIns.length > 0
      ? Math.round(
          data.checkIns.reduce((sum, c) => sum + c.energy, 0) / data.checkIns.length
        )
      : 0;
  const avgFocus =
    data.checkIns.length > 0
      ? Math.round(
          data.checkIns.reduce((sum, c) => sum + c.focus, 0) / data.checkIns.length
        )
      : 0;

  // Get most common mood
  const moodCounts: Record<string, number> = {};
  data.checkIns.forEach((checkIn) => {
    moodCounts[checkIn.mood] = (moodCounts[checkIn.mood] || 0) + 1;
  });
  const mostCommonMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    tasksByPriority,
    tasksByCategory,
    totalChecklists,
    completedChecklists,
    checklistCompletionRate,
    avgMoodScore,
    mostCommonMood,
    avgEnergy,
    avgFocus,
    checkInsCount: data.checkIns.length,
  };
};

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generate PDF report
 */
export const generatePDFReport = (type: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
  const period = getReportPeriod(type);
  const data = gatherReportData(period);
  const stats = calculateStats(data);

  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper to check if we need a new page
  const checkNewPage = (requiredSpace: number = 20) => {
    if (yPos + requiredSpace > 280) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Status Report`;
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += lineHeight + 5;

  // Date range
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const dateRange = `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`;
  doc.text(dateRange, pageWidth / 2, yPos, { align: 'center' });
  yPos += lineHeight + 3;

  // Generated date
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on: ${formatDate(new Date())}`, pageWidth / 2, yPos, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPos += lineHeight + 5;

  // Horizontal line
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // === OVERVIEW SECTION ===
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Overview', margin, yPos);
  yPos += lineHeight + 2;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const overviewItems = [
    `Total Tasks: ${stats.totalTasks}`,
    `Completed: ${stats.completedTasks} (${stats.completionRate}%)`,
    `Pending: ${stats.pendingTasks}`,
    ``,
    `Checklist Items: ${stats.totalChecklists}`,
    `Completed: ${stats.completedChecklists} (${stats.checklistCompletionRate}%)`,
    ``,
    `Daily Check-ins: ${stats.checkInsCount}`,
  ];

  overviewItems.forEach((item) => {
    if (item === '') {
      yPos += lineHeight / 2;
    } else {
      doc.text(item, margin + 5, yPos);
      yPos += lineHeight;
    }
  });
  yPos += 5;

  // === TASK BREAKDOWN ===
  checkNewPage(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Task Breakdown', margin, yPos);
  yPos += lineHeight + 2;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // By Priority
  doc.setFont('helvetica', 'bold');
  doc.text('By Priority:', margin + 5, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.text(`High: ${stats.tasksByPriority.high}`, margin + 10, yPos);
  yPos += lineHeight;
  doc.text(`Medium: ${stats.tasksByPriority.medium}`, margin + 10, yPos);
  yPos += lineHeight;
  doc.text(`Low: ${stats.tasksByPriority.low}`, margin + 10, yPos);
  yPos += lineHeight + 3;

  // By Category
  doc.setFont('helvetica', 'bold');
  doc.text('By Category:', margin + 5, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'normal');
  Object.entries(stats.tasksByCategory).forEach(([category, count]) => {
    checkNewPage();
    const displayCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    doc.text(`${displayCategory}: ${count}`, margin + 10, yPos);
    yPos += lineHeight;
  });
  yPos += 5;

  // === WELL-BEING METRICS ===
  if (stats.checkInsCount > 0) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Well-being Metrics', margin, yPos);
    yPos += lineHeight + 2;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Most Common Mood: ${stats.mostCommonMood.charAt(0).toUpperCase() + stats.mostCommonMood.slice(1)}`, margin + 5, yPos);
    yPos += lineHeight;
    doc.text(`Average Mood Score: ${stats.avgMoodScore}/5`, margin + 5, yPos);
    yPos += lineHeight;
    doc.text(`Average Energy: ${stats.avgEnergy}/10`, margin + 5, yPos);
    yPos += lineHeight;
    doc.text(`Average Focus: ${stats.avgFocus}/5`, margin + 5, yPos);
    yPos += lineHeight + 5;
  }

  // === COMPLETED TASKS LIST ===
  const completedTasksList = data.tasks.filter((t) => t.completed);
  if (completedTasksList.length > 0) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Completed Tasks (${completedTasksList.length})`, margin, yPos);
    yPos += lineHeight + 2;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    completedTasksList.slice(0, 20).forEach((task, idx) => {
      checkNewPage(15);
      const taskText = `${idx + 1}. ${task.title}`;
      const splitText = doc.splitTextToSize(taskText, contentWidth - 10);
      splitText.forEach((line: string) => {
        doc.text(line, margin + 5, yPos);
        yPos += lineHeight;
      });
      
      // Task details
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      const details = `   Category: ${task.category} | Priority: ${task.priority}`;
      doc.text(details, margin + 5, yPos);
      yPos += lineHeight;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
    });

    if (completedTasksList.length > 20) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(`... and ${completedTasksList.length - 20} more completed tasks`, margin + 5, yPos);
      yPos += lineHeight;
    }
    yPos += 5;
  }

  // === PENDING TASKS LIST ===
  const pendingTasksList = data.tasks.filter((t) => !t.completed);
  if (pendingTasksList.length > 0) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pending Tasks (${pendingTasksList.length})`, margin, yPos);
    yPos += lineHeight + 2;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    pendingTasksList.slice(0, 20).forEach((task, idx) => {
      checkNewPage(15);
      const taskText = `${idx + 1}. ${task.title}`;
      const splitText = doc.splitTextToSize(taskText, contentWidth - 10);
      splitText.forEach((line: string) => {
        doc.text(line, margin + 5, yPos);
        yPos += lineHeight;
      });
      
      // Task details
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      const details = `   Category: ${task.category} | Priority: ${task.priority}`;
      doc.text(details, margin + 5, yPos);
      yPos += lineHeight;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
    });

    if (pendingTasksList.length > 20) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(`... and ${pendingTasksList.length - 20} more pending tasks`, margin + 5, yPos);
      yPos += lineHeight;
    }
    yPos += 5;
  }

  // === CHECKLIST STATUS ===
  if (data.checklists.length > 0) {
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Checklist Items`, margin, yPos);
    yPos += lineHeight + 2;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    // Group by category
    const checklistByCategory: Record<string, ChecklistItem[]> = {};
    data.checklists.forEach((item) => {
      if (!checklistByCategory[item.category]) {
        checklistByCategory[item.category] = [];
      }
      checklistByCategory[item.category].push(item);
    });

    Object.entries(checklistByCategory).forEach(([category, items]) => {
      checkNewPage(20);
      doc.setFont('helvetica', 'bold');
      const displayCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      doc.text(displayCategory, margin + 5, yPos);
      yPos += lineHeight;
      
      doc.setFont('helvetica', 'normal');
      items.forEach((item) => {
        checkNewPage();
        const status = item.completed ? '[x]' : '[ ]';
        const itemText = `${status} ${item.title}`;
        doc.text(itemText, margin + 10, yPos);
        yPos += lineHeight;
      });
      yPos += 3;
    });
  }

  // === FOOTER ===
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `status-report-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

/**
 * Export functions for all report types
 */
export const downloadDailyReport = () => generatePDFReport('daily');
export const downloadWeeklyReport = () => generatePDFReport('weekly');
export const downloadMonthlyReport = () => generatePDFReport('monthly');
export const downloadYearlyReport = () => generatePDFReport('yearly');
