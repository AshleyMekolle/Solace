// timerStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SoundType = 'bell' | 'chime' | 'gong' | 'nature' | 'none';
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type ThemeType = 'zen' | 'forest' | 'ocean' | 'sunset' | 'monochrome' | 'professional';

interface TimerState {
  // Timer state
  time: number;
  isRunning: boolean;
  isCompleted: boolean;
  mode: TimerMode;
  remainingTime: string;
  
  // Settings
  theme: ThemeType;
  selectedSound: SoundType;
  autoStartBreaks: boolean;
  
  // Statistics
  pomodoroCount: number;
  totalFocusTime: number;
  completedSessions: number;
  timerHistory: Array<{
    id: string;
    mode: TimerMode;
    duration: number;
    completedAt: Date;
  }>;
  
  // Timer presets (in seconds)
  timerPresets: {
    focus: Record<string, number>;
    shortBreak: Record<string, number>;
    longBreak: Record<string, number>;
  };
  
  // Actions
  setTime: (time: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setMode: (mode: TimerMode) => void;
  setTheme: (theme: ThemeType) => void;
  setSelectedSound: (sound: SoundType) => void;
  setAutoStartBreaks: (autoStart: boolean) => void;
  setRemainingTime: (time: string) => void;
  
  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;
  switchMode: (newMode: TimerMode) => void;
  setTimerDuration: (seconds: number) => void;
  
  // Statistics actions
  incrementPomodoroCount: () => void;
  addFocusTime: (seconds: number) => void;
  addTimerSession: (mode: TimerMode, duration: number) => void;
  
  // Preset actions
  getPresetForMode: (mode: TimerMode, label: string) => number;
}

const defaultTimerPresets = {
  focus: {
    '15': 15 * 60,
    '25': 25 * 60,
    '45': 45 * 60,
    '60': 60 * 60,
  },
  shortBreak: {
    '5': 5 * 60,
    '10': 10 * 60,
  },
  longBreak: {
    '15': 15 * 60,
    '20': 20 * 60,
  }
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Initial state
      time: 25 * 60,
      isRunning: false,
      isCompleted: false,
      mode: 'focus',
      theme: 'zen',
      selectedSound: 'bell',
      autoStartBreaks: true,
      pomodoroCount: 0,
      totalFocusTime: 0,
      completedSessions: 0,
      remainingTime: '25:00',
      timerHistory: [],
      timerPresets: defaultTimerPresets,

      // Actions
      setTime: (time) => {
        set({ time });
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        get().setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      },
      
      setIsRunning: (isRunning) => set({ isRunning }),
      setIsCompleted: (isCompleted) => set({ isCompleted }),
      setMode: (mode) => set({ mode }),
      setTheme: (theme) => set({ theme }),
      setSelectedSound: (selectedSound) => set({ selectedSound }),
      setAutoStartBreaks: (autoStartBreaks) => set({ autoStartBreaks }),
      setRemainingTime: (remainingTime) => set({ remainingTime }),
      
      // Timer actions
      startTimer: () => {
        set({ isRunning: true, isCompleted: false });
      },
      
      pauseTimer: () => {
        set({ isRunning: false });
      },
      
      resetTimer: () => {
        const { mode } = get();
        const defaultTime = mode === 'focus' 
          ? defaultTimerPresets.focus['25']
          : mode === 'shortBreak'
            ? defaultTimerPresets.shortBreak['5']
            : defaultTimerPresets.longBreak['15'];
        
        set({
          time: defaultTime,
          isRunning: false,
          isCompleted: false,
        });
        
        const minutes = Math.floor(defaultTime / 60);
        const seconds = defaultTime % 60;
        get().setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      },
      
      completeTimer: () => {
        const { mode, time } = get();
        set({ 
          isRunning: false, 
          isCompleted: true,
          completedSessions: get().completedSessions + 1
        });
        
        if (mode === 'focus') {
          get().incrementPomodoroCount();
          get().addFocusTime(time);
        }
        
        get().addTimerSession(mode, time);
      },
      
      switchMode: (newMode: TimerMode) => {
        const defaultTime = newMode === 'focus' 
          ? defaultTimerPresets.focus['25']
          : newMode === 'shortBreak'
            ? defaultTimerPresets.shortBreak['5']
            : defaultTimerPresets.longBreak['15'];
        
        set({
          mode: newMode,
          time: defaultTime,
          isRunning: false,
          isCompleted: false,
        });
        
        const minutes = Math.floor(defaultTime / 60);
        const seconds = defaultTime % 60;
        get().setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      },
      
      setTimerDuration: (seconds: number) => {
        set({ 
          time: seconds,
          isRunning: false,
          isCompleted: false,
        });
        
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        get().setRemainingTime(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      },
      
      // Statistics actions
      incrementPomodoroCount: () => set((state) => ({ 
        pomodoroCount: state.pomodoroCount + 1 
      })),
      
      addFocusTime: (seconds: number) => set((state) => ({
        totalFocusTime: state.totalFocusTime + seconds
      })),
      
      addTimerSession: (mode: TimerMode, duration: number) => set((state) => ({
        timerHistory: [
          {
            id: Date.now().toString(),
            mode,
            duration,
            completedAt: new Date(),
          },
          ...state.timerHistory.slice(0, 99), // Keep last 100 sessions
        ]
      })),
      
      // Helper to get preset values
      getPresetForMode: (mode: TimerMode, label: string) => {
        return defaultTimerPresets[mode][label] || defaultTimerPresets.focus['25'];
      },
    }),
    {
      name: 'focus-timer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        time: state.time,
        isRunning: state.isRunning,
        isCompleted: state.isCompleted,
        mode: state.mode,
        theme: state.theme,
        selectedSound: state.selectedSound,
        autoStartBreaks: state.autoStartBreaks,
        pomodoroCount: state.pomodoroCount,
        totalFocusTime: state.totalFocusTime,
        completedSessions: state.completedSessions,
        remainingTime: state.remainingTime,
        timerHistory: state.timerHistory,
      }),
    }
  )
);

// Helper functions
export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateProgress = (current: number, total: number) => {
  if (total === 0) return 0;
  return Math.min(100, (current / total) * 100);
};

// Theme colors - UPDATED TO UNISEX & MINIMALIST
export const themes = {
  zen: {
    name: 'Zen',
    icon: '⚡',
    primary: '#4A90E2',      // Professional Blue
    secondary: '#50C878',    // Fresh Green
    background: '#F5F7FA',   // Light Gray
    surface: '#FFFFFF',      // White
    text: '#2D3748',         // Dark Gray
    lightText: '#718096',    // Medium Gray
    border: '#E2E8F0',       // Light Gray Border
  },
  forest: {
    name: 'Forest',
    icon: '🌿',
    primary: '#50C878',      // Green
    secondary: '#20B2AA',    // Turquoise
    background: '#F0FFF4',   // Very Light Green
    surface: '#FFFFFF',
    text: '#2D3748',
    lightText: '#718096',
    border: '#C6F6D5',       // Light Green Border
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    primary: '#4A90E2',      // Blue
    secondary: '#4169E1',    // Royal Blue
    background: '#EBF4FF',   // Very Light Blue
    surface: '#FFFFFF',
    text: '#2D3748',
    lightText: '#718096',
    border: '#C3DDFD',       // Light Blue Border
  },
  sunset: {
    name: 'Sunset',
    icon: '🌅',
    primary: '#FF8C42',      // Orange
    secondary: '#FF6B6B',    // Red
    background: '#FFF7ED',   // Very Light Orange
    surface: '#FFFFFF',
    text: '#2D3748',
    lightText: '#718096',
    border: '#FED7AA',       // Light Orange Border
  },
  monochrome: {
    name: 'Monochrome',
    icon: '⚫',
    primary: '#2D3748',      // Dark Gray
    secondary: '#4A5568',    // Medium Gray
    background: '#F7FAFC',   // Light Gray
    surface: '#FFFFFF',
    text: '#1A202C',         // Very Dark Gray
    lightText: '#718096',
    border: '#E2E8F0',       // Light Gray Border
  },
  professional: {
    name: 'Professional',
    icon: '💼',
    primary: '#2C5282',      // Dark Blue
    secondary: '#4299E1',    // Blue
    background: '#EDF2F7',   // Light Gray Blue
    surface: '#FFFFFF',
    text: '#1A202C',
    lightText: '#4A5568',
    border: '#CBD5E0',       // Medium Gray Border
  }
};

// Sound files mapping
export const soundFiles: Record<SoundType, string> = {
  bell: 'https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3',
  chime: 'https://assets.mixkit.co/sfx/preview/mixkit-clear-morning-chimes-331.mp3',
  gong: 'https://assets.mixkit.co/sfx/preview/mixkit-gong-deep-voice-576.mp3',
  nature: 'https://assets.mixkit.co/sfx/preview/mixkit-birds-chirping-1465.mp3',
  none: ''
};

// Timer presets export
export const timerPresets = defaultTimerPresets;