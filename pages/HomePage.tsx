
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans">
      <div className="flex items-center px-4 py-6 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-primary/20 rounded-full size-12 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background-dark rounded-full"></div>
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-tighter leading-tight">Agente Autorizado</h2>
            <p className="text-lg font-black leading-tight">{state.userName || 'Inspector'}</p>
          </div>
        </div>
        <button className="size-10 bg-surface-dark rounded-full flex items-center justify-center border border-white/5">
          <span className="material-symbols-outlined text-sm">settings</span>
        </button>
      </div>

      <div className="px-4 pb-2">
        <h1 className="text-3xl font-black leading-[1.1] tracking-tight">
          Nueva <br/>
          <span className="text-primary">Inspección Digital.</span>
        </h1>
        <p className="text-slate-500 text-sm py-4 max-w-[80%]">
          Inicia el protocolo de captura para obtener la ficha técnica y diagnóstico IA.
        </p>
      </div>

      <div className="px-4 py-4">
        <div onClick={() => navigate('/intro')} className="relative w-full rounded-3xl overflow-hidden bg-surface-dark shadow-2xl group cursor-pointer border border-white/5 h-[320px]">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-1000 group-hover:scale-110" 
               style={{backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000")'}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
          <div className="relative flex flex-col items-center justify-end p-8 gap-6 text-center h-full pb-10">
            <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20">
              <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Iniciar Protocolo</h3>
              <p className="text-xs text-slate-400">Escaneo de VIN + Ficha Técnica IA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#111418] border-t border-slate-200 dark:border-white/10 px-6 py-2 flex justify-between items-center z-50 h-20">
        <button className="flex flex-col items-center justify-center gap-1 text-primary">
          <span className="material-symbols-outlined icon-filled">home</span>
          <span className="text-[10px] font-bold">INICIO</span>
        </button>
        <button onClick={() => navigate('/list')} className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px] font-bold">HISTORIAL</span>
        </button>
        <div className="relative -top-8">
          <button onClick={() => navigate('/intro')} className="flex items-center justify-center size-16 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40 rotate-45 active:rotate-90 transition-all">
            <span className="material-symbols-outlined text-3xl -rotate-45">add</span>
          </button>
        </div>
        <button className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">garage</span>
          <span className="text-[10px] font-bold">GARAGE</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">PERFIL</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
