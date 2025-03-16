import { create } from 'zustand';
import { StoryState, Beat, ApiBeat, GeneratedScenesResponse, Scenes } from '../types/beats';

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

// Mock API response for local development to avoid API calls
const createMockApiResponse = (beatId: string): GeneratedScenesResponse => {
  return {
    success: true,
    context: {
      script_title: "Mock Script",
      genre: "Drama",
      beat_position: 1,
      template_beat: {
        name: "Mock Beat",
        position: 1,
        description: "A mock beat description",
        number_of_scenes: 2
      },
      source: "mock"
    },
    generated_scenes: [
      {
        id: `scene-${Date.now()}-1`,
        beat_id: beatId,
        position: 1,
        scene_heading: "INT. LIVING ROOM - DAY",
        scene_description: "A mock scene description",
        scene_detail_for_ui: "INT. LIVING ROOM - DAY: A well-lit living room with modern furniture",
        created_at: new Date().toISOString(),
        updated_at: null,
        is_deleted: false,
        deleted_at: null
      },
      {
        id: `scene-${Date.now()}-2`,
        beat_id: beatId,
        position: 2,
        scene_heading: "EXT. PARK - EVENING",
        scene_description: "Another mock scene description",
        scene_detail_for_ui: "EXT. PARK - EVENING: A quiet park with people walking",
        created_at: new Date().toISOString(),
        updated_at: null,
        is_deleted: false,
        deleted_at: null
      }
    ]
  };
};

export interface StoryStoreState extends StoryState {
  isGeneratingActScenes: Record<Beat['act'], boolean>;
  actGenerationErrors: Record<Beat['act'], string | null>;
}

// Store setup
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
  
  // Fetch beats with safety checks
  fetchBeats: async () => {
    // Check if beats are already loaded to prevent duplicate fetches
    if (get().beats.length > 0) {
      console.log("Beats already loaded, skipping fetch");
      return;
    }

    try {
      // Use local mock data for development to prevent API calls
      const useLocalMock = process.env.NODE_ENV === 'development';
      
      let apiBeats: ApiBeat[];
      
      if (useLocalMock) {
        // Mock data to avoid API calls
        apiBeats = [
          {
            beat_id: 'beat-1',
            beat_title: 'Opening Image',
            beat_description: 'A visual that represents the struggle and tone of the story',
            beat_act: 'act_1',
            script_id: 'mock-script-id',
            position: 1
          },
          {
            beat_id: 'beat-2',
            beat_title: 'Theme Stated',
            beat_description: 'What the story is about is stated',
            beat_act: 'act_1',
            script_id: 'mock-script-id',
            position: 2
          },
          {
            beat_id: 'beat-3',
            beat_title: 'Set-up',
            beat_description: 'Characters and their world before the journey begins',
            beat_act: 'act_1',
            script_id: 'mock-script-id',
            position: 3
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        // Actual API call
        apiBeats = await fetch('/api/beats').then(res => res.json());
      }
      
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
      throw error;
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
      // Check if beat already has scenes
      const currentBeats = get().beats;
      const beatIndex = currentBeats.findIndex(b => b.id === beatId);
      
      if (beatIndex === -1) {
        throw new Error('Beat not found');
      }
      
      if (currentBeats[beatIndex].scenes.length > 0) {
        console.log(`Beat ${beatId} already has scenes, returning existing scenes`);
        return {
          success: true,
          context: {
            script_title: "Existing Script",
            genre: "Drama",
            beat_position: beatIndex + 1,
            template_beat: {
              name: currentBeats[beatIndex].title,
              position: beatIndex + 1,
              description: currentBeats[beatIndex].description,
              number_of_scenes: currentBeats[beatIndex].scenes.length
            },
            source: "local"
          },
          generated_scenes: currentBeats[beatIndex].scenes
        };
      }
      
      // Use mock response for development
      const response = createMockApiResponse(beatId);
      
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

      // Get all beats for this act that don't have scenes
      const beatsForAct = get().beats.filter(beat => 
        beat.act === act && beat.scenes.length === 0
      );
      
      if (beatsForAct.length === 0) {
        console.log(`No beats without scenes for act ${act}`);
        return;
      }
      
      // Generate scenes for each beat in sequence
      const results = await Promise.all(
        beatsForAct.map(beat => get().generateScenes(beat.id))
      );
      
      console.log(`Generated scenes for ${results.length} beats in ${act}`);
      
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