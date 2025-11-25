import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Aperture, RefreshCw, Share2, Loader2, Settings, Save, X } from 'lucide-react';
import { scanForInvisibleEntity, generateEntityVisualization, DEFAULT_PROMPT } from '../services/gemini';
import { ScanResult } from '../types';

interface ARViewProps {
  onBack: () => void;
}

export const ARView: React.FC<ARViewProps> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Stages: 'idle', 'analyzing', 'visualizing', 'done'
  const [scanStage, setScanStage] = useState<'idle' | 'analyzing' | 'visualizing' | 'done'>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Settings / Prompt state
  const [showSettings, setShowSettings] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_PROMPT);
  const [negativePrompt, setNegativePrompt] = useState("texto, marcas de agua, cartoon, dibujo, baja calidad, borroso");
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 }, // Try to get higher res for better AI analysis
            height: { ideal: 1080 }
          },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("No se puede acceder a la cámara. Verifica los permisos.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setScanStage('analyzing');
    setResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Increased quality to 0.95 for better AI detail detection
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.95);

      try {
        // Step 1: Detect/Create the text description
        const entity = await scanForInvisibleEntity(imageBase64, customPrompt);
        
        setScanStage('visualizing');
        
        // Step 2: Generate the visual representations (x4)
        const visualizationUrls = await generateEntityVisualization(entity, imageSize, negativePrompt);

        setResult({
            image: imageBase64,
            entity,
            generatedVisualizations: visualizationUrls.length > 0 ? visualizationUrls : undefined,
            timestamp: Date.now()
        });
        setScanStage('done');
        setShowDetails(true);
      } catch (err) {
        console.error(err);
        setError("Error al comunicar con la dimensión oculta.");
        setScanStage('idle');
      }
    }
  }, [customPrompt, negativePrompt, imageSize]);

  const handleReset = () => {
    setResult(null);
    setShowDetails(false);
    setError(null);
    setScanStage('idle');
  };

  // Rarity Color Helper
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Común': return 'text-gray-400 border-gray-400 from-gray-500/20 to-gray-900/40';
      case 'Raro': return 'text-cyan-400 border-cyan-400 from-cyan-500/20 to-cyan-900/40';
      case 'Legendario': return 'text-amber-400 border-amber-400 from-amber-500/20 to-amber-900/40';
      case 'Artefacto': return 'text-purple-400 border-purple-400 from-purple-500/20 to-purple-900/40';
      default: return 'text-white border-white from-white/20 to-black/40';
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-display">
      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Feed */}
      <div className="absolute inset-0 z-0 bg-runes">
        {!error ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-all duration-1000 ${result ? 'grayscale brightness-50 blur-md' : ''}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/50 p-6 text-center">
            {error}
          </div>
        )}
        {/* Scanlines Overlay */}
        <div className="scanlines opacity-30"></div>
      </div>

      {/* Overlay UI - Scanner HUD */}
      {!result && !error && !showSettings && (
        <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Corner Brackets */}
            <div className="corner-brackets"></div>

            {/* Grid Lines */}
            <div className="w-full h-full border-[20px] border-black/20 box-border relative">
                
                {/* Center Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/30 rounded-full flex items-center justify-center">
                    <div className="w-56 h-56 border border-cyan-500/10 rounded-full animate-pulse-slow" />
                    
                    {/* Sci-fi crosshair marks */}
                    <div className="absolute top-0 text-cyan-500/50 text-[10px] tracking-[0.5em] mt-2">NV-882</div>
                    
                    <div className="w-0.5 h-6 bg-cyan-500/50 absolute top-0" />
                    <div className="w-0.5 h-6 bg-cyan-500/50 absolute bottom-0" />
                    <div className="w-6 h-0.5 bg-cyan-500/50 absolute left-0" />
                    <div className="w-6 h-0.5 bg-cyan-500/50 absolute right-0" />
                </div>

                {/* Data readout decoration */}
                <div className="absolute bottom-24 left-6 text-[10px] text-cyan-500/40 font-mono space-y-1">
                   <div>ISO: 800</div>
                   <div>SPEC: ULTRA</div>
                   <div>GEMINI: ACTIVE</div>
                   <div>RES: {imageSize}</div>
                </div>
            </div>

            {/* Scanning Scanline */}
            {scanStage !== 'idle' && (
                <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.8)] animate-scan z-20" />
            )}
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent">
        <button 
            onClick={onBack}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/10 transition-colors border border-white/10"
        >
            <ArrowLeft size={20} />
        </button>
        
        {/* Status Indicator */}
        <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className={`w-2 h-2 rounded-full ${scanStage === 'idle' ? 'bg-green-500 animate-pulse' : 'bg-cyan-400 animate-ping'}`} />
            {scanStage === 'idle' && 'BUSCANDO ANOMALÍAS'}
            {scanStage === 'analyzing' && 'INTERPRETANDO DATOS...'}
            {scanStage === 'visualizing' && 'GENERANDO IMÁGENES (x4)...'}
        </div>

        <button 
            onClick={() => setShowSettings(true)}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/10 transition-colors border border-white/10"
        >
            <Settings size={20} />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl p-6 flex flex-col animate-[fade-in_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Settings className="text-cyan-400" size={20}/> Calibración de Lente
                </h2>
                <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6">
                {/* Prompt Section */}
                <div>
                    <label className="block text-sm text-cyan-400 mb-2 font-mono uppercase tracking-widest">Prompt del Sistema</label>
                    <p className="text-xs text-white/50 mb-4">Define cómo la IA interpreta la realidad.</p>
                    <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full h-24 bg-zinc-900/50 border border-white/20 rounded-lg p-4 text-white text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                        placeholder="Escribe tus instrucciones aquí..."
                    />
                </div>

                 {/* Negative Prompt Section */}
                 <div>
                    <label className="block text-sm text-red-400 mb-2 font-mono uppercase tracking-widest">Prompt Negativo</label>
                    <p className="text-xs text-white/50 mb-4">Elementos a EXCLUIR de la alucinación.</p>
                    <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="w-full h-20 bg-zinc-900/50 border border-red-900/50 rounded-lg p-4 text-white text-sm font-mono focus:outline-none focus:border-red-500 transition-colors resize-none"
                        placeholder="Ej: texto, borroso, gente..."
                    />
                </div>

                {/* Resolution Section */}
                <div>
                  <label className="block text-sm text-cyan-400 mb-2 font-mono uppercase tracking-widest">Resolución (Gemini 3 Pro)</label>
                  <div className="grid grid-cols-3 gap-2">
                      {(['1K', '2K', '4K'] as const).map((size) => (
                          <button
                              key={size}
                              onClick={() => setImageSize(size)}
                              className={`py-3 px-3 rounded-lg text-sm font-bold transition-all border ${
                                  imageSize === size 
                                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                  : 'bg-zinc-800/50 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                              {size}
                          </button>
                      ))}
                  </div>
                </div>
            </div>

            <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 mt-4 transition-colors shadow-[0_0_20px_rgba(8,145,178,0.4)]"
            >
                <Save size={18} /> Guardar Calibración
            </button>
        </div>
      )}

      {/* Result Card Overlay */}
      {result && result.entity && (
          <div className={`absolute inset-0 z-20 flex flex-col transition-opacity duration-500 bg-black/40 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Generated Visualization Centerpiece - GRID LAYOUT */}
              <div className="flex-1 p-4 flex items-center justify-center overflow-y-auto">
                  <div className={`grid gap-4 w-full max-w-lg ${
                      result.generatedVisualizations && result.generatedVisualizations.length > 1 
                      ? 'grid-cols-2' 
                      : 'grid-cols-1'
                  }`}>
                      {result.generatedVisualizations ? (
                          result.generatedVisualizations.map((imgUrl, index) => (
                             <div key={index} className="relative aspect-square">
                                 <div className={`absolute inset-0 bg-gradient-to-tr ${getRarityColor(result.entity!.rarity).split(' ')[2]} rounded-2xl blur-lg opacity-40`}></div>
                                 <img 
                                     src={imgUrl} 
                                     alt={`Entidad Invisible ${index + 1}`} 
                                     className="relative w-full h-full object-cover rounded-2xl border border-white/20 shadow-xl z-10"
                                 />
                             </div>
                          ))
                      ) : (
                          <div className="col-span-2 aspect-square flex items-center justify-center bg-black/20 backdrop-blur rounded-2xl border border-white/10">
                              <Loader2 className="animate-spin text-white/30" size={48} />
                          </div>
                      )}
                  </div>
              </div>

              {/* Bottom Sheet */}
              <div className="bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl pointer-events-auto shrink-0 z-30">
                  <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                  
                  <div className="flex justify-between items-start mb-2">
                      <div>
                          <span className={`inline-block px-2 py-1 mb-2 text-[10px] uppercase tracking-widest border rounded bg-black/50 ${getRarityColor(result.entity.rarity).split(' ').slice(0, 2).join(' ')}`}>
                              {result.entity.rarity}
                          </span>
                          <h2 className="text-xl font-bold text-white mb-1 leading-tight">{result.entity.title}</h2>
                      </div>
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed font-light mb-4 border-l-2 border-white/20 pl-4 max-h-24 overflow-y-auto">
                      {result.entity.description}
                  </p>

                  <div className="flex gap-3">
                      <button 
                        onClick={handleReset}
                        className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                          <RefreshCw size={18} /> Re-escanear
                      </button>
                      <button className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                          <Share2 size={18} />
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Main Action Button (Only visible when not showing result) */}
      {!result && scanStage === 'idle' && !showSettings && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20 pointer-events-auto">
          <button
            onClick={handleScan}
            className="group relative"
          >
             <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl group-hover:bg-cyan-400/50 transition-all duration-500" />
             <div className="relative w-20 h-20 bg-black/40 backdrop-blur-md rounded-full border border-cyan-400/50 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-100 to-white opacity-100" />
                    <Aperture className="text-cyan-900 relative z-10" size={32} />
                </div>
             </div>
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {scanStage !== 'idle' && scanStage !== 'done' && (
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center z-20 gap-4 pointer-events-none">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-40 animate-pulse"></div>
                <Loader2 className="animate-spin text-cyan-400 w-12 h-12 relative z-10" />
              </div>
              <p className="text-cyan-300 text-sm font-mono tracking-widest animate-pulse uppercase">
                  {scanStage === 'analyzing' ? 'Decodificando Realidad...' : 'Materializando (x4)...'}
              </p>
          </div>
      )}
    </div>
  );
};