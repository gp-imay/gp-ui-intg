import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';
import Avatar from '../components/Dashboard/Avatar';
import ComingSoon from '../components/Dashboard/ComingSoon';
import NewScriptModal from '../components/Dashboard/NewScriptModal';
import {
  LogOut,
  Search,
  Bell,
  ChevronDown,
  User,
  Clock,
  Star,
  Settings,
  FileText,
  Users,
  HelpCircle,
  CreditCard,
  Megaphone,
  Plus,
} from 'lucide-react';
import { mockApi, Script } from '../services/mockApi';

type Section = 'scripts' | 'projects' | 'pricing' | 'promote' | 'help';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNewScriptModal, setShowNewScriptModal] = useState(false);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('scripts');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileMenuRef, () => {
    setShowProfileMenu(false);
  });

  useEffect(() => {
    // Parse the current section from the URL
    const section = location.hash.slice(1) as Section;
    if (section && ['scripts', 'projects', 'pricing', 'promote', 'help'].includes(section)) {
      setActiveSection(section);
    } else {
      // Default to scripts if no valid section is in URL
      setActiveSection('scripts');
      navigate('#scripts', { replace: true });
    }
  }, [location, navigate]);

  const fetchScripts = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getUserScripts();
      setScripts(data);
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'scripts') {
      fetchScripts();
    }
  }, [activeSection]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    navigate(`#${section}`);
  };

  const handleScriptCreated = () => {
    fetchScripts();
  };

  // Added function to handle script click and navigate to editor
  const handleScriptClick = (scriptId: string) => {
    navigate(`/editor/${scriptId}`);
  };

  const renderContent = () => {
    if (activeSection !== 'scripts') {
      return <ComingSoon section={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} />;
    }

    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Start Writing Your First Script With GP
          </h2>
          <button
            onClick={() => setShowNewScriptModal(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 inline-block mr-2" />
            Create New Project
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Scripts</h3>
          </div>
          
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Loading scripts...
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Script Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Genre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scripts.map((script) => (
                  <tr 
                    key={script.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleScriptClick(script.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          name={script.name}
                          size={32}
                          className="flex-shrink-0 mr-4"
                          variant="script"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {script.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{script.genre}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${script.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{script.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="px-6 py-4 border-t border-gray-200">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Projects
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 px-6 py-4">
          <img 
            src="https://framerusercontent.com/images/wlmLl0p0tfc5j0IhyhoO8krmeCM.png" 
            alt="Grease Pencil" 
            className="h-8"
          />
        </div>
        <nav className="mt-8 px-4">
          <button
            onClick={() => handleSectionChange('scripts')}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeSection === 'scripts'
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-5 w-5" />
            Scripts
          </button>
          <button
            onClick={() => handleSectionChange('projects')}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mt-1 transition-colors duration-200 ${
              activeSection === 'projects'
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="h-5 w-5" />
            Projects
          </button>
          <button
            onClick={() => handleSectionChange('pricing')}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mt-1 transition-colors duration-200 ${
              activeSection === 'pricing'
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            Pricing
          </button>
          <button
            onClick={() => handleSectionChange('promote')}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mt-1 transition-colors duration-200 ${
              activeSection === 'promote'
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Megaphone className="h-5 w-5" />
            Promote
          </button>
          <button
            onClick={() => handleSectionChange('help')}
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mt-1 transition-colors duration-200 ${
              activeSection === 'help'
                ? 'text-white bg-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            Help
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Hello {user?.user_metadata?.full_name || user?.email} 👋
              </h1>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scripts, projects..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  2
                </span>
              </button>

              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <Avatar
                      name={user?.user_metadata?.full_name || user?.email || 'User'}
                      size={32}
                      className="flex-shrink-0"
                      variant="profile"
                    />
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{user?.user_metadata?.full_name || user?.email}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4" />
                        Edit Profile
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Clock className="h-4 w-4" />
                        Activity Log
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Star className="h-4 w-4" />
                        Go Pro
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>

        {/* New Script Modal */}
        <NewScriptModal
          isOpen={showNewScriptModal}
          onClose={() => setShowNewScriptModal(false)}
          onScriptCreated={handleScriptCreated}
        />
      </div>
    </div>
  );
}