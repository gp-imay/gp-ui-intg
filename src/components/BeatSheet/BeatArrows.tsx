import React, { useEffect, useState } from 'react';
import Xarrow from 'react-xarrows';
import { Beat } from '../types/beat';

interface BeatArrowsProps {
  beats: Beat[];
}

export const BeatArrows: React.FC<BeatArrowsProps> = ({ beats }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for elements to be mounted
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [beats]);

  if (!mounted) return null;

  return (
    <>
      {beats.map((beat, index) => {
        if (index === beats.length - 1) return null;
        
        const startElement = document.getElementById(`beat-${beat.id}`);
        const endElement = document.getElementById(`beat-${beats[index + 1].id}`);
        
        // Only render arrow if both elements exist
        if (!startElement || !endElement) return null;

        return (
          <Xarrow
            key={`${beat.id}-${beats[index + 1].id}`}
            start={`beat-${beat.id}`}
            end={`beat-${beats[index + 1].id}`}
            color="#94a3b8"
            strokeWidth={2}
            path="straight"
            startAnchor="right"
            endAnchor="left"
            zIndex={0}
            showHead={true}
            headSize={6}
            // Ensure proper positioning
            _cpx1Offset={0}
            _cpx2Offset={0}
            _cpy1Offset={0}
            _cpy2Offset={0}
          />
        );
      })}
    </>
  );
};