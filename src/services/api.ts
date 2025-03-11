// src/services/api.ts
import { ApiBeat, GeneratedScenesResponse, Scenes } from '../types/beats';
import { ScriptElement, ElementType } from '../types/screenplay';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Using the token from the existing implementation
const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImJPb1NwQjZjMEVUNmpVMmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2hhd3Zna2lybG1kZ2JkbXV0dXFoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQxNzI3MzkyLCJpYXQiOjE3NDE3MjM3OTIsImVtYWlsIjoiaW1heWF5b2dpQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJpbWF5YXlvZ2lAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkltYXlhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0MTcyMzc5Mn1dLCJzZXNzaW9uX2lkIjoiMzFiNTNhYmQtYzgzNS00Y2I0LWEwNjItZmZmNDIyZTBjNjllIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.Yf5w9AxEVeJKywZxWKFHd0kV-CVBGhCxuku0Vm3y2I8';

// Interface for the scene segment generation response
export interface ComponentTypeAI {
  HEADING: "HEADING";
  ACTION: "ACTION";
  DIALOGUE: "DIALOGUE";
  CHARACTER: "CHARACTER";
  TRANSITION: "TRANSITION";
}

export interface AISceneComponent {
  component_type: keyof ComponentTypeAI;
  position: number;
  content: string;
  character_name: string | null;
  parenthetical: string | null;
  component_id: string; // Add component_id property
}

export interface GeneratedSceneSegment {
  components: AISceneComponent[];
}

export interface SceneSegmentGenerationResponse {
  success: boolean;
  input_context?: Record<string, any>;
  generated_segment?: GeneratedSceneSegment;
  fountain_text?: string;
  error?: string;
  scene_segment_id?: string;
  creation_method: string;
  message: string;
}

export interface UpdateBeatPayload {
  beat_title: string;
  beat_description: string;
  beat_act: string;
}

// Interface for the Act Scene Generation request
export interface GenerateScenesForActPayload {
  script_id: string;
  act: string;
}

// Interface for Act Scene Generation response
export interface ActScenesResponse {
  success: boolean;
  context: {
    script_id: string;
    script_title: string;
    genre: string;
    act: string;
    total_beats: number;
    existing: Array<{
      beat_id: string;
      beat_title: string;
      start_idx: number;
      end_idx: number;
    }>;
    generated: any[];
    source: string;
  };
  generated_scenes: Scenes[];
}

// Map AI component types to editor element types
function mapComponentTypeToElementType(componentType: keyof ComponentTypeAI): ElementType {
  const typeMap: Record<keyof ComponentTypeAI, ElementType> = {
    'HEADING': 'scene-heading',
    'ACTION': 'action',
    'DIALOGUE': 'dialogue',
    'CHARACTER': 'character',
    'TRANSITION': 'transition'
  };
  return typeMap[componentType] || 'action';
}

export const api = {
  async getBeats(scriptId: string = '73638436-9d3d-4bc4-89ef-9d7b9e5141df'): Promise<ApiBeat[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/beats/${scriptId}/beatsheet`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch beats:', error);
      throw error;
    }
  },

  async updateBeat(beatId: string, payload: UpdateBeatPayload): Promise<ApiBeat> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/beats/${beatId}`,
        {
          method: 'PATCH',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to update beat:', error);
      throw error;
    }
  },

  async generateScenes(beatId: string): Promise<GeneratedScenesResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scene-descriptions/beat`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ beat_id: beatId })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate scenes:', error);
      throw error;
    }
  },
  
  async updateSceneDescription(sceneId: string, scene_detail_for_ui: string): Promise<Scenes> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scene-descriptions/${sceneId}`,
        {
          method: 'PATCH',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ scene_detail_for_ui })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update scene:', error);
      throw error;
    }
  },

  async generateScenesForAct(act: string, scriptId: string = '73638436-9d3d-4bc4-89ef-9d7b9e5141df'): Promise<ActScenesResponse> {
    try {
      const payload: GenerateScenesForActPayload = {
        script_id: scriptId,
        act: act.toLowerCase().replace(' ', '_') // Convert "Act 1" to "act_1"
      };

      const response = await fetch(
        `${API_BASE_URL}/scene-descriptions/act`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate scenes for act:', error);
      throw error;
    }
  },

  async generateScript(scriptId: string = '73638436-9d3d-4bc4-89ef-9d7b9e5141df'): Promise<SceneSegmentGenerationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scene-segments/ai/get-or-generate-first`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ script_id: scriptId })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: SceneSegmentGenerationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate script:', error);
      throw error;
    }
  },

  // Convert API scene components to script elements
  convertSceneComponentsToElements(components: AISceneComponent[]): ScriptElement[] {
    return components.map((component) => {
      let elementType: ElementType = mapComponentTypeToElementType(component.component_type);
      let content = component.content;

      // Case 1: DIALOGUE with both character_name and parenthetical - create three elements
      if (component.component_type === 'DIALOGUE' && component.character_name && component.parenthetical) {
        // Create three separate elements with distinct IDs
        return [
          // Character element
          {
            id: `${component.component_id}-character`,
            type: 'character' as ElementType,
            content: component.character_name || ''
          },
          // Parenthetical element
          {
            id: `${component.component_id}-parenthetical`,
            type: 'parenthetical' as ElementType,
            content: component.parenthetical.trim()
          },
          // Dialogue element
          {
            id: component.component_id,
            type: elementType,
            content
          }
        ] as ScriptElement[];
      }
      
      // Case 2: DIALOGUE with only parenthetical
      else if (component.component_type === 'DIALOGUE' && component.parenthetical) {
        // Create a separate parenthetical element with a derived ID
        const parentheticalContent = component.parenthetical.trim();
        
        return [
          {
            id: `${component.component_id}-parenthetical`,
            type: 'parenthetical' as ElementType,
            content: parentheticalContent
          },
          {
            id: component.component_id,
            type: elementType,
            content
          }
        ] as ScriptElement[];
      }

      // Case 3: DIALOGUE with only character_name
      else if (component.component_type === 'DIALOGUE' && component.character_name) {
        return [
          {
            id: `${component.component_id}-character`,
            type: 'character' as ElementType,
            content: component.character_name || ''
          },
          {
            id: component.component_id,
            type: elementType,
            content
          }
        ] as ScriptElement[];
      }

      // Case 4: Regular element (non-DIALOGUE or DIALOGUE without extras)
      return {
        id: component.component_id,
        type: elementType,
        content
      } as ScriptElement;
    }).flat(); // Flatten the array to handle the cases where we return multiple elements
  }
};