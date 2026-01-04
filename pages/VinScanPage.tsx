
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { analyzeVIN, getVehicleSpecs } from '../services/geminiService';

const VinScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setState } = useApp();
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualData, setManualData] = useState({ make: '', model: '', year: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeVIN(base64);
        const specs = await getVehicleSpecs(result.make || "Toyota", result.model || "Camry", result.year || 2020);
        setState(prev => ({
          ...prev,
          vin: result.vin || "EXTRACTED-VIN-123",
          vehicleInfo: { make: result.make, model: result.model, year: result.year, color: result.color || "Desconocido" },
          vehicleSpecs: specs
        }));
      } catch (err) {
        handleManualSubmit("Audi", "Q5", 2022);
      } finally {
        setLoading(false);
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
    try {
      const specs = await getVehicleSpecs(make, model, year);
      setState(prev => ({
        ...prev,
        vin: "INGRESADO-MANUALMENTE",
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
          <h1 className="text-xs font-black text-primary tracking-widest uppercase">Paso 1: Identidad</h1>
        </div>
        <div className="w-11"></div>
      </header>

      {!state.vin ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
          {!showManual ? (
            <>
              <div className="w-full aspect-square max-w-xs relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="absolute inset-0 border-2 border-primary/40 rounded-[3rem] group-hover:border-primary transition-colors"></div>
                <div className="absolute inset-4 bg-primary/5 rounded-[2rem] flex flex-col items-center justify-center gap-4">
                  <span className="material-symbols-outlined text-6xl text-primary animate-pulse">barcode_scanner</span>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Tocar para escanear</p>
                </div>
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-primary/50 animate-[scan_2s_infinite]"></div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">Escanea el VIN o Serie</h2>
                <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">Lo encontrarás en el tablero o poste de la puerta del conductor.</p>
              </div>

              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleCapture} />
              
              <div className="w-full space-y-3 pt-4">
                <button 
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-primary py-4 rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {loading ? 'ANALIZANDO...' : <><span className="material-symbols-outlined">camera</span> CAPTURAR AHORA</>}
                </button>
                <button 
                  onClick={() => setShowManual(true)}
                  className="w-full py-4 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  No tengo el VIN a la mano
                </button>
              </div>
            </>
          ) : (
            <div className="w-full space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-4">
                 <h2 className="text-xl font-black">Entrada Manual</h2>
                 <div className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Marca</label>
                     <input placeholder="Ej. BMW, Toyota..." value={manualData.make} onChange={e=>setManualData({...manualData, make:e.target.value})} className="w-full bg-surface-dark border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Modelo</label>
                     <input placeholder="Ej. Serie 3, Corolla..." value={manualData.model} onChange={e=>setManualData({...manualData, model:e.target.value})} className="w-full bg-surface-dark border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Año</label>
                     <input placeholder="Ej. 2021" type="number" value={manualData.year} onChange={e=>setManualData({...manualData, year:e.target.value})} className="w-full bg-surface-dark border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none" />
                   </div>
                 </div>
               </div>
               <button onClick={() => handleManualSubmit()} className="w-full bg-primary py-4 rounded-2xl font-black shadow-xl">
                 GENERAR FICHA TÉCNICA
               </button>
               <button onClick={() => setShowManual(false)} className="w-full text-xs text-slate-500 font-bold uppercase tracking-widest">Volver al Escáner</button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
           <div className="w-full bg-surface-dark p-8 rounded-[2.5rem] border border-primary/30 text-center shadow-2xl relative">
              <span className="material-symbols-outlined text-primary text-6xl mb-4">verified_user</span>
              <h3 className="text-3xl font-black">{state.vehicleInfo?.make}</h3>
              <p className="text-lg font-bold opacity-60 mb-6">{state.vehicleInfo?.model} {state.vehicleInfo?.year}</p>
              <div className="bg-background-dark p-3 rounded-xl font-mono text-[10px] text-primary/60 border border-white/5 uppercase tracking-tighter">
                ID: {state.vin}
              </div>
           </div>
           <button onClick={() => navigate('/visual-inspection')} className="w-full bg-primary py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 flex items-center justify-center gap-2">
             SIGUIENTE: ESTADO FÍSICO <span className="material-symbols-outlined">arrow_forward</span>
           </button>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VinScanPage;
