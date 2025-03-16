import React, { useState } from 'react';
import { Home, Edit2, Download, Settings, User, ChevronDown, LogOut, FileText, AlertCircle } from 'lucide-react';
import { ViewMode, UserProfile } from '../types/screenplay';
import { useStoryStore } from '../store/storyStore';

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
  suggestionsEnabled?: boolean;
  setSuggestionsEnabled?: (enabled: boolean) => void;
  onGenerateScript?: () => void;
  showGenerateScript?: boolean;
  // New prop for controlling UI based on script state
  scriptState: 'empty' | 'beatsLoaded' | 'firstSceneGenerated' | 'scriptGenerated' |  'multipleScenes' | 'uploaded' | 'complete';
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
  setSuggestionsEnabled,
  onGenerateScript,
  showGenerateScript,
  scriptState,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const activeUser = userProfiles.find(profile => profile.id === activeProfile);
  // let showGenerateScript = False;
  // For beats view, check if all beats have scenes
  const { beats } = useStoryStore();
  const allBeatsHaveScenes = beats.length > 0 && beats.every(beat => beat.scenes.length > 0);

  const handleGenerateScriptClick = () => {
    if (viewMode === 'beats' && !allBeatsHaveScenes) {
      // If in beats mode and not all beats have scenes, don't do anything
      // The tooltip will be shown on hover
      return;
    }
    
    if (onGenerateScript) {
      onGenerateScript();
    } else {
      // If no handler provided, just switch to script view
      setViewMode('script');
    }
  };

  // Determine if the script is empty so we can hide certain features
  const isScriptEmpty = scriptState === 'empty';

  return (
    <header className="bg-white shadow-sm z-10 flex-none">
      <div className="max-w-full px-4 py-4 flex items-center">
        <div className="w-[300px] flex-shrink-0 flex items-center space-x-4">
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

        {/* Only show view mode selector when the script is not empty */}
        {!isScriptEmpty && (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('beats')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'beats'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Beats
              </button>
              <button
                onClick={() => setViewMode('script')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'script'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Script
              </button>
              <button
                onClick={() => setViewMode('boards')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'boards'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Boards
              </button>
            </div>
          </div>
        )}

        <div className="w-[300px] flex-shrink-0 flex items-center justify-end space-x-4">
          {/* Show Generate Script button when in beats mode and script is not empty */}
          {/* {!isScriptEmpty && viewMode === 'beats' && (
            <div className="relative">
              {showTooltip && !allBeatsHaveScenes && (
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>Generate scenes for all beats before generating the script</span>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full h-2 w-2 border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
              <button
                onClick={handleGenerateScriptClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showGenerateScript ? 'Generate Script' : 'Generate Script'}
              </button>
            </div>
          )} */}
          
          {/* Only show Settings and Export when the script is not empty */}
          {!isScriptEmpty && (
            <>
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
            </>
          )}

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {activeUser?.avatar ? (
                  <img src={activeUser.avatar} alt={activeUser.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div className="hidden md:flex items-center">
                <span className="text-sm font-medium text-gray-700">{activeUser?.name || 'User'}</span>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{activeUser?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{activeUser?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    {userProfiles.map(profile => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          setActiveProfile(profile.id);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          profile.id === activeProfile
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-gray-500 m-auto" />
                            )}
                          </div>
                          <span>{profile.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100">
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <div className="flex items-center text-red-600">
                        <LogOut className="h-4 w-4 mr-3" />
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
