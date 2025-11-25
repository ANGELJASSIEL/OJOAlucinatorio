import React from 'react';
import { X, Cpu, Layers, MapPin } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-display font-bold mb-6 text-white">¿Cómo funciona?</h2>
        
        <div className="space-y-6 text-white/80">
          <p>
            Inspirado en la exhibición <em className="text-cyan-400">Seeing the Invisible</em> de Google Arts & Culture, esta aplicación simula la experiencia de descubrir obras de arte digitales ocultas en espacios físicos.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">El Concepto Original</h3>
                <p className="text-sm mt-1 text-white/60">
                  Tradicionalmente, las exhibiciones de RA usan coordenadas GPS para colocar obras 3D específicas en lugares exactos (como jardines botánicos). Tu teléfono actúa como una ventana para ver estos activos pre-colocados.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Este Experimento de IA</h3>
                <p className="text-sm mt-1 text-white/60">
                  Como estamos en un navegador web sin activos pre-mapeados, esta app usa <strong>IA Generativa (Gemini 2.5)</strong>. En lugar de mostrar arte prefabricado, analiza lo que ve tu cámara y "alucina" entidades invisibles basándose en el contexto visual de tu entorno.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">La Tecnología</h3>
                <p className="text-sm mt-1 text-white/60">
                  Usamos la <strong>API MediaStream</strong> para la cámara y <strong>Gemini 2.5 Flash</strong> para procesar los datos visuales y generar la historia, descripción visual y significado del arte "invisible" en tiempo real.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};