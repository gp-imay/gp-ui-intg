import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AIActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  colorClass: string;
}

export const AIActionButton: React.FC<AIActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  colorClass
}) => {
  return (
    <button 
      className={`flex flex-col items-center justify-center p-3 ${colorClass} rounded-lg hover:bg-opacity-80 transition-colors group`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
      <span className="text-xs text-gray-700">{label}</span>
    </button>
  );
};