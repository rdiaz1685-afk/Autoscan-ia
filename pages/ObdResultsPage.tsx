
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { analyzeOBDCodes } from '../services/geminiService';

const ObdResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setState } = useApp();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const mockCodes = ["P0420", "P0128", "P0300"];
      try {
        const data = await analyzeOBDCodes(mockCodes);
        setResults(data);
        setState(prev => ({ ...prev, obdCodes: mockCodes }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col p-4">
      <header className="flex items-center justify-between mb-8 py-2 z-50">
        <button 
          onClick={() => navigate('/obd-connect')} 
          className="size-11 flex items-center justify-center bg-slate-100 dark:bg-surface-dark rounded-xl active:scale-90 transition-transform border border-slate-200 dark:border-white/10"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg">Resultados Diagnóstico</h1>
        <div className="w-11"></div>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-slate-500 uppercase text-[10px] font-black tracking-widest">ARIA analizando códigos...</p>
        </div>
      ) : (
        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-24">
          <div className="flex flex-col items-center py-4">
             <div className="size-32 relative flex items-center justify-center">
               <svg className="size-full transform -rotate-90">
                 <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-800" />
                 <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset="72" className="text-primary" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-bold">82</span>
                 <span className="text-[10px] uppercase font-bold text-slate-500">Puntos</span>
               </div>
             </div>
             <h2 className="text-xl font-bold mt-4">Estado General: Bueno</h2>
             <p className="text-sm text-slate-500">{results.length} códigos detectados</p>
          </div>

          <div className="space-y-4">
            {results.map((res, i) => (
              <div key={i} className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-sm">{res.code}</span>
                    <h3 className="font-bold">{res.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    res.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>{res.severity}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{res.cause}</p>
                <div className="flex gap-2 items-center text-xs font-medium text-primary bg-primary/5 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-sm">info</span>
                  <p>{res.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md pb-8">
        <button onClick={() => navigate('/preliminary-report')} className="w-full bg-primary py-4 rounded-xl font-bold text-white shadow-lg">
          Ver Reporte Preliminar
        </button>
      </div>
    </div>
  );
};

export default ObdResultsPage;
