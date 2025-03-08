import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FormatButtonProps {
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

export const FormatButton: React.FC<FormatButtonProps> = ({
  icon: Icon,
  title,
  isActive,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded hover:bg-gray-100 ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};