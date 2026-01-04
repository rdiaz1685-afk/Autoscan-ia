
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ObdConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const startConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      navigate('/obd-results');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col p-6 text-slate-900 dark:text-white">
      <header className="flex items-center mb-8 z-50">
        <button 
          onClick={() => navigate('/guided-inspection')} 
          className="size-11 flex items-center justify-center bg-slate-100 dark:bg-surface-dark rounded-xl active:scale-90 transition-transform border border-slate-200 dark:border-white/10"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">Conectar Escáner</h1>
        <div className="w-11"></div>
      </header>

      <div className="flex-1 space-y-8">
        <div className="bg-surface-dark rounded-2xl aspect-[4/3] overflow-hidden relative border border-white/5">
           <img src="https://picsum.photos/seed/obd/400/300" className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
               <span className="material-symbols-outlined text-primary text-4xl">bluetooth</span>
             </div>
           </div>
        </div>

        <div className="space-y-4">
           <h2 className="text-xl font-bold text-center">Configuración del OBD-II</h2>
           {[
             { id: 1, text: "Localiza el puerto bajo el volante." },
             { id: 2, text: "Inserta el escáner Bluetooth firmemente." },
             { id: 3, text: "Enciende el contacto del vehículo (Posición ON)." }
           ].map(step => (
             <div key={step.id} className="flex gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800">
               <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{step.id}</span>
               <p className="text-sm">{step.text}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={startConnect}
          disabled={connecting}
          className="w-full bg-primary py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
        >
          {connecting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
          ) : (
            <><span className="material-symbols-outlined">bluetooth_searching</span> Buscar y Conectar</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ObdConnectPage;
