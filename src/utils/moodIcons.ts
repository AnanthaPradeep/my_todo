/**
 * Mood Icon Mapping
 * Maps mood types to Lucide React icon components
 */
import {
  Smile,
  Heart,
  Rocket,
  Meh,
  Moon,
  AlertCircle,
  Zap,
  Flame,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type MoodType = 'happy' | 'excited' | 'calm' | 'productive' | 'neutral' | 'tired' | 'stressed';

export const MOOD_ICON_MAP: Record<MoodType, LucideIcon> = {
  happy: Smile,
  excited: Zap,
  calm: Heart,
  productive: Rocket,
  neutral: Meh,
  tired: Moon,
  stressed: AlertCircle,
};

export const getMoodIcon = (mood: MoodType | undefined): LucideIcon | null => {
  if (!mood) return null;
  return MOOD_ICON_MAP[mood] || null;
};

export const STREAK_ICON = Flame;
