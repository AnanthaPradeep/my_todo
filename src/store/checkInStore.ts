import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CheckIn, CheckInStats } from '../types/checkIn';
import { dateUtils } from '../utils/dateUtils';

interface CheckInStore {
  checkIns: CheckIn[];
  freezesRemaining: number; // 2 freezes per month
  lastFreezeReset: string; // Track when freezes were last reset
  longestStreak: number; // Track longest streak achieved
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'createdAt' | 'updatedAt'>) => CheckIn;
  updateCheckIn: (id: string, checkIn: Partial<CheckIn>) => void;
  getCheckInByDate: (date: string) => CheckIn | undefined;
  getTodayCheckIn: () => CheckIn | undefined;
  getWeeklyCheckIns: () => CheckIn[];
  getStats: () => CheckInStats;
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
  useStreakFreeze: () => boolean;
  clearAllCheckIns: () => void;
}

const calculateStreak = (checkIns: CheckIn[]): number => {
  if (checkIns.length === 0) return 0;

  const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sorted.length; i++) {
    const checkInDate = new Date(sorted[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    const checkInDateStr = dateUtils.formatDateISO(checkInDate);
    const expectedDateStr = dateUtils.formatDateISO(expectedDate);

    if (checkInDateStr === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set, get) => ({
      checkIns: [],
      freezesRemaining: 2,
      lastFreezeReset: new Date().toISOString(),
      longestStreak: 0,

      addCheckIn: (checkInData) => {
        const id = `checkin-${Date.now()}`;
        const now = new Date().toISOString();
        const newCheckIn: CheckIn = {
          id,
          ...checkInData,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const newCheckIns = [...state.checkIns, newCheckIn];
          const currentStreak = calculateStreak(newCheckIns);
          const newLongestStreak = Math.max(state.longestStreak, currentStreak);
          
          // Reset freezes monthly
          const lastReset = new Date(state.lastFreezeReset);
          const now = new Date();
          const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                            (now.getMonth() - lastReset.getMonth());
          
          return {
            checkIns: newCheckIns,
            longestStreak: newLongestStreak,
            freezesRemaining: monthsDiff > 0 ? 2 : state.freezesRemaining,
            lastFreezeReset: monthsDiff > 0 ? now.toISOString() : state.lastFreezeReset,
          };
        });

        return newCheckIn;
      },

      updateCheckIn: (id, updates) => {
        set((state) => ({
          checkIns: state.checkIns.map((checkIn) =>
            checkIn.id === id
              ? { ...checkIn, ...updates, updatedAt: new Date().toISOString() }
              : checkIn
          ),
        }));
      },

      getCheckInByDate: (date) => {
        return get().checkIns.find((checkIn) => checkIn.date === date);
      },

      getTodayCheckIn: () => {
        const today = dateUtils.getToday();
        return get().checkIns.find((checkIn) => checkIn.date === today);
      },

      getWeeklyCheckIns: () => {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const checkIns = get().checkIns;

        return checkIns.filter((checkIn) => {
          const checkInDate = new Date(checkIn.date);
          return checkInDate >= weekAgo && checkInDate <= today;
        });
      },

      getStats: (): CheckInStats => {
        const checkIns = get().checkIns;
        const weeklyCheckIns = get().getWeeklyCheckIns();
        const currentStreak = calculateStreak(checkIns);

        const weeklyEnergy = weeklyCheckIns.length > 0
          ? weeklyCheckIns.reduce((sum, c) => sum + c.energy, 0) / weeklyCheckIns.length
          : 0;

        const weeklyFocus = weeklyCheckIns.length > 0
          ? weeklyCheckIns.reduce((sum, c) => sum + c.focus, 0) / weeklyCheckIns.length
          : 0;

        return {
          totalCheckIns: checkIns.length,
          currentStreak,
          weeklyAvgEnergy: Math.round(weeklyEnergy * 10) / 10,
          weeklyAvgFocus: Math.round(weeklyFocus * 10) / 10,
          weeklyMoods: weeklyCheckIns.map((c) => ({ date: c.date, mood: c.mood })),
        };
      },

      getCurrentStreak: () => {
        return calculateStreak(get().checkIns);
      },

      getLongestStreak: () => {
        return get().longestStreak;
      },

      useStreakFreeze: () => {
        const state = get();
        
        // Reset freezes monthly
        const lastReset = new Date(state.lastFreezeReset);
        const now = new Date();
        const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                          (now.getMonth() - lastReset.getMonth());
        
        let freezesAvailable = state.freezesRemaining;
        if (monthsDiff > 0) {
          freezesAvailable = 2;
        }
        
        // Check if freezes available
        if (freezesAvailable <= 0) {
          return false;
        }
        
        // Create virtual check-in for yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        // Check if already has check-in for yesterday
        const hasYesterdayCheckIn = state.checkIns.some(
          (checkIn) => checkIn.date === yesterdayStr
        );
        
        if (hasYesterdayCheckIn) {
          return false; // Already checked in yesterday
        }
        
        // Create freeze check-in (neutral placeholder)
        const freezeCheckIn: CheckIn = {
          id: `freeze-${Date.now()}`,
          date: yesterdayStr,
          mood: 'neutral',
          energy: 5,
          focus: 3,
          reflection: 'Streak freeze used',
          gratitude: [],
          completedTasksCount: 0,
          missedTasksCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          checkIns: [...state.checkIns, freezeCheckIn].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
          freezesRemaining: monthsDiff > 0 ? 1 : freezesAvailable - 1,
          lastFreezeReset: monthsDiff > 0 ? now.toISOString() : state.lastFreezeReset,
        }));
        
        return true;
      },

      clearAllCheckIns: () => {
        set({ checkIns: [] });
        console.log('Cleared all check-ins');
      },
    }),
    {
      name: 'checkin-store',
    }
  )
);
