
import React from 'react';
import { useNavigate } from 'react-router-dom';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white p-6">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="size-10 flex items-center justify-center bg-slate-100 dark:bg-surface-dark rounded-xl active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center text-xs font-bold text-primary uppercase tracking-widest mr-10">Protocolo AutoScan</h2>
      </header>

      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2 tracking-tight">Ruta de <br/><span className="text-primary">Certificación.</span></h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Sigue los pasos para obtener un valor comercial preciso.</p>
      </div>

      <div className="space-y-6 flex-1">
        {[
          { title: "Identidad", desc: "VIN y Ficha Técnica oficial.", icon: "fingerprint", active: true },
          { title: "Estado Físico", desc: "Captura visual y daños estéticos.", icon: "photo_camera", active: false },
          { title: "Validación Legal", desc: "Factura, refrendos y multas.", icon: "gavel", active: false },
          { title: "Salud Mecánica", desc: "Diagnóstico OBD-II y sensores.", icon: "settings_input_component", active: false },
          { title: "Veredicto Final", desc: "Reporte certificado e imprimible.", icon: "verified_user", active: false }
        ].map((step, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className={`flex size-10 items-center justify-center rounded-2xl shrink-0 ${idx === 0 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <span className="material-symbols-outlined text-xl">{step.icon}</span>
            </div>
            <div>
              <h3 className={`text-sm font-bold ${idx === 0 ? 'text-primary' : ''}`}>{step.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <button onClick={() => navigate('/scan-vin')} className="w-full bg-primary py-4 rounded-2xl font-black text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all">
          COMENZAR AHORA
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
