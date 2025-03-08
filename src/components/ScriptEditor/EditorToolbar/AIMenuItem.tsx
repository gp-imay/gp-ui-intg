import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AIMenuItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

export const AIMenuItem: React.FC<AIMenuItemProps> = ({
  icon: Icon,
  title,
  description,
  color,
  onClick
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-100', hover: 'hover:bg-blue-50', text: 'text-blue-600' };
      case 'purple': return { bg: 'bg-purple-100', hover: 'hover:bg-purple-50', text: 'text-purple-600' };
      case 'amber': return { bg: 'bg-amber-100', hover: 'hover:bg-amber-50', text: 'text-amber-600' };
      case 'green': return { bg: 'bg-green-100', hover: 'hover:bg-green-50', text: 'text-green-600' };
      case 'indigo': return { bg: 'bg-indigo-100', hover: 'hover:bg-indigo-50', text: 'text-indigo-600' };
      case 'rose': return { bg: 'bg-rose-100', hover: 'hover:bg-rose-50', text: 'text-rose-600' };
      default: return { bg: 'bg-gray-100', hover: 'hover:bg-gray-50', text: 'text-gray-600' };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded ${colorClasses.hover} text-gray-700 text-sm group ai-action-button`}
    >
      <div className={`w-6 h-6 rounded-full ${colorClasses.bg} flex items-center justify-center group-hover:bg-opacity-80 transition-colors ai-action-icon`}>
        <Icon className={`w-3.5 h-3.5 ${colorClasses.text}`} />
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </button>
  );
};