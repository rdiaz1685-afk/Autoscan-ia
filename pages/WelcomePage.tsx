
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const WelcomePage: React.FC = () => {
  const [name, setName] = useState("");
  const { setState } = useApp();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) return;
    localStorage.setItem('autoscan_user', name);
    setState(prev => ({ ...prev, userName: name }));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col p-8 justify-center items-center">
      <div className="size-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_20px_rgba(19,127,236,0.3)]">
        <span className="material-symbols-outlined text-primary text-5xl">auto_videocam</span>
      </div>
      <h1 className="text-4xl font-black text-center mb-4 tracking-tighter">AutoScan <span className="text-primary">AI</span></h1>
      <p className="text-slate-400 text-center mb-12">Diagnóstico inteligente para el futuro automotriz.</p>
      
      <div className="w-full max-w-xs space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-primary px-1">¿Cómo te llamas?</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Introduce tu nombre"
            className="w-full bg-surface-dark border-none rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"
          />
        </div>
        <button 
          onClick={handleStart}
          className="w-full bg-primary py-4 rounded-xl font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all"
        >
          Comenzar Experiencia
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
