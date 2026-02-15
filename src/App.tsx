import './index.css'
import { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import { TopBar } from './components/layout/TopBar'
import { useSettingsStore } from './store/settingsStore'
import { useChecklistStore } from './store/checklistStore'
import { initChecklistResetScheduler } from './utils/checklistResetScheduler'

function App() {
  const theme = useSettingsStore((state) => state.theme)

  useEffect(() => {
    // Initialize settings on app startup
    initializeAppSettings()
    
    // Initialize checklist templates
    const checklistStore = useChecklistStore.getState();
    checklistStore.initializeTemplates()
    
    // Force reload templates to get latest from JSON (preserves completion state)
    checklistStore.reinitializeTemplates()
    
    // Start checklist reset scheduler
    initChecklistResetScheduler(checklistStore)
  }, [])

  // Listen to theme changes and apply them
  useEffect(() => {
    applyInitialTheme(theme)
  }, [theme])

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  )
}

/**
 * Initialize app settings from store (applies theme, colors, etc.)
 */
function initializeAppSettings() {
  const root = document.documentElement
  const settings = useSettingsStore.getState()

  // Apply accent color
  root.style.setProperty('--accent-color', settings.accentColor)
  const accentRGB = hexToRGB(settings.accentColor)
  root.style.setProperty('--accent-color-rgb', accentRGB)
  root.style.setProperty('--accent-color-hover', darkenColor(settings.accentColor, 0.2))

  // Apply font size scaling - affects all typography on the page
  const fontSizeScaleMap: { [key: string]: number } = {
    small: 0.93,   // 93% of normal size
    medium: 1.0,   // 100% (default)
    large: 1.14,   // 114% of normal size
  }
  const scale = fontSizeScaleMap[settings.fontSize] || 1.0
  root.style.zoom = scale.toString()

  // Apply compact mode
  const spacing = settings.compactMode
    ? { lg: '12px', md: '8px', sm: '4px' }
    : { lg: '24px', md: '16px', sm: '8px' }
  root.style.setProperty('--space-lg', spacing.lg)
  root.style.setProperty('--space-md', spacing.md)
  root.style.setProperty('--space-sm', spacing.sm)

  // Apply animation setting
  if (settings.reduceAnimations) {
    root.style.setProperty('--transition-duration', '0s')
  } else {
    root.style.setProperty('--transition-duration', '0.2s')
  }

  // Apply theme
  applyInitialTheme(settings.theme)
}

/**
 * Apply initial theme based on setting
 */
function applyInitialTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  } else if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * Convert hex color to RGB string
 */
function hexToRGB(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }
  return '59, 130, 246' // Default blue RGB
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const darkR = Math.round(r * (1 - percent))
  const darkG = Math.round(g * (1 - percent))
  const darkB = Math.round(b * (1 - percent))

  return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`
}

export default App
