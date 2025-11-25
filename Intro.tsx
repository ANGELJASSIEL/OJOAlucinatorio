import React from 'react';
import { Eye, Sparkles } from 'lucide-react';

interface IntroProps {
  onStart: () => void;
  onAbout: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart, onAbout }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center p-6 bg-black text-white overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 blur-lg opacity-50 rounded-full" />
          <div className="relative bg-black/50 p-6 rounded-full border border-white/10 backdrop-blur-sm">
            <Eye size={48} className="text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-display font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            VISIÓN<br />INVISIBLE
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-[0.2em]">Augmented Reality Experiment</p>
        </div>

        <p className="text-white/80 leading-relaxed">
          The world is full of art you cannot see. Use your device to reveal the invisible entities, structures, and memories hidden in the empty spaces around you.
        </p>

        <div className="flex flex-col w-full space-y-4 pt-8">
          <button
            onClick={onStart}
            className="group relative w-full py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start Scanning <Sparkles size={18} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button
            onClick={onAbout}
            className="text-white/50 text-sm hover:text-white transition-colors"
          >
            ¿Cómo funciona? (How it works)
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-[10px] text-white/20">
        Powered by Google Gemini 2.5
      </div>
    </div>
  );
};