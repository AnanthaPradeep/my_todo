export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 'happy' | 'neutral' | 'stressed' | 'tired' | 'productive' | 'calm' | 'excited';
  energy: number; // 1-10
  focus: number; // 1-5
  reflection: string;
  gratitude: string[];
  completedTasksCount: number;
  missedTasksCount: number;
  // New enhanced fields
  activities?: string[]; // Tags like 'exercise', 'social', 'learning'
  sleepQuality?: number; // 1-5
  stress?: number; // 1-10
  timeOfDay?: 'morning' | 'evening'; // When check-in was done
  microCommitment?: string; // Small action to take
  microCommitmentCompleted?: boolean; // Tracked next day
  createdAt: string;
  updatedAt: string;
}

export interface CheckInStats {
  totalCheckIns: number;
  currentStreak: number;
  weeklyAvgEnergy: number;
  weeklyAvgFocus: number;
  weeklyMoods: Array<{ date: string; mood: CheckIn['mood'] }>;
}

export const MOOD_OPTIONS = [
  { id: 'happy', label: 'Happy', color: '#FFD93D' },
  { id: 'excited', label: 'Excited', color: '#FF6B6B' },
  { id: 'calm', label: 'Calm', color: '#1F9E9E' },
  { id: 'productive', label: 'Productive', color: '#4FC7BC' },
  { id: 'neutral', label: 'Neutral', color: '#A8DADC' },
  { id: 'tired', label: 'Tired', color: '#F1FAEE' },
  { id: 'stressed', label: 'Stressed', color: '#E76F51' },
];

export const ACTIVITY_OPTIONS = [
  { id: 'exercise', label: 'Exercise', color: '#FF6B6B' },
  { id: 'social', label: 'Social', color: '#1F9E9E' },
  { id: 'learning', label: 'Learning', color: '#4FC7BC' },
  { id: 'deep-work', label: 'Deep Work', color: '#A8DADC' },
  { id: 'leisure', label: 'Leisure', color: '#FFD93D' },
  { id: 'ate-well', label: 'Ate Well', color: '#98D8C8' },
  { id: 'good-sleep', label: 'Good Sleep', color: '#B8B8D1' },
  { id: 'meditation', label: 'Meditation', color: '#F7B5CA' },
];

export const REFLECTION_PROMPTS = [
  // General
  { text: 'What went well today?', category: 'general' },
  { text: 'What could improve?', category: 'general' },
  { text: 'What are you grateful for?', category: 'gratitude' },
  { text: 'One small win today?', category: 'positive' },
  { text: 'What did you learn?', category: 'growth' },
  // Day-specific
  { text: 'What\'s one goal for this week?', category: 'monday' },
  { text: 'What gave you energy today?', category: 'weekday' },
  { text: 'What drained your energy?', category: 'weekday' },
  { text: 'What\'s one win from this week?', category: 'friday' },
  { text: 'How did you recharge today?', category: 'weekend' },
  // Mood-based
  { text: 'What made today great?', category: 'high-mood' },
  { text: 'What\'s one small thing you can do for yourself?', category: 'low-mood' },
  // Growth
  { text: 'What challenged you today?', category: 'growth' },
  { text: 'How did you take care of yourself?', category: 'self-care' },
  { text: 'What are you proud of?', category: 'celebrate' },
];

export const MICRO_COMMITMENT_EXAMPLES = [
  'Drink 3 glasses of water',
  'Walk for 10 minutes',
  'Text one friend',
  'Read 5 pages',
  'Do 5 push-ups',
  'Write in journal',
  'Meditate for 5 min',
  'No phone for 1 hour',
];
