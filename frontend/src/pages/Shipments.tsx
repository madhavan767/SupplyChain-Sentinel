import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  X,
  ArrowRight,
  ExternalLink,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { Shipment } from '../types';
import { useApp } from '../context/AppContext';

export const Shipments: React.FC = () => {
  const { scenarioActive, traceImpact } = useApp();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>('SHP-801'); // Select SHP-801 by default for demo
  const [shipmentDetail, setShipmentDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getShipments(statusFilter).then(setShipments).catch(console.error);
  }, [statusFilter, scenarioActive]);

  useEffect(() => {
    if (selectedShipmentId) {
      setLoadingDetail(true);
      api.getShipmentDetail(selectedShipmentId)
        .then(setShipmentDetail)
        .catch(console.error)
        .finally(() => setLoadingDetail(false));
    } else {
      setShipmentDetail(null);
    }
  }, [selectedShipmentId]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Shipment Monitoring</h1>
          <p className="text-xs text-[#686868] mt-1">
            Global in-flight and customs logistics tracking, milestone exception detection, and delivery ETA projections.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-white border border-[#E5E5E5] rounded-md p-0.5 text-xs">
          {['ALL', 'DELAYED', 'IN TRANSIT', 'DELIVERED', 'PENDING'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-[#171717] text-white'
                  : 'text-[#686868] hover:text-[#171717]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Disruption Alert Banner */}
      {scenarioActive && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600 text-white rounded-md shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded font-mono">
                  ACTIVE LOGISTICS DISRUPTION
                </span>
                <span className="text-xs text-red-700 font-mono font-bold">SHP-801 (Pacific Air Freight TW-EXP-94021)</span>
              </div>
              <h2 className="text-sm font-bold text-red-950 mt-1">
                Supplier A (Apex Microelectronics) — Component C-101 — 500 units — 5-Day Delivery Delay
              </h2>
              <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                Foundry final electrical qualification lot hold at Taiwan packaging line 3. Delivery postponed from <strong>Nov 08</strong> to <strong>Nov 13, 2026</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                traceImpact();
                navigate('/dependency-map');
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Investigate in Graph
            </button>
            <button
              onClick={() => navigate('/recovery-plans')}
              className="px-3 py-1.5 bg-white border border-red-300 text-red-900 hover:bg-red-100 text-xs font-semibold rounded-md transition-colors"
            >
              Open Recovery Planner
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Shipments Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table */}
        <div className={`${selectedShipmentId ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#686868] font-semibold">
                  <th className="py-2.5 px-3">Shipment & Carrier</th>
                  <th className="py-2.5 px-3">Supplier & Component</th>
                  <th className="py-2.5 px-3 text-center">Quantity</th>
                  <th className="py-2.5 px-3">Origin / Destination</th>
                  <th className="py-2.5 px-3">ETA</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {shipments.map((sh) => {
                  const isSelected = selectedShipmentId === sh.shipment_id;
                  const isSHP801 = sh.shipment_id === 'SHP-801';

                  return (
                    <tr
                      key={sh.shipment_id}
                      onClick={() => setSelectedShipmentId(sh.shipment_id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-orange-50/50 hover:bg-orange-50/80'
                          : isSHP801 && scenarioActive
                          ? 'bg-red-50/40 hover:bg-red-50/70'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-[#171717] flex items-center gap-1.5">
                          {sh.shipment_id}
                          {isSHP801 && (
                            <span className="text-[9px] bg-red-600 text-white font-mono px-1 rounded">DELAYED</span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#888]">{sh.carrier}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#171717]">{sh.supplier_name.split('(')[0]}</div>
                        <div className="text-[10px] text-[#888] font-mono">{sh.component_name} [{sh.component_id}]</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-[#171717]">{sh.quantity}</td>
                      <td className="py-3 px-3 text-[11px] text-[#555]">
                        <div className="truncate max-w-[140px]">{sh.origin.split(',')[0]}</div>
                        <div className="text-[10px] text-[#888] truncate max-w-[140px]">→ {sh.destination.split(',')[0]}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div className={sh.delay_days > 0 ? 'text-red-700 font-bold' : 'text-[#171717]'}>
                          {sh.revised_delivery}
                        </div>
                        {sh.delay_days > 0 && (
                          <div className="text-[10px] text-red-600 line-through">orig: {sh.expected_delivery}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            sh.status === 'Delayed'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : sh.status === 'Delivered'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : sh.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-[#555] border border-gray-200'
                          }`}
                        >
                          {sh.status} {sh.delay_days > 0 ? `(+${sh.delay_days}d)` : ''}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <ChevronRight className={`w-4 h-4 inline-block ${isSelected ? 'text-[#ED6A24]' : 'text-[#888]'}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipment Detail Drawer (Right) */}
        {selectedShipmentId && (
          <div className="lg:col-span-5 bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-5 shadow-xs sticky top-20">
            {loadingDetail ? (
              <div className="py-12 text-center text-xs text-[#888]">Loading shipment telemetry...</div>
            ) : shipmentDetail ? (
              <>
                <div className="flex items-start justify-between pb-3 border-b border-[#E5E5E5]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[#555]">
                        {shipmentDetail.shipment.shipment_id}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        shipmentDetail.shipment.status === 'Delayed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {shipmentDetail.shipment.status} {shipmentDetail.shipment.delay_days > 0 ? `(+${shipmentDetail.shipment.delay_days}d)` : ''}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-[#171717] mt-1">
                      {shipmentDetail.shipment.component_name} ({shipmentDetail.shipment.quantity} units)
                    </h2>
                    <p className="text-xs text-[#686868] mt-0.5">Carrier: {shipmentDetail.shipment.carrier} • Tracking: {shipmentDetail.shipment.tracking_ref}</p>
                  </div>
                  <button
                    onClick={() => setSelectedShipmentId(null)}
                    className="p-1 text-[#888] hover:text-[#171717] rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Delay Notice Banner if delayed */}
                {shipmentDetail.shipment.delay_days > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-red-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Carrier Exception Notice</span>
                    </div>
                    <div className="text-[11px] text-red-700 leading-relaxed">
                      {shipmentDetail.shipment.delay_reason}
                    </div>
                    <div className="text-[10px] text-red-800 font-mono pt-1">
                      Scheduled: {shipmentDetail.shipment.expected_delivery} → Revised: {shipmentDetail.shipment.revised_delivery} (+{shipmentDetail.shipment.delay_days} days)
                    </div>
                  </div>
                )}

                {/* Simulated Shipment Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider text-[#888]">
                    Simulated Shipment Milestone Timeline
                  </h3>
                  <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 text-xs">
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white" />
                      <div className="font-semibold text-[#171717]">Order Dispatched at Supplier Facility</div>
                      <div className="text-[10px] text-[#888]">{shipmentDetail.shipment.origin} • Oct 28, 2026</div>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-6 top-0.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                        shipmentDetail.shipment.delay_days > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                      }`} />
                      <div className="font-semibold text-[#171717]">
                        {shipmentDetail.shipment.delay_days > 0 ? 'Packaging Electrical QA Hold' : 'Export Customs Cleared'}
                      </div>
                      <div className="text-[10px] text-[#888]">
                        {shipmentDetail.shipment.delay_days > 0 ? 'Hsinchu Fab 4 Line 3 • Nov 06, 2026' : 'Taoyuan Air Terminal'}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                      <div className="font-semibold text-[#888]">International Air Freight Transit</div>
                      <div className="text-[10px] text-[#888]">Pacific Air Cargo (Flight PAC-804) • Est. Nov 11</div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                      <div className="font-semibold text-[#888]">Final Delivery & Dock Receipt</div>
                      <div className="text-[10px] text-[#888]">{shipmentDetail.shipment.destination} • Est. {shipmentDetail.shipment.revised_delivery}</div>
                    </div>
                  </div>
                </div>

                {/* Sourcing & PO References */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#686868]">Supplier:</span>
                    <span className="font-semibold text-[#171717]">{shipmentDetail.shipment.supplier_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#686868]">Linked PO:</span>
                    <span className="font-mono font-semibold text-[#171717]">{shipmentDetail.shipment.po_ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#686868]">Carrier Waybill:</span>
                    <span className="font-mono text-[#171717]">{shipmentDetail.shipment.tracking_ref}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      traceImpact();
                      navigate('/dependency-map');
                    }}
                    className="flex-1 py-2 bg-[#171717] hover:bg-black text-white text-xs font-semibold rounded transition-colors text-center"
                  >
                    Trace in Dependency Graph
                  </button>
                  <button
                    onClick={() => navigate('/recovery-plans')}
                    className="flex-1 py-2 bg-[#ED6A24] hover:bg-[#D85A18] text-white text-xs font-semibold rounded transition-colors text-center"
                  >
                    View Recovery Options
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
