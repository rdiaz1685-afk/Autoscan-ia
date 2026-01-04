
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const VisualInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setState } = useApp();
  
  // Usamos el estado global para el paso actual, o empezamos en 0
  const currentStep = state.currentPhotoStep || 0;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const photosNeeded = [
    "Frente del Auto", 
    "Lado Derecho", 
    "Parte Trasera", 
    "Lado Izquierdo", 
    "Neumáticos", 
    "Interior / Tablero"
  ];

  // Si ya terminamos las fotos, redirigir
  useEffect(() => {
    if (currentStep >= photosNeeded.length) {
      navigate('/guided-inspection');
    }
  }, [currentStep]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setIsCapturing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = () => {
    if (!previewUrl) return;

    // Guardamos la foto y avanzamos el paso en el estado global
    setState(prev => ({
      ...prev,
      exteriorPhotos: [...prev.exteriorPhotos, previewUrl],
      currentPhotoStep: currentStep + 1
    }));

    setPreviewUrl(null);
    setIsCapturing(false);

    // Si era la última foto, vamos a la siguiente página
    if (currentStep === photosNeeded.length - 1) {
      setState(prev => ({ ...prev, status: 'inspecting' }));
      navigate('/guided-inspection');
    }
  };

  const retakePhoto = () => {
    setPreviewUrl(null);
    setIsCapturing(false);
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-screen bg-[#0a0f14] text-white flex flex-col overflow-hidden">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      {/* Visor de Cámara / Previsualización */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        {previewUrl ? (
          <img src={previewUrl} className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" alt="Preview" />
        ) : (
          <div className="text-center space-y-4 opacity-30">
            <span className="material-symbols-outlined text-8xl">photo_camera</span>
            <p className="text-xs font-bold uppercase tracking-widest">Listo para capturar</p>
          </div>
        )}
        
        {/* Guías visuales (solo si no hay preview) */}
        {!previewUrl && (
          <div className="absolute inset-10 border border-white/20 rounded-3xl pointer-events-none">
            <div className="absolute top-0 left-0 size-10 border-t-2 border-l-2 border-primary/50 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 size-10 border-b-2 border-r-2 border-primary/50 rounded-br-3xl"></div>
          </div>
        )}
      </div>
      
      {/* Header */}
      <header className="relative z-50 p-6 pt-12 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate('/scan-vin')} 
          className="size-11 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase font-black text-primary tracking-[0.2em] mb-1">Paso {currentStep + 1} de {photosNeeded.length}</p>
          <h2 className="text-lg font-black tracking-tight">{photosNeeded[currentStep]}</h2>
        </div>
        <div className="w-11"></div>
      </header>

      {/* Footer / Controles */}
      <div className="mt-auto relative z-50 p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent">
        {!isCapturing ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-full gap-1 mb-2">
              {photosNeeded.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= currentStep ? 'bg-primary shadow-[0_0_10px_rgba(19,127,236,0.8)]' : 'bg-white/20'}`}></div>
              ))}
            </div>
            <p className="text-sm text-slate-400 text-center max-w-[250px]">
              Toma una foto clara del <span className="text-white font-bold">{photosNeeded[currentStep].toLowerCase()}</span>. No tiene que ser perfecta.
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="size-24 rounded-full border-[6px] border-white/20 flex items-center justify-center active:scale-90 transition-transform"
            >
              <div className="size-18 rounded-full bg-white flex items-center justify-center shadow-2xl">
                <span className="material-symbols-outlined text-black text-4xl">camera_alt</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-10 duration-300">
            <p className="text-center text-xs font-bold text-primary uppercase tracking-widest mb-2">¿La foto es aceptable?</p>
            <div className="flex gap-4">
              <button 
                onClick={retakePhoto} 
                className="flex-1 bg-white/10 backdrop-blur-md py-5 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">refresh</span> REPETIR
              </button>
              <button 
                onClick={confirmPhoto} 
                className="flex-[2] bg-primary py-5 rounded-2xl font-black shadow-2xl shadow-primary/40 flex items-center justify-center gap-2"
              >
                ACEPTAR <span className="material-symbols-outlined">check_circle</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualInspectionPage;
