import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={toggleTheme} 
      data-state={theme}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-thumb">
        {/* Simple SVG icons for day/night representation */}
        <span className="theme-toggle-icon">
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </div>
    </button>
  );
};

export default React.memo(ThemeToggle);