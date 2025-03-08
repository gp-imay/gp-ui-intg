import React, { forwardRef } from 'react';
import {
  Wand2,
  Maximize2,
  Minimize2,
  MessageCircle,
  Zap,
  RefreshCw
} from 'lucide-react';
import { AIMenuItem } from './AIMenuItem';

interface AIMenuProps {
  onAction: (action: string) => void;
}

export const AIMenu = forwardRef<HTMLDivElement, AIMenuProps>(({ onAction }, ref) => {
  const menuItems = [
    {
      id: 'improve',
      icon: Wand2,
      title: 'Improve',
      description: 'Enhance writing quality',
      color: 'blue'
    },
    {
      id: 'expand',
      icon: Maximize2,
      title: 'Expand',
      description: 'Add more details',
      color: 'purple'
    },
    {
      id: 'shorten',
      icon: Minimize2,
      title: 'Shorten',
      description: 'Make it more concise',
      color: 'amber'
    },
    {
      id: 'dialogue',
      icon: MessageCircle,
      title: 'Dialogue',
      description: 'Improve character speech',
      color: 'green'
    },
    {
      id: 'rewrite',
      icon: RefreshCw,
      title: 'Rewrite',
      description: 'Alternative version',
      color: 'indigo'
    },
    {
      id: 'continue',
      icon: Zap,
      title: 'Continue',
      description: 'Generate next part',
      color: 'rose'
    }
  ];

  return (
    <div 
      ref={ref}
      className="absolute left-0 top-full mt-2 w-[220px] bg-white rounded-lg shadow-lg p-2 flex flex-col z-50 ai-menu"
    >
      <div className="text-xs text-gray-500 mb-2 px-2">AI Actions</div>
      
      {menuItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <AIMenuItem
            icon={item.icon}
            title={item.title}
            description={item.description}
            color={item.color}
            onClick={() => onAction(item.id)}
          />
          {index === 3 && <div className="border-t border-gray-100 my-1"></div>}
        </React.Fragment>
      ))}
    </div>
  );
});

AIMenu.displayName = 'AIMenu';