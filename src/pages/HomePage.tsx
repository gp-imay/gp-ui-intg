import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

/**
 * HomePage component serves as the landing page where users can enter a script ID
 * to access the script editor.
 */
export function HomePage() {
  const [scriptId, setScriptId] = useState<string>('73638436-9d3d-4bc4-89ef-9d7b9e5141df');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOpenScript = () => {
    if (!scriptId.trim()) return;
    
    setIsLoading(true);
    
    // Add a small delay to prevent rapid consecutive navigations
    // This helps with preventing potential race conditions
    setTimeout(() => {
      // Navigate to the script editor with the provided ID
      navigate(`/editor/${scriptId}`);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Screenplay Writer</h1>
        </div>
        
        <p className="text-gray-600 mb-6 text-center">
          Enter your script ID below to open the screenplay editor.
        </p>
        
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 text-sm font-medium">Script ID</span>
            <input
              type="text"
              value={scriptId}
              onChange={(e) => setScriptId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter script ID"
            />
          </label>
          
          <button
            onClick={handleOpenScript}
            disabled={isLoading || !scriptId.trim()}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>Loading...</>
            ) : (
              <>
                Open Script
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Default Script ID: 73638436-9d3d-4bc4-89ef-9d7b9e5141df</p>
        </div>
      </div>
    </div>
  );
}