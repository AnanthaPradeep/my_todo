import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,

      toggleDarkMode: () =>
        set((state) => ({ isDark: !state.isDark })),

      setDarkMode: (isDark) => set({ isDark }),
    }),
    {
      name: 'theme-store',
    }
  )
);
