import React from 'react';
import { ViewMode, UserProfile } from '../../types/screenplay';
import { TitleDisplay } from './TitleDisplay';
import { ViewModeSelector } from './ViewModeSelector';
import { ActionButtons } from './ActionButtons';
import { ProfileMenu } from './ProfileMenu';
import { Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';

interface HeaderProps {
  title: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setShowTitlePageModal: (show: boolean) => void;
  handleExport: () => void;
  openSettings: () => void;
  userProfiles: UserProfile[];
  activeProfile: string;
  setActiveProfile: (id: string) => void;
  suggestionsEnabled: boolean;
  setSuggestionsEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  viewMode,
  setViewMode,
  setShowTitlePageModal,
  handleExport,
  openSettings,
  userProfiles,
  activeProfile,
  setActiveProfile,
  suggestionsEnabled,
  setSuggestionsEnabled
}) => {
  return (
    <header className="bg-white shadow-sm z-10 flex-none">
      <div className="max-w-full px-4 py-4 flex items-center">
        <div className="flex items-center space-x-4">
          <TitleDisplay 
            title={title} 
            setShowTitlePageModal={setShowTitlePageModal}
          />
          
          <button
            onClick={() => setSuggestionsEnabled(!suggestionsEnabled)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border ${
              suggestionsEnabled 
                ? 'bg-blue-500 text-white border-blue-600 shadow-sm ai-toggle-button' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title={suggestionsEnabled ? "Disable AI Assistant" : "Enable AI Assistant"}
          >
            <div className="relative">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-medium">AI {suggestionsEnabled ? "ON" : "OFF"}</span>
            {suggestionsEnabled ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <ViewModeSelector 
            viewMode={viewMode} 
            setViewMode={setViewMode}
          />
        </div>

        <div className="w-[300px] flex-shrink-0 flex items-center justify-end space-x-4">
          <ActionButtons 
            handleExport={handleExport} 
            openSettings={openSettings}
          />

          <ProfileMenu 
            userProfiles={userProfiles} 
            activeProfile={activeProfile} 
            setActiveProfile={setActiveProfile} 
          />
        </div>
      </div>
    </header>
  );
};