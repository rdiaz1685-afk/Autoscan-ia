
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { generateFinalReport } from '../services/geminiService';

const FinalReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<'doc' | 'json' | null>(null);
  const [report, setReport] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await generateFinalReport(state);
        setReport(data || "Error al generar reporte.");
      } catch (err) {
        setReport("# Reporte Fallido\n\nHubo un problema contactando a la IA.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [state]);

  const handleDownloadJson = () => {
    setDownloading('json');
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data_AutoScan_${state.vin || 'Vehiculo'}.json`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 100);
  };

  const handleDownloadDoc = () => {
    if (!report) return;
    setDownloading('doc');
    
    const vehicleName = `${state.vehicleInfo?.make || 'Vehiculo'} ${state.vehicleInfo?.model || ''}`;
    const filename = `Reporte_AutoScan_${vehicleName.replace(/\s+/g, '_')}.doc`;

    const formatToHtml = (text: string) => {
      let formatted = text
        .replace(/^# (.*$)/gim, '<h1 style="color: #137fec; font-family: Arial;">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 style="color: #1c252e; font-family: Arial; border-bottom: 1px solid #eee;">$1</h2>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\n/gim, '<br/>');

      return `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; padding: 40px;">
          <div style="text-align: center; border-bottom: 2px solid #137fec; margin-bottom: 20px;">
            <h1 style="color: #137fec; margin: 0;">AutoScan AI</h1>
            <p>Reporte Oficial de Inspección</p>
          </div>
          <h3>Datos del Vehículo</h3>
          <p><b>Modelo:</b> ${state.vehicleInfo?.year} ${state.vehicleInfo?.make} ${state.vehicleInfo?.model}</p>
          <p><b>VIN:</b> ${state.vin}</p>
          <hr/>
          ${formatted}
        </body>
        </html>`;
    };

    const blob = new Blob(['\ufeff', formatToHtml(report)], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col">
      <header className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-50">
        <button 
          onClick={() => navigate('/preliminary-report')} 
          className="size-11 flex items-center justify-center bg-slate-100 dark:bg-surface-dark rounded-xl active:scale-90 transition-transform border border-slate-200 dark:border-white/10"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="font-black uppercase tracking-tighter">Reporte Final</h1>
        <button 
          onClick={() => navigate('/')} 
          className="size-11 flex items-center justify-center bg-primary/10 rounded-xl active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-primary">home</span>
        </button>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Compilando diagnóstico...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-48 no-scrollbar">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black">{state.vehicleInfo?.year} {state.vehicleInfo?.make} {state.vehicleInfo?.model}</h2>
            <p className="text-sm font-mono opacity-50">{state.vin}</p>
          </div>

          <div className="p-6 bg-surface-dark rounded-3xl text-center border border-white/5 shadow-xl">
             <div className="text-5xl font-black text-primary mb-2">85<span className="text-lg opacity-50">/100</span></div>
             <p className="font-bold text-primary uppercase tracking-widest text-xs">Estado: Excelente</p>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {report}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pb-8 border-t border-gray-200 dark:border-white/10 space-y-3">
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadDoc}
            disabled={loading || !!downloading}
            className="flex-1 py-4 bg-primary text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">description</span>
            {downloading === 'doc' ? '...' : '.DOC'}
          </button>
          <button 
            onClick={handleDownloadJson}
            disabled={loading || !!downloading}
            className="flex-1 py-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">data_object</span>
            {downloading === 'json' ? '...' : '.JSON'}
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500">Usa .DOC para lectura humana y .JSON para integrar con otros sistemas.</p>
      </div>
    </div>
  );
};

export default FinalReportPage;
