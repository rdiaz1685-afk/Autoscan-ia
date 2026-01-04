
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const PreliminaryReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col p-4 pb-32">
      <header className="flex items-center justify-between py-4 mb-6 z-50">
        <button 
          onClick={() => navigate('/obd-results')} 
          className="size-11 flex items-center justify-center bg-slate-100 dark:bg-surface-dark rounded-xl active:scale-90 transition-transform border border-slate-200 dark:border-white/10"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="font-black text-xl uppercase tracking-tighter flex-1 text-center pr-10">Ficha Técnica <span className="text-primary">IA</span></h1>
      </header>

      <div className="space-y-6 overflow-y-auto no-scrollbar">
        {/* Header Unit */}
        <div className="bg-surface-dark p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white">{state.vehicleInfo?.year} {state.vehicleInfo?.make}</h2>
            <p className="text-primary font-bold text-lg">{state.vehicleInfo?.model}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5"><span className="material-symbols-outlined text-9xl">settings</span></div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Motor", val: state.vehicleSpecs?.engine || "V6 3.5L", icon: "engine" },
            { label: "Potencia", val: state.vehicleSpecs?.horsepower || "295 HP", icon: "speed" },
            { label: "Tracción", val: state.vehicleSpecs?.driveType || "AWD", icon: "tire_repair" },
            { label: "Transmisión", val: state.vehicleSpecs?.transmission || "Auto 8v", icon: "settings_input_component" }
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-2">
              <span className="material-symbols-outlined text-primary text-sm">{s.icon}</span>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{s.label}</p>
                <p className="text-sm font-bold">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Curiosities Section */}
        <div className="bg-primary/5 border border-primary/20 p-5 rounded-3xl space-y-3">
          <h3 className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">auto_awesome</span> Insider Data
          </h3>
          <ul className="space-y-3">
            {(state.vehicleSpecs?.curiosities || ["Consumo eficiente en ciudad", "Alta durabilidad de transmisión"]).map((c, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-primary">•</span> {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Progress Card */}
        <div className="p-5 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="flex justify-between items-end mb-3">
             <p className="font-bold text-sm">Estado de Auditoría</p>
             <span className="text-2xl font-black text-primary">75%</span>
           </div>
           <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(19,127,236,0.6)]" style={{width: '75%'}}></div>
           </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pb-8">
        <button onClick={() => navigate('/final-report')} className="w-full bg-primary py-4 rounded-xl font-black text-white shadow-2xl shadow-primary/25 flex items-center justify-center gap-3">
           Generar Reporte Final IA <span className="material-symbols-outlined">auto_awesome</span>
        </button>
      </div>
    </div>
  );
};

export default PreliminaryReportPage;
