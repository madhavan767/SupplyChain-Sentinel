import {
  Supplier,
  Component,
  Product,
  Shipment,
  PurchaseOrder,
  CustomerOrder,
  Incident,
  RiskAnalysisResponse,
  ChatResponse,
  RecoveryOption,
  ImpactTrace
} from '../types';

const API_BASE = '/api';

export const api = {
  async getKpis() {
    const res = await fetch(`${API_BASE}/kpis`);
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    return res.json();
  },

  async getSuppliers(search?: string, risk?: string): Promise<Supplier[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (risk && risk !== 'ALL') params.append('risk', risk);
    const res = await fetch(`${API_BASE}/suppliers?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch suppliers');
    return res.json();
  },

  async getSupplierDetail(supplierId: string) {
    const res = await fetch(`${API_BASE}/suppliers/${supplierId}`);
    if (!res.ok) throw new Error('Failed to fetch supplier details');
    return res.json();
  },

  async getInventory(search?: string, status?: string): Promise<Component[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'ALL') params.append('status', status);
    const res = await fetch(`${API_BASE}/inventory?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  },

  async getComponentDetail(componentId: string) {
    const res = await fetch(`${API_BASE}/inventory/${componentId}`);
    if (!res.ok) throw new Error('Failed to fetch component details');
    return res.json();
  },

  async getOrders(orderType: 'customer' | 'purchase' = 'customer', status?: string, priority?: string): Promise<any[]> {
    const params = new URLSearchParams();
    params.append('order_type', orderType);
    if (status && status !== 'ALL') params.append('status', status);
    if (priority && priority !== 'ALL') params.append('priority', priority);
    const res = await fetch(`${API_BASE}/orders?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getShipments(status?: string): Promise<Shipment[]> {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    const res = await fetch(`${API_BASE}/shipments?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return res.json();
  },

  async getShipmentDetail(shipmentId: string) {
    const res = await fetch(`${API_BASE}/shipments/${shipmentId}`);
    if (!res.ok) throw new Error('Failed to fetch shipment detail');
    return res.json();
  },

  async getIncidents(): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async getDependencies(highlight: boolean = false) {
    const res = await fetch(`${API_BASE}/dependencies?highlight=${highlight}`);
    if (!res.ok) throw new Error('Failed to fetch dependency graph');
    return res.json();
  },

  async traceDependencies(): Promise<ImpactTrace> {
    const res = await fetch(`${API_BASE}/dependencies/trace`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to trace dependencies');
    return res.json();
  },

  async getRiskAnalysis(): Promise<RiskAnalysisResponse> {
    const res = await fetch(`${API_BASE}/risk-analysis`);
    if (!res.ok) throw new Error('Failed to fetch risk analysis');
    return res.json();
  },

  async getRecoveryPlans(): Promise<{ scenario: string; options: RecoveryOption[] }> {
    const res = await fetch(`${API_BASE}/recovery-plans`);
    if (!res.ok) throw new Error('Failed to fetch recovery plans');
    return res.json();
  },

  async updateRecoveryPlanStatus(planId: string, status: string, notes?: string) {
    const res = await fetch(`${API_BASE}/recovery-plans/${planId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update recovery plan status');
    return res.json();
  },

  async askAssistant(query: string): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed to query assistant');
    return res.json();
  },

  async getDocuments(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async runScenario() {
    const res = await fetch(`${API_BASE}/scenario/run`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to run scenario');
    return res.json();
  },

  async resetScenario() {
    const res = await fetch(`${API_BASE}/scenario/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset scenario');
    return res.json();
  }
};
