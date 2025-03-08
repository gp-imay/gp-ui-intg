import React from 'react';
import { ViewMode } from '../../types/screenplay';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setViewMode('beats')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          viewMode === 'beats'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Beats
      </button>
      <button
        onClick={() => setViewMode('script')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          viewMode === 'script'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Script
      </button>
      <button
        onClick={() => setViewMode('boards')}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          viewMode === 'boards'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Boards
      </button>
    </div>
  );
};