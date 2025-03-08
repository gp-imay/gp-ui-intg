import React, { useState } from 'react';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { UserProfile } from '../../types/screenplay';

interface ProfileMenuProps {
  userProfiles: UserProfile[];
  activeProfile: string;
  setActiveProfile: (id: string) => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userProfiles,
  activeProfile,
  setActiveProfile
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const activeUser = userProfiles.find(profile => profile.id === activeProfile);

  return (
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
                    <span>{profile.name} Something Daa</span>
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
                  <span>Sign out -- </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};