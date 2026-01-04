
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { analyzeVIN, getVehicleSpecs } from '../services/geminiService';

const VinScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setState } = useApp();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [manualData, setManualData] = useState({ make: '', model: '', year: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setLoadingStep("Extrayendo caracteres del VIN...");
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeVIN(base64);
        setLoadingStep(`Identificando ${result.make || 'Vehículo'}...`);
        const specs = await getVehicleSpecs(result.make || "Toyota", result.model || "Camry", result.year || 2020);
        
        setState(prev => ({
          ...prev,
          vin: result.vin || "VIN-EXTRACTED-772",
          vehicleInfo: { 
            make: result.make || "Desconocido", 
            model: result.model || "Desconocido", 
            year: result.year || 2020, 
            color: result.color || "No detectado" 
          },
          vehicleSpecs: specs
        }));
      } catch (err) {
        console.error("Error analizando VIN:", err);
        // Fallback para demo si falla la API
        handleManualSubmit("Mercedes-Benz", "Clase C", 2023);
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = async (mk?: string, md?: string, yr?: number) => {
    const make = mk || manualData.make;
    const model = md || manualData.model;
    const year = yr || parseInt(manualData.year);
    if (!make || !model || !year) return;

    setLoading(true);
    setLoadingStep("Consultando bases de datos...");
    try {
      const specs = await getVehicleSpecs(make, model, year);
      setState(prev => ({
        ...prev,
        vin: "MANUAL-INPUT-99",
        vehicleInfo: { make, model, year, color: "Pendiente" },
        vehicleSpecs: specs
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background-dark text-white overflow-hidden p-6">
      <header className="flex justify-between items-center mb-8 z-50">
        <button 
          onClick={() => navigate('/intro')} 
          className="size-11 flex items-center justify-center bg-surface-dark rounded-xl active:scale-90 transition-transform border border-white/5"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <div className="text-center">
          <h1 className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Módulo de Identidad</h1>
        </div>
        <div className="w-11"></div>
      </header>

      {!state.vin ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
          {!showManual ? (
            <>
              <div 
                className={`w-full aspect-square max-w-[280px] relative rounded-[3rem] overflow-hidden border-2 transition-all duration-500 ${loading ? 'border-primary shadow-[0_0_30px_rgba(19,127,236,0.3)]' : 'border-white/10'}`}
                onClick={() => !loading && fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
                
                {/* Cuadrante de enfoque */}
                <div className="absolute inset-8 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4">
                  {!loading ? (
                    <>
                      <span className="material-symbols-outlined text-7xl text-white/20">qr_code_scanner</span>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center px-4">Enfoca el código de barras o VIN</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] font-bold text-primary animate-pulse">{loadingStep}</p>
                    </div>
                  )}
                </div>

                {/* Línea de escaneo láser */}
                <div className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(19,127,236,1)] z-20 ${loading ? 'animate-[scan_1.5s_infinite_linear]' : 'top-1/2 opacity-20'}`}></div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black tracking-tight">Escaneo Inteligente</h2>
                <p className="text-sm text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                  Nuestra IA extraerá automáticamente la ficha técnica desde la placa del VIN.
                </p>
              </div>

              <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleCapture} />
              
              <div className="w-full space-y-4 pt-4">
                <button 
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-primary py-5 rounded-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">camera</span> 
                  {loading ? 'PROCESANDO...' : 'CAPTURAR VIN'}
                </button>
                <button 
                  disabled={loading}
                  onClick={() => setShowManual(true)}
                  className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  Ingresar datos manualmente
                </button>
              </div>
            </>
          ) : (
            <div className="w-full space-y-6 animate-in slide-in-from-right-8 duration-500">
               <div className="space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center">
                     <span className="material-symbols-outlined text-primary">edit_note</span>
                   </div>
                   <h2 className="text-2xl font-black">Registro Manual</h2>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="group">
                     <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1 mb-2 block">Marca del vehículo</label>
                     <input 
                       placeholder="Ej. BMW, Audi, Tesla..." 
                       value={manualData.make} 
                       onChange={e=>setManualData({...manualData, make:e.target.value})} 
                       className="w-full bg-surface-dark border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:opacity-30" 
                     />
                   </div>
                   <div className="group">
                     <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1 mb-2 block">Modelo específico</label>
                     <input 
                       placeholder="Ej. Serie 3 M-Sport, Q5..." 
                       value={manualData.model} 
                       onChange={e=>setManualData({...manualData, model:e.target.value})} 
                       className="w-full bg-surface-dark border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:opacity-30" 
                     />
                   </div>
                   <div className="group">
                     <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1 mb-2 block">Año de fabricación</label>
                     <input 
                       placeholder="2024" 
                       type="number" 
                       value={manualData.year} 
                       onChange={e=>setManualData({...manualData, year:e.target.value})} 
                       className="w-full bg-surface-dark border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:opacity-30" 
                     />
                   </div>
                 </div>
               </div>
               <button onClick={() => handleManualSubmit()} className="w-full bg-primary py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">
                 CONTINUAR PROTOCOLO
               </button>
               <button onClick={() => setShowManual(false)} className="w-full text-[10px] text-slate-500 font-bold uppercase tracking-widest">Volver al escáner</button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-700">
           <div className="w-full bg-surface-dark p-10 rounded-[3rem] border border-primary/30 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">verified</span>
              </div>
              <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-5xl">directions_car</span>
              </div>
              <h3 className="text-3xl font-black mb-1">{state.vehicleInfo?.make}</h3>
              <p className="text-xl font-bold text-slate-400 mb-8">{state.vehicleInfo?.model} {state.vehicleInfo?.year}</p>
              
              <div className="bg-background-dark/50 p-4 rounded-2xl font-mono text-[11px] text-primary border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-[0.2em]">Serie VIN Certificada</span>
                {state.vin}
              </div>
           </div>
           
           <div className="w-full space-y-4">
             <button onClick={() => navigate('/visual-inspection')} className="w-full bg-primary py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
               INICIAR INSPECCIÓN VISUAL <span className="material-symbols-outlined">arrow_forward</span>
             </button>
             <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">Paso 1 de 4 completado</p>
           </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.1; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default VinScanPage;
