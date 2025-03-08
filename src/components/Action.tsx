import React from 'react';

interface ActionProps {
  content: string;
  onChange: (content: string) => void;
}

export const Action: React.FC<ActionProps> = ({ content, onChange }) => {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 font-courier text-base bg-white border-none outline-none resize-none"
      placeholder="Describe the action..."
      rows={4}
    />
  );
};