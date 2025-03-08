import React from 'react';

interface CharacterProps {
  content: string;
  onChange: (content: string) => void;
}

export const Character: React.FC<CharacterProps> = ({ content, onChange }) => {
  return (
    <input
      type="text"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-[40%] mx-auto px-4 py-2 font-courier text-base uppercase font-semibold bg-white border-none outline-none block"
      placeholder="CHARACTER NAME"
    />
  );
};