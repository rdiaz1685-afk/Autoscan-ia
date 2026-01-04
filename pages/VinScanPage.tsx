
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const VisualInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setState } = useApp();
  
  // Obtenemos el paso actual del estado global para persistencia
  const currentStep = state.currentPhotoStep || 0;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const photosNeeded = [
    "Frente del Auto", 
    "Lado Derecho", 
    "Parte Trasera", 
    "Lado Izquierdo", 
    "Neumáticos", 
    "Tablero / Odómetro"
  ];

  // Si ya se completaron todas las fotos, navegar a la siguiente fase
  useEffect(() => {
    if (currentStep >= photosNeeded.length) {
      navigate('/guided-inspection');
    }
  }, [currentStep, navigate, photosNeeded.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = () => {
    if (!previewUrl) return;

    // Guardamos la foto y avanzamos el contador de pasos global
    setState(prev => ({
      ...prev,
      exteriorPhotos: [...(prev.exteriorPhotos || []), previewUrl],
      currentPhotoStep: (prev.currentPhotoStep || 0) + 1
    }));

    setPreviewUrl(null);
  };

  return (
    <div className="relative h-screen bg-black text-white flex flex-col overflow-hidden">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
        {previewUrl ? (
          <img src={previewUrl} className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" alt="Preview" />
        ) : (
          <div className="text-center opacity-20">
            <span className="material-symbols-outlined text-9xl">photo_camera</span>
            <p className="text-xs font-black uppercase tracking-widest mt-4">Esperando captura...</p>
          </div>
        )}
      </div>
      
      <header className="relative z-50 p-6 pt-12 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate('/scan-vin')} 
          className="size-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-md"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">Paso {currentStep + 1} de {photosNeeded.length}</p>
          <h2 className="text-lg font-black tracking-tight">{photosNeeded[currentStep]}</h2>
        </div>
        <div className="w-11"></div>
      </header>

      <div className="mt-auto relative z-50 p-8 pb-12 bg-gradient-to-t from-black via-black/90 to-transparent">
        {!previewUrl ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-full gap-1 mb-2">
              {photosNeeded.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= currentStep ? 'bg-primary shadow-[0_0_8px_rgba(19,127,236,0.5)]' : 'bg-white/20'}`}></div>
              ))}
            </div>
            <p className="text-sm text-slate-400 text-center max-w-[250px]">
              Toma una foto del <span className="text-white font-bold">{photosNeeded[currentStep].toLowerCase()}</span>.
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="size-20 rounded-full border-4 border-white/30 p-1 active:scale-90 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-3xl">camera</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-8">
            <p className="text-center text-xs font-bold text-primary uppercase mb-2 tracking-widest">¿Es aceptable esta foto?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setPreviewUrl(null)} 
                className="flex-1 bg-white/10 py-5 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2 backdrop-blur-md"
              >
                REPETIR
              </button>
              <button 
                onClick={confirmPhoto} 
                className="flex-[2] bg-primary py-5 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-2"
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
