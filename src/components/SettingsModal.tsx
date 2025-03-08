import React, { useState } from 'react';
import { X, AlignLeft, AlignCenter, AlignRight, ArrowDown, ArrowUp, Layers, User, Settings as SettingsIcon, PenTool, UserPlus, Edit, Trash2 } from 'lucide-react';
import { FormatSettings, PageLayout, SceneSuggestions, UserProfile } from '../types/screenplay';

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  settings: FormatSettings;
  setSettings: (settings: FormatSettings) => void;
  suggestions: SceneSuggestions;
  setSuggestions: (suggestions: SceneSuggestions) => void;
  userProfiles: UserProfile[];
  setUserProfiles: (profiles: UserProfile[]) => void;
  activeProfile: string;
  setActiveProfile: (id: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  show,
  onClose,
  settings,
  setSettings,
  suggestions,
  setSuggestions,
  userProfiles,
  setUserProfiles,
  activeProfile,
  setActiveProfile
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'page' | 'profile'>('profile');
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  
  if (!show) return null;

  const handleChange = (
    elementType: keyof FormatSettings['elements'],
    property: keyof FormatSettings['elements'][keyof FormatSettings['elements']],
    value: string | number
  ) => {
    setSettings({
      ...settings,
      preset: 'custom',
      elements: {
        ...settings.elements,
        [elementType]: {
          ...settings.elements[elementType],
          [property]: value
        }
      }
    });
  };

  const handlePageLayoutChange = (property: keyof PageLayout, value: string | number) => {
    setSettings({
      ...settings,
      preset: 'custom',
      pageLayout: {
        ...settings.pageLayout,
        [property]: value
      }
    });
  };

  const getAlignmentIcon = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return <AlignLeft className="w-4 h-4" />;
      case 'center':
        return <AlignCenter className="w-4 h-4" />;
      case 'right':
        return <AlignRight className="w-4 h-4" />;
      default:
        return <AlignLeft className="w-4 h-4" />;
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfiles(userProfiles.map(p => 
      p.id === updatedProfile.id ? updatedProfile : p
    ));
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (userProfiles.length <= 1) {
      alert("Cannot delete the only profile");
      return;
    }
    
    const newProfiles = userProfiles.filter(p => p.id !== profileId);
    setUserProfiles(newProfiles);
    
    // If the active profile is deleted, switch to the first available profile
    if (profileId === activeProfile) {
      setActiveProfile(newProfiles[0].id);
    }
  };

  const handleAddProfile = () => {
    const newProfile: UserProfile = {
      id: `user${userProfiles.length + 1}`,
      name: `New User ${userProfiles.length + 1}`,
      email: `user${userProfiles.length + 1}@example.com`,
      role: 'free',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light',
        fontSize: 14,
        autoSave: true,
        formatSettings: settings
      }
    };
    
    setUserProfiles([...userProfiles, newProfile]);
    setEditingProfile(newProfile);
  };

  const handleSaveProfileSettings = () => {
    const currentProfile = userProfiles.find(p => p.id === activeProfile);
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        preferences: {
          ...currentProfile.preferences,
          formatSettings: settings
        }
      };
      handleUpdateProfile(updatedProfile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div
        className="my-8 bg-white rounded-lg shadow-xl w-[600px] max-w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-4 h-4" />
              User Profile
            </button>
            <button
              onClick={() => setActiveTab('elements')}
              className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === 'elements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PenTool className="w-4 h-4" />
              Element Formatting
            </button>
            <button
              onClick={() => setActiveTab('page')}
              className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === 'page'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Layers className="w-4 h-4" />
              Page Layout
            </button>
          </nav>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {editingProfile ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {editingProfile.id === activeProfile ? 'Edit Your Profile' : 'Edit Profile'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editingProfile.name}
                        onChange={(e) => setEditingProfile({
                          ...editingProfile,
                          name: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingProfile.email}
                        onChange={(e) => setEditingProfile({
                          ...editingProfile,
                          email: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={editingProfile.bio || ''}
                        onChange={(e) => setEditingProfile({
                          ...editingProfile,
                          bio: e.target.value
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Avatar URL
                      </label>
                      <input
                        type="text"
                        value={editingProfile.avatar || ''}
                        onChange={(e) => setEditingProfile({
                          ...editingProfile,
                          avatar: e.target.value
                        })}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {editingProfile.avatar && (
                        <div className="mt-2 flex items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200">
                            <img 
                              src={editingProfile.avatar} 
                              alt="Avatar preview" 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/150?text=Error';
                              }}
                            />
                          </div>
                          <span className="ml-3 text-xs text-gray-500">Avatar preview</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Theme
                      </label>
                      <select
                        value={editingProfile.preferences.theme}
                        onChange={(e) => setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            theme: e.target.value as 'light' | 'dark' | 'system'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="24"
                        value={editingProfile.preferences.fontSize}
                        onChange={(e) => setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            fontSize: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoSave"
                        checked={editingProfile.preferences.autoSave}
                        onChange={(e) => setEditingProfile({
                          ...editingProfile,
                          preferences: {
                            ...editingProfile.preferences,
                            autoSave: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-700">
                        Enable Auto-Save
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingProfile(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateProfile(editingProfile)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">User Profiles</h3>
                      <button
                        onClick={handleAddProfile}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Profile
                      </button>
                    </div>
                    <div className="space-y-3">
                      {userProfiles.map(profile => (
                        <div 
                          key={profile.id}
                          className={`p-3 rounded-lg border ${
                            profile.id === activeProfile 
                              ? 'border-blue-200 bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {profile.avatar ? (
                                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                                ) : (
                                  <User className="h-5 w-5 text-gray-500 m-auto" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{profile.name}</h4>
                                <p className="text-xs text-gray-500">{profile.email}</p>
                                <div className="flex items-center mt-1">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    profile.role === 'premium' 
                                      ? 'bg-purple-100 text-purple-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {profile.role === 'premium' ? 'Premium' : 'Free'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingProfile(profile)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Edit profile"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {profile.id !== activeProfile && (
                                <button
                                  onClick={() => handleDeleteProfile(profile.id)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                  title="Delete profile"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          {profile.id === activeProfile && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Current profile</span>
                                <button
                                  onClick={handleSaveProfileSettings}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Save current settings to profile
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-3">Element Formatting</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Customize the alignment and spacing of screenplay elements to match your preferred format.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Element
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alignment
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Width (inches)
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Spacing Before
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Spacing After
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(settings.elements).map(([type, format]) => (
                          <tr key={type} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleChange(type as any, 'alignment', 'left')}
                                  className={`p-1.5 rounded ${format.alignment === 'left' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                  title="Align Left"
                                >
                                  <AlignLeft className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleChange(type as any, 'alignment', 'center')}
                                  className={`p-1.5 rounded ${format.alignment === 'center' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                  title="Align Center"
                                >
                                  <AlignCenter className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleChange(type as any, 'alignment', 'right')}
                                  className={`p-1.5 rounded ${format.alignment === 'right' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                  title="Align Right"
                                >
                                  <AlignRight className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  min="0.5"
                                  max="6"
                                  step="0.1"
                                  value={format.width}
                                  onChange={(e) => handleChange(type as any, 'width', parseFloat(e.target.value))}
                                  className="w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <span className="ml-1">in</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="3"
                                  step="0.25"
                                  value={format.spacingBefore}
                                  onChange={(e) => handleChange(type as any, 'spacingBefore', parseFloat(e.target.value))}
                                  className="w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <span className="ml-1">rem</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="3"
                                  step="0.25"
                                  value={format.spacingAfter}
                                  onChange={(e) => handleChange(type as any, 'spacingAfter', parseFloat(e.target.value))}
                                  className="w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <span className="ml-1">rem</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-3">Preset Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      preset: 'standard',
                      elements: {
                        'scene-heading': { alignment: 'left', width: 6, spacingBefore: 1.5, spacingAfter: 1 },
                        'action': { alignment: 'left', width: 6, spacingBefore: 0, spacingAfter: 1 },
                        'character': { alignment: 'center', width: 3.5, spacingBefore: 1, spacingAfter: 0.25 },
                        'parenthetical': { alignment: 'center', width: 2.5, spacingBefore: 0, spacingAfter: 0 },
                        'dialogue': { alignment: 'left', width: 3.5, spacingBefore: 0, spacingAfter: 1 },
                        'transition': { alignment: 'right', width: 6, spacingBefore: 1, spacingAfter: 1 }
                      }
                    })}
                    className={`p-4 border rounded-lg text-left ${settings.preset === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <h4 className="font-medium">Standard Format</h4>
                    <p className="text-sm text-gray-600 mt-1">Industry standard screenplay format</p>
                  </button>
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      preset: 'compact',
                      elements: {
                        'scene-heading': { alignment: 'left', width: 6, spacingBefore: 1, spacingAfter: 0.5 },
                        'action': { alignment: 'left', width: 6, spacingBefore: 0, spacingAfter: 0.5 },
                        'character': { alignment: 'center', width: 3.5, spacingBefore: 0.5, spacingAfter: 0 },
                        'parenthetical': { alignment: 'center', width: 2.5, spacingBefore: 0, spacingAfter: 0 },
                        'dialogue': { alignment: 'left', width: 3.5, spacingBefore: 0, spacingAfter: 0.5 },
                        'transition': { alignment: 'right', width: 6, spacingBefore: 0.5, spacingAfter: 0.5 }
                      }
                    })}
                    className={`p-4 border rounded-lg text-left ${settings.preset === 'compact' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <h4 className="font-medium">Compact Format</h4>
                    <p className="text-sm text-gray-600 mt-1">Reduced spacing for more content per page</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'page' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-3">Page Layout</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Customize the page dimensions and margins for your screenplay.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Page Size</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Paper Format
                          </label>
                          <select
                            value={settings.pageLayout.paperSize}
                            onChange={(e) => handlePageLayoutChange('paperSize', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="letter">US Letter (8.5" × 11")</option>
                            <option value="a4">A4 (210mm × 297mm)</option>
                            <option value="legal">Legal (8.5" × 14")</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Width
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="5"
                                max="12"
                                step="0.1"
                                value={settings.pageLayout.width}
                                onChange={(e) => handlePageLayoutChange('width', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                disabled={settings.pageLayout.paperSize !== 'custom'}
                              />
                              <span className="ml-2">in</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Height
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="7"
                                max="17"
                                step="0.1"
                                value={settings.pageLayout.height}
                                onChange={(e) => handlePageLayoutChange('height', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                disabled={settings.pageLayout.paperSize !== 'custom'}
                              />
                              <span className="ml-2">in</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => handlePageLayoutChange('paperSize', 'custom')}
                            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            Use custom dimensions
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Margins</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Top
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={settings.pageLayout.marginTop}
                                onChange={(e) => handlePageLayoutChange('marginTop', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <span className="ml-2">in</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bottom
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={settings.pageLayout.marginBottom}
                                onChange={(e) => handlePageLayoutChange('marginBottom', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <span className="ml-2">in</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Left
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={settings.pageLayout.marginLeft}
                                onChange={(e) => handlePageLayoutChange('marginLeft', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <span className="ml-2">in</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Right
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={settings.pageLayout.marginRight}
                                onChange={(e) => handlePageLayoutChange('marginRight', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <span className="ml-2">in</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Page Numbering</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.pageLayout.showPageNumbers}
                            onChange={(e) => handlePageLayoutChange('showPageNumbers', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Show page numbers</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Page Number Position
                        </label>
                        <select
                          value={settings.pageLayout.pageNumberPosition}
                          onChange={(e) => handlePageLayoutChange('pageNumberPosition', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={!settings.pageLayout.showPageNumbers}
                        >
                          <option value="top-right">Top Right</option>
                          <option value="top-center">Top Center</option>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-center">Bottom Center</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Page Layout Preview</h4>
                    <div className="border border-gray-300 rounded-md p-4 bg-white flex justify-center">
                      <div 
                        className="bg-white border border-gray-300 shadow-sm relative"
                        style={{
                          width: `${Math.min(settings.pageLayout.width * 20, 170)}px`,
                          height: `${Math.min(settings.pageLayout.height * 20, 220)}px`,
                        }}
                      >
                        <div 
                          className="absolute bg-blue-50 border border-blue-200"
                          style={{
                            top: `${settings.pageLayout.marginTop * 20}px`,
                            left: `${settings.pageLayout.marginLeft * 20}px`,
                            right: `${settings.pageLayout.marginRight * 20}px`,
                            bottom: `${settings.pageLayout.marginBottom * 20}px`,
                          }}
                        >
                          {/* Content area */}
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers className="text-blue-300 w-6 h-6" />
                          </div>
                        </div>
                        
                        {/* Page number indicator */}
                        {settings.pageLayout.showPageNumbers && (
                          <div 
                            className="absolute text-xs text-gray-500 px-1"
                            style={{
                              top: settings.pageLayout.pageNumberPosition.startsWith('top') ? '4px' : 'auto',
                              bottom: settings.pageLayout.pageNumberPosition.startsWith('bottom') ? '4px' : 'auto',
                              left: settings.pageLayout.pageNumberPosition.endsWith('center') ? '50%' : 'auto',
                              right: settings.pageLayout.pageNumberPosition.endsWith('right') ? '4px' : 'auto',
                              transform: settings.pageLayout.pageNumberPosition.endsWith('center') ? 'translateX(-50%)' : 'none',
                            }}
                          >
                            1.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-3">Preset Page Layouts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      pageLayout: {
                        paperSize: 'letter',
                        width: 8.5,
                        height: 11,
                        marginTop: 1,
                        marginBottom: 1,
                        marginLeft: 1.5,
                        marginRight: 1,
                        showPageNumbers: true,
                        pageNumberPosition: 'top-right'
                      }
                    })}
                    className={`p-4 border rounded-lg text-left ${
                      settings.pageLayout.paperSize === 'letter' &&
                      settings.pageLayout.marginTop === 1 &&
                      settings.pageLayout.marginLeft === 1.5
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-medium">US Screenplay Standard</h4>
                    <p className="text-sm text-gray-600 mt-1">US Letter with industry standard margins</p>
                  </button>
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      pageLayout: {
                        paperSize: 'a4',
                        width: 8.27,
                        height: 11.69,
                        marginTop: 1,
                        marginBottom: 1,
                        marginLeft: 1.5,
                        marginRight: 1,
                        showPageNumbers: true,
                        pageNumberPosition: 'top-right'
                      }
                    })}
                    className={`p-4 border rounded-lg text-left ${
                      settings.pageLayout.paperSize === 'a4' &&
                      settings.pageLayout.marginTop === 1 &&
                      settings.pageLayout.marginLeft === 1.5
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-medium">European Screenplay Standard</h4>
                    <p className="text-sm text-gray-600 mt-1">A4 with industry standard margins</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export { SettingsModal }