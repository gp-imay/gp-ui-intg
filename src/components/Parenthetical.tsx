import React from 'react';

interface ParentheticalProps {
  content: string;
  onChange: (content: string) => void;
}

export const Parenthetical: React.FC<ParentheticalProps> = ({ content, onChange }) => {
  return (
    <input
      type="text"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-[30%] mx-auto px-4 py-1 font-courier text-sm italic bg-white border-none outline-none block"
      placeholder="(beat)"
    />
  );
};