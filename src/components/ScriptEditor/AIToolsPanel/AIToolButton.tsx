import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AIToolButtonProps {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  onClick: () => void;
}

export const AIToolButton: React.FC<AIToolButtonProps> = ({
  id,
  icon: Icon,
  label,
  color,
  onClick
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 group-hover:bg-blue-200 text-blue-600';
      case 'purple': return 'bg-purple-100 group-hover:bg-purple-200 text-purple-600';
      case 'amber': return 'bg-amber-100 group-hover:bg-amber-200 text-amber-600';
      case 'green': return 'bg-green-100 group-hover:bg-green-200 text-green-600';
      case 'indigo': return 'bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600';
      case 'rose': return 'bg-rose-100 group-hover:bg-rose-200 text-rose-600';
      default: return 'bg-gray-100 group-hover:bg-gray-200 text-gray-600';
    }
  };

  const getHoverClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'hover:bg-blue-50';
      case 'purple': return 'hover:bg-purple-50';
      case 'amber': return 'hover:bg-amber-50';
      case 'green': return 'hover:bg-green-50';
      case 'indigo': return 'hover:bg-indigo-50';
      case 'rose': return 'hover:bg-rose-50';
      default: return 'hover:bg-gray-50';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors flex items-center gap-2 w-48 text-gray-700 ${getHoverClasses(color)} group`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${getColorClasses(color)}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};