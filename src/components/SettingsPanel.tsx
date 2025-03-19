import { useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface SettingsPanelProps {
  onToggleMarkerLines: (show: boolean) => void;
  onThemeChange: (theme: Theme) => void;
  currentTheme: Theme;
  shouldFollowSystem: boolean;
  onToggleSystemFollow: (follow: boolean) => void;
}

export const SettingsPanel = ({ 
  onToggleMarkerLines, 
  onThemeChange, 
  currentTheme,
  shouldFollowSystem,
  onToggleSystemFollow
}: SettingsPanelProps) => {
  const [showMarkerLines, setShowMarkerLines] = useState(true);

  const handleToggle = (show: boolean) => {
    setShowMarkerLines(show);
    onToggleMarkerLines(show);
  };

  const isDark = currentTheme === 'dark';
  const isSystem = currentTheme === 'system';

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
        
        {/* Appearance Settings */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</h3>
          
          {/* Theme Settings */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Theme:</span>
              <div className="flex items-center gap-2">
                <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => onThemeChange('light')}
                    className={`px-3 py-1 text-sm transition-colors ${
                      !isSystem && !isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => onThemeChange('dark')}
                    className={`px-3 py-1 text-sm transition-colors ${
                      !isSystem && isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Dark
                  </button>
                </div>
                <button
                  onClick={() => onThemeChange('system')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    isSystem
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  System
                </button>
              </div>
            </div>
            {!isSystem && (
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={shouldFollowSystem}
                  onChange={(e) => onToggleSystemFollow(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600"
                />
                Reset by next system color changes
              </label>
            )}
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Ruler Settings */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showMarkerLines}
                onChange={(e) => handleToggle(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600"
              />
              <div className="flex flex-col">
                <span>Compact ruler design</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Align markers to the left</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};