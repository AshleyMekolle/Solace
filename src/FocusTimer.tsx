import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore, themes, timerPresets, soundFiles } from './timerStore'; 

const FocusTimer: React.FC = () => {
  // Use timer store
  const {
    time,
    isRunning,
    isCompleted,
    mode,
    theme,
    selectedSound,
    autoStartBreaks,
    pomodoroCount,
    remainingTime,
    setTime,
    setIsRunning,
    setIsCompleted,
    setMode,
    setTheme,
    setSelectedSound,
    setAutoStartBreaks,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    switchMode,
    setTimerDuration,
    incrementPomodoroCount,
  } = useTimerStore();

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const notificationPermissionRef = useRef(false);

  const currentTheme = themes[theme];

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(soundFiles[selectedSound]);
    audioRef.current.volume = 0.5;

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        notificationPermissionRef.current = permission === 'granted';
      });
    }
  }, [selectedSound]);

  // Timer logic
  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, time, setTime]);

  // Handle timer completion
  useEffect(() => {
    if (time === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [time, isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    completeTimer();
    
    // Play sound
    if (selectedSound !== 'none' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        playFallbackSound();
      });
    }

    // Show notification
    if (notificationPermissionRef.current && 'Notification' in window) {
      const message = mode === 'focus' 
        ? 'Focus session complete! Take a break.' 
        : 'Break time is over! Ready to focus?';
      
      new Notification('⏱️ Zen Timer', {
        body: message,
        icon: 'https://emojicdn.elk.sh/⏱️',
      });
    } else {
      setTimeout(() => {
        alert(mode === 'focus' 
          ? '🎉 Focus session complete! Time for a break.' 
          : '⏰ Break time is over! Ready to focus?'
        );
      }, 100);
    }

    // Auto-start breaks if enabled
    if (mode === 'focus' && autoStartBreaks) {
      setTimeout(() => {
        const newMode = (pomodoroCount + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        const newTime = newMode === 'longBreak' 
          ? timerPresets.longBreak['15'] 
          : timerPresets.shortBreak['5'];
        
        switchMode(newMode);
        setTime(newTime);
        startTimer();
      }, 2000);
    }
  };

  const playFallbackSound = () => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    let totalTime = mode === 'focus' ? 25 * 60 :
                   mode === 'shortBreak' ? 5 * 60 : 15 * 60;
    return ((totalTime - time) / totalTime) * 100;
  };

  const progress = calculateProgress();

  // Get motivational messages
  const getMotivationalMessage = () => {
    if (mode === 'focus') {
      if (time > 20 * 60) return "Begin your journey ⚡";
      if (time > 10 * 60) return "Stay focused 🔥";
      if (time > 5 * 60) return "Almost there! 🚀";
      return "Final stretch! 🎯";
    } else {
      if (time > 2 * 60) return "Relax and recharge 🌊";
      return "Get ready to focus again! ⚡";
    }
  };

  const handleSetTimer = (seconds: number) => {
    setTimerDuration(seconds);
  };

  return (
    <div className="focus-timer" style={{ background: currentTheme.background }}>
      {/* Header */}
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>{currentTheme.icon} Focus Timer</h1>
        {/* <p className="subtitle">Find your flow, one pomodoro at a time</p>
        <p className="storage-info">💾 Timer settings saved locally</p> */}
      </motion.div>

      <div className="main-content">
        {/* Timer Display */}
        <div className="timer-section">
          <motion.div 
            className="timer-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Progress Ring */}
            <svg className="timer-ring" width="320" height="320" viewBox="0 0 320 320">
              <circle
                cx="160"
                cy="160"
                r="145"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="12"
              />
              <motion.circle
                cx="160"
                cy="160"
                r="145"
                fill="none"
                stroke={currentTheme.primary}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 145}`}
                strokeDashoffset={`${2 * Math.PI * 145 * (1 - progress / 100)}`}
                transform="rotate(-90 160 160)"
                initial={{ strokeDashoffset: 2 * Math.PI * 145 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 145 * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Timer Display */}
            <div className="timer-display">
              <motion.div 
                className="timer-text"
                key={remainingTime}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {remainingTime}
              </motion.div>
              <div className="timer-label" style={{ color: currentTheme.primary }}>
                {mode === 'focus' ? 'Focus Session' : 
                 mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </div>
              <div className="motivational-message" style={{ color: currentTheme.lightText }}>
                {getMotivationalMessage()}
              </div>
              {isCompleted && (
                <motion.div 
                  className="completion-message"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ background: currentTheme.secondary }}
                >
                  🎉 Session Complete!
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Timer Controls */}
          <div className="timer-controls">
            <div className="control-buttons">
              {!isRunning ? (
                <motion.button
                  onClick={startTimer}
                  className="timer-btn start-btn"
                  style={{ background: currentTheme.primary }}
                  whileHover={{ scale: 1.05, boxShadow: `0 8px 24px ${currentTheme.primary}40` }}
                  whileTap={{ scale: 0.95 }}
                  disabled={time === 0}
                >
                  ▶️ Start Focus
                </motion.button>
              ) : (
                <motion.button
                  onClick={pauseTimer}
                  className="timer-btn pause-btn"
                  style={{ background: currentTheme.secondary }}
                  whileHover={{ scale: 1.05, boxShadow: `0 8px 24px ${currentTheme.secondary}40` }}
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
          </div>
        </div>

        {/* Settings Panel */}
        <motion.div 
          className="settings-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mode Selection */}
          <div className="settings-section">
            <h3 style={{ color: currentTheme.text }}>⏱️ Timer Mode</h3>
            <div className="mode-buttons">
              {(['focus', 'shortBreak', 'longBreak']).map((modeOption) => (
                <motion.button
                  key={modeOption}
                  className={`mode-btn ${mode === modeOption ? 'active' : ''}`}
                  onClick={() => switchMode(modeOption as any)}
                  style={{
                    background: mode === modeOption ? currentTheme.primary : 'rgba(0,0,0,0.05)',
                    color: mode === modeOption ? 'white' : currentTheme.text
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {modeOption === 'focus' && '🎯 Focus'}
                  {modeOption === 'shortBreak' && '☕ Short Break'}
                  {modeOption === 'longBreak' && '🌴 Long Break'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Time Presets */}
          <div className="settings-section">
            <h3 style={{ color: currentTheme.text }}>⏰ Duration</h3>
            <div className="preset-buttons">
              {Object.entries(timerPresets[mode]).map(([label, seconds]) => (
                <motion.button
                  key={label}
                  className={`preset-btn ${time === seconds ? 'active' : ''}`}
                  onClick={() => handleSetTimer(seconds)}
                  style={{
                    background: time === seconds ? currentTheme.primary : 'rgba(0,0,0,0.05)',
                    color: time === seconds ? 'white' : currentTheme.text
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label} min
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="settings-section">
            <h3 style={{ color: currentTheme.text }}>🔔 Completion Sound</h3>
            <div className="sound-buttons">
              {(['bell', 'chime', 'gong', 'nature', 'none']).map((sound) => (
                <motion.button
                  key={sound}
                  className={`sound-btn ${selectedSound === sound ? 'active' : ''}`}
                  onClick={() => setSelectedSound(sound as any)}
                  style={{
                    background: selectedSound === sound ? currentTheme.primary : 'rgba(0,0,0,0.05)',
                    color: selectedSound === sound ? 'white' : currentTheme.text
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sound === 'bell' && '🔔 Bell'}
                  {sound === 'chime' && '🎐 Chime'}
                  {sound === 'gong' && '🥁 Gong'}
                  {sound === 'nature' && '🌿 Nature'}
                  {sound === 'none' && '🔇 None'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Theme Settings */}
          <div className="settings-section">
            <h3 style={{ color: currentTheme.text }}>🎨 Theme</h3>
            <div className="theme-buttons">
              {(['zen', 'forest', 'ocean', 'sunset']).map((themeOption) => (
                <motion.button
                  key={themeOption}
                  className={`theme-btn ${theme === themeOption ? 'active' : ''}`}
                  onClick={() => setTheme(themeOption as any)}
                  style={{
                    background: themes[themeOption as keyof typeof themes].background,
                    border: `2px solid ${theme === themeOption ? themes[themeOption as keyof typeof themes].primary : 'transparent'}`
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {themes[themeOption as keyof typeof themes].icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Auto-start Settings */}
          <div className="settings-section">
            <div className="switch-container">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={autoStartBreaks}
                  onChange={(e) => setAutoStartBreaks(e.target.checked)}
                  className="switch-input"
                />
                <span className="switch-slider" style={{ background: currentTheme.primary }}></span>
              </label>
              <div className="switch-text">
                <span style={{ color: currentTheme.text }}>Auto-start breaks</span>
                <span className="switch-description" style={{ color: currentTheme.lightText }}>
                  Automatically start break timer after focus sessions
                </span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div 
        className="tips-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 style={{ color: currentTheme.text }}>💡 Focus Tips</h3>
        <div className="tips-grid">
          <div className="tip-card" style={{ borderColor: currentTheme.primary }}>
            <div className="tip-icon">🎯</div>
            <h4>Single Tasking</h4>
            <p>Focus on one task at a time for maximum productivity.</p>
          </div>
          {/* <div className="tip-card" style={{ borderColor: currentTheme.secondary }}>
            <div className="tip-icon">⏰</div>
            <h4>Time Boxing</h4>
            <p>Use the timer to create dedicated focus blocks.</p>
          </div> */}
          <div className="tip-card" style={{ borderColor: currentTheme.primary }}>
            <div className="tip-icon">🌊</div>
            <h4>Regular Breaks</h4>
            <p>Take breaks to maintain focus and prevent burnout.</p>
          </div>
          <div className="tip-card" style={{ borderColor: currentTheme.secondary }}>
            <div className="tip-icon">🚫</div>
            <h4>Eliminate Distractions</h4>
            <p>Close unnecessary tabs and silence notifications.</p>
          </div>
        </div>
      </motion.div>

      {/* Notification Test */}
      <div className="notification-test">
        <motion.button
          onClick={() => {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('⏱️ Zen Timer', {
                body: 'This is a test notification! Your timer notifications are working.',
                icon: 'https://emojicdn.elk.sh/⏱️',
              });
            } else if ('Notification' in window && Notification.permission === 'default') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  notificationPermissionRef.current = true;
                  new Notification('⏱️ Zen Timer', {
                    body: 'Notifications enabled! You\'ll be notified when timers complete.',
                    icon: 'https://emojicdn.elk.sh/⏱️',
                  });
                }
              });
            } else {
              alert('Please enable notifications in your browser settings.');
            }
          }}
          className="test-notification-btn"
          style={{ background: currentTheme.primary }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔔 Test Notifications
        </motion.button>
      </div>

      {/* IMPORTANT: Update the themes in timerStore.ts with these unisex colors */}
      <style>{`
        /* This would be the updated themes in your timerStore.ts */
        /* 
        export const themes = {
          zen: {
            name: 'Zen',
            icon: '⚡',
            primary: '#4A90E2',
            secondary: '#50C878',
            background: '#F5F7FA',
            surface: '#FFFFFF',
            text: '#2D3748',
            lightText: '#718096',
            border: '#E2E8F0',
          },
          forest: {
            name: 'Forest',
            icon: '🌿',
            primary: '#50C878',
            secondary: '#20B2AA',
            background: '#F0FFF4',
            surface: '#FFFFFF',
            text: '#2D3748',
            lightText: '#718096',
            border: '#C6F6D5',
          },
          ocean: {
            name: 'Ocean',
            icon: '🌊',
            primary: '#4A90E2',
            secondary: '#4169E1',
            background: '#EBF4FF',
            surface: '#FFFFFF',
            text: '#2D3748',
            lightText: '#718096',
            border: '#C3DDFD',
          },
          sunset: {
            name: 'Sunset',
            icon: '🌅',
            primary: '#FF8C42',
            secondary: '#FF6B6B',
            background: '#FFF7ED',
            surface: '#FFFFFF',
            text: '#2D3748',
            lightText: '#718096',
            border: '#FED7AA',
          },
        };
        */

        .focus-timer {
          min-height: 100vh;
          padding: 30px;
          font-family: 'Poppins', sans-serif;
          transition: background 0.5s ease;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid rgba(0,0,0,0.05);
        }

        .header h1 {
          font-size: 2.8rem;
          margin: 0 0 10px 0;
          background: linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: ${currentTheme.lightText};
          font-size: 1.2rem;
          margin: 0;
          font-weight: 400;
        }

        .storage-info {
          color: ${currentTheme.secondary};
          font-size: 0.9rem;
          margin: 10px 0 0 0;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        /* Main Content */
        .main-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
          margin-bottom: 40px;
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        /* Timer Section */
        .timer-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .timer-container {
          position: relative;
          margin-bottom: 40px;
          transition: transform 0.3s ease;
        }

        .timer-ring {
          display: block;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.1));
        }

        .timer-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
        }

        .timer-text {
          font-size: 5rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          margin-bottom: 10px;
          background: linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .timer-label {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .motivational-message {
          font-size: 1.1rem;
          margin-bottom: 15px;
          font-style: italic;
        }

        .completion-message {
          padding: 12px 24px;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          display: inline-block;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        /* Timer Controls */
        .timer-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .control-buttons {
          display: flex;
          gap: 15px;
        }

        .timer-btn {
          padding: 16px 32px;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .timer-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .start-btn, .pause-btn {
          color: white;
          min-width: 160px;
        }

        .reset-btn {
          background: rgba(0,0,0,0.05);
          color: ${currentTheme.text};
        }

        .reset-btn:hover {
          background: rgba(0,0,0,0.1);
        }

        /* Settings Panel */
        .settings-panel {
          background: white;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          height: fit-content;
        }

        .settings-section {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .settings-section:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .settings-section h3 {
          margin: 0 0 20px 0;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Mode Buttons */
        .mode-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mode-btn, .preset-btn, .sound-btn {
          padding: 14px 20px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }

        .mode-btn:hover, .preset-btn:hover, .sound-btn:hover {
          transform: translateX(4px);
        }

        /* Preset Buttons */
        .preset-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        /* Sound Buttons */
        .sound-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        @media (max-width: 480px) {
          .preset-buttons,
          .sound-buttons {
            grid-template-columns: 1fr;
          }
        }

        /* Theme Buttons */
        .theme-buttons {
          display: flex;
          gap: 15px;
        }

        .theme-btn {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: 2px solid transparent;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-btn.active {
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        /* Switch */
        .switch-container {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .switch-label {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 32px;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .switch-input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .switch-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 34px;
          transition: .4s;
        }

        .switch-slider:before {
          position: absolute;
          content: "";
          height: 24px;
          width: 24px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          border-radius: 50%;
          transition: .4s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .switch-input:checked + .switch-slider:before {
          transform: translateX(28px);
        }

        .switch-text {
          flex: 1;
        }

        .switch-text span {
          display: block;
        }

        .switch-description {
          font-size: 0.9rem;
          margin-top: 5px;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .stat-item {
          text-align: center;
          padding: 15px;
          background: rgba(0,0,0,0.02);
          border-radius: 12px;
        }

        .stat-number {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          color: ${currentTheme.primary};
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
        }

        /* Tips Section */
        .tips-section {
          max-width: 1400px;
          margin: 0 auto;
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .tips-section h3 {
          margin: 0 0 30px 0;
          font-size: 1.8rem;
          text-align: center;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .tip-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          border: 2px solid;
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
          transition: all 0.3s;
        }

        .tip-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }

        .tip-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .tip-card h4 {
          margin: 0 0 10px 0;
          color: ${currentTheme.text};
          font-size: 1.2rem;
        }

        .tip-card p {
          margin: 0;
          color: ${currentTheme.lightText};
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Notification Test */
        .notification-test {
          text-align: center;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .test-notification-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header h1 {
            font-size: 2.2rem;
          }

          .timer-text {
            font-size: 3.5rem;
          }

          .timer-ring {
            width: 280px;
            height: 280px;
          }

          .main-content {
            gap: 30px;
          }

          .settings-panel {
            padding: 20px;
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }

          .control-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
          }

          .timer-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .focus-timer {
            padding: 20px;
          }

          .header h1 {
            font-size: 1.8rem;
          }

          .subtitle {
            font-size: 1rem;
          }

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