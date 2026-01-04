
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ListPage: React.FC = () => {
  const navigate = useNavigate();
  
  const history = [
    { id: 1, car: "2021 Ford Ranger", vin: "1FTEF48...", score: 9.2, date: "12 May 2024", status: "Verificado", img: "https://picsum.photos/seed/ranger/100/100" },
    { id: 2, car: "2019 Toyota Corolla", vin: "2T1BU4E...", score: 8.5, date: "24 Oct 2023", status: "Finalizado", img: "https://picsum.photos/seed/corolla/100/100" },
    { id: 3, car: "2015 Honda Civic", vin: "HG781...", score: 6.4, date: "10 Sep 2023", status: "Finalizado", img: "https://picsum.photos/seed/civic/100/100" }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col">
      <header className="p-4 pt-6 flex justify-between items-center z-50">
        <button 
          onClick={() => navigate('/')} 
          className="size-11 flex items-center justify-center bg-slate-100 dark:bg-surface-dark rounded-xl active:scale-90 transition-transform border border-slate-200 dark:border-white/10"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">Evaluaciones</h1>
        <button onClick={() => navigate('/intro')} className="size-11 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      <div className="px-4 py-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary shadow-sm" placeholder="Buscar por modelo o VIN" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-24">
        {history.map(item => (
          <div key={item.id} onClick={() => navigate('/final-report')} className="p-3 bg-white dark:bg-surface-dark rounded-2xl flex gap-4 shadow-sm border border-gray-100 dark:border-transparent cursor-pointer active:scale-[0.98] transition-transform">
             <img src={item.img} className="size-20 rounded-xl object-cover" />
             <div className="flex-1 flex flex-col justify-between py-1">
               <div className="flex justify-between items-start">
                 <h3 className="font-bold text-sm">{item.car}</h3>
                 <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold">{item.score} ★</span>
               </div>
               <p className="text-[10px] font-mono text-slate-500">VIN: {item.vin}</p>
               <div className="flex justify-between items-center text-[10px] text-slate-400">
                 <span>{item.date}</span>
                 <span className="text-primary font-bold uppercase">{item.status}</span>
               </div>
             </div>
          </div>
        ))}
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-white/10 px-6 py-2 flex justify-between items-center z-50 h-20">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold">Inicio</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-primary">
          <span className="material-symbols-outlined icon-filled">list_alt</span>
          <span className="text-[10px] font-bold">Lista</span>
        </button>
        <div className="relative -top-6">
          <button onClick={() => navigate('/intro')} className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">notifications</span>
          <span className="text-[10px] font-bold">Alertas</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default ListPage;
