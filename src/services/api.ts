// src/services/api.ts
import { ApiBeat, GeneratedScenesResponse, Scenes } from '../types/beats';
import { ScriptElement, ElementType } from '../types/screenplay';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Get the token from the environment or use a default token
// In a real application, this would come from an authentication service
const getToken = () => {
  // This is the token from the existing implementation
  const defaultToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImJPb1NwQjZjMEVUNmpVMmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2hhd3Zna2lybG1kZ2JkbXV0dXFoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQxODEzOTA5LCJpYXQiOjE3NDE4MTAzMDksImVtYWlsIjoiaW1heWF5b2dpQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJpbWF5YXlvZ2lAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkltYXlhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0MTgxMDMwOX1dLCJzZXNzaW9uX2lkIjoiYWVhNzAwZTMtYzVlMC00MTYzLWFhMjQtN2YxNTIxNTRhM2Y3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.6vmWF-mFahaCYHbVt8dL6WMXGoWAu3XIDoc531KyLnc';
  
  // If there's a token in localStorage or session storage, use that instead
  const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  return storedToken || defaultToken;
};

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

export interface SceneSegment {
  id: string;
  beat_id?: string;
  scene_description_id?: string;
  created_at: string;
  updated_at?: string;
  is_deleted: boolean;
  deleted_at?: string;
  components: AISceneComponent[];
}

export interface SegmentListResponse {
  segments: SceneSegment[];
  total: number;
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

// Generate a unique ID for components without an ID
function generateUniqueId(prefix: string = 'comp'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const api = {
  async getBeats(scriptId: string = '73638436-9d3d-4bc4-89ef-9d7b9e5141df'): Promise<ApiBeat[]> {
    try {
      const token = getToken();
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
        const errorText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${errorText || 'Unknown error'}`
        );
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
      const token = getToken();
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
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText || 'Unknown error'}`);
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
      const token = getToken();
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
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText || 'Unknown error'}`);
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
      const token = getToken();
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
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update scene:', error);
      throw error;
    }
  },

  async generateScenesForAct(act: string, scriptId: string = '73638436-9d3d-4bc4-89ef-9d7b9e5141df'): Promise<ActScenesResponse> {
    try {
      const token = getToken();
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
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText || 'Unknown error'}`);
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
      const token = getToken();
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
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText || 'Unknown error'}`);
      }

      const data: SceneSegmentGenerationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate script:', error);
      throw error;
    }
  },

  // New method to fetch script segments
  async getScriptSegments(scriptId: string, skip: number = 0, limit: number = 10): Promise<SegmentListResponse> {
    try {
      const token = getToken();
      console.log(`Fetching script segments for ${scriptId}, skip=${skip}, limit=${limit}`);
      
      const response = await fetch(
        `${API_BASE_URL}/scene-segments/script/${scriptId}?skip=${skip}&limit=${limit}`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        
        try {
          // Try to parse error message from response
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If we can't parse JSON, try to get text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (e2) {
            // If all else fails, use the status code
            console.error('Could not extract error details', e2);
          }
        }
        
        throw new Error(errorMessage);
      }

      // Ensure we handle empty or malformed responses properly
      const responseText = await response.text();
      let data: SegmentListResponse;
      
      try {
        // Try to parse as JSON
        if (responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          console.warn('Empty response from API');
          // Return a valid but empty response object
          data = { segments: [], total: 0 };
        }
      } catch (e) {
        console.error('Failed to parse response as JSON:', e, 'Response was:', responseText);
        // Return a valid but empty response to avoid breaking the app
        data = { segments: [], total: 0 };
      }
      
      // Ensure segments property exists
      if (!data.segments) {
        console.warn('Response missing segments property', data);
        data.segments = [];
      }
      
      // Ensure total property exists
      if (data.total === undefined) {
        data.total = data.segments.length;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch script segments:', error);
      throw error;
    }
  },

  // Convert API scene components to script elements
  convertSceneComponentsToElements(components: AISceneComponent[]): ScriptElement[] {
    return components.map((component, index) => {
      let elementType: ElementType = mapComponentTypeToElementType(component.component_type);
      let content = component.content;

      // Skip standalone CHARACTER components but keep character data for DIALOGUE
      if (component.component_type === 'CHARACTER') {
        return [];
      }

      // Ensure we have a reliable component ID
      const componentId = component.component_id || generateUniqueId(`comp-${index}`);

      // Case 1: DIALOGUE with both character_name and parenthetical
      if (component.component_type === 'DIALOGUE' && component.character_name && component.parenthetical) {
        return [
          // Character element (needed for formatting)
          {
            id: `${componentId}-character`,
            type: 'character' as ElementType,
            content: component.character_name || ''
          },
          // Parenthetical element
          {
            id: `${componentId}-parenthetical-${index}`,
            type: 'parenthetical' as ElementType,
            content: component.parenthetical.trim()
          },
          // Dialogue element
          {
            id: componentId,
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
            id: `${componentId}-parenthetical-${index}`,
            type: 'parenthetical' as ElementType,
            content: parentheticalContent
          },
          {
            id: componentId,
            type: elementType,
            content
          }
        ] as ScriptElement[];
      }

      // Case 3: DIALOGUE with only character_name
      else if (component.component_type === 'DIALOGUE' && component.character_name) {
        return [
          // Character element (needed for formatting)
          {
            id: `${componentId}-character`,
            type: 'character' as ElementType,
            content: component.character_name || ''
          },
          // Dialogue element
          {
            id: componentId,
            type: elementType,
            content
          }
        ] as ScriptElement[];
      }

      // Case 4: Regular element (non-DIALOGUE or DIALOGUE without extras)
      return {
        id: componentId,
        type: elementType,
        content
      } as ScriptElement;
    }).flat(); // Keep character elements this time
  },

  // Convert all scene segments to script elements
  convertSegmentsToScriptElements(segments: SceneSegment[]): ScriptElement[] {
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      console.log('No segments to convert to script elements');
      return [];
    }
    
    const allElements: ScriptElement[] = [];
    
    segments.forEach(segment => {
      // Skip segments with no components or invalid structure
      if (!segment || !segment.components || !Array.isArray(segment.components)) {
        console.warn('Skipping invalid segment:', segment);
        return;
      }
      
      try {
        const segmentElements = this.convertSceneComponentsToElements(segment.components);
        allElements.push(...segmentElements);
      } catch (error) {
        console.error('Error converting segment components to elements:', error, segment);
        // Continue with other segments
      }
    });
    
    if (allElements.length === 0) {
      console.log('No elements were created from the segments');
    }
    
    return allElements;
  }
};