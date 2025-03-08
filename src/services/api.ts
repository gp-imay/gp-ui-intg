// import { ApiBeat } from '../types/beat';
import { ApiBeat, GeneratedScenesResponse, Scenes } from '../types/beats';


const API_BASE_URL = 'http://localhost:8000/api/v1';


// "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6ImJPb1NwQjZjMEVUNmpVMmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2hhd3Zna2lybG1kZ2JkbXV0dXFoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQwMjI4MDg5LCJpYXQiOjE3NDAyMjQ0ODksImVtYWlsIjoiaW1heWF5b2dpQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJpbWF5YXlvZ2lAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkltYXlhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0MDIyNDQ4OX1dLCJzZXNzaW9uX2lkIjoiMzQyYWVjYmQtOTY5ZS00NmVhLTgwMjgtOTI1MGMzMmIxNzA5IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.dmSajuU1VxXEzo8qIjO4F8OOEtVe6Hs3nU-z96IzE6Q",
const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImJPb1NwQjZjMEVUNmpVMmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2hhd3Zna2lybG1kZ2JkbXV0dXFoLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQxNDY1ODY5LCJpYXQiOjE3NDE0NjIyNjksImVtYWlsIjoiaW1heWF5b2dpQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJpbWF5YXlvZ2lAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkltYXlhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI3MGJiZDRlMy1kNWRjLTQzMDMtYTcyYy02YjM0YjNiNGQ0MWYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc0MTQ2MjI2OX1dLCJzZXNzaW9uX2lkIjoiNzI4Mzk0YjktNmEwNi00MzJkLTg3NjktOWQzN2EyNTU0MjE1IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.L8sK_s36_K9vXM3KcIat31gZZd1FFzv4mjOtY7wEDUo';
interface UpdateBeatPayload {
  beat_title: string;
  beat_description: string;
  beat_act: string;
}

// Interface for the Act Scene Generation request
interface GenerateScenesForActPayload {
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



};
