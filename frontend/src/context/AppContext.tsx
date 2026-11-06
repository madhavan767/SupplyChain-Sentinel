import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Supplier, Component, Shipment, ImpactTrace } from '../types';

interface AppContextType {
  kpis: any;
  loading: boolean;
  scenarioActive: boolean;
  impactTraced: boolean;
  impactTraceData: ImpactTrace | null;
  selectedSupplier: Supplier | null;
  selectedComponent: Component | null;
  selectedShipment: Shipment | null;
  setSelectedSupplier: (s: Supplier | null) => void;
  setSelectedComponent: (c: Component | null) => void;
  setSelectedShipment: (sh: Shipment | null) => void;
  refreshKpis: () => Promise<void>;
  runScenario: () => Promise<void>;
  resetScenario: () => Promise<void>;
  traceImpact: () => Promise<ImpactTrace>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scenarioActive, setScenarioActive] = useState<boolean>(true);
  const [impactTraced, setImpactTraced] = useState<boolean>(true);
  const [impactTraceData, setImpactTraceData] = useState<ImpactTrace | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const refreshKpis = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getKpis();
      setKpis(data);
      setScenarioActive(data.scenario_active);
      setImpactTraced(data.impact_traced);
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const traceImpact = useCallback(async () => {
    try {
      const data = await api.traceDependencies();
      setImpactTraceData(data);
      setImpactTraced(true);
      return data;
    } catch (err) {
      console.error('Trace impact failed:', err);
      throw err;
    }
  }, []);

  const runScenario = useCallback(async () => {
    try {
      await api.runScenario();
      setScenarioActive(true);
      await refreshKpis();
      await traceImpact();
    } catch (err) {
      console.error('Run scenario failed:', err);
    }
  }, [refreshKpis, traceImpact]);

  const resetScenario = useCallback(async () => {
    try {
      await api.resetScenario();
      setScenarioActive(true);
      setImpactTraced(false);
      setImpactTraceData(null);
      setSelectedSupplier(null);
      setSelectedComponent(null);
      setSelectedShipment(null);
      await refreshKpis();
    } catch (err) {
      console.error('Reset scenario failed:', err);
    }
  }, [refreshKpis]);

  useEffect(() => {
    refreshKpis();
    traceImpact();
  }, [refreshKpis, traceImpact]);

  return (
    <AppContext.Provider
      value={{
        kpis,
        loading,
        scenarioActive,
        impactTraced,
        impactTraceData,
        selectedSupplier,
        selectedComponent,
        selectedShipment,
        setSelectedSupplier,
        setSelectedComponent,
        setSelectedShipment,
        refreshKpis,
        runScenario,
        resetScenario,
        traceImpact
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
