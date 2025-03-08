import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIIconProps {
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AIIcon: React.FC<AIIconProps> = ({
  active = true,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'scale-75',
    md: '',
    lg: 'scale-125'
  };

  return (
    <div className={`ai-icon-container ${active ? 'active' : ''} ${sizeClasses[size]} ${className}`}>
      <div className="ai-icon-pulse"></div>
      <Sparkles className={`ai-icon-sparkle ${size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} text-blue-500`} />
    </div>
  );
};