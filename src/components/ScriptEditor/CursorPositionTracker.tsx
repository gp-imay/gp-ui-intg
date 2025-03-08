import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { WritingCursor } from './WritingCursor';

interface CursorPositionTrackerProps {
  editor: Editor | null;
  isActive: boolean;
}

export const CursorPositionTracker: React.FC<CursorPositionTrackerProps> = ({
  editor,
  isActive
}) => {
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor || !isActive) {
      setCursorPosition(null);
      return;
    }

    const updateCursorPosition = () => {
      try {
        const { from } = editor.state.selection;
        const { top, left } = editor.view.coordsAtPos(from);
        
        if (containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          setCursorPosition({
            x: left - containerRect.left,
            y: top - containerRect.top
          });
        }
      } catch (error) {
        setCursorPosition(null);
      }
    };

    // Update position initially
    updateCursorPosition();

    // Update position on selection change
    const handleSelectionUpdate = () => {
      updateCursorPosition();
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    
    // Update position on window resize
    window.addEventListener('resize', updateCursorPosition);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      window.removeEventListener('resize', updateCursorPosition);
    };
  }, [editor, isActive]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <WritingCursor isActive={isActive} position={cursorPosition} />
    </div>
  );
};