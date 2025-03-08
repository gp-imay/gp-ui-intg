import React from 'react';
import { Home, Edit2 } from 'lucide-react';

interface TitleDisplayProps {
  title: string;
  setShowTitlePageModal: (show: boolean) => void;
}

export const TitleDisplay: React.FC<TitleDisplayProps> = ({
  title,
  setShowTitlePageModal
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Home className="h-5 w-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => setShowTitlePageModal(true)}
          className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
          title={title}
        >
          {title}
        </button>
        <button
          onClick={() => setShowTitlePageModal(true)}
          className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};