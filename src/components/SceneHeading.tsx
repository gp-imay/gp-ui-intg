import React from 'react';

interface SceneHeadingProps {
  content: string;
  onChange: (content: string) => void;
}

export const SceneHeading: React.FC<SceneHeadingProps> = ({ content, onChange }) => {
  return (
    <input
      type="text"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 font-courier text-lg uppercase font-bold bg-white border-none outline-none"
      placeholder="INT. LOCATION - TIME"
    />
  );
};