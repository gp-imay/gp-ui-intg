import React, { useState } from 'react';
import Xarrow from 'react-xarrows';
import { Beat, GeneratedScenesResponse } from '../../types/beats';
import { BeatCard } from './BeatCard';

interface CanvasProps {
  beats: Beat[];
  onUpdateBeat: (id: string, beat: Partial<Beat>) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onValidateBeat: (id: string) => void;
  onGenerateScenes: (id: string) => Promise<GeneratedScenesResponse>;
  onBeatSelected?: (beat: Beat) => void;
  selectedBeatId?: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({
  beats,
  onUpdateBeat,
  onUpdatePosition,
  onValidateBeat,
  onGenerateScenes,
  onBeatSelected,
  selectedBeatId
}) => {
  // Create a mapping of beat handlers
  const beatHandlers = new Map<string, () => void>();
  
  // Pre-create handlers for each beat to avoid recreation on render
  beats.forEach(beat => {
    if (!beatHandlers.has(beat.id)) {
      beatHandlers.set(beat.id, () => {
        if (onBeatSelected) {
          onBeatSelected(beat);
        }
      });
    }
  });
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      {beats.map((beat) => (
        <BeatCard
          key={beat.id}
          beat={beat}
          onUpdate={onUpdateBeat}
          onPositionChange={onUpdatePosition}
          onValidate={onValidateBeat}
          onGenerateScenes={onGenerateScenes}
          onShowScenes={beatHandlers.get(beat.id) || (() => {})}
          isSelected={selectedBeatId === beat.id}
        />
      ))}
      
      {beats.map((beat, index) => {
        if (index === beats.length - 1) return null;
        return (
          <Xarrow
            key={`${beat.id}-${beats[index + 1].id}`}
            start={`beat-${beat.id}`}
            end={`beat-${beats[index + 1].id}`}
            color="#94a3b8"
            strokeWidth={2}
            path="smooth"
          />
        );
      })}
    </div>
  );
};