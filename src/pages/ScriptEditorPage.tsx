import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ScriptEditor } from '../components/ScriptEditor';
import { AlertProvider } from '../components/Alert';

/**
 * ScriptEditorPage component that extracts the scriptId from URL parameters
 * and passes it to the ScriptEditor component.
 */
export function ScriptEditorPage() {
  const { scriptId } = useParams<{ scriptId: string }>();
  
  // If no scriptId is provided, redirect to the home page
  if (!scriptId) {
    return <Navigate to="/" replace />;
  }

  return (
    <AlertProvider>
      <ScriptEditor scriptId={scriptId} />
    </AlertProvider>
  );
}