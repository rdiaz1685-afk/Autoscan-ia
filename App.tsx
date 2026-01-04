
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { EvaluationState } from './types';

// Pages
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import IntroPage from './pages/IntroPage';
import VinScanPage from './pages/VinScanPage';
import VisualInspectionPage from './pages/VisualInspectionPage';
import GuidedInspectionPage from './pages/GuidedInspectionPage';
import ObdConnectPage from './pages/ObdConnectPage';
import ObdResultsPage from './pages/ObdResultsPage';
import PreliminaryReportPage from './pages/PreliminaryReportPage';
import FinalReportPage from './pages/FinalReportPage';
import ListPage from './pages/ListPage';

interface AppContextType {
  state: EvaluationState;
  setState: React.Dispatch<React.SetStateAction<EvaluationState>>;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

const INITIAL_STATE: EvaluationState = {
  userName: localStorage.getItem('autoscan_user') || undefined,
  vin: undefined,
  vehicleInfo: undefined,
  exteriorPhotos: [],
  obdCodes: [],
  inspectionChat: [
    { role: 'model', text: 'Hola, soy tu asistente de diagnóstico. ¿Observas alguna mancha de líquido o aceite debajo del motor?', timestamp: Date.now() }
  ],
  status: 'idle'
};

const App: React.FC = () => {
  const [state, setState] = useState<EvaluationState>(INITIAL_STATE);
  const resetState = () => setState(INITIAL_STATE);

  return (
    <AppContext.Provider value={{ state, setState, resetState }}>
      <Router>
        <Routes>
          <Route path="/" element={state.userName ? <HomePage /> : <WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/scan-vin" element={<VinScanPage />} />
          <Route path="/visual-inspection" element={<VisualInspectionPage />} />
          <Route path="/guided-inspection" element={<GuidedInspectionPage />} />
          <Route path="/obd-connect" element={<ObdConnectPage />} />
          <Route path="/obd-results" element={<ObdResultsPage />} />
          <Route path="/preliminary-report" element={<PreliminaryReportPage />} />
          <Route path="/final-report" element={<FinalReportPage />} />
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
