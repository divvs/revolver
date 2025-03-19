import { useState } from 'react';

interface TimeScaleSelectorProps {
  onChange?: (minutes: number) => void;
}

const TIME_SCALES = [1, 5, 10, 15, 30, 60];

export const TimeScaleSelector = ({ onChange }: TimeScaleSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(2); // Default to 10 minutes

  const handleIncrement = () => {
    if (currentIndex < TIME_SCALES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      onChange?.(TIME_SCALES[currentIndex + 1]);
    }
  };

  const handleDecrement = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      onChange?.(TIME_SCALES[currentIndex - 1]);
    }
  };

  return (
    <div className="flex items-center gap-[1px] bg-gray-200 p-[1px] rounded-lg select-none overflow-hidden">
      <div className="min-w-[48px] h-8 bg-white flex items-center justify-center text-base font-mono text-gray-700 rounded-l-lg">
        {TIME_SCALES[currentIndex]}M
      </div>
      <div className="flex flex-col h-8 bg-white rounded-r-lg">
        <button 
          className={`h-4 w-6 flex items-center justify-center text-[10px] font-mono
            ${currentIndex === TIME_SCALES.length - 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-blue-50 transition-colors'
            }`}
          onClick={handleIncrement}
          disabled={currentIndex === TIME_SCALES.length - 1}
        >
          ▲
        </button>
        <button 
          className={`h-4 w-6 flex items-center justify-center text-[10px] font-mono
            ${currentIndex === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-red-50 transition-colors'
            }`}
          onClick={handleDecrement}
          disabled={currentIndex === 0}
        >
          ▼
        </button>
      </div>
    </div>
  );
}; 