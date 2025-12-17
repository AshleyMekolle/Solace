import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectTracker from './ProjectTracker';
import GoalTracker from './GoalTracker';
import FocusTimer from './FocusTimer';

// Sample data for the dashboard
const sampleData = {
  tasks: {
    total: 2,
    completed: 1,
    pending: 6,
    recent: [
      { id: 1, title: 'Write API documentation', project: 'Mobile App', due: 'Tomorrow', priority: 'medium' },
      { id: 2, title: 'Review pull requests', project: 'GitHub', due: 'Today', priority: 'high' },
    ]
  },
  goals: {
    active: 8,
    completed: 12,
    streak: 7,
    recent: [
      { id: 1, title: 'Daily workout', category: 'health', streak: 7, icon: '💪' },
      { id: 2, title: 'Daily GitHub Commit', category: 'productivity', streak: 2, icon: '💻' },
    ]
  },
  focus: {
    sessions: 42,
    totalTime: '18h 30m',
    avgSession: '26m',
    today: 3
  },
  projects: {
    active: 3,
    completed: 2,
    upcoming: 1
  }
};

type TabType = 'dashboard' | 'projects' | 'goals' | 'focus';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Determine time of day
  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const tabs: { id: TabType; label: string; icon: string; color: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: '#4A90E2' },
    { id: 'projects', label: 'Projects', icon: '📋', color: '#50C878' },
    { id: 'goals', label: 'Goals', icon: '🎯', color: '#7B68EE' },
    { id: 'focus', label: 'Focus', icon: '⏱️', color: '#FF8C42' },
  ];

  const greetings = {
    morning: { emoji: '🌅', text: 'Good morning' },
    afternoon: { emoji: '☀️', text: 'Good afternoon' },
    evening: { emoji: '🌙', text: 'Good evening' }
  };

  const zenColors = {
    primary: '#4A90E2',
    secondary: '#50C878',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#2D3748',
    lightText: '#718096',
    border: '#E2E8F0',
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'addTask':
        setActiveTab('projects');
        break;
      case 'setGoal':
        setActiveTab('goals');
        break;
      case 'startFocus':
        setActiveTab('focus');
        break;
      case 'quickNote':
        alert('Quick note feature would open here');
        break;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <motion.header 
        className="header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-icon">⚡</span>
            SolaceFlow
          </h1>
          <div className="greeting">
            <span className="greeting-emoji">{greetings[timeOfDay].emoji}</span>
            <span className="greeting-text">{greetings[timeOfDay].text}, let's make today productive</span>
          </div>
        </div>
        <div className="header-right">
          <div className="date-display">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <nav className="nav">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              borderColor: tab.color,
              background: activeTab === tab.id ? tab.color : 'transparent'
            }}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                className="active-indicator"
                layoutId="activeTab"
                style={{ background: tab.color }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      <main className="main">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              className="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Overview */}
              <div className="stats-overview">
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <div className="stat-value">{sampleData.tasks.completed}/{sampleData.tasks.total}</div>
                    <div className="stat-label">Tasks Completed</div>
                    <div className="stat-subtext">{sampleData.tasks.pending} pending</div>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-value">{sampleData.goals.active}</div>
                    <div className="stat-label">Active Goals</div>
                    <div className="stat-subtext">{sampleData.goals.streak} day streak</div>
                  </div>
                </motion.div>

                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">📁</div>
                  <div className="stat-content">
                    <div className="stat-value">{sampleData.projects.active}</div>
                    <div className="stat-label">Active Projects</div>
                    <div className="stat-subtext">{sampleData.projects.completed} completed</div>
                  </div>
                </motion.div>
              </div>

              {/* Dashboard Content */}
              <div className="dashboard-content">
                {/* Left Column */}
                <div className="dashboard-left">
                  {/* Quick Actions */}
                  <div className="widget quick-actions-widget">
                    <h3 className="widget-title">🚀 Quick Actions</h3>
                    <div className="action-grid">
                      <motion.button 
                        className="action-card"
                        onClick={() => handleQuickAction('addTask')}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="action-icon">➕</div>
                        <span>Add Task</span>
                      </motion.button>
                      <motion.button 
                        className="action-card"
                        onClick={() => handleQuickAction('setGoal')}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="action-icon">🎯</div>
                        <span>Set Goal</span>
                      </motion.button>
                      <motion.button 
                        className="action-card"
                        onClick={() => handleQuickAction('startFocus')}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="action-icon">⏱️</div>
                        <span>Start Focus</span>
                      </motion.button>
                      <motion.button 
                        className="action-card"
                        onClick={() => handleQuickAction('quickNote')}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="action-icon">📝</div>
                        <span>Quick Note</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Recent Tasks */}
                  <div className="widget tasks-widget">
                    <div className="widget-header">
                      <h3 className="widget-title">📋 Recent Tasks</h3>
                      <button className="widget-action" onClick={() => setActiveTab('projects')}>
                        View All →
                      </button>
                    </div>
                    <div className="tasks-list">
                      {sampleData.tasks.recent.map((task) => (
                        <motion.div 
                          key={task.id}
                          className="task-item"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="task-checkbox"></div>
                          <div className="task-content">
                            <div className="task-title">{task.title}</div>
                            <div className="task-meta">
                              <span className="task-project">{task.project}</span>
                              <span className={`task-priority ${task.priority}`}>
                                {task.priority}
                              </span>
                              <span className="task-due">{task.due}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="dashboard-right">
                  {/* Goals Progress */}
                  <div className="widget goals-widget">
                    <div className="widget-header">
                      <h3 className="widget-title">🎯 Goals Progress</h3>
                      <button className="widget-action" onClick={() => setActiveTab('goals')}>
                        View All →
                      </button>
                    </div>
                    <div className="goals-list">
                      {sampleData.goals.recent.map((goal) => (
                        <motion.div 
                          key={goal.id}
                          className="goal-item"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="goal-icon">{goal.icon}</div>
                          <div className="goal-content">
                            <div className="goal-title">{goal.title}</div>
                            <div className="goal-meta">
                              <span className="goal-category">{goal.category}</span>
                              <span className="goal-streak">
                                🔥 {goal.streak} days
                              </span>
                            </div>
                          </div>
                          <div className="goal-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${Math.min(goal.streak * 10, 100)}%` }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Inspiration */}
                  <div className="widget inspiration-widget">
                    <h3 className="widget-title">✨</h3>
                    <div className="inspiration-content">
                      {/* <div className="inspiration-emoji">⚡</div> */}
                      <p className="inspiration-text">
                        "Small daily improvements are the key to staggering long-term results."
                      </p>
                      <div className="inspiration-author">– Anonymous</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '40px' }}
            >
              <ProjectTracker/>
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '40px' }}
            >
              <GoalTracker/>
            </motion.div>
          )}

          {activeTab === 'focus' && (
            <motion.div
              key="focus"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '40px' }}
            >
              <FocusTimer/>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: ${zenColors.background};
          color: ${zenColors.text};
        }

        .app {
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid ${zenColors.border};
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .logo {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, ${zenColors.primary}, ${zenColors.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 2.5rem;
        }

        .greeting {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          color: ${zenColors.lightText};
        }

        .greeting-emoji {
          font-size: 1.2rem;
        }

        .date-display {
          font-size: 1rem;
          color: ${zenColors.lightText};
          padding: 8px 16px;
          background: ${zenColors.surface};
          border-radius: 20px;
          border: 1px solid ${zenColors.border};
        }

        /* Navigation */
        .nav {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          background: ${zenColors.surface};
          padding: 10px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid ${zenColors.border};
        }

        .nav-button {
          flex: 1;
          padding: 16px 20px;
          border: 2px solid;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: ${zenColors.text};
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          background: transparent;
        }

        .nav-button:hover {
          transform: translateY(-2px);
        }

        .nav-button.active {
          color: white;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .nav-label {
          font-weight: 500;
        }

        .active-indicator {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          border-radius: 2px;
        }

        /* Main Content */
        .main {
          background: ${zenColors.surface};
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.05);
          border: 1px solid ${zenColors.border};
          min-height: 600px;
          font-family: 'Poppins', sans-serif;
        }

        /* Dashboard */
        .dashboard {
          animation: fadeIn 0.3s ease;
        }

        /* Stats Overview */
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: ${zenColors.surface};
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          border-radius: 15px;
          background: ${zenColors.background};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: ${zenColors.text};
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 1rem;
          color: ${zenColors.text};
          font-weight: 600;
          margin-bottom: 4px;
        }

        .stat-subtext {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        /* Dashboard Content */
        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }

        /* Widgets */
        .widget {
          background: ${zenColors.surface};
          border: 2px solid ${zenColors.border};
          border-radius: 20px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .widget-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: ${zenColors.text};
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .widget-action {
          background: none;
          border: none;
          color: ${zenColors.primary};
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .widget-action:hover {
          background: ${zenColors.background};
        }

        /* Quick Actions */
        .action-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .action-card {
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          color: ${zenColors.text};
          font-size: 1rem;
          font-weight: 500;
        }

        .action-card:hover {
          background: ${zenColors.primary}15;
          border-color: ${zenColors.primary};
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: ${zenColors.background};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Tasks List */
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px;
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 12px;
          transition: all 0.3s;
        }

        .task-item:hover {
          border-color: ${zenColors.primary};
        }

        .task-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid ${zenColors.border};
          border-radius: 6px;
          flex-shrink: 0;
        }

        .task-content {
          flex: 1;
        }

        .task-title {
          font-weight: 500;
          color: ${zenColors.text};
          margin-bottom: 6px;
        }

        .task-meta {
          display: flex;
          gap: 10px;
          font-size: 0.85rem;
          color: ${zenColors.lightText};
        }

        .task-project {
          background: ${zenColors.border};
          padding: 4px 8px;
          border-radius: 6px;
        }

        .task-priority {
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 500;
        }

        .task-priority.high {
          background: #4A90E2;
          color: white;
        }

        .task-priority.medium {
          background: #FF8C42;
          color: white;
        }

        /* Goals List */
        .goals-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .goal-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px;
          background: ${zenColors.background};
          border: 2px solid ${zenColors.border};
          border-radius: 16px;
          transition: all 0.3s;
        }

        .goal-item:hover {
          border-color: ${zenColors.primary};
        }

        .goal-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${zenColors.primary};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .goal-content {
          flex: 1;
        }

        .goal-title {
          font-weight: 500;
          color: ${zenColors.text};
          margin-bottom: 6px;
        }

        .goal-meta {
          display: flex;
          gap: 10px;
          font-size: 0.85rem;
        }

        .goal-category {
          color: ${zenColors.lightText};
        }

        .goal-streak {
          color: ${zenColors.primary};
          font-weight: 500;
        }

        .goal-progress {
          width: 100%;
          margin-top: 10px;
        }

        .progress-bar {
          height: 6px;
          background: ${zenColors.border};
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: ${zenColors.primary};
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        /* Focus Stats */
        .focus-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 25px;
          text-align: center;
        }

        .focus-stat {
          padding: 15px;
          background: ${zenColors.background};
          border-radius: 12px;
        }

        .focus-stat .stat-value {
          font-size: 1.5rem;
          margin-bottom: 5px;
        }

        .focus-stat .stat-label {
          font-size: 0.9rem;
          color: ${zenColors.lightText};
        }

        .focus-button {
          width: 100%;
          padding: 16px;
          background: ${zenColors.primary};
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px ${zenColors.primary}40;
        }

        .focus-button:hover {
          background: #3A80D2;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px ${zenColors.primary}60;
        }

        /* Inspiration Widget */
        .inspiration-content {
          text-align: center;
        }

        .inspiration-emoji {
          font-size: 3rem;
          margin-bottom: 15px;
          opacity: 0.8;
        }

        .inspiration-text {
          font-size: 1.1rem;
          color: ${zenColors.text};
          font-style: italic;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .inspiration-author {
          color: ${zenColors.lightText};
          font-size: 0.9rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .app {
            padding: 15px;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .header-right {
            width: 100%;
          }

          .date-display {
            width: 100%;
            text-align: center;
          }

          .nav {
            flex-direction: column;
          }

          .logo {
            font-size: 2rem;
          }

          .main {
            padding: 20px;
          }

          .stats-overview {
            grid-template-columns: 1fr;
          }

          .action-grid {
            grid-template-columns: 1fr;
          }

          .focus-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .greeting {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .task-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .goal-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;