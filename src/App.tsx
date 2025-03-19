import { useState, useEffect } from 'react';
import { TimeRuler } from './components/TimeRuler';
import { SettingsPanel } from './components/SettingsPanel';

type Theme = 'light' | 'dark' | 'system';

function App() {
  const [timeScale, setTimeScale] = useState(5);
  const [showMarkerLines, setShowMarkerLines] = useState(true);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'system';
  });
  const [shouldFollowSystem, setShouldFollowSystem] = useState(() => {
    const saved = localStorage.getItem('shouldFollowSystem');
    return saved ? JSON.parse(saved) : true;
  });

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Remove all theme classes first
    root.classList.remove('light', 'dark');

    // Add the appropriate theme class
    if (theme === 'system') {
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (shouldFollowSystem) {
        // Switch to system mode when system theme changes and shouldFollowSystem is enabled
        setTheme('system');
      }
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [shouldFollowSystem]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleToggleSystemFollow = (follow: boolean) => {
    setShouldFollowSystem(follow);
    localStorage.setItem('shouldFollowSystem', JSON.stringify(follow));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <TimeRuler 
        timeScale={timeScale} 
        width={window.innerWidth} 
        onTimeScaleChange={setTimeScale}
        showMarkerLines={showMarkerLines}
      />
      <SettingsPanel 
        onToggleMarkerLines={setShowMarkerLines}
        onThemeChange={handleThemeChange}
        currentTheme={theme}
        shouldFollowSystem={shouldFollowSystem}
        onToggleSystemFollow={handleToggleSystemFollow}
      />
    </div>
  );
}

export default App;
