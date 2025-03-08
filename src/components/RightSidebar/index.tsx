import React, { useState } from 'react';
import { Wand2, Maximize2, Minimize2, MessageSquare, Trash2, Zap } from 'lucide-react';
import { SidebarHeader } from './SidebarHeader';
import { AIActionButton } from './AIActionButton';
import { SuggestionCard } from './SuggestionCard';

interface RightSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onApplySuggestion?: (content: string) => void;
  selectedElementId?: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ 
  isOpen, 
  setIsOpen,
  onApplySuggestion,
  selectedElementId
}) => {
  const [suggestions, setSuggestions] = useState([
    {
      id: '1',
      type: 'improve',
      title: 'Improve Scene',
      timestamp: 'Just now',
      description: 'Added more visual details to the scene description to enhance the atmosphere.',
      content: 'INT. LIVING ROOM - NIGHT\n\nThe dimly lit room is cluttered with old furniture, the walls adorned with faded family photos. A single lamp casts long shadows across the worn carpet, where dust particles dance in the beam of light.'
    },
    {
      id: '2',
      type: 'expand',
      title: 'Expanded Dialogue',
      timestamp: '5m ago',
      description: 'Extended the character\'s response to reveal more about their motivation.',
      content: 'SARAH\n\nI can\'t just walk away from this. You don\'t understand what I\'ve been through, what we\'ve all sacrificed to get here. This isn\'t just about me anymore - there are people counting on us to finish what we started.'
    }
  ]);

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  const handleApplySuggestion = (content: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(content);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'improve': return Wand2;
      case 'expand': return Maximize2;
      case 'shorten': return Minimize2;
      case 'dialogue': return MessageSquare;
      default: return Zap;
    }
  };

  const aiActions = [
    { icon: Wand2, label: 'Improve', color: 'bg-blue-50', type: 'improve' },
    { icon: Maximize2, label: 'Expand', color: 'bg-purple-50', type: 'expand' },
    { icon: Minimize2, label: 'Shorten', color: 'bg-amber-50', type: 'shorten' },
    { icon: MessageSquare, label: 'Dialogue', color: 'bg-green-50', type: 'dialogue' }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 overflow-hidden relative ${
      isOpen ? 'w-80' : 'w-0'
    }`}>
      <div className="h-full flex flex-col">
        <SidebarHeader title="AI Assistant" onClose={() => setIsOpen(false)} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Select text and use the AI Assist button in the toolbar to get suggestions and improvements.</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">AI Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {aiActions.map(action => (
                  <AIActionButton 
                    key={action.type}
                    icon={action.icon}
                    label={action.label}
                    colorClass={action.color}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">Recent Suggestions</h3>
                {suggestions.length > 0 && (
                  <button 
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                    onClick={clearSuggestions}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </button>
                )}
              </div>
              {suggestions.length === 0 ? (
                <div className="text-center py-6">
                  <Zap className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No suggestions yet</p>
                  <p className="text-xs text-gray-400 mt-1">Select text and use AI actions to get suggestions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestions.map(suggestion => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      icon={getIconForType(suggestion.type)}
                      onApply={handleApplySuggestion}
                      disabled={!selectedElementId}
                    />
                  ))}
                </div>
              )}
              {suggestions.length > 0 && (
                <div className="mt-2 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    View all suggestions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};