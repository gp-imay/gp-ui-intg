import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { ScriptState, ScriptCreationMethod, ScriptStateValues } from '../types/screenplay';
import { useAlert } from '../components/Alert';

interface UseScriptStateProps {
 scriptId: string;
 onStateChange?: (newState: ScriptState) => void;
}

/**
* Hook for managing script state and transitions
* 
* Provides state, context, actions, and derived UI flags for the script
*/
export function useScriptState({ scriptId, onStateChange }: UseScriptStateProps): ScriptStateValues {
 const [state, setState] = useState<ScriptState>('empty');
 const [context, setContext] = useState<ScriptStateContext>({
   scriptId,
   creationMethod: 'FROM_SCRATCH' as ScriptCreationMethod,
   hasBeats: false,
   scenesCount: 0,
   isComplete: false,
   currentSceneSegmentId: undefined,
   uploadInfo: undefined
 });
 const [isLoading, setIsLoading] = useState(true);
 const [isError, setIsError] = useState(false);
 const { showAlert } = useAlert();
 
 // Use refs to prevent unnecessary re-renders and infinite loops
 const initializationRef = useRef(false);
 const scriptIdRef = useRef(scriptId);

 // Helper function to update the state and trigger onStateChange
 const updateState = useCallback((newState: ScriptState) => {
   setState(newState);
   if (onStateChange) {
     onStateChange(newState);
   }
 }, [onStateChange]);

 // Initialize state based on script data - runs only once or when scriptId changes
 useEffect(() => {
   // Skip if already initialized with this scriptId
   if (!scriptId || (initializationRef.current && scriptIdRef.current === scriptId)) return;
   
   // Update the ref to current scriptId
   scriptIdRef.current = scriptId;

   const initState = async () => {
     setIsLoading(true);
     setIsError(false);

     try {
       // Determine initialization data
       let creationMethod: ScriptCreationMethod = 'FROM_SCRATCH';
       let hasBeats = false;
       let scenesCount = 0;
       let currentSceneId = null;
       
       // For simplicity, use mockApi pattern or simulated state detection
       if (scriptId.includes('ai')) {
         creationMethod = 'WITH_AI';
         hasBeats = true;
         // Assume some scenes might be generated based on ID
         scenesCount = scriptId.includes('scene') ? 1 : 0;
       } else if (scriptId.includes('upload')) {
         creationMethod = 'UPLOAD';
         scenesCount = 1; // Uploaded scripts typically have content
       }

       // Update context with determined state
       setContext({
         scriptId,
         creationMethod,
         hasBeats,
         scenesCount,
         isComplete: false,
         currentSceneSegmentId: currentSceneId,
         uploadInfo: undefined
       });

       // Determine initial state based on script data
       let initialState: ScriptState = 'empty';

       if (creationMethod === 'UPLOAD') {
         initialState = 'uploaded';
       } else if (scenesCount > 1) {
         initialState = 'multipleScenes';
       } else if (scenesCount === 1) {
         initialState = 'firstSceneGenerated';
       } else if (hasBeats) {
         initialState = 'beatsLoaded';
       }

       updateState(initialState);
       initializationRef.current = true;
     } catch (error) {
       console.error('Failed to initialize script state:', error);
       setIsError(true);
       showAlert('error', error instanceof Error ? error.message : 'Failed to load script state');
     } finally {
       setIsLoading(false);
     }
   };

   initState();
 }, [scriptId, showAlert, updateState]);

 // Generate beats handler
 const generateBeats = useCallback(async () => {
   // Mock implementation
   setContext((prev: ScriptStateContext) => ({
     ...prev,
     hasBeats: true
   }));
   updateState('beatsLoaded');
   showAlert('success', 'Story beats generated successfully');
 }, [showAlert, updateState]);

 const generateFirstScene = useCallback(async () => {
   // Mock implementation
   const mockSceneId = `scene-${Date.now()}`;
   setContext(prev => ({
     ...prev,
     scenesCount: 1,
     currentSceneSegmentId: mockSceneId
   }));
   updateState('firstSceneGenerated');
   showAlert('success', 'First scene generated successfully');
   return { scene_segment_id: mockSceneId };
 }, [showAlert, updateState]);

 const generateNextScene = useCallback(async () => {
   // Mock implementation
   const mockSceneId = `scene-${Date.now()}`;
   setContext(prev => ({
     ...prev,
     scenesCount: prev.scenesCount + 1,
     currentSceneSegmentId: mockSceneId
   }));
   updateState('multipleScenes');
   showAlert('success', 'Next scene generated successfully');
   return { scene_segment_id: mockSceneId };
 }, [showAlert, updateState]);

 const markComplete = useCallback(() => {
   setContext((prev: ScriptStateContext) => ({
     ...prev,
     isComplete: true
   }));
   updateState('complete');
   showAlert('success', 'Script marked as complete');
 }, [showAlert, updateState]);

 // Process uploaded script handler 
 const processUploadedScript = useCallback(async (file: File) => {
   // Mock implementation
   setContext((prev: ScriptStateContext) => ({
     ...prev,
     creationMethod: 'UPLOAD',
     uploadInfo: {
       fileType: file.type,
       fileName: file.name,
       uploadDate: new Date().toISOString()
     } as ScriptStateContext['uploadInfo']
   }));
   updateState('uploaded');
   showAlert('success', 'Script uploaded and processed successfully');
 }, [showAlert, updateState]);

 // Derive UI flags based on state and context
 const shouldShowGenerateBeatsButton = context.creationMethod === 'WITH_AI' && state === 'empty';
 const shouldShowGenerateScriptButton = state === 'beatsLoaded';
 const shouldShowGenerateNextSceneButton = state === 'firstSceneGenerated' || (state === 'multipleScenes' && !context.isComplete);
 const canEditBeats = state === 'beatsLoaded' || state === 'empty';
 const canEditScript = true; // Script can always be edited
 const isUploadedScript = context.creationMethod === 'UPLOAD';
 const canReprocessUpload = isUploadedScript && (state === 'empty' || state === 'uploaded');

 // Create actions object with explicit type annotation
 const actions: ScriptStateActions = {
   generateBeats,
   generateFirstScene,
   generateNextScene,
   markComplete,
   processUploadedScript
 };

 // Return the complete state machine
 return {
   state,
   context,
   actions,
   showGenerateBeatsButton: shouldShowGenerateBeatsButton,
   showGenerateScriptButton: shouldShowGenerateScriptButton,
   showGenerateNextSceneButton: shouldShowGenerateNextSceneButton,
   canEditBeats,
   canEditScript,
   isUploadedScript,
   canReprocessUpload
 };
}