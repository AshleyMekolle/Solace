import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
type Priority = 0 | 1 | 2 | 3;
type SDLCPhase = 'planning' | 'analysis' | 'design' | 'implementation' | 'testing' | 'deployment' | 'maintenance';
type GoalStatus = 'backlog' | 'active' | 'in-progress' | 'completed' | 'archived';
type GoalCategory = 'health' | 'learning' | 'productivity' | 'personal' | 'creative' | 'other';
type GoalFrequency = 'daily' | 'weekly' | 'monthly';
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
type SoundType = 'bell' | 'chime' | 'gong' | 'nature' | 'none';
type ThemeType = 'zen' | 'forest' | 'ocean' | 'sunset';
type ResourceType = 'image' | 'document' | 'link' | 'audio' | 'video' | 'other';

// Interfaces
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  phase: SDLCPhase;
  createdAt: Date;
  dueDate?: Date;
  projectId: string;
  ideaId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: Date;
  isActive: boolean;
}

interface Idea {
  id: string;
  projectId: string;
  title: string;
  description: string;
  phase: SDLCPhase;
  status: GoalStatus;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  frequency: GoalFrequency;
  status: GoalStatus;
  targetCount: number;
  currentCount: number;
  streak: number;
  bestStreak: number;
  color: string;
  icon: string;
  createdAt: Date;
  lastCompleted: Date | null;
  history: { date: string; completed: boolean }[];
}

interface Resource {
  id: string;
  projectId: string;
  title: string;
  url?: string;
  file?: { name: string; size: number; type: string };
  type: ResourceType;
  description: string;
  tags: string[];
  createdAt: Date;
}

interface TimerSession {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
  focusType?: string;
}

interface TimerSettings {
  sound: SoundType;
  autoStartBreaks: boolean;
  theme: ThemeType;
  notificationsEnabled: boolean;
}

interface DailyProgress {
  date: string;
  goals: { goalId: string; completed: boolean }[];
  tasks: { taskId: string; completed: boolean }[];
}

interface StoreState {
  // Projects & Tasks
  projects: Project[];
  tasks: Task[];
  ideas: Idea[];
  resources: Resource[];
  
  // Goals
  goals: Goal[];
  dailyProgress: DailyProgress[];
  
  // Timer
  timer: {
    currentTime: number;
    isRunning: boolean;
    mode: TimerMode;
    selectedDuration: number;
    completedSessions: number;
    totalFocusTime: number;
  };
  timerSettings: TimerSettings;
  timerHistory: TimerSession[];
  
  // Active States
  activeProjectId: string;
  activeTab: string;
  
  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Idea Actions
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  
  // Resource Actions
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  deleteResource: (id: string) => void;
  
  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'lastCompleted' | 'history'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalCompletion: (goalId: string) => void;
  updateGoalStatus: (goalId: string, status: GoalStatus) => void;
  
  // Timer Actions
  startTimer: (duration: number, mode: TimerMode) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  completeTimer: () => void;
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;
  
  // UI Actions
  setActiveTab: (tab: string) => void;
  
  // Stats
  getProjectStats: (projectId: string) => {
    totalTasks: number;
    completedTasks: number;
    totalIdeas: number;
    phaseCounts: Record<SDLCPhase, number>;
  };
  getGoalStats: () => {
    totalGoals: number;
    activeGoals: number;
    totalStreaks: number;
    completedToday: number;
    bestStreak: number;
  };
  
  // Export/Import
  exportData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
}

// Default data for first-time users
const defaultProjects: Project[] = [
  {
    id: 'default-1',
    name: 'Website Redesign',
    description: 'Create beautiful e-commerce site',
    color: '#FF9BC9',
    icon: '🌸',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: 'default-2',
    name: 'Mindfulness App',
    description: 'Meditation and relaxation mobile app',
    color: '#A1E8D9',
    icon: '🧘‍♀️',
    createdAt: new Date(),
    isActive: true,
  },
];

const defaultGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Daily GitHub Commit',
    description: 'Commit code to GitHub every day',
    category: 'productivity',
    frequency: 'daily',
    status: 'active',
    targetCount: 1,
    currentCount: 7,
    streak: 7,
    bestStreak: 10,
    color: '#FF9BC9',
    icon: '💻',
    createdAt: new Date(Date.now() - 7 * 86400000),
    lastCompleted: new Date(),
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
      completed: i < 6
    }))
  },
  {
    id: 'goal-2',
    title: 'Morning Workout',
    description: 'Exercise for 30 minutes',
    category: 'health',
    frequency: 'daily',
    status: 'active',
    targetCount: 1,
    currentCount: 5,
    streak: 5,
    bestStreak: 8,
    color: '#A1E8D9',
    icon: '💪',
    createdAt: new Date(Date.now() - 7 * 86400000),
    lastCompleted: new Date(),
    history: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
      completed: i < 5
    }))
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      projects: defaultProjects,
      tasks: [],
      ideas: [],
      resources: [],
      goals: defaultGoals,
      dailyProgress: [],
      
      timer: {
        currentTime: 25 * 60,
        isRunning: false,
        mode: 'focus',
        selectedDuration: 25 * 60,
        completedSessions: 0,
        totalFocusTime: 0,
      },
      
      timerSettings: {
        sound: 'bell',
        autoStartBreaks: true,
        theme: 'zen',
        notificationsEnabled: true,
      },
      
      timerHistory: [],
      activeProjectId: defaultProjects[0]?.id || '',
      activeTab: 'dashboard',

      // Project Actions
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          projects: [newProject, ...state.projects],
          activeProjectId: state.activeProjectId || newProject.id,
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => {
          const newProjects = state.projects.filter((project) => project.id !== id);
          return {
            projects: newProjects,
            activeProjectId: state.activeProjectId === id 
              ? newProjects[0]?.id || '' 
              : state.activeProjectId,
            tasks: state.tasks.filter((task) => task.projectId !== id),
            ideas: state.ideas.filter((idea) => idea.projectId !== id),
            resources: state.resources.filter((resource) => resource.projectId !== id),
          };
        });
      },

      setActiveProject: (id) => {
        set({ activeProjectId: id });
      },

      // Task Actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTask: (id) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          );
          
          // Update daily progress
          const today = new Date().toISOString().split('T')[0];
          const existingProgress = state.dailyProgress.find((p) => p.date === today);
          
          if (existingProgress) {
            const taskProgress = existingProgress.tasks.find((t) => t.taskId === id);
            if (taskProgress) {
              taskProgress.completed = !taskProgress.completed;
            } else {
              existingProgress.tasks.push({ taskId: id, completed: true });
            }
          }
          
          return { tasks: updatedTasks };
        });
      },

      // Idea Actions
      addIdea: (ideaData) => {
        const newIdea: Idea = {
          ...ideaData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          ideas: [newIdea, ...state.ideas],
        }));
      },

      updateIdea: (id, updates) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id ? { ...idea, ...updates, updatedAt: new Date() } : idea
          ),
        }));
      },

      deleteIdea: (id) => {
        set((state) => ({
          ideas: state.ideas.filter((idea) => idea.id !== id),
          tasks: state.tasks.filter((task) => task.ideaId !== id),
        }));
      },

      // Resource Actions
      addResource: (resourceData) => {
        const newResource: Resource = {
          ...resourceData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          resources: [newResource, ...state.resources],
        }));
      },

      deleteResource: (id) => {
        set((state) => ({
          resources: state.resources.filter((resource) => resource.id !== id),
        }));
      },

      // Goal Actions
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: Date.now().toString(),
          createdAt: new Date(),
          lastCompleted: null,
          history: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
            completed: false
          }))
        };
        
        set((state) => ({
          goals: [newGoal, ...state.goals],
        }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      toggleGoalCompletion: (goalId) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const goal = state.goals.find((g) => g.id === goalId);
          
          if (!goal) return state;

          // Check if already completed today
          const existingProgress = state.dailyProgress.find((p) => p.date === today);
          const isCompletedToday = existingProgress?.goals.find((g) => g.goalId === goalId)?.completed || false;

          let updatedGoals = [...state.goals];
          let updatedProgress = [...state.dailyProgress];

          if (isCompletedToday) {
            // Undo completion
            updatedGoals = updatedGoals.map((g) => {
              if (g.id === goalId) {
                const newStreak = g.streak > 0 ? g.streak - 1 : 0;
                return {
                  ...g,
                  currentCount: Math.max(0, g.currentCount - 1),
                  streak: newStreak,
                  lastCompleted: g.currentCount === 1 ? null : g.lastCompleted,
                };
              }
              return g;
            });

            updatedProgress = updatedProgress.map((day) => {
              if (day.date === today) {
                return {
                  ...day,
                  goals: day.goals.map((g) => 
                    g.goalId === goalId ? { ...g, completed: false } : g
                  ),
                };
              }
              return day;
            });
          } else {
            // Mark as completed
            updatedGoals = updatedGoals.map((g) => {
              if (g.id === goalId) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                
                // Check if completed yesterday for streak
                const yesterdayProgress = state.dailyProgress.find((p) => p.date === yesterdayStr);
                const completedYesterday = yesterdayProgress?.goals.find((g) => g.goalId === goalId)?.completed;
                
                const newStreak = completedYesterday ? g.streak + 1 : 1;
                const newBestStreak = Math.max(g.bestStreak, newStreak);

                return {
                  ...g,
                  currentCount: g.currentCount + 1,
                  streak: newStreak,
                  bestStreak: newBestStreak,
                  lastCompleted: new Date(),
                };
              }
              return g;
            });

            if (existingProgress) {
              updatedProgress = updatedProgress.map((day) => {
                if (day.date === today) {
                  const existingGoal = day.goals.find((g) => g.goalId === goalId);
                  if (existingGoal) {
                    return {
                      ...day,
                      goals: day.goals.map((g) => 
                        g.goalId === goalId ? { ...g, completed: true } : g
                      ),
                    };
                  } else {
                    return {
                      ...day,
                      goals: [...day.goals, { goalId, completed: true }],
                    };
                  }
                }
                return day;
              });
            } else {
              updatedProgress.push({
                date: today,
                goals: [{ goalId, completed: true }],
                tasks: [],
              });
            }
          }

          return { goals: updatedGoals, dailyProgress: updatedProgress };
        });
      },

      updateGoalStatus: (goalId, status) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId ? { ...goal, status } : goal
          ),
        }));
      },

      // Timer Actions
      startTimer: (duration, mode) => {
        set({
          timer: {
            currentTime: duration,
            isRunning: true,
            mode,
            selectedDuration: duration,
            completedSessions: get().timer.completedSessions,
            totalFocusTime: get().timer.totalFocusTime,
          },
        });
      },

      pauseTimer: () => {
        set((state) => ({
          timer: { ...state.timer, isRunning: false },
        }));
      },

      resetTimer: () => {
        set((state) => ({
          timer: {
            ...state.timer,
            currentTime: state.timer.selectedDuration,
            isRunning: false,
          },
        }));
      },

      tickTimer: () => {
        set((state) => {
          if (state.timer.currentTime <= 0) {
            // Timer completed
            const newTotalTime = state.timer.totalFocusTime + state.timer.selectedDuration;
            const newSession: TimerSession = {
              id: Date.now().toString(),
              mode: state.timer.mode,
              duration: state.timer.selectedDuration,
              completedAt: new Date(),
            };
            
            return {
              timer: {
                ...state.timer,
                currentTime: 0,
                isRunning: false,
                completedSessions: state.timer.completedSessions + 1,
                totalFocusTime: newTotalTime,
              },
              timerHistory: [newSession, ...state.timerHistory],
            };
          }
          
          return {
            timer: { ...state.timer, currentTime: state.timer.currentTime - 1 },
          };
        });
      },

      completeTimer: () => {
        set((state) => {
          const newTotalTime = state.timer.totalFocusTime + state.timer.selectedDuration;
          const newSession: TimerSession = {
            id: Date.now().toString(),
            mode: state.timer.mode,
            duration: state.timer.selectedDuration,
            completedAt: new Date(),
          };
          
          return {
            timer: {
              ...state.timer,
              currentTime: 0,
              isRunning: false,
              completedSessions: state.timer.completedSessions + 1,
              totalFocusTime: newTotalTime,
            },
            timerHistory: [newSession, ...state.timerHistory],
          };
        });
      },

      updateTimerSettings: (settings) => {
        set((state) => ({
          timerSettings: { ...state.timerSettings, ...settings },
        }));
      },

      // UI Actions
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      // Stats Functions
      getProjectStats: (projectId) => {
        const state = get();
        const projectTasks = state.tasks.filter((task) => task.projectId === projectId);
        const projectIdeas = state.ideas.filter((idea) => idea.projectId === projectId);
        
        const phaseCounts: Record<SDLCPhase, number> = {
          planning: 0, analysis: 0, design: 0, 
          implementation: 0, testing: 0, deployment: 0, maintenance: 0
        };
        
        projectIdeas.forEach((idea) => {
          phaseCounts[idea.phase]++;
        });

        return {
          totalTasks: projectTasks.length,
          completedTasks: projectTasks.filter((t) => t.completed).length,
          totalIdeas: projectIdeas.length,
          phaseCounts,
        };
      },

      getGoalStats: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const todayProgress = state.dailyProgress.find((p) => p.date === today);
        
        return {
          totalGoals: state.goals.length,
          activeGoals: state.goals.filter((g) => g.status === 'active').length,
          totalStreaks: state.goals.reduce((sum, goal) => sum + goal.streak, 0),
          completedToday: todayProgress?.goals.filter((g) => g.completed).length || 0,
          bestStreak: Math.max(...state.goals.map((g) => g.bestStreak), 0),
        };
      },

      // Export/Import
      exportData: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },

      importData: (data) => {
        try {
          const imported = JSON.parse(data);
          set(imported);
          return true;
        } catch (error) {
          console.error('Failed to import data:', error);
          return false;
        }
      },

      clearAllData: () => {
        set({
          projects: defaultProjects,
          tasks: [],
          ideas: [],
          resources: [],
          goals: defaultGoals,
          dailyProgress: [],
          timer: {
            currentTime: 25 * 60,
            isRunning: false,
            mode: 'focus',
            selectedDuration: 25 * 60,
            completedSessions: 0,
            totalFocusTime: 0,
          },
          timerHistory: [],
          activeProjectId: defaultProjects[0]?.id || '',
          activeTab: 'dashboard',
        });
      },
    }),
    {
      name: 'solaceflow-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        ideas: state.ideas,
        resources: state.resources,
        goals: state.goals,
        dailyProgress: state.dailyProgress,
        timer: state.timer,
        timerSettings: state.timerSettings,
        timerHistory: state.timerHistory,
        activeProjectId: state.activeProjectId,
        activeTab: state.activeTab,
      }),
    }
  )
);

// Helper functions
export const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateProgress = (current: number, total: number) => {
  if (total === 0) return 0;
  return Math.min(100, (current / total) * 100);
};

// Timer presets in seconds
export const timerPresets = {
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
  },
};

// Theme colors
export const themes = {
  zen: {
    primary: '#FF9BC9',
    secondary: '#A1E8D9',
    background: '#FFF9F9',
    surface: '#FFFFFF',
    text: '#5A5560',
    lightText: '#9D8BA5',
    border: '#F0D9E7',
  },
  forest: {
    primary: '#10B981',
    secondary: '#84CC16',
    background: '#F0FDF4',
    surface: '#FFFFFF',
    text: '#064E3B',
    lightText: '#6B7280',
    border: '#D1FAE5',
  },
  ocean: {
    primary: '#3B82F6',
    secondary: '#06B6D4',
    background: '#EFF6FF',
    surface: '#FFFFFF',
    text: '#1E40AF',
    lightText: '#6B7280',
    border: '#DBEAFE',
  },
  sunset: {
    primary: '#F59E0B',
    secondary: '#EC4899',
    background: '#FFFBEB',
    surface: '#FFFFFF',
    text: '#92400E',
    lightText: '#6B7280',
    border: '#FEF3C7',
  },
};

// Goal categories
export const goalCategories: { id: GoalCategory; name: string; icon: string; color: string }[] = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#A1E8D9' },
  { id: 'learning', name: 'Learning', icon: '🎓', color: '#BDB2FF' },
  { id: 'productivity', name: 'Productivity', icon: '📊', color: '#FF9BC9' },
  { id: 'personal', name: 'Personal Growth', icon: '🌱', color: '#FFD6A5' },
  { id: 'creative', name: 'Creative', icon: '🎨', color: '#FFC8DD' },
  { id: 'other', name: 'Other', icon: '✨', color: '#D6CCC2' },
];

// SDLC Phases
export const sdlcPhases: { id: SDLCPhase; name: string; icon: string; color: string }[] = [
  { id: 'planning', name: 'Planning', icon: '📋', color: '#BDB2FF' },
  { id: 'analysis', name: 'Analysis', icon: '🔍', color: '#A1E8D9' },
  { id: 'design', name: 'Design', icon: '🎨', color: '#FFC8DD' },
  { id: 'implementation', name: 'Implementation', icon: '💻', color: '#FF9BC9' },
  { id: 'testing', name: 'Testing', icon: '🧪', color: '#FFD6A5' },
  { id: 'deployment', name: 'Deployment', icon: '🚀', color: '#CAFFBF' },
  { id: 'maintenance', name: 'Maintenance', icon: '🛠️', color: '#D6CCC2' },
];