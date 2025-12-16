import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type GoalCategory = 'health' | 'learning' | 'productivity' | 'personal' | 'creative' | 'other';
type GoalFrequency = 'daily' | 'weekly' | 'monthly';
type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';

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

interface DailyProgress {
  date: string;
  goals: { goalId: string; completed: boolean }[];
}

const GoalTracker: React.FC = () => {
  // Load initial data from localStorage
  const loadFromStorage = () => {
    try {
      const savedGoals = localStorage.getItem('zen-goals');
      const savedProgress = localStorage.getItem('zen-goal-progress');
      
      if (savedGoals) {
        return {
          goals: JSON.parse(savedGoals).map((goal: any) => ({
            ...goal,
            createdAt: new Date(goal.createdAt),
            lastCompleted: goal.lastCompleted ? new Date(goal.lastCompleted) : null
          })),
          progress: savedProgress ? JSON.parse(savedProgress) : []
        };
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return null;
  };

  // Default data for first-time users
  const defaultGoals: Goal[] = [
    {
      id: '1',
      title: 'Daily GitHub Commit',
      description: 'Commit code to GitHub every day',
      category: 'productivity',
      frequency: 'daily',
      status: 'active',
      targetCount: 1,
      currentCount: 1,
      streak: 2,
      bestStreak: 10,
      color: '#FF9BC9',
      icon: '💻',
      createdAt: new Date('2024-01-01'),
      lastCompleted: new Date(),
      history: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
        completed: i < 6
      }))
    },
    {
      id: '2',
      title: 'Morning Gym Session',
      description: 'Workout for 45 minutes',
      category: 'health',
      frequency: 'weekly',
      status: 'active',
      targetCount: 3,
      currentCount: 2,
      streak: 3,
      bestStreak: 5,
      color: '#A1E8D9',
      icon: '🏋️‍♀️',
      createdAt: new Date('2024-01-05'),
      lastCompleted: new Date(),
      history: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
        completed: [0, 2, 4].includes(i)
      }))
    },
    {
      id: '3',
      title: 'Read 30 Minutes',
      description: 'Read non-fiction books',
      category: 'learning',
      frequency: 'daily',
      status: 'active',
      targetCount: 1,
      currentCount: 1,
      streak: 5,
      bestStreak: 8,
      color: '#BDB2FF',
      icon: '📚',
      createdAt: new Date('2024-01-10'),
      lastCompleted: new Date(),
      history: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
        completed: i < 5
      }))
    },

  ];

  const defaultDailyProgress: DailyProgress[] = [
    {
      date: new Date().toISOString().split('T')[0],
      goals: [
        { goalId: '1', completed: true },
        { goalId: '2', completed: true },
        { goalId: '3', completed: true },
      ]
    }
  ];

  // State with localStorage initialization
  const [goals, setGoals] = useState<Goal[]>(() => {
    const loaded = loadFromStorage();
    return loaded?.goals || defaultGoals;
  });

  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>(() => {
    const loaded = loadFromStorage();
    return loaded?.progress || defaultDailyProgress;
  });

  const [activeTab, setActiveTab] = useState<'today' | 'goals' | 'stats' | 'history'>('today');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  
  // Form states
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<GoalCategory>('personal');
  const [newGoalFrequency, setNewGoalFrequency] = useState<GoalFrequency>('daily');
  const [newGoalTarget, setNewGoalTarget] = useState<number>(1);

  // Save to localStorage whenever goals or progress changes
  useEffect(() => {
    try {
      localStorage.setItem('zen-goals', JSON.stringify(goals));
      localStorage.setItem('zen-goal-progress', JSON.stringify(dailyProgress));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [goals, dailyProgress]);

  // Zen Color Palette
  const zenColors = {
    primary: '#FF9BC9',
    secondary: '#A1E8D9',
    tertiary: '#FFC8DD',
    accent: '#BDB2FF',
    background: '#FFF9F9',
    surface: '#FFFFFF',
    text: '#5A5560',
    lightText: '#9D8BA5',
    border: '#F0D9E7',
    success: '#A1E8D9',
    warning: '#FFD6A5',
    error: '#FF9BC9',
  };

  // Goal categories
  const categories: { id: GoalCategory; name: string; icon: string; color: string; description: string }[] = [
    { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#A1E8D9', description: 'Physical wellbeing' },
    { id: 'learning', name: 'Learning', icon: '🎓', color: '#BDB2FF', description: 'Knowledge & skills' },
    { id: 'productivity', name: 'Productivity', icon: '📊', color: '#FF9BC9', description: 'Work & efficiency' },
    { id: 'personal', name: 'Personal Growth', icon: '🌱', color: '#FFD6A5', description: 'Self-improvement' },
    { id: 'creative', name: 'Creative', icon: '🎨', color: '#FFC8DD', description: 'Art & expression' },
    { id: 'other', name: 'Other', icon: '✨', color: '#D6CCC2', description: 'Miscellaneous goals' },
  ];

  // Frequency options
  const frequencies: { id: GoalFrequency; name: string; icon: string; description: string }[] = [
    { id: 'daily', name: 'Daily', icon: '📅', description: 'Every day' },
    { id: 'weekly', name: 'Weekly', icon: '📆', description: 'Multiple times per week' },
    { id: 'monthly', name: 'Monthly', icon: '🗓️', description: 'Monthly goals' },
  ];

  // Status colors
  const statusColors = {
    'active': zenColors.success,
    'paused': zenColors.warning,
    'completed': zenColors.accent,
    'archived': zenColors.lightText,
  };

  // Today's date
  const today = new Date().toISOString().split('T')[0];
  const todayProgress = dailyProgress.find(p => p.date === today) || { date: today, goals: [] };

  // Calculate today's progress
  const todayStats = {
    total: goals.filter(g => g.status === 'active').length,
    completed: todayProgress.goals.filter(g => g.completed).length,
    percentage: Math.round((todayProgress.goals.filter(g => g.completed).length / goals.filter(g => g.status === 'active').length) * 100) || 0
  };

  // Calculate overall stats
  const overallStats = {
    totalGoals: goals.length,
    activeGoals: goals.filter(g => g.status === 'active').length,
    totalStreaks: goals.reduce((sum, goal) => sum + goal.streak, 0),
    totalCompletions: goals.reduce((sum, goal) => sum + goal.currentCount, 0),
    bestStreak: Math.max(...goals.map(g => g.bestStreak), 0)
  };

  // Category statistics
  const categoryStats = categories.map(category => ({
    ...category,
    count: goals.filter(g => g.category === category.id).length,
    completed: goals.filter(g => g.category === category.id).reduce((sum, goal) => sum + goal.currentCount, 0),
    active: goals.filter(g => g.category === category.id && g.status === 'active').length
  }));

  // Handlers
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim()) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        description: newGoalDesc,
        category: newGoalCategory,
        frequency: newGoalFrequency,
        status: 'active',
        targetCount: newGoalTarget,
        currentCount: 0,
        streak: 0,
        bestStreak: 0,
        color: categories.find(c => c.id === newGoalCategory)?.color || zenColors.primary,
        icon: categories.find(c => c.id === newGoalCategory)?.icon || '✨',
        createdAt: new Date(),
        lastCompleted: null,
        history: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
          completed: false
        }))
      };
      setGoals([newGoal, ...goals]);
      setNewGoalTitle('');
      setNewGoalDesc('');
      setNewGoalTarget(1);
    }
  };

  const toggleGoalCompletion = (goalId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // Check if already completed today
    const isCompletedToday = todayProgress.goals.find(g => g.goalId === goalId)?.completed;

    if (isCompletedToday) {
      // Undo completion
      const updatedGoals = goals.map(g => {
        if (g.id === goalId) {
          const newStreak = g.streak > 0 ? g.streak - 1 : 0;
          return {
            ...g,
            currentCount: Math.max(0, g.currentCount - 1),
            streak: newStreak,
            lastCompleted: g.currentCount === 1 ? null : g.lastCompleted
          };
        }
        return g;
      });

      const updatedProgress = dailyProgress.map(day => {
        if (day.date === today) {
          return {
            ...day,
            goals: day.goals.map(g => 
              g.goalId === goalId ? { ...g, completed: false } : g
            )
          };
        }
        return day;
      });

      setGoals(updatedGoals);
      setDailyProgress(updatedProgress);
    } else {
      // Mark as completed
      const updatedGoals = goals.map(g => {
        if (g.id === goalId) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          // Check if completed yesterday for streak
          const yesterdayProgress = dailyProgress.find(p => p.date === yesterdayStr);
          const completedYesterday = yesterdayProgress?.goals.find(g => g.goalId === goalId)?.completed;
          
          const newStreak = completedYesterday ? g.streak + 1 : 1;
          const newBestStreak = Math.max(g.bestStreak, newStreak);

          return {
            ...g,
            currentCount: g.currentCount + 1,
            streak: newStreak,
            bestStreak: newBestStreak,
            lastCompleted: new Date()
          };
        }
        return g;
      });

      const updatedProgress = dailyProgress.map(day => {
        if (day.date === today) {
          const existingGoal = day.goals.find(g => g.goalId === goalId);
          if (existingGoal) {
            return {
              ...day,
              goals: day.goals.map(g => 
                g.goalId === goalId ? { ...g, completed: true } : g
              )
            };
          } else {
            return {
              ...day,
              goals: [...day.goals, { goalId, completed: true }]
            };
          }
        }
        return day;
      });

      // If no progress entry for today exists
      if (!dailyProgress.find(p => p.date === today)) {
        updatedProgress.push({
          date: today,
          goals: [{ goalId, completed: true }]
        });
      }

      setGoals(updatedGoals);
      setDailyProgress(updatedProgress);
    }
  };

  const updateGoalStatus = (goalId: string, status: GoalStatus) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, status } : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  // Get progress for a specific goal
  const getGoalProgress = (goal: Goal) => {
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = dailyProgress.find(p => p.date === today);
    const isCompletedToday = todayProgress?.goals.find(g => g.goalId === goal.id)?.completed || false;

    return {
      isCompletedToday,
      progress: Math.min(100, (goal.currentCount / goal.targetCount) * 100),
      needsCompletion: goal.frequency === 'daily' && !isCompletedToday
    };
  };

  // Get completion streak emoji
  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '🌟';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '👍';
    return '🌱';
  };

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Start your day strong! 🌞";
    if (hour < 17) return "Keep going! You're doing great! 🌤️";
    return "Finish strong! You've got this! 🌙";
  };

  // Get today's day of week
  const getTodayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="goal-tracker">
      {/* Header */}
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <h1>🌸 Goal Tracker</h1>
          <p className="subtitle">{getMotivationalMessage()}</p>
        </div>
        <div className="header-stats">
          <div className="daily-stats">
            <span className="day-name">{getTodayName()}</span>
            <div className="completion-circle">
              <svg width="60" height="60">
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  stroke={zenColors.border}
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="25"
                  stroke={zenColors.primary}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(todayStats.percentage / 100) * 157} 157`}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
              </svg>
              <span className="percentage">{todayStats.percentage}%</span>
            </div>
            <span className="completion-text">{todayStats.completed}/{todayStats.total} completed</span>
          </div>
        </div>
      </motion.div>

      <div className="main-content">
        {/* Navigation Tabs */}
        <div className="tabs">
          <motion.button
            className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🌟 Today
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎯 All Goals
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 Statistics
          </motion.button>
          <motion.button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📅 History
          </motion.button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Today's Goals Tab */}
          {activeTab === 'today' && (
            <motion.div
              className="today-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="section-header">
                <h2>Today's Goals</h2>
                <span className="date">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>

              {/* Goals Checklist */}
              <div className="goals-checklist">
                <AnimatePresence>
                  {goals.filter(g => g.status === 'active').map((goal, index) => {
                    const progress = getGoalProgress(goal);
                    return (
                      <motion.div
                        key={goal.id}
                        className={`goal-item ${progress.isCompletedToday ? 'completed' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="goal-checkbox" onClick={() => toggleGoalCompletion(goal.id)}>
                          {progress.isCompletedToday ? (
                            <motion.div
                              className="checkmark"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              ✓
                            </motion.div>
                          ) : (
                            <div className="checkbox" />
                          )}
                        </div>
                        <div className="goal-info">
                          <div className="goal-header">
                            <span className="goal-icon" style={{ background: goal.color }}>
                              {goal.icon}
                            </span>
                            <h3>{goal.title}</h3>
                            <span className="goal-streak">
                              {getStreakEmoji(goal.streak)} {goal.streak} days
                            </span>
                          </div>
                          <p className="goal-desc">{goal.description}</p>
                          <div className="goal-meta">
                            <span className="goal-frequency">
                              {goal.frequency === 'daily' ? '📅 Daily' : 
                               goal.frequency === 'weekly' ? '📆 Weekly' : '🗓️ Monthly'}
                            </span>
                            <span className="goal-category">
                              {categories.find(c => c.id === goal.category)?.icon} 
                              {categories.find(c => c.id === goal.category)?.name}
                            </span>
                          </div>
                        </div>
                        {progress.needsCompletion && (
                          <motion.div 
                            className="reminder-badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            ⏰ Do today!
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {goals.filter(g => g.status === 'active').length === 0 && (
                  <motion.div 
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="empty-icon">🎯</div>
                    <h3>No active goals yet</h3>
                    <p>Add your first goal to start tracking!</p>
                  </motion.div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="quick-stats">
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -4 }}
                >
                  <div className="stat-icon">🔥</div>
                  <div className="stat-content">
                    <h3>Current Streak</h3>
                    <p>{Math.max(...goals.map(g => g.streak), 0)} days</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -4 }}
                >
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <h3>Completion Rate</h3>
                    <p>{todayStats.percentage}% today</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -4 }}
                >
                  <div className="stat-icon">🏆</div>
                  <div className="stat-content">
                    <h3>Best Streak</h3>
                    <p>{overallStats.bestStreak} days</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* All Goals Tab */}
          {activeTab === 'goals' && (
            <motion.div
              className="goals-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Add Goal Form */}
              <form onSubmit={handleAddGoal} className="add-goal-form">
                <h2>🎯 Add New Goal</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="Goal title (e.g., 'Exercise daily')"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={newGoalDesc}
                      onChange={(e) => setNewGoalDesc(e.target.value)}
                      placeholder="Description (optional)"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value as GoalCategory)}
                      className="form-select"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select
                      value={newGoalFrequency}
                      onChange={(e) => setNewGoalFrequency(e.target.value as GoalFrequency)}
                      className="form-select"
                    >
                      {frequencies.map(freq => (
                        <option key={freq.id} value={freq.id}>
                          {freq.icon} {freq.name} ({freq.description})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <div className="target-input">
                      <label>Target per {newGoalFrequency}:</label>
                      <input
                        type="number"
                        value={newGoalTarget}
                        onChange={(e) => setNewGoalTarget(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="number-input"
                      />
                    </div>
                  </div>
                </div>
                <motion.button 
                  type="submit" 
                  className="submit-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🌸 Add Goal
                </motion.button>
              </form>

              {/* Goals Grid */}
              <div className="goals-grid">
                <AnimatePresence>
                  {goals.map((goal, index) => {
                    const progress = getGoalProgress(goal);
                    const category = categories.find(c => c.id === goal.category);
                    return (
                      <motion.div
                        key={goal.id}
                        className="goal-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <div 
                          className="goal-card-header"
                          style={{ background: `${goal.color}20` }}
                        >
                          <div className="goal-card-title">
                            <span className="goal-icon" style={{ background: goal.color }}>
                              {goal.icon}
                            </span>
                            <h3>{goal.title}</h3>
                          </div>
                          <div className="goal-actions">
                            <select
                              value={goal.status}
                              onChange={(e) => updateGoalStatus(goal.id, e.target.value as GoalStatus)}
                              className="status-select"
                              style={{ color: statusColors[goal.status] }}
                            >
                              <option value="active">🌱 Active</option>
                              <option value="paused">⏸️ Paused</option>
                              <option value="completed">✅ Completed</option>
                              <option value="archived">📦 Archived</option>
                            </select>
                            <motion.button
                              onClick={() => deleteGoal(goal.id)}
                              className="delete-btn"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              🗑️
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="goal-card-body">
                          <p className="goal-description">{goal.description}</p>
                          
                          <div className="goal-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ 
                                  width: `${progress.progress}%`,
                                  background: goal.color
                                }}
                              />
                            </div>
                            <div className="progress-text">
                              <span>{goal.currentCount}/{goal.targetCount} {goal.frequency}</span>
                              <span className="progress-percent">{Math.round(progress.progress)}%</span>
                            </div>
                          </div>

                          <div className="goal-stats">
                            <div className="stat-item">
                              <span className="stat-label">Streak:</span>
                              <span className="stat-value">
                                {getStreakEmoji(goal.streak)} {goal.streak} days
                              </span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Best:</span>
                              <span className="stat-value">🏆 {goal.bestStreak} days</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Last:</span>
                              <span className="stat-value">
                                {goal.lastCompleted ? 
                                  new Date(goal.lastCompleted).toLocaleDateString() : 
                                  'Never'
                                }
                              </span>
                            </div>
                          </div>

                          <div className="goal-details">
                            <span className="detail-badge" style={{ background: `${category?.color}20` }}>
                              {category?.icon} {category?.name}
                            </span>
                            <span className="detail-badge" style={{ background: zenColors.border }}>
                              {goal.frequency === 'daily' ? '📅 Daily' : 
                               goal.frequency === 'weekly' ? '📆 Weekly' : '🗓️ Monthly'}
                            </span>
                            <span className="detail-badge" style={{ background: zenColors.border }}>
                              Since {new Date(goal.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="goal-card-footer">
                          <motion.button
                            onClick={() => toggleGoalCompletion(goal.id)}
                            className={`complete-btn ${progress.isCompletedToday ? 'completed' : ''}`}
                            style={{ 
                              background: progress.isCompletedToday ? goal.color : zenColors.border 
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {progress.isCompletedToday ? '✅ Completed' : 'Mark Complete'}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <motion.div
              className="stats-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="stats-header">
                <h2>📊 Your Progress</h2>
                <p>Track your journey towards becoming your best self</p>
              </div>

              {/* Overall Stats */}
              <div className="overall-stats">
                <motion.div 
                  className="overall-stat"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="stat-number">{overallStats.totalGoals}</div>
                  <div className="stat-label">Total Goals</div>
                </motion.div>
                <motion.div 
                  className="overall-stat"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="stat-number">{overallStats.activeGoals}</div>
                  <div className="stat-label">Active Goals</div>
                </motion.div>
                <motion.div 
                  className="overall-stat"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="stat-number">{overallStats.totalStreaks}</div>
                  <div className="stat-label">Total Streak Days</div>
                </motion.div>
                <motion.div 
                  className="overall-stat"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="stat-number">{overallStats.bestStreak}</div>
                  <div className="stat-label">Best Streak</div>
                </motion.div>
              </div>

              {/* Category Distribution */}
              <div className="category-stats">
                <h3>Goals by Category</h3>
                <div className="category-grid">
                  {categoryStats.map((category, index) => (
                    <motion.div
                      key={category.id}
                      className="category-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div 
                        className="category-icon"
                        style={{ background: category.color }}
                      >
                        {category.icon}
                      </div>
                      <h4>{category.name}</h4>
                      <div className="category-numbers">
                        <span className="category-count">{category.count} goals</span>
                        <span className="category-active">{category.active} active</span>
                      </div>
                      <p className="category-desc">{category.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Streak Leaders */}
              <div className="streak-leaders">
                <h3>🔥 Streak Leaders</h3>
                <div className="leaders-list">
                  {goals
                    .filter(g => g.status === 'active')
                    .sort((a, b) => b.streak - a.streak)
                    .slice(0, 5)
                    .map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        className="leader-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="leader-rank">
                          <span className="rank-number">{index + 1}</span>
                        </div>
                        <div className="leader-icon" style={{ background: goal.color }}>
                          {goal.icon}
                        </div>
                        <div className="leader-info">
                          <h4>{goal.title}</h4>
                          <p>{goal.description}</p>
                        </div>
                        <div className="leader-streak">
                          <span className="streak-number">{goal.streak}</span>
                          <span className="streak-label">days</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              className="history-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="history-header">
                <h2>📅 7-Day History</h2>
                <p>Track your consistency over the past week</p>
              </div>

              {/* Weekly Calendar */}
              <div className="weekly-calendar">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  const dateStr = date.toISOString().split('T')[0];
                  const dayProgress = dailyProgress.find(p => p.date === dateStr);
                  const totalGoals = goals.filter(g => g.status === 'active').length;
                  const completedGoals = dayProgress?.goals.filter(g => g.completed).length || 0;
                  const percentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

                  return (
                    <motion.div
                      key={dateStr}
                      className="calendar-day"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="day-header">
                        <span className="day-name">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="day-date">
                          {date.getDate()}
                        </span>
                      </div>
                      <div className="day-progress">
                        <div 
                          className="progress-circle"
                          style={{
                            background: `conic-gradient(${zenColors.primary} ${percentage}%, ${zenColors.border} 0)`
                          }}
                        >
                          <span className="progress-percent">{percentage}%</span>
                        </div>
                      </div>
                      <div className="day-stats">
                        <span className="stats-text">{completedGoals}/{totalGoals}</span>
                        <span className="stats-label">completed</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <h3>Recent Completions</h3>
                <div className="activity-list">
                  {goals
                    .filter(g => g.lastCompleted)
                    .sort((a, b) => new Date(b.lastCompleted!).getTime() - new Date(a.lastCompleted!).getTime())
                    .slice(0, 10)
                    .map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        className="activity-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="activity-icon" style={{ background: goal.color }}>
                          {goal.icon}
                        </div>
                        <div className="activity-info">
                          <h4>{goal.title}</h4>
                          <p>Completed {new Date(goal.lastCompleted!).toLocaleDateString()} • Streak: {goal.streak} days</p>
                        </div>
                        <div className="activity-time">
                          {new Date(goal.lastCompleted!).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Daily Inspiration */}
      <motion.div 
        className="inspiration"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inspiration-icon">🌸</div>
        <p>"Small daily improvements are the key to staggering long-term results."</p>
      </motion.div>

      <style>{`
        .goal-tracker {
          min-height: 100vh;
          background: linear-gradient(135deg, ${zenColors.background} 0%, #FFEFF7 100%);
          padding: 20px;
          font-family: 'Poppins', sans-serif;
          color: ${zenColors.text};
        }

        /* Header */
        .header {
          background: ${zenColors.surface};
          padding: 40px;
          border-radius: 24px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(255, 155, 201, 0.1);
          border: 1px solid ${zenColors.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          font-size: 3rem;
          color: ${zenColors.primary};
          margin: 0 0 10px 0;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: ${zenColors.lightText};
          font-size: 1.2rem;
          margin: 0;
          font-weight: 400;
        }

        .header-stats {
          display: flex;
          gap: 30px;
        }

        .daily-stats {
          text-align: center;
        }

        .day-name {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${zenColors.primary};
          margin-bottom: 10px;
        }

        .completion-circle {
          position: relative;
          width: 60px;
          height: 60px;
          margin: 0 auto;
        }

        .percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.1rem;
          font-weight: 700;
          color: ${zenColors.primary};
        }

        .completion-text {
          display: block;
          margin-top: 8px;
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        /* Main Content */
        .main-content {
          background: ${zenColors.surface};
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(255, 155, 201, 0.1);
          border: 1px solid ${zenColors.border};
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid ${zenColors.border};
          padding-bottom: 10px;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 12px 24px;
          font-family: 'Poppins', sans-serif;
          border: none;
          background: none;
          font-weight: 600;
          color: ${zenColors.lightText};
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn.active {
          background: ${zenColors.primary};
          color: white;
          box-shadow: 0 4px 12px rgba(255, 155, 201, 0.3);
        }

        .tab-btn:hover:not(.active) {
          background: ${zenColors.background};
          color: ${zenColors.primary};
        }

        /* Today's Goals */
        .today-content {
          animation: fadeIn 0.5s ease;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .section-header h2 {
          margin: 0;
          color: ${zenColors.text};
          font-size: 2rem;
          font-weight: 700;
        }

        .date {
          color: ${zenColors.lightText};
          font-size: 1rem;
        }

        .goals-checklist {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 40px;
        }

        .goal-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 25px;
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          transition: all 0.3s;
          position: relative;
        }

        .goal-item:hover {
          border-color: ${zenColors.primary};
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 155, 201, 0.1);
        }

        .goal-item.completed {
          background: ${zenColors.success}10;
          border-color: ${zenColors.success};
        }

        .goal-checkbox {
          width: 28px;
          height: 28px;
          border: 2px solid ${zenColors.border};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.3s;
        }

        .goal-item.completed .goal-checkbox {
          background: ${zenColors.success};
          border-color: ${zenColors.success};
        }

        .checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          background: white;
        }

        .checkmark {
          color: white;
          font-size: 1rem;
          font-weight: bold;
        }

        .goal-info {
          flex: 1;
        }

        .goal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .goal-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .goal-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: ${zenColors.text};
          flex: 1;
        }

        .goal-streak {
          background: ${zenColors.border};
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: ${zenColors.text};
        }

        .goal-desc {
          margin: 0 0 12px 0;
          color: ${zenColors.lightText};
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .goal-meta {
          display: flex;
          gap: 15px;
        }

        .goal-frequency,
        .goal-category {
          background: ${zenColors.border};
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          color: ${zenColors.text};
        }

        .reminder-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: ${zenColors.warning};
          color: ${zenColors.text};
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(255, 214, 165, 0.3);
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: ${zenColors.primary};
          box-shadow: 0 8px 24px rgba(255, 155, 201, 0.1);
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          border-radius: 15px;
          background: ${zenColors.primary}20;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content h3 {
          margin: 0 0 5px 0;
          font-size: 1rem;
          color: ${zenColors.lightText};
        }

        .stat-content p {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: ${zenColors.text};
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: ${zenColors.background};
          border: 2px dashed ${zenColors.border};
          border-radius: 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: ${zenColors.text};
        }

        .empty-state p {
          margin: 0;
          color: ${zenColors.lightText};
        }

        /* Add Goal Form */
        .add-goal-form {
          background: ${zenColors.background};
          padding: 30px;
          border-radius: 20px;
          border: 2px solid ${zenColors.border};
          margin-bottom: 40px;
        }

        .add-goal-form h2 {
          margin: 0 0 25px 0;
          color: ${zenColors.text};
          font-size: 1.8rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-input,
        .form-select,
        .number-input {
          padding: 14px;
          border: 2px solid ${zenColors.border};
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          color: ${zenColors.text};
          transition: all 0.3s;
        }

        .form-input:focus,
        .form-select:focus,
        .number-input:focus {
          outline: none;
          border-color: ${zenColors.primary};
          box-shadow: 0 0 0 3px ${zenColors.primary}20;
        }

        .target-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .target-input label {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        .number-input {
          width: 100%;
        }

        .submit-btn {
          background: ${zenColors.primary};
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          box-shadow: 0 4px 12px rgba(255, 155, 201, 0.3);
        }

        .submit-btn:hover {
          background: #FF7BB3;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 155, 201, 0.4);
        }

        /* Goals Grid */
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }

        .goal-card {
          background: white;
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .goal-card:hover {
          box-shadow: 0 12px 32px rgba(255, 155, 201, 0.1);
        }

        .goal-card-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .goal-card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .goal-card-title h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: ${zenColors.text};
        }

        .goal-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .status-select {
          padding: 8px 12px;
          border: 2px solid ${zenColors.border};
          border-radius: 8px;
          background: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .status-select:focus {
          outline: none;
          border-color: ${zenColors.primary};
        }

        .goal-card-body {
          padding: 0 20px 20px;
        }

        .goal-description {
          margin: 0 0 20px 0;
          color: ${zenColors.lightText};
          line-height: 1.5;
        }

        .goal-progress {
          margin-bottom: 20px;
        }

        .progress-bar {
          height: 8px;
          background: ${zenColors.border};
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        .progress-percent {
          font-weight: 600;
          color: ${zenColors.text};
        }

        .goal-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: ${zenColors.background};
          border-radius: 12px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: ${zenColors.lightText};
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: ${zenColors.text};
        }

        .goal-details {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .detail-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          color: ${zenColors.text};
        }

        .goal-card-footer {
          padding: 20px;
          border-top: 1px solid ${zenColors.border};
          text-align: center;
        }

        .complete-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          font-size: 1rem;
        }

        .complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        .complete-btn.completed {
          opacity: 0.8;
        }

        /* Statistics */
        .stats-content {
          animation: fadeIn 0.5s ease;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .stats-header h2 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
          color: ${zenColors.text};
        }

        .stats-header p {
          margin: 0;
          color: ${zenColors.lightText};
          font-size: 1.1rem;
        }

        .overall-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .overall-stat {
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s;
        }

        .overall-stat:hover {
          border-color: ${zenColors.primary};
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(255, 155, 201, 0.1);
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          color: ${zenColors.primary};
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 1rem;
          color: ${zenColors.lightText};
        }

        .category-stats {
          margin-bottom: 40px;
        }

        .category-stats h3 {
          margin: 0 0 25px 0;
          font-size: 1.8rem;
          color: ${zenColors.text};
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .category-item {
          background: white;
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          padding: 25px;
          text-align: center;
          transition: all 0.3s;
        }

        .category-item:hover {
          border-color: ${zenColors.primary};
          transform: translateY(-2px);
        }

        .category-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto 15px;
        }

        .category-item h4 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
          color: ${zenColors.text};
        }

        .category-numbers {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .category-count,
        .category-active {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 12px;
          background: ${zenColors.border};
        }

        .category-desc {
          margin: 0;
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        .streak-leaders {
          margin-bottom: 40px;
        }

        .streak-leaders h3 {
          margin: 0 0 25px 0;
          font-size: 1.8rem;
          color: ${zenColors.text};
        }

        .leaders-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .leader-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          transition: all 0.3s;
        }

        .leader-item:hover {
          border-color: ${zenColors.primary};
          transform: translateX(4px);
        }

        .leader-rank {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${zenColors.primary};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rank-number {
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .leader-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .leader-info {
          flex: 1;
        }

        .leader-info h4 {
          margin: 0 0 5px 0;
          font-size: 1.1rem;
          color: ${zenColors.text};
        }

        .leader-info p {
          margin: 0;
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        .leader-streak {
          text-align: center;
        }

        .streak-number {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          color: ${zenColors.primary};
        }

        .streak-label {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        /* History */
        .history-content {
          animation: fadeIn 0.5s ease;
        }

        .history-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .history-header h2 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
          color: ${zenColors.text};
        }

        .history-header p {
          margin: 0;
          color: ${zenColors.lightText};
          font-size: 1.1rem;
        }

        .weekly-calendar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .calendar-day {
          background: white;
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .calendar-day:hover {
          border-color: ${zenColors.primary};
        }

        .day-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        .day-name {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
          margin-bottom: 4px;
        }

        .day-date {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${zenColors.text};
        }

        .day-progress {
          margin-bottom: 15px;
        }

        .progress-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .progress-circle::before {
          content: '';
          position: absolute;
          width: 55px;
          height: 55px;
          background: white;
          border-radius: 50%;
        }

        .progress-percent {
          position: relative;
          font-size: 1.1rem;
          font-weight: 700;
          color: ${zenColors.text};
          z-index: 1;
        }

        .day-stats {
          display: flex;
          flex-direction: column;
        }

        .stats-text {
          font-size: 1rem;
          font-weight: 600;
          color: ${zenColors.text};
        }

        .stats-label {
          font-size: 0.8rem;
          color: ${zenColors.lightText};
        }

        .recent-activity {
          margin-bottom: 40px;
        }

        .recent-activity h3 {
          margin: 0 0 25px 0;
          font-size: 1.8rem;
          color: ${zenColors.text};
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          transition: all 0.3s;
        }

        .activity-item:hover {
          border-color: ${zenColors.primary};
          transform: translateX(4px);
        }

        .activity-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .activity-info {
          flex: 1;
        }

        .activity-info h4 {
          margin: 0 0 5px 0;
          font-size: 1.1rem;
          color: ${zenColors.text};
        }

        .activity-info p {
          margin: 0;
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        .activity-time {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
          font-weight: 600;
        }

        /* Inspiration */
        .inspiration {
          background: ${zenColors.surface};
          padding: 30px;
          border-radius: 24px;
          margin-top: 20px;
          box-shadow: 0 8px 32px rgba(255, 155, 201, 0.1);
          border: 1px solid ${zenColors.border};
          display: flex;
          align-items: center;
          gap: 20px;
          text-align: center;
        }

        .inspiration-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .inspiration p {
          margin: 0;
          font-size: 1.1rem;
          color: ${zenColors.text};
          font-style: italic;
          flex: 1;
        }

        /* Delete Button */
        .delete-btn {
          background: none;
          border: none;
          color: ${zenColors.error};
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.6;
          padding: 4px;
          transition: all 0.3s;
          border-radius: 6px;
        }

        .delete-btn:hover {
          opacity: 1;
          background: ${zenColors.error}15;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .header {
            flex-direction: column;
            text-align: center;
            gap: 30px;
          }
          
          .goals-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
          
          .overall-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 2.5rem;
          }
          
          .tabs {
            overflow-x: auto;
            padding-bottom: 0;
          }
          
          .tab-btn {
            white-space: nowrap;
            padding: 10px 16px;
          }
          
          .goals-grid {
            grid-template-columns: 1fr;
          }
          
          .overall-stats,
          .category-grid {
            grid-template-columns: 1fr;
          }
          
          .weekly-calendar {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .goal-item {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .goal-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .goal-meta {
            justify-content: center;
          }
          
          .inspiration {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .header h1 {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .weekly-calendar {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .goal-card-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .goal-card-title {
            flex-direction: column;
            gap: 10px;
          }
          
          .goal-actions {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default GoalTracker;