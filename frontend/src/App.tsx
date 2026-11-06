import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Suppliers } from './pages/Suppliers';
import { Inventory } from './pages/Inventory';
import { Shipments } from './pages/Shipments';
import { DependencyMap } from './pages/DependencyMap';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { AIAssistant } from './pages/AIAssistant';
import { RecoveryPlans } from './pages/RecoveryPlans';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FAFAFA] flex text-[#171717]">
          {/* Fixed Left Sidebar */}
          <Sidebar />

          {/* Main Area */}
          <div className="flex-1 ml-64 flex flex-col min-h-screen">
            {/* Top Fixed Header Navbar */}
            <Navbar />

            {/* Page Body Container */}
            <main className="flex-1 mt-14 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/shipments" element={<Shipments />} />
                <Route path="/dependency-map" element={<DependencyMap />} />
                <Route path="/risk-analysis" element={<RiskAnalysis />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/recovery-plans" element={<RecoveryPlans />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
