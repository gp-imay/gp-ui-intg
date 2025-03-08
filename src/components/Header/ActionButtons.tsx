import React from 'react';
import { Download, Settings } from 'lucide-react';

interface ActionButtonsProps {
  handleExport: () => void;
  openSettings: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleExport,
  openSettings
}) => {
  return (
    <div className="flex items-center justify-end space-x-4">
      <button
        onClick={openSettings}
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
      
      <button
        onClick={handleExport}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </button>
    </div>
  );
};