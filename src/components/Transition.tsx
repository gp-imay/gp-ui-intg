import React from 'react';

interface TransitionProps {
  content: string;
  onChange: (content: string) => void;
}

export const Transition: React.FC<TransitionProps> = ({ content, onChange }) => {
  return (
    <input
      type="text"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-[20%] ml-auto px-4 py-2 font-courier text-base uppercase font-semibold bg-white border-none outline-none block"
      placeholder="CUT TO:"
    />
  );
};