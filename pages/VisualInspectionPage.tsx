
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const VisualInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setState } = useApp();
  const [step, setStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const photosNeeded = [
    "Frente del Auto", 
    "Lado Derecho", 
    "Parte Trasera", 
    "Lado Izquierdo", 
    "Neumáticos", 
    "Interior / Tablero"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Simular un pequeño delay para que el usuario vea la foto capturada antes de pasar al siguiente
      setTimeout(() => {
        if (step < photosNeeded.length - 1) {
          setStep(step + 1);
          setPreviewUrl(null);
        } else {
          setState(prev => ({ ...prev, status: 'inspecting' }));
          navigate('/guided-inspection');
        }
      }, 800);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Input oculto que invoca la cámara nativa en móviles */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" 
           style={{ 
             backgroundImage: previewUrl ? `url(${previewUrl})` : 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000")',
             opacity: previewUrl ? 1 : 0.4 
           }}>
      </div>
      
      <header className="relative z-50 p-4 pt-10 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <button 
          onClick={() => navigate('/scan-vin')} 
          className="size-11 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md active:scale-90 transition-transform border border-white/20"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-0.5">Captura Visual</p>
          <h2 className="text-sm font-bold">{photosNeeded[step]}</h2>
        </div>
        <div className="w-11"></div>
      </header>

      <div className="flex-1 relative flex items-center justify-center p-6">
        {!previewUrl && (
          <div className="w-full max-w-md aspect-[4/3] border-2 border-primary/50 rounded-2xl relative animate-pulse">
            <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="material-symbols-outlined text-primary/30 text-6xl">photo_camera</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 p-6 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent space-y-6">
        <div className="flex justify-center gap-1.5">
          {photosNeeded.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(19,127,236,1)]' : 'bg-white/20'}`}></div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-6 text-center font-medium">
            {previewUrl ? '¡Foto capturada!' : `Alinea el vehículo para capturar el ${photosNeeded[step].toLowerCase()}`}
          </p>
          <button 
            onClick={triggerCamera} 
            className="group relative size-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90"
          >
            <div className="size-16 rounded-full bg-white group-active:bg-primary transition-colors flex items-center justify-center">
               <span className="material-symbols-outlined text-black group-active:text-white">camera</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualInspectionPage;
