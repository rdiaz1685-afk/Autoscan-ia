
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { chatInspector } from '../services/geminiService';

const GuidedInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setState } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.inspectionChat]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user' as const, text: textToSend, timestamp: Date.now() };
    const newChat = [...state.inspectionChat, userMessage];
    
    setState(prev => ({ ...prev, inspectionChat: newChat }));
    setInput("");
    setLoading(true);

    try {
      const legalContext = `El usuario está preguntando sobre la legalidad: Facturas, Refrendos y Tenencias. Explica cómo la factura original vs aseguradora cambia el valor.`;
      const aiResponseText = await chatInspector(newChat, textToSend, { ...state.vehicleInfo, context: legalContext });
      
      const aiMessage = { role: 'model' as const, text: aiResponseText || "Entendido. ¿Tienes los comprobantes de los últimos 5 años de tenencia?", timestamp: Date.now() };
      setState(prev => ({ ...prev, inspectionChat: [...prev.inspectionChat, aiMessage] }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const legalChips = [
    "Factura Original", 
    "Refrendos pagados", 
    "Tengo multas", 
    "Factura Aseguradora",
    "Baja de placas"
  ];

  return (
    <div className="flex h-screen flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans">
      <header className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/5 shrink-0 bg-surface-light dark:bg-surface-dark z-50">
        <button 
          onClick={() => navigate('/visual-inspection')} 
          className="size-11 flex items-center justify-center bg-slate-100 dark:bg-background-dark rounded-xl active:scale-90 transition-transform border border-slate-200 dark:border-white/10"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <div className="text-center">
          <h1 className="text-xs font-black uppercase tracking-widest text-primary">Validación Legal y Física</h1>
          <p className="text-[9px] opacity-50 uppercase font-bold">{state.vehicleInfo?.make} {state.vehicleInfo?.model}</p>
        </div>
        <button onClick={() => navigate('/obd-connect')} className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-xl shadow-lg shadow-primary/20">
          LISTO
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-10">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="text-[11px] leading-snug text-slate-600 dark:text-slate-400 font-medium">
            Hablemos de la documentación. Menciona si tienes la factura original, si los refrendos están al día o si el auto tiene algún detalle legal.
          </p>
        </div>

        {state.inspectionChat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className="text-[8px] opacity-40 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl rounded-bl-none flex gap-1.5 border border-white/5">
              <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <footer className="p-4 border-t border-gray-200 dark:border-white/5 bg-surface-light dark:bg-surface-dark pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
           {legalChips.map(chip => (
             <button 
                key={chip} 
                onClick={() => handleSend(chip)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-background-dark rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-200 dark:border-white/5 shrink-0 hover:bg-primary/10 transition-colors"
             >
               {chip}
             </button>
           ))}
        </div>
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta sobre trámites o reporta daños..." 
            className="flex-1 bg-gray-100 dark:bg-background-dark border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary outline-none shadow-inner"
          />
          <button onClick={() => handleSend()} className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 transition-transform active:scale-90">
            <span className="material-symbols-outlined text-2xl">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GuidedInspectionPage;
