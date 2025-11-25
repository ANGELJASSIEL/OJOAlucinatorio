import React, { useState } from 'react';
import { Intro } from './components/Intro';
import { ARView } from './components/ARView';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>('intro');

  const handleStart = () => {
    setMode('scanner');
  };

  const handleBack = () => {
    setMode('intro');
  };

  return (
    <div className="w-full h-full min-h-screen bg-black">
      {mode === 'intro' && (
        <Intro 
          onStart={handleStart} 
          onAbout={() => {}} 
        />
      )}
      
      {mode === 'scanner' && (
        <ARView onBack={handleBack} />
      )}
    </div>
  );
}

export default App;