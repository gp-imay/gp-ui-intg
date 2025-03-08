import React from 'react';
import { 
  Wand2, 
  Maximize2, 
  Minimize2, 
  MessageCircle, 
  RefreshCw, 
  Zap 
} from 'lucide-react';
import { AIToolButton } from './AIToolButton';

interface AIToolsPanelProps {
  showAITools: boolean;
  onAIAction: (action: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const AIToolsPanel: React.FC<AIToolsPanelProps> = ({
  showAITools,
  onAIAction,
  onMouseEnter,
  onMouseLeave
}) => {
  const aiTools = [
    { id: 'improve', icon: Wand2, label: 'Improve', color: 'blue' },
    { id: 'expand', icon: Maximize2, label: 'Expand', color: 'purple' },
    { id: 'shorten', icon: Minimize2, label: 'Shorten', color: 'amber' },
    { id: 'dialogue', icon: MessageCircle, label: 'Dialogue', color: 'green' },
    { id: 'rewrite', icon: RefreshCw, label: 'Rewrite', color: 'indigo' },
    { id: 'continue', icon: Zap, label: 'Continue', color: 'rose' }
  ];

  return (
    <div 
      className={`absolute -right-[12rem] top-0 flex flex-col gap-0.5 transition-all duration-200 z-10 ${
        showAITools ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white rounded-lg shadow-lg p-1">
        {aiTools.map((tool, index) => (
          <div
            key={tool.id}
            className={`transition-all duration-200 ${
              showAITools 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-2'
            }`}
            style={{ 
              transitionDelay: showAITools ? `${index * 50}ms` : '0ms'
            }}
          >
            <AIToolButton
              id={tool.id}
              icon={tool.icon}
              label={tool.label}
              color={tool.color}
              onClick={() => onAIAction(tool.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};