import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import ProjectTracker from './ProjectTracker';
import GoalTracker from './GoalTracker';
import FocusTimer from './FocusTimer';
import './App.module.css';

type TabType = 'dashboard' | 'projects' | 'goals' | 'focus';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { tasks, goals } = useStore();

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const longestStreak = Math.max(...goals.map(g => g.streak), 0);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'focus', label: 'Focus', icon: '⏱️' },
  ];

  return (
    <div className="app">
      <motion.header 
        className="header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="logo">
          <span className="logo-icon">🌊</span>
          SolaceFlow
        </h1>
      </motion.header>

      <nav className="nav">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="nav-icon">{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </nav>

      <main className="main">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              className="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title">Your Productivity Dashboard</h2>
              <div className="stats-grid">
                <motion.div 
                  className="stat-card card-blue"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{completedTasks}/{totalTasks}</div>
                  <div className="stat-label">Tasks Completed</div>
                </motion.div>

                <motion.div 
                  className="stat-card card-teal"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">🎯</div>
                  <div className="stat-value">{completedGoals}/{totalGoals}</div>
                  <div className="stat-label">Goals Achieved</div>
                </motion.div>

                <motion.div 
                  className="stat-card card-coral"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-icon">🔥</div>
                  <div className="stat-value">{longestStreak}</div>
                  <div className="stat-label">Longest Streak</div>
                </motion.div>
              </div>

              <motion.div 
                className="quick-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <motion.button 
                    className="action-btn"
                    onClick={() => setActiveTab('projects')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Task
                  </motion.button>
                  <motion.button 
                    className="action-btn"
                    onClick={() => setActiveTab('goals')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Set Goal
                  </motion.button>
                  <motion.button 
                    className="action-btn"
                    onClick={() => setActiveTab('focus')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Focus
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectTracker />
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <GoalTracker />
            </motion.div>
          )}

          {activeTab === 'focus' && (
            <motion.div
              key="focus"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FocusTimer />
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
          background: #FAF7F0;
          color: #333;
        }

        .app {
          min-height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo {
          font-size: 2.5rem;
          font-weight: 700;
          color: #5B8FB9;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 2.5rem;
        }

        .nav {
          display: flex;
          font-family: 'Poppins', sans-serif;
          gap: 10px;
          margin-bottom: 30px;
          background: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .nav-button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .nav-button:hover {
          background: #f5f5f5;
        }

        .nav-button.active {
          background: #5B8FB9;
          color: white;
        }

        .main {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          min-height: 400px;
        }

        .dashboard {
          animation: fadeIn 0.3s ease;
        }

        .section-title {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .card-blue {
          background: linear-gradient(135deg, #5B8FB9 0%, #4a7ba0 100%);
          color: white;
        }

        .card-teal {
          background: linear-gradient(135deg, #86B6B6 0%, #6fa0a0 100%);
          color: white;
        }

        .card-coral {
          background: linear-gradient(135deg, #FF9A76 0%, #ff8560 100%);
          color: white;
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .quick-actions {
          margin-top: 40px;
        }

        .quick-actions h3 {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #333;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 12px 24px;
          border: none;
          background: #5B8FB9;
          color: white;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #4a7ba0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .app {
            padding: 10px;
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

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};


export default App;