import React from 'react';
import { Eye, Sparkles } from 'lucide-react';

interface IntroProps {
  onStart: () => void;
  onAbout: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 uppercase">
            OJO ALUCINATORIO<br />ONLINE
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-[0.2em]">Experimento de Realidad Aumentada</p>
        </div>

        <p className="text-white/80 leading-relaxed">
          El mundo está lleno de arte que no puedes ver. Usa tu dispositivo para revelar las entidades invisibles, estructuras y recuerdos ocultos en los espacios vacíos a tu alrededor.
        </p>

        <div className="flex flex-col w-full space-y-4 pt-8">
          <button
            onClick={onStart}
            className="group relative w-full py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Iniciar Escáner <Sparkles size={18} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-[10px] text-white/20">
        Impulsado por Google Gemini 2.5
      </div>
    </div>
  );
};