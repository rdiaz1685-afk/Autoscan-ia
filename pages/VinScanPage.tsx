
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

  const processImage = async (file: File) => {
    setLoading(true);
    setLoadingStep("PROCESANDO ARCHIVO...");
    const mimeType = file.type || "image/jpeg";
    
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        setLoadingStep("CONECTANDO CON IA...");
        
        const result = await analyzeVIN(base64, mimeType);
        
        if (!result || !result.make) {
          throw new Error("No se pudo identificar la marca del vehículo en la imagen.");
        }

        setLoadingStep(`VEHÍCULO DETECTADO: ${result.make}`);
        const specs = await getVehicleSpecs(result.make, result.model || "Modelo", result.year || 2024);
        
        setState(prev => ({
          ...prev,
          vin: result.vin || "VIN-NO-DETECTADO",
          vehicleInfo: { 
            make: result.make, 
            model: result.model || "Desconocido", 
            year: result.year || 2024, 
            color: result.color || "N/A" 
          },
          vehicleSpecs: specs
        }));
      } catch (err: any) {
        console.error("Scan Error Details:", err);
        const errorMsg = err.message || "Error desconocido";
        alert(`Error en Escaneo: ${errorMsg}\n\nIntenta con una foto más clara o ingresa los datos manualmente.`);
      } finally {
        setLoading(false);
        setLoadingStep("");
      }
    };
    reader.onerror = () => alert("Error al leer el archivo de imagen.");
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleManual = async () => {
    if (!manualData.make || !manualData.model || !manualData.year) return;
    setLoading(true);
    try {
      const specs = await getVehicleSpecs(manualData.make, manualData.model, parseInt(manualData.year));
      setState(prev => ({
        ...prev,
        vin: "MANUAL-REG",
        vehicleInfo: { 
          make: manualData.make, 
          model: manualData.model, 
          year: parseInt(manualData.year), 
          color: "N/A" 
        },
        vehicleSpecs: specs
      }));
    } catch (e) {
      alert("Error al cargar especificaciones manuales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#101922] text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <button onClick={() => navigate('/intro')} className="size-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="text-[10px] font-black text-primary uppercase tracking-widest">Módulo Identidad</h1>
        <div className="w-10"></div>
      </header>

      {!state.vin ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-10">
          {!showManual ? (
            <>
              <div 
                className={`w-full aspect-square max-w-[280px] relative rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-4 transition-all ${loading ? 'border-primary shadow-2xl' : 'border-white/10'}`}
                onClick={() => !loading && fileInputRef.current?.click()}
              >
                {!loading ? (
                  <>
                    <span className="material-symbols-outlined text-7xl text-white/10">qr_code_scanner</span>
                    <p className="text-[9px] font-bold text-slate-500 uppercase text-center px-4">Escanear VIN o Placa</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-primary animate-pulse text-center px-4">{loadingStep}</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-black mb-2 tracking-tighter">Escaneo Visual AI</h2>
                <p className="text-sm text-slate-400">Captura el VIN en el tablero o la tarjeta de circulación.</p>
              </div>

              <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={onFileChange} />
              
              <div className="w-full space-y-4">
                <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="w-full bg-primary py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl">
                  <span className="material-symbols-outlined">camera_enhance</span> 
                  {loading ? 'ANALIZANDO...' : 'CAPTURAR'}
                </button>
                <button onClick={() => setShowManual(true)} className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ingreso Manual</button>
              </div>
            </>
          ) : (
            <div className="w-full space-y-6">
               <h2 className="text-2xl font-black text-center">Registro Manual</h2>
               <div className="space-y-4">
                 {['make', 'model', 'year'].map(f => (
                   <div key={f} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                     <label className="text-[10px] font-black text-primary uppercase block mb-1">{f}</label>
                     <input 
                       value={(manualData as any)[f]} 
                       onChange={e => setManualData({...manualData, [f]: e.target.value})}
                       className="w-full bg-transparent outline-none font-bold capitalize" 
                       placeholder={`Ej. ${f === 'year' ? '2022' : 'Toyota'}`}
                     />
                   </div>
                 ))}
               </div>
               <button onClick={handleManual} className="w-full bg-primary py-5 rounded-2xl font-black">CONTINUAR</button>
               <button onClick={() => setShowManual(false)} className="w-full text-[10px] text-slate-500 uppercase text-center font-bold">Volver al escáner</button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500">
           <div className="w-full bg-white/5 p-10 rounded-[3rem] border border-primary/20 text-center shadow-2xl">
              <span className="material-symbols-outlined text-primary text-6xl mb-4">verified</span>
              <h3 className="text-3xl font-black mb-1">{state.vehicleInfo?.make}</h3>
              <p className="text-slate-400 font-bold mb-6">{state.vehicleInfo?.model} {state.vehicleInfo?.year}</p>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[10px] tracking-widest uppercase">{state.vin}</div>
           </div>
           <button onClick={() => navigate('/visual-inspection')} className="w-full bg-primary py-5 rounded-2xl font-black flex items-center justify-center gap-2">
             SIGUIENTE PASO <span className="material-symbols-outlined">arrow_forward</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default VinScanPage;
