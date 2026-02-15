export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;                                    // ISO format YYYY-MM-DD (required)
  startTime: string;                              // HH:mm format (required)
  endTime: string;                                // HH:mm format (required, must be > startTime)
  category: 'work' | 'health' | 'finance' | 'learning' | 'relationships' | 'personal-growth';
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  reminder?: boolean;                             // Enable browser notifications
  checklistIds?: string[];                        // Linked checklist items from the same category
  subtasks?: Subtask[];
  recurring?: RecurrencePattern;
  createdAt: string;                             // ISO timestamp
  updatedAt: string;                             // ISO timestamp

  // Deprecated - kept for migration purposes only
  dueDate?: string;
  dueTime?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  endsOn?: string;
}

export interface CheckIn {
  id: string;
  date: string;
  morning?: MorningCheckIn;
  midday?: MiddayCheckIn;
  night?: NightCheckIn;
  dailyScore?: number;
}

export interface MorningCheckIn {
  wakeUpTime: string;
  sleepQuality: number; // 1-5
  energyLevel: number; // 1-5
  mood: string; // mood identifier
  topThreePriorities: string[];
  affirmation: string;
}

export interface MiddayCheckIn {
  productivityLevel: number; // 1-5
  stressLevel: number; // 1-5
  waterIntake: number;
  notes: string;
}

export interface NightCheckIn {
  whatWentWell: string[];
  whatDidntGoWell: string[];
  gratitude: string[];
  moodEndOfDay: string;
  sleepTime: string;
}
