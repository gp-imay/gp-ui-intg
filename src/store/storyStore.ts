import { create } from 'zustand';
import { StoryState, Beat, Scene, ApiBeat, GeneratedScenesResponse, Scenes } from '../types/beats';
import { api, ActScenesResponse } from '../services/api';

const mapActFromApi = (apiAct: string): Beat['act'] => {
  const actMap: Record<string, Beat['act']> = {
    'act_1': 'Act 1',
    'act_2a': 'Act 2A',
    'act_2b': 'Act 2B',
    'act_3': 'Act 3'
  };
  return actMap[apiAct.toLowerCase()] || 'Act 1';
};

// Convert from UI format (Act 1) to API format (act_1)
const mapActToApi = (act: Beat['act']): string => {
  const actMap: Record<Beat['act'], string> = {
    'Act 1': 'act_1',
    'Act 2A': 'act_2a',
    'Act 2B': 'act_2b',
    'Act 3': 'act_3'
  };
  return actMap[act];
};

const calculatePosition = (beats: ApiBeat[], currentBeat: ApiBeat): { x: number; y: number } => {
  const actBeats = beats.filter(b => b.beat_act === currentBeat.beat_act);
  const positionInAct = actBeats.findIndex(b => b.beat_id === currentBeat.beat_id);
  return {
    x: positionInAct * 320 + 20,
    y: 20
  };
};

export interface StoryStoreState extends StoryState {
  isGeneratingActScenes: Record<Beat['act'], boolean>;
  actGenerationErrors: Record<Beat['act'], string | null>;
}

export const useStoryStore = create<StoryStoreState>((set, get) => ({
  title: '',
  premise: '',
  beats: [],
  isGeneratingActScenes: {
    'Act 1': false,
    'Act 2A': false,
    'Act 2B': false,
    'Act 3': false
  },
  actGenerationErrors: {
    'Act 1': null,
    'Act 2A': null,
    'Act 2B': null,
    'Act 3': null
  },
  
  setPremise: (premise: string) => set({ premise }),
  
  fetchBeats: async () => {
    try {
      const apiBeats = await api.getBeats();
      const beats: Beat[] = apiBeats.map((apiBeat: ApiBeat) => ({
        id: apiBeat.beat_id,
        title: apiBeat.beat_title,
        description: apiBeat.beat_description,
        category: apiBeat.beat_title,
        act: mapActFromApi(apiBeat.beat_act),
        position: calculatePosition(apiBeats, apiBeat),
        isValidated: false,
        scenes: [],
      }));
      set({ beats });
    } catch (error) {
      console.error('Failed to fetch beats:', error);
    }
  },
  
  addBeat: (beat: Beat) =>
    set((state) => ({ beats: [...state.beats, beat] })),
  
  updateBeat: (id: string, beatUpdate: Partial<Beat>) =>
    set((state) => {
      const updatedBeats: Beat[] = state.beats.map((b) =>
        b.id === id ? { ...b, ...beatUpdate } : b
      );
      return { beats: updatedBeats };
    }),
  
  updateBeatPosition: (id: string, position: { x: number; y: number }) =>
    set((state) => ({
      beats: state.beats.map((b) =>
        b.id === id ? { ...b, position } : b
      ),
    })),
  
  validateBeat: (id: string) =>
    set((state) => ({
      beats: state.beats.map((b) =>
        b.id === id ? { ...b, isValidated: true } : b
      ),
    })),

  generateScenes: async (beatId: string): Promise<GeneratedScenesResponse> => {
    try {
      const response = await api.generateScenes(beatId);
      
      set((state) => {
        const updatedBeats: Beat[] = state.beats.map((b) =>
          b.id === beatId
            ? { 
                ...b, 
                scenes: response.generated_scenes,
                isValidated: true 
              }
            : b
        );
        
        return { beats: updatedBeats };
      });
  
      return response;
    } catch (error) {
      console.error('Failed to generate scenes:', error);
      throw error;
    }
  },
  
  generateScenesForAct: async (act: Beat['act']) => {
    try {
      // Set loading state for this act
      set(state => ({
        isGeneratingActScenes: {
          ...state.isGeneratingActScenes,
          [act]: true
        },
        actGenerationErrors: {
          ...state.actGenerationErrors,
          [act]: null
        }
      }));

      const apiAct = mapActToApi(act);
      const response: ActScenesResponse = await api.generateScenesForAct(apiAct);
      
      if (!response.success) {
        throw new Error('Failed to generate scenes for act');
      }
      
      // Group scenes by beat_id
      const scenesByBeatId = response.generated_scenes.reduce((acc, scene) => {
        if (!acc[scene.beat_id]) {
          acc[scene.beat_id] = [];
        }
        acc[scene.beat_id].push(scene);
        return acc;
      }, {} as Record<string, Scenes[]>);
      
      // Update beats with their respective scenes
      set(state => {
        const updatedBeats = state.beats.map(beat => {
          if (beat.act === act) {
            const beatScenes = scenesByBeatId[beat.id] || [];
            return {
              ...beat,
              scenes: beatScenes,
              isValidated: beatScenes.length > 0
            };
          }
          return beat;
        });
        
        return { beats: updatedBeats };
      });
    } catch (error) {
      // Set error state for this act
      set(state => ({
        actGenerationErrors: {
          ...state.actGenerationErrors,
          [act]: error instanceof Error ? error.message : 'Failed to generate scenes'
        }
      }));
      console.error(`Failed to generate scenes for act ${act}:`, error);
    } finally {
      // Reset loading state
      set(state => ({
        isGeneratingActScenes: {
          ...state.isGeneratingActScenes,
          [act]: false
        }
      }));
    }
  }
}));