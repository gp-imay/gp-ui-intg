import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AIIcon } from './AIIcon';

interface SidebarHeaderProps {
  title: string;
  onClose: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  title,
  onClose
}) => {
  return (
    <div className="p-4 border-b border-gray-200 flex-none flex justify-between items-center">
      <div className="flex items-center">
        <AIIcon className="mr-2" active={true} />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};