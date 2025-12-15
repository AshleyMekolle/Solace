

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from './store';

const FocusTimer: React.FC = () => {
  const { timerMinutes, timerSeconds, isTimerRunning, startTimer, stopTimer, resetTimer, tickTimer } = useStore();

  React.useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = window.setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerMinutes, timerSeconds, tickTimer]);

  const progress = ((25 * 60 - (timerMinutes * 60 + timerSeconds)) / (25 * 60)) * 100;

  return (
    <div className="focus-timer">
      <h2 className="section-title">Focus Timer</h2>

      <motion.div 
        className="timer-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <svg className="timer-ring" width="280" height="280">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="12"
          />
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="#FF9A76"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
            transform="rotate(-90 140 140)"
            initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="timer-display">
          <motion.div 
            className="timer-text"
            key={`${timerMinutes}-${timerSeconds}`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
          </motion.div>
          <div className="timer-label">
            {isTimerRunning ? 'Focus Time' : 'Ready to Focus?'}
          </div>
        </div>
      </motion.div>

      <div className="timer-controls">
        {!isTimerRunning ? (
          <motion.button
            onClick={startTimer}
            className="timer-btn start-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ▶️ Start
          </motion.button>
        ) : (
          <motion.button
            onClick={stopTimer}
            className="timer-btn stop-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⏸️ Pause
          </motion.button>
        )}
        <motion.button
          onClick={resetTimer}
          className="timer-btn reset-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Reset
        </motion.button>
      </div>

      <motion.div 
        className="timer-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p>🍅 Classic Pomodoro: 25 minutes of focused work</p>
        <p>Take a break after each session!</p>
      </motion.div>

      <style>{`
        .focus-timer {
          animation: fadeIn 0.3s ease;
          text-align: center;
        }

        .timer-container {
          position: relative;
          display: inline-block;
          margin: 40px 0;
        }

        .timer-ring {
          display: block;
        }

        .timer-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .timer-text {
          font-size: 4rem;
          font-weight: 700;
          color: #333;
          font-variant-numeric: tabular-nums;
        }

        .timer-label {
          font-size: 1rem;
          color: #999;
          margin-top: 5px;
        }

        .timer-controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .timer-btn {
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .start-btn {
          background: linear-gradient(135deg, #86B6B6 0%, #6fa0a0 100%);
          color: white;
        }

        .stop-btn {
          background: linear-gradient(135deg, #FF9A76 0%, #ff8560 100%);
          color: white;
        }

        .reset-btn {
          background: #f0f0f0;
          color: #666;
        }

        .reset-btn:hover {
          background: #e0e0e0;
        }

        .timer-info {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f8f8;
          border-radius: 12px;
        }

        .timer-info p {
          margin: 10px 0;
          color: #666;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .timer-text {
            font-size: 3rem;
          }

          .timer-ring {
            width: 240px;
            height: 240px;
          }
        }
      `}</style>
    </div>
  );
};

export default FocusTimer;