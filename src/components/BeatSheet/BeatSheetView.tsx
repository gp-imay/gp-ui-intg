import React, { useEffect, useRef, useState } from 'react';
import { RefreshCcw, AlertCircle, FileText } from 'lucide-react';
import { BeatCard } from './BeatCard';
import { ScenePanel } from './ScenePanel';
import { BeatArrows } from './BeatArrows';
import { useStoryStore } from '../../store/storyStore';
import { Beat, GeneratedScenesResponse } from '../../types/beats';

const ACTS = ['Act 1', 'Act 2A', 'Act 2B', 'Act 3'] as const;

interface BeatSheetViewProps {
  title?: string;
  onSwitchToScript?: () => void;
}

export function BeatSheetView({ title = "Untitled Screenplay", onSwitchToScript }: BeatSheetViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  
  const { 
    premise, 
    beats, 
    fetchBeats, 
    updateBeat, 
    updateBeatPosition, 
    validateBeat, 
    generateScenes, 
    generateScenesForAct,
    isGeneratingActScenes,
    actGenerationErrors
  } = useStoryStore();

  const allBeatsHaveScenes = true;

  useEffect(() => {
    console.log('Current beats:', beats);
    if (!premise) {
      useStoryStore.getState().setPremise(title || "Untitled Screenplay");
    }
    if (beats.length === 0) {
      console.log('Fetching beats...');
      fetchBeats();
    }
  }, [premise, beats.length, fetchBeats, title]);

  // Measure header height dynamically
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, []);

  const handleGenerateScript = () => {
    console.log('Generating script...');
    if (onSwitchToScript) {
      onSwitchToScript();
    }
  };

  const handleGenerateScenes = async (beatId: string): Promise<GeneratedScenesResponse> => {
    try {
      return await generateScenes(beatId);
    } catch (error) {
      throw error;
    }
  };

  const handleShowScenes = (beat: Beat) => {
    console.log('handleShowScenes called with beat:', beat);
    console.log('Current selectedBeat:', selectedBeat);
    setSelectedBeat(selectedBeat?.id === beat.id ? null : beat);
    console.log('Updated selectedBeat:', selectedBeat?.id === beat.id ? null : beat);
  };

  const handleGenerateScenesForAct = (act: Beat['act']) => {
    generateScenesForAct(act);
  };

  const beatsByAct = ACTS.map(act => ({
    act,
    beats: beats.filter(beat => beat.act === act)
  }));

  console.log('beatsByAct:', beatsByAct);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Generate Script button on top */}
      <div ref={headerRef} className="p-4 flex justify-center bg-white border-b">
        <div className="relative">
          <button
            onClick={allBeatsHaveScenes ? handleGenerateScript : undefined}
            onMouseEnter={() => !allBeatsHaveScenes && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
              allBeatsHaveScenes
                ? 'text-white bg-green-600 hover:bg-green-700'
                : 'text-gray-500 bg-gray-200 cursor-not-allowed'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Script
          </button>
          
          {showTooltip && !allBeatsHaveScenes && (
            <div className="absolute right-0 transform top-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50 animate-fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>Generate scenes for all beats before generating the script</span>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full h-2 w-2 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {/* Main content with acts sidebar and beats canvas */}
        <div className="h-full flex">
          {/* Acts sidebar */}
          <div className="w-[200px] flex-shrink-0 border-r bg-gray-50 overflow-y-auto">
            {ACTS.map((act) => (
              <div 
                key={act} 
                className="h-[220px] flex items-center justify-center border-b last:border-b-0 font-medium text-gray-600 relative"
              >
                <div className="text-center">
                  {act}
                  {actGenerationErrors[act] && (
                    <div className="absolute top-2 left-2 right-2 p-2 text-xs text-red-600 bg-red-50 rounded-md flex items-center">
                      <AlertCircle className="w-3 h-3 flex-shrink-0 mr-1" />
                      <span className="truncate">{actGenerationErrors[act]}</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleGenerateScenesForAct(act)}
                    disabled={isGeneratingActScenes[act]}
                    className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs ${
                      isGeneratingActScenes[act] 
                        ? 'text-gray-500 bg-gray-100' 
                        : 'text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50'
                    } whitespace-nowrap px-2 py-1 rounded-full shadow-sm border border-blue-100 flex items-center justify-center gap-1 min-w-24`}
                  >
                    {isGeneratingActScenes[act] ? (
                      <>
                        <RefreshCcw className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Scenes For Act'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Beats canvas */}
          <div
            ref={canvasRef}
            className={`flex-1 overflow-y-auto transition-all duration-300 ${
              selectedBeat ? 'pr-96' : ''
            }`}
          >
            {beatsByAct.map(({ act, beats: actBeats }) => (
              <div 
                key={act} 
                className="h-[220px] relative border-b last:border-b-0 flex overflow-x-auto"
                style={{ minWidth: actBeats.length * 320 + 40 }}
              >
                {actBeats.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 flex-1">
                    No beats for {act}
                  </div>
                ) : (
                  <>
                    {actBeats.map((beat) => (
                      <BeatCard
                        key={beat.id}
                        beat={beat}
                        onUpdate={updateBeat}
                        onPositionChange={updateBeatPosition}
                        onValidate={validateBeat}
                        onGenerateScenes={handleGenerateScenes}
                        onShowScenes={(event) => {
                          // event.preventDefault();
                          handleShowScenes(beat);
                        }}
                        isSelected={selectedBeat?.id === beat.id}
                      />
                    ))}
                    <BeatArrows beats={actBeats} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scene Panel (Fixed Right Sidebar) */}
        {selectedBeat && (
          <div
            className="w-96 border-l bg-white overflow-y-auto fixed right-0 z-10"
            style={{
              top: `${headerHeight}px`,
              height: `calc(100vh - ${headerHeight}px)`,
            }}
          >
            <ScenePanel
              beat={selectedBeat}
              onClose={() => setSelectedBeat(null)}
              onUpdate={(scenes) => {
                updateBeat(selectedBeat.id, { scenes });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}