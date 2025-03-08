import React from 'react';
import { Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';

interface AIToggleProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  className?: string;
}

export const AIToggle: React.FC<AIToggleProps> = ({
  enabled,
  setEnabled,
  className = ''
}) => {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border ${
        enabled 
          ? 'bg-blue-500 text-white border-blue-600 shadow-sm ai-toggle-button' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      } ${className}`}
      title={enabled ? "Disable AI Assistant" : "Enable AI Assistant"}
    >
      <div className={`ai-icon-container scale-75 ${enabled ? 'active' : ''}`}>
        <div className="ai-icon-pulse"></div>
        <Sparkles className={`ai-icon-sparkle w-4 h-4 ${enabled ? 'text-white' : 'text-blue-500'}`} />
      </div>
      <span className="font-medium">{enabled ? "ON" : "OFF"}</span>
      {enabled ? (
        <ToggleRight className="w-4 h-4" />
      ) : (
        <ToggleLeft className="w-4 h-4" />
      )}
    </button>
  );
};