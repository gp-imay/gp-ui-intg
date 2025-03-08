import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  StrikethroughIcon, 
  Type, 
  MessageSquare, 
  Sparkles
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { FormatButton } from './FormatButton';
import { AIMenu } from './AIMenu';

interface EditorToolbarProps {
  editor: Editor | null;
  position: { top: number; left: number };
  onComment: () => void;
  onAIAssist?: () => void;
  showCommentInput: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  position,
  onComment,
  onAIAssist,
  showCommentInput
}) => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const aiButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aiMenuRef.current && 
        !aiMenuRef.current.contains(event.target as Node) &&
        aiButtonRef.current && 
        !aiButtonRef.current.contains(event.target as Node)
      ) {
        setShowAIMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!editor) return null;

  const handleAIAction = (action: string) => {
    // Here you would implement the actual AI action
    console.log(`AI action: ${action}`);
    if (onAIAssist) onAIAssist();
    // Close the menu after selecting an action
    setShowAIMenu(false);
  };

  const formatButtons = [
    {
      icon: Bold,
      title: 'Bold (⌘B)',
      isActive: editor.isActive('bold'),
      action: () => editor.chain().focus().toggleBold().run()
    },
    {
      icon: Italic,
      title: 'Italic (⌘I)',
      isActive: editor.isActive('italic'),
      action: () => editor.chain().focus().toggleItalic().run()
    },
    {
      icon: UnderlineIcon,
      title: 'Underline (⌘U)',
      isActive: editor.isActive('underline'),
      action: () => editor.chain().focus().toggleUnderline().run()
    },
    {
      icon: StrikethroughIcon,
      title: 'Strikethrough',
      isActive: editor.isActive('strike'),
      action: () => editor.chain().focus().toggleStrike().run()
    },
    {
      icon: Type,
      title: 'Uppercase',
      isActive: false,
      action: () => {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);
        editor
          .chain()
          .focus()
          .deleteRange({ from, to })
          .insertContent(text.toUpperCase())
          .run();
      }
    }
  ];

  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg p-1 flex gap-1 z-50 animate-fade-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)'
      }}
    >
      {formatButtons.map((button, index) => (
        <FormatButton
          key={index}
          icon={button.icon}
          title={button.title}
          isActive={button.isActive}
          onClick={button.action}
        />
      ))}
      
      <FormatButton
        icon={MessageSquare}
        title="Add Comment"
        isActive={showCommentInput}
        onClick={onComment}
      />
      
      {onAIAssist && (
        <>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <div className="relative">
            <button
              ref={aiButtonRef}
              onClick={() => setShowAIMenu(!showAIMenu)}
              className={`p-1.5 rounded hover:bg-gray-100 relative ${
                showAIMenu ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
              title="AI Assist"
            >
              <div className="ai-icon-container">
                <div className="ai-icon-pulse"></div>
                <Sparkles className="ai-icon-sparkle w-4 h-4" />
              </div>
            </button>
            
            {showAIMenu && (
              <AIMenu 
                ref={aiMenuRef}
                onAction={handleAIAction}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};