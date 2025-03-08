import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Suggestion {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  description: string;
  content: string;
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  icon: LucideIcon;
  onApply: (content: string) => void;
  disabled?: boolean;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  icon: Icon,
  onApply,
  disabled = false
}) => {
  return (
    <div 
      className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center">
          <Icon className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-medium text-gray-700 ml-1.5">{suggestion.title}</span>
        </div>
        <span className="text-xs text-gray-400">{suggestion.timestamp}</span>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">{suggestion.description}</p>
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className={`text-xs ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
          onClick={() => !disabled && onApply(suggestion.content)}
          disabled={disabled}
        >
          Apply
        </button>
      </div>
    </div>
  );
};