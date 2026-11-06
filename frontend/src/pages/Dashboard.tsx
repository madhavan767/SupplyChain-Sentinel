import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Truck,
  Boxes,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Incident } from '../types';

export const Dashboard: React.FC = () => {
  const { kpis, loading, scenarioActive, traceImpact } = useApp();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getIncidents().then(setIncidents).catch(console.error);
  }, [scenarioActive]);

  const primaryIncident = incidents.find(i => i.incident_id === 'INC-2024-001');

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Supply Chain Overview</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-gray-100 text-[#555] rounded border border-gray-200">
              Control Tower Active
            </span>
          </div>
          <p className="text-xs text-[#686868] mt-1">
            Monitor supplier performance, inventory health, shipment activity, and operational risks across the global supply network.
          </p>
        </div>

        {/* Quick Action buttons header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              traceImpact();
              navigate('/dependency-map');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ED6A24] hover:bg-[#D85A18] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <span>Investigate Disruption</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D4D4D4] hover:bg-gray-50 text-[#171717] text-xs font-medium rounded-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ED6A24]" />
            <span>Open AI Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Total Suppliers */}
        <div
          onClick={() => navigate('/suppliers')}
          className="bg-white p-4 rounded-lg border border-[#E5E5E5] hover:border-gray-400 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-[#686868] mb-2">
            <span className="text-xs font-medium">Total Suppliers</span>
            <Building2 className="w-4 h-4 text-[#888]" />
          </div>
          <div className="text-2xl font-bold text-[#171717]">{kpis?.total_suppliers ?? 12}</div>
          <div className="text-[11px] text-[#686868] mt-1 flex items-center gap-1">
            <span className="font-semibold text-red-600">1</span> high risk watch
          </div>
        </div>

        {/* Active Shipments */}
        <div
          onClick={() => navigate('/shipments')}
          className="bg-white p-4 rounded-lg border border-[#E5E5E5] hover:border-gray-400 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-[#686868] mb-2">
            <span className="text-xs font-medium">Active Shipments</span>
            <Truck className="w-4 h-4 text-[#888]" />
          </div>
          <div className="text-2xl font-bold text-[#171717]">{kpis?.active_shipments ?? 17}</div>
          <div className="text-[11px] text-[#686868] mt-1 flex items-center gap-1">
            <span className="font-semibold text-red-600">2</span> delayed shipments
          </div>
        </div>

        {/* Inventory Items */}
        <div
          onClick={() => navigate('/inventory')}
          className="bg-white p-4 rounded-lg border border-[#E5E5E5] hover:border-gray-400 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-[#686868] mb-2">
            <span className="text-xs font-medium">Inventory Items</span>
            <Boxes className="w-4 h-4 text-[#888]" />
          </div>
          <div className="text-2xl font-bold text-[#171717]">{kpis?.total_inventory_items ?? 30}</div>
          <div className="text-[11px] text-[#686868] mt-1 flex items-center gap-1">
            <span className="font-semibold text-red-600">1</span> critical shortage
          </div>
        </div>

        {/* Active Risk Alerts */}
        <div
          onClick={() => navigate('/risk-analysis')}
          className={`p-4 rounded-lg border cursor-pointer transition-all shadow-xs ${
            scenarioActive
              ? 'bg-red-50/60 border-red-200 hover:border-red-300'
              : 'bg-white border-[#E5E5E5] hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-between text-red-700 mb-2">
            <span className="text-xs font-semibold">Active Risk Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700">{scenarioActive ? (kpis?.active_risk_alerts ?? 2) : 0}</div>
          <div className="text-[11px] text-red-600 mt-1 font-medium">
            {scenarioActive ? 'Immediate action required' : 'Network nominal'}
          </div>
        </div>

        {/* Affected Orders */}
        <div
          onClick={() => navigate('/inventory')}
          className={`p-4 rounded-lg border cursor-pointer transition-all shadow-xs ${
            scenarioActive
              ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
              : 'bg-white border-[#E5E5E5] hover:border-gray-400'
          }`}
        >
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold">Affected Orders</span>
            <ShoppingCart className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900">{scenarioActive ? (kpis?.affected_orders ?? 3) : 0}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            {scenarioActive ? 'Orders at delivery risk' : 'All orders on schedule'}
          </div>
        </div>

        {/* Value at Risk */}
        <div
          onClick={() => navigate('/risk-analysis')}
          className="bg-white p-4 rounded-lg border border-[#E5E5E5] hover:border-gray-400 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between text-[#686868] mb-2">
            <span className="text-xs font-medium">Revenue at Risk</span>
            <TrendingUp className="w-4 h-4 text-[#888]" />
          </div>
          <div className="text-xl font-bold text-[#171717]">
            {scenarioActive ? `$${(kpis?.total_value_at_risk ?? 226400).toLocaleString()}` : '$0'}
          </div>
          <div className="text-[11px] text-[#686868] mt-1 font-medium">
            {scenarioActive ? 'Across 3 enterprise accounts' : 'Exposure protected'}
          </div>
        </div>
      </div>

      {/* Prominent Primary Scenario Disruption Alert Banner */}
      {scenarioActive && primaryIncident && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600 text-white rounded-md shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  CRITICAL DISRUPTION INCIDENT ({primaryIncident.incident_id})
                </span>
                <span className="text-xs text-red-600 font-mono">Detected: {primaryIncident.date_detected}</span>
              </div>
              <h2 className="text-sm font-bold text-red-950 mt-1">
                {primaryIncident.supplier_name} — Component {primaryIncident.component_id} Delay ({primaryIncident.delay_days} Days)
              </h2>
              <p className="text-xs text-red-800 mt-0.5 max-w-4xl leading-relaxed">
                {primaryIncident.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-red-900 font-medium">
                <span>Shipment: <code className="bg-red-100/80 px-1 py-0.5 rounded font-mono font-bold">{primaryIncident.shipment_id}</code></span>
                <span>•</span>
                <span>Quantity: <strong>{primaryIncident.affected_quantity} units</strong></span>
                <span>•</span>
                <span>Impact: <strong>{primaryIncident.operational_impact}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                traceImpact();
                navigate('/dependency-map');
              }}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
            >
              Trace in Graph
            </button>
            <button
              onClick={() => navigate('/recovery-plans')}
              className="px-3 py-2 bg-white border border-red-300 text-red-900 hover:bg-red-100 text-xs font-semibold rounded-md transition-colors"
            >
              Formulate Recovery
            </button>
          </div>
        </div>
      )}

      {/* Grid: 2 Columns - Health Overview & Risk Distribution / Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Supply Chain Health Overview */}
        <div className="bg-white p-5 rounded-lg border border-[#E5E5E5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Supply Chain Health</h2>
              <p className="text-[11px] text-[#686868]">Overall network risk distribution</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Score: 76.5 / 100
            </span>
          </div>

          {/* Supplier Risk Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#555]">Supplier Risk Profile</span>
              <span className="text-[#171717] font-semibold">12 Monitored</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
              <div style={{ width: '8.3%' }} className="bg-red-500 h-full" title="1 High Risk (Supplier A)" />
              <div style={{ width: '16.7%' }} className="bg-amber-400 h-full" title="2 Medium Risk" />
              <div style={{ width: '75%' }} className="bg-green-500 h-full" title="9 Low Risk" />
            </div>
            <div className="flex justify-between text-[11px] text-[#686868] pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" /> High: 1 (8%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Medium: 2 (17%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Low: 9 (75%)
              </span>
            </div>
          </div>

          {/* Section C: Shipment Overview */}
          <div className="pt-3 border-t border-[#EFEFEF] space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#555]">Shipment Pipeline Status</span>
              <span className="text-[#171717] font-semibold">20 Shipments</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                <div className="text-xs text-[#686868]">In Transit</div>
                <div className="text-sm font-bold text-[#171717]">13</div>
              </div>
              <div className="p-2 bg-green-50 border border-green-200 rounded">
                <div className="text-xs text-green-700">Delivered</div>
                <div className="text-sm font-bold text-green-800">3</div>
              </div>
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                <div className="text-xs text-red-700">Delayed</div>
                <div className="text-sm font-bold text-red-800">2</div>
              </div>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                <div className="text-xs text-[#686868]">Pending</div>
                <div className="text-sm font-bold text-[#171717]">2</div>
              </div>
            </div>
          </div>

          {/* Section D: Inventory Health */}
          <div className="pt-3 border-t border-[#EFEFEF] space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#555]">Inventory Health Status</span>
              <span className="text-[#171717] font-semibold">30 Components</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-1.5 bg-red-50/70 border border-red-200 rounded">
                <span className="text-red-800 font-medium">Critical Stock Shortage (C-101)</span>
                <span className="font-mono font-bold text-red-800">1 Item</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-amber-50/70 border border-amber-200 rounded">
                <span className="text-amber-800 font-medium">Low Stock Warning (C-104)</span>
                <span className="font-mono font-bold text-amber-800">1 Item</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-green-50/70 border border-green-200 rounded">
                <span className="text-green-800 font-medium">Nominal Operating Stock</span>
                <span className="font-mono font-bold text-green-800">28 Items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Active Risk Alerts & Detailed Incidents (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-[#E5E5E5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Active Risk Alerts & Operational Incidents</h2>
              <p className="text-[11px] text-[#686868]">Identified supply chain variances requiring operational response</p>
            </div>
            <button
              onClick={() => navigate('/risk-analysis')}
              className="text-xs font-semibold text-[#ED6A24] hover:underline flex items-center gap-1"
            >
              <span>Full Risk Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.incident_id}
                className="p-3.5 rounded-lg border border-[#E5E5E5] hover:border-gray-300 transition-colors bg-white flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : inc.severity === 'LOW'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-xs font-bold text-[#171717]">{inc.supplier_name}</span>
                    <span className="text-xs text-[#888] font-mono">[{inc.component_id}]</span>
                  </div>
                  <div className="text-xs text-[#333] font-medium">{inc.incident_type}</div>
                  <p className="text-[11px] text-[#666] line-clamp-2">{inc.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (inc.incident_id === 'INC-2024-001') {
                        traceImpact();
                        navigate('/dependency-map');
                      } else {
                        navigate('/shipments');
                      }
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium bg-[#171717] hover:bg-black text-white rounded transition-colors"
                  >
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Section E: Recent Activity Feed */}
          <div className="pt-3 border-t border-[#EFEFEF]">
            <h3 className="text-xs font-bold text-[#171717] mb-2.5 uppercase tracking-wider text-[#888]">
              Recent Activity Feed
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 py-1 border-b border-gray-50">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-[#171717]">Supplier A Alert:</span> Shipment SHP-801 marked Delayed (+5 days) due to electrical lot qualification hold.
                </div>
                <span className="text-[10px] text-[#888] font-mono shrink-0">15m ago</span>
              </div>
              <div className="flex items-start gap-2.5 py-1 border-b border-gray-50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-[#171717]">Shortage Warning:</span> Component C-101 unreserved inventory reduced to 30 units in Central DC Chicago.
                </div>
                <span className="text-[10px] text-[#888] font-mono shrink-0">32m ago</span>
              </div>
              <div className="flex items-start gap-2.5 py-1 border-b border-gray-50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-[#171717]">Shipment Received:</span> SHP-804 (800 units of C-102 Power ICs) successfully docked from Nordic Power.
                </div>
                <span className="text-[10px] text-[#888] font-mono shrink-0">1h ago</span>
              </div>
              <div className="flex items-start gap-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-[#171717]">Risk Assessment Updated:</span> Disruption exposure evaluated at 89.5/100 (HIGH RISK).
                </div>
                <span className="text-[10px] text-[#888] font-mono shrink-0">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
