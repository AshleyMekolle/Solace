
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';

const GoalTracker: React.FC = () => {
  const { goals, addGoal, toggleGoal, deleteGoal } = useStore();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addGoal(title);
      setTitle('');
    }
  };

  return (
    <div className="goal-tracker">
      <h2 className="section-title">Daily Goals</h2>

      <motion.form 
        className="goal-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your daily goal?"
          className="goal-input"
        />
        <motion.button 
          type="submit" 
          className="add-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add Goal
        </motion.button>
      </motion.form>

      <div className="goal-list">
        <AnimatePresence>
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              className={`goal-item ${goal.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
                className="goal-checkbox"
              />
              <div className="goal-content">
                <span className="goal-title">{goal.title}</span>
                <div className="streak-info">
                  <span className="streak-icon">🔥</span>
                  <span className="streak-count">{goal.streak} day streak</span>
                </div>
              </div>
              <motion.button
                onClick={() => deleteGoal(goal.id)}
                className="delete-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                🗑️
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
        {goals.length === 0 && (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="empty-icon">🎯</span>
            <p>No goals yet. Set your first goal above!</p>
          </motion.div>
        )}
      </div>

      <style>{`
        .goal-tracker {
          animation: fadeIn 0.3s ease;
        }

        .goal-form {
          background: #f8f8f8;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
        }

        .goal-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          margin-bottom: 15px;
          transition: border 0.2s;
        }

        .goal-input:focus {
          outline: none;
          border-color: #86B6B6;
        }

        .goal-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .goal-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .goal-item:hover {
          border-color: #86B6B6;
          box-shadow: 0 2px 8px rgba(134, 182, 182, 0.1);
        }

        .goal-item.completed {
          background: linear-gradient(135deg, #86B6B6 0%, #6fa0a0 100%);
          border-color: #86B6B6;
          color: white;
        }

        .goal-checkbox {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }

        .goal-content {
          flex: 1;
        }

        .goal-title {
          display: block;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .streak-info {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .streak-icon {
          font-size: 1rem;
        }

        .streak-count {
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default GoalTracker;