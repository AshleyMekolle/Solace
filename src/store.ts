import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 0 | 1 | 2 | 3;
}

interface Goal {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  lastCompleted?: string;
}

interface StoreState {
  tasks: Task[];
  goals: Goal[];
  timerMinutes: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  addTask: (title: string, priority: 0 | 1 | 2 | 3) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addGoal: (title: string) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
}

// Load from localStorage
const loadState = () => {
  try {
    const saved = localStorage.getItem('solaceflow-storage');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// Save to localStorage
const saveState = (state: Partial<StoreState>) => {
  try {
    localStorage.setItem('solaceflow-storage', JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

const initialState = loadState();

export const useStore = create<StoreState>((set) => ({
  tasks: initialState.tasks || [],
  goals: initialState.goals || [],
  timerMinutes: initialState.timerMinutes || 25,
  timerSeconds: initialState.timerSeconds || 0,
  isTimerRunning: false,

  addTask: (title, priority) =>
    set((state) => {
      const newState = {
        ...state,
        tasks: [...state.tasks, { id: Date.now().toString(), title, completed: false, priority }],
      };
      saveState(newState);
      return newState;
    }),

  toggleTask: (id) =>
    set((state) => {
      const newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      };
      saveState(newState);
      return newState;
    }),

  deleteTask: (id) =>
    set((state) => {
      const newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== id),
      };
      saveState(newState);
      return newState;
    }),

  addGoal: (title) =>
    set((state) => {
      const newState = {
        ...state,
        goals: [...state.goals, { id: Date.now().toString(), title, completed: false, streak: 0 }],
      };
      saveState(newState);
      return newState;
    }),

  toggleGoal: (id) =>
    set((state) => {
      const today = new Date().toDateString();
      const newState = {
        ...state,
        goals: state.goals.map((goal) => {
          if (goal.id === id) {
            const newCompleted = !goal.completed;
            let newStreak = goal.streak;

            if (newCompleted) {
              const lastCompletedDate = goal.lastCompleted ? new Date(goal.lastCompleted).toDateString() : null;
              const yesterday = new Date(Date.now() - 86400000).toDateString();

              if (!lastCompletedDate || lastCompletedDate === yesterday || lastCompletedDate === today) {
                newStreak = goal.streak + 1;
              } else {
                newStreak = 1;
              }
            }

            return {
              ...goal,
              completed: newCompleted,
              streak: newStreak,
              lastCompleted: newCompleted ? today : goal.lastCompleted,
            };
          }
          return goal;
        }),
      };
      saveState(newState);
      return newState;
    }),

  deleteGoal: (id) =>
    set((state) => {
      const newState = {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== id),
      };
      saveState(newState);
      return newState;
    }),

  startTimer: () => set({ isTimerRunning: true }),

  stopTimer: () => set({ isTimerRunning: false }),

  resetTimer: () =>
    set((state) => {
      const newState = { ...state, timerMinutes: 25, timerSeconds: 0, isTimerRunning: false };
      saveState(newState);
      return newState;
    }),

  tickTimer: () =>
    set((state) => {
      if (state.timerMinutes === 0 && state.timerSeconds === 0) {
        return { isTimerRunning: false };
      }

      if (state.timerSeconds > 0) {
        return { timerSeconds: state.timerSeconds - 1 };
      } else {
        return { timerMinutes: state.timerMinutes - 1, timerSeconds: 59 };
      }
    }),
}));