import React from 'react';

interface DialogueProps {
  content: string;
  onChange: (content: string) => void;
}

export const Dialogue: React.FC<DialogueProps> = ({ content, onChange }) => {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-[60%] mx-auto px-4 py-2 font-courier text-base bg-white border-none outline-none resize-none block"
      placeholder="Character's dialogue..."
      rows={2}
    />
  );
};