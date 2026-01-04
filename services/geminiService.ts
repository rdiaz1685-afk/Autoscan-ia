
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
    setLoadingStep("INICIANDO SENSORES...");
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        setLoadingStep("ANALIZANDO VIN...");
        const result = await analyzeVIN(base64);
        
        setLoadingStep(`IDENTIFICADO: ${result.make || 'VEHÍCULO'}`);
        const specs = await getVehicleSpecs(result.make || "Desconocido", result.model || "Modelo", result.year || 2024);
        
        setState(prev => ({
          ...prev,
          vin: result.vin || "VIN-DETECTADO-AI",
          vehicleInfo: { 
            make: result.make || "Desconocido", 
            model: result.model || "Desconocido", 
            year: result.year || 2024, 
            color: result.color || "Detectado" 
          },
          vehicleSpecs: specs
        }));
      } catch (err) {
        console.error("Error analizando VIN:", err);
        alert("No se pudo leer el VIN. Por favor intenta de nuevo o ingresa los datos manuales.");
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = async () => {
    if (!manualData.make || !manualData.model || !manualData.year) return;

    setLoading(true);
    setLoadingStep("CONFIGURANDO FICHA TÉCNICA...");
    try {
      const specs = await getVehicleSpecs(manualData.make, manualData.model, parseInt(manualData.year));
      setState(prev => ({
        ...prev,
        vin: "MANUAL-ENTRY",
        vehicleInfo: { 
          make: manualData.make, 
          model: manualData.model, 
          year: parseInt(manualData.year), 
          color: "N/A" 
        },
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
          className="size-11 flex items-center justify-center bg-surface-dark rounded-xl border border-white/5 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <div className="text-center">
          <h1 className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Módulo de Identidad</h1>
        </div>
        <div className="w-11"></div>
      </header>

      {!state.vin ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-10">
          {!showManual ? (
            <>
              <div 
                className={`w-full aspect-square max-w-[300px] relative rounded-[3rem] overflow-hidden border-2 transition-all duration-700 ${loading ? 'border-primary shadow-[0_0_40px_rgba(19,127,236,0.4)]' : 'border-white/10'}`}
                onClick={() => !loading && fileInputRef.current?.click()}
              >
                {/* Fondo dinámico */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
                
                {/* Cuadros de enfoque */}
                <div className="absolute inset-10 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4">
                  {!loading ? (
                    <>
                      <div className="relative">
                        <span className="material-symbols-outlined text-8xl text-white/10">qr_code_scanner</span>
                        <div className="absolute -top-2 -right-2 size-4 bg-primary rounded-full animate-ping"></div>
                      </div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center px-6">Centra el código de barras o placa de VIN</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-5">
                      <div className="size-14 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] font-black text-primary tracking-widest animate-pulse">{loadingStep}</p>
                    </div>
                  )}
                </div>

                {/* Rayo Láser Animado */}
                <div className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(19,127,236,1)] z-20 ${loading ? 'animate-[laser_2s_infinite_linear]' : 'top-1/2 opacity-20'}`}></div>
                
                {/* Decoración en esquinas */}
                <div className="absolute top-6 left-6 size-6 border-t-2 border-l-2 border-primary opacity-50"></div>
                <div className="absolute bottom-6 right-6 size-6 border-b-2 border-r-2 border-primary opacity-50"></div>
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black tracking-tighter">Escaneo Visual AI</h2>
                <p className="text-sm text-slate-400 max-w-[260px] mx-auto leading-relaxed">
                  Utiliza visión artificial para decodificar la historia de este vehículo.
                </p>
              </div>

              <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleCapture} />
              
              <div className="w-full space-y-4 pt-4">
                <button 
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-primary py-5 rounded-2xl font-black shadow-[0_20px_40px_rgba(19,127,236,0.2)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">camera_enhance</span> 
                  {loading ? 'ANALIZANDO...' : 'ESCANEAR AHORA'}
                </button>
                <button 
                  disabled={loading}
                  onClick={() => setShowManual(true)}
                  className="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  O ingresar datos manualmente
                </button>
              </div>
            </>
          ) : (
            <div className="w-full space-y-8 animate-in slide-in-from-bottom-10 duration-500">
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                   <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                     <span className="material-symbols-outlined text-primary">edit_square</span>
                   </div>
                   <div>
                     <h2 className="text-2xl font-black">Registro Manual</h2>
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Protocolo de Emergencia</p>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 focus-within:border-primary transition-colors">
                     <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Marca</label>
                     <input 
                       placeholder="Ej. Porsche" 
                       value={manualData.make} 
                       onChange={e=>setManualData({...manualData, make:e.target.value})} 
                       className="w-full bg-transparent border-none outline-none font-bold placeholder:opacity-20" 
                     />
                   </div>
                   <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 focus-within:border-primary transition-colors">
                     <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Modelo</label>
                     <input 
                       placeholder="Ej. Cayenne Turbo" 
                       value={manualData.model} 
                       onChange={e=>setManualData({...manualData, model:e.target.value})} 
                       className="w-full bg-transparent border-none outline-none font-bold placeholder:opacity-20" 
                     />
                   </div>
                   <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 focus-within:border-primary transition-colors">
                     <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Año</label>
                     <input 
                       placeholder="2024" 
                       type="number" 
                       value={manualData.year} 
                       onChange={e=>setManualData({...manualData, year:e.target.value})} 
                       className="w-full bg-transparent border-none outline-none font-bold placeholder:opacity-20" 
                     />
                   </div>
                 </div>
               </div>
               <button onClick={handleManualSubmit} className="w-full bg-primary py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">
                 VERIFICAR VEHÍCULO
               </button>
               <button onClick={() => setShowManual(false)} className="w-full text-[10px] text-slate-500 font-black uppercase tracking-widest">Regresar al Escáner</button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
           <div className="w-full bg-surface-dark p-12 rounded-[3.5rem] border border-primary/20 text-center shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <span className="material-symbols-outlined text-[120px]">verified</span>
              </div>
              
              <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <span className="material-symbols-outlined text-primary text-6xl">minor_crash</span>
              </div>
              
              <h3 className="text-4xl font-black mb-2 tracking-tighter">{state.vehicleInfo?.make}</h3>
              <p className="text-xl font-bold text-slate-400 mb-10">{state.vehicleInfo?.model} {state.vehicleInfo?.year}</p>
              
              <div className="bg-background-dark p-5 rounded-2xl border border-white/5">
                <p className="text-[8px] text-primary font-black uppercase tracking-[0.3em] mb-2">Certificación VIN AI</p>
                <span className="font-mono text-xs tracking-widest text-white/80">{state.vin}</span>
              </div>
           </div>
           
           <div className="w-full space-y-4">
             <button onClick={() => navigate('/visual-inspection')} className="w-full bg-primary py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
               INICIAR PERITAJE <span className="material-symbols-outlined">arrow_forward</span>
             </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes laser {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VinScanPage;
