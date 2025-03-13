import { supabase } from '../lib/supabase';

export interface Script {
  id: string;
  name: string;
  subtitle?: string;
  genre: string;
  story?: string;
  progress: number;
  created_at: string;
  user_id: string;
}

export interface CreateScriptInput {
  title: string;
  subtitle?: string;
  genre: string;
  story?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Fallback to mock data if API_BASE_URL is not set
const mockScripts: Script[] = [
  {
    id: '1',
    name: 'The Last Horizon',
    genre: 'Action',
    progress: 75,
    created_at: '2024-03-15T10:00:00Z',
    user_id: 'mock-user-1'
  },
  {
    id: '2',
    name: 'Coffee & Dreams',
    genre: 'Comedy',
    progress: 45,
    created_at: '2024-03-14T15:30:00Z',
    user_id: 'mock-user-1'
  },
  {
    id: '3',
    name: 'Neural Path',
    genre: 'Sci-fi',
    progress: 90,
    created_at: '2024-03-13T09:15:00Z',
    user_id: 'mock-user-1'
  }
];

export const mockApi = {
  async getUserScripts(): Promise<Script[]> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to fetch scripts');
    }

    // If API_BASE_URL is not set, return mock data
    if (!API_BASE_URL) {
      console.log('API URL not configured, using mock data');
      return mockScripts;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/scripts/?skip=0&limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Failed to fetch scripts:', {
        error: error.message,
        status: error.status,
        stack: error.stack
      });
      
      // Fallback to mock data on error if in development
      if (import.meta.env.DEV) {
        console.log('Falling back to mock data');
        return mockScripts;
      }
      
      throw error;
    }
  },

  async createScript(input: CreateScriptInput): Promise<Script> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to create a script');
    }

    // If API_BASE_URL is not set, simulate creation with mock data
    if (!API_BASE_URL) {
      const newScript: Script = {
        id: `script-${Date.now()}`,
        name: input.title,
        subtitle: input.subtitle,
        genre: input.genre || 'Unknown',
        story: input.story,
        progress: 0,
        created_at: new Date().toISOString(),
        user_id: session.user.id
      };
      mockScripts.unshift(newScript);
      return newScript;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/scripts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: input.title,
          subtitle: input.subtitle || '',
          genre: input.genre || '',
          story: input.story || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to create script:', {
        error: error.message,
        status: error.status,
        stack: error.stack
      });

      // Fallback to mock data creation on error if in development
      if (import.meta.env.DEV) {
        console.log('Falling back to mock data creation');
        const newScript: Script = {
          id: `script-${Date.now()}`,
          name: input.title,
          subtitle: input.subtitle,
          genre: input.genre || 'Unknown',
          story: input.story,
          progress: 0,
          created_at: new Date().toISOString(),
          user_id: session.user.id
        };
        mockScripts.unshift(newScript);
        return newScript;
      }

      throw error;
    }
  }
};