import React, { useEffect, useState, useRef } from 'react';

interface WritingCursorProps {
  isActive: boolean;
  position: { x: number; y: number } | null;
  color?: string;
}

export const WritingCursor: React.FC<WritingCursorProps> = ({
  isActive,
  position,
  color = '#2563eb'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Setup cursor blinking
  useEffect(() => {
    // Start cursor blinking interval
    blinkIntervalRef.current = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      // Only blink cursor if it's been inactive for a short while
      if (timeSinceLastActivity > 500) {
        setIsVisible(prev => !prev);
        setIsTyping(false);
      } else {
        setIsVisible(true); // Keep cursor visible during active typing
        setIsTyping(true);
      }
    }, 530); // Slightly longer than 500ms to ensure smooth blinking

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, [lastActivity]);

  // Update activity timestamp when position changes
  useEffect(() => {
    if (position) {
      setLastActivity(Date.now());
      setIsVisible(true);
      setIsTyping(true);
    }
  }, [position]);

  // Handle keyboard events to update activity
  useEffect(() => {
    const handleKeyDown = () => {
      setLastActivity(Date.now());
      setIsVisible(true);
      setIsTyping(true);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isActive || !position) return null;

  return (
    <div
      className={`absolute w-[2px] h-[1.2em] transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isTyping ? 'writing-cursor-active' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: color,
        transform: 'translateY(-50%)'
      }}
    />
  );
};