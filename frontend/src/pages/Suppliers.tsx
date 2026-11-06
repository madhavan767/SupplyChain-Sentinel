import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Clock,
  Truck,
  Boxes,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { Supplier } from '../types';
import { useApp } from '../context/AppContext';

export const Suppliers: React.FC = () => {
  const { scenarioActive } = useApp();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc'); // default show lowest reliability (Supplier A) first
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>('SUP-001'); // open Supplier A by default for immediate demo impact
  const [supplierDetail, setSupplierDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    api.getSuppliers(search, riskFilter).then(setSuppliers).catch(console.error);
  }, [search, riskFilter, scenarioActive]);

  useEffect(() => {
    if (selectedSupplierId) {
      setLoadingDetail(true);
      api.getSupplierDetail(selectedSupplierId)
        .then(setSupplierDetail)
        .catch(console.error)
        .finally(() => setLoadingDetail(false));
    } else {
      setSupplierDetail(null);
    }
  }, [selectedSupplierId]);

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    return sortOrder === 'desc'
      ? b.reliability_score - a.reliability_score
      : a.reliability_score - b.reliability_score;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Supplier Intelligence</h1>
          <p className="text-xs text-[#686868] mt-1">
            Global supplier directory, reliability benchmarking, component sourcing mapping, and operational risk telemetry.
          </p>
        </div>

        {/* Search & Risk Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
            <input
              type="text"
              placeholder="Search by name, ID, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E5E5E5] rounded-md text-xs placeholder-[#888] focus:outline-none focus:border-[#ED6A24]"
            />
          </div>

          <div className="flex items-center bg-white border border-[#E5E5E5] rounded-md p-0.5 text-xs">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  riskFilter === lvl
                    ? 'bg-[#171717] text-white'
                    : 'text-[#686868] hover:text-[#171717]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#E5E5E5] hover:bg-gray-50 text-xs text-[#555] rounded-md"
            title="Sort by reliability score"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Reliability: {sortOrder === 'desc' ? 'High → Low' : 'Low → High'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Supplier Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table (Left / Center) */}
        <div className={`${selectedSupplierId ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#686868] font-semibold">
                  <th className="py-2.5 px-3">Supplier Name & ID</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3 text-center">Reliability</th>
                  <th className="py-2.5 px-3 text-center">Avg Lead Time</th>
                  <th className="py-2.5 px-3 text-center">Active Shipments</th>
                  <th className="py-2.5 px-3 text-center">Risk Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {sortedSuppliers.map((s) => {
                  const isSelected = selectedSupplierId === s.supplier_id;
                  const isSupplierA = s.supplier_id === 'SUP-001';

                  return (
                    <tr
                      key={s.supplier_id}
                      onClick={() => setSelectedSupplierId(s.supplier_id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-orange-50/50 hover:bg-orange-50/80'
                          : isSupplierA && scenarioActive
                          ? 'bg-red-50/30 hover:bg-red-50/60'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isSupplierA ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-[#555]'
                          }`}>
                            {s.supplier_id.slice(-3)}
                          </div>
                          <div>
                            <div className="font-semibold text-[#171717] flex items-center gap-1.5">
                              {s.supplier_name}
                              {isSupplierA && (
                                <span className="text-[9px] bg-red-600 text-white font-mono px-1 rounded">DISRUPTED</span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#888] font-mono">{s.supplier_id} • {s.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#555]">{s.location}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-mono font-bold ${
                          s.reliability_score < 80
                            ? 'text-red-600'
                            : s.reliability_score < 90
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`}>
                          {s.reliability_score}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-[#555] font-mono">{s.average_lead_time} days</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#333]">
                          {s.active_shipments_count}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            s.risk_status === 'HIGH'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : s.risk_status === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}
                        >
                          {s.risk_status}
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

        {/* Detail Drawer (Right) */}
        {selectedSupplierId && (
          <div className="lg:col-span-5 bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-5 shadow-xs sticky top-20">
            {loadingDetail ? (
              <div className="py-12 text-center text-xs text-[#888]">Loading supplier intelligence telemetry...</div>
            ) : supplierDetail ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-[#E5E5E5]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[#555]">
                        {supplierDetail.supplier.supplier_id}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        supplierDetail.supplier.risk_status === 'HIGH'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {supplierDetail.supplier.risk_status} RISK
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-[#171717] mt-1">{supplierDetail.supplier.supplier_name}</h2>
                    <p className="text-xs text-[#686868]">{supplierDetail.supplier.location} • {supplierDetail.supplier.category}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSupplierId(null)}
                    className="p-1 text-[#888] hover:text-[#171717] rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-[10px] text-[#686868]">Reliability</div>
                    <div className="text-sm font-bold text-[#171717] font-mono">{supplierDetail.supplier.reliability_score}%</div>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-[10px] text-[#686868]">Avg Lead Time</div>
                    <div className="text-sm font-bold text-[#171717] font-mono">{supplierDetail.supplier.average_lead_time}d</div>
                  </div>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="text-[10px] text-[#686868]">Contract Ref</div>
                    <div className="text-xs font-mono font-bold text-[#171717] mt-0.5">{supplierDetail.supplier.contract_ref}</div>
                  </div>
                </div>

                {/* Open Incidents if any */}
                {supplierDetail.open_incidents && supplierDetail.open_incidents.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-red-800">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Active Disruption Incident</span>
                    </div>
                    <p className="text-[11px] text-red-700 leading-relaxed">
                      {supplierDetail.open_incidents[0].description}
                    </p>
                    <div className="text-[10px] text-red-800 font-mono pt-1">
                      Shipment: {supplierDetail.open_incidents[0].shipment_id} | Delay: +{supplierDetail.open_incidents[0].delay_days} days
                    </div>
                  </div>
                )}

                {/* Components Supplied */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider text-[#888]">
                    Components Supplied ({supplierDetail.components.length})
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    {supplierDetail.components.map((c: any) => (
                      <div key={c.component_id} className="p-2 border border-[#E5E5E5] rounded flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#171717] flex items-center gap-1.5">
                            <span>{c.component_name}</span>
                            <span className="font-mono text-[10px] text-[#666]">[{c.component_id}]</span>
                          </div>
                          <div className="text-[10px] text-[#888]">
                            Stock: {c.available_stock} | Reserved: {c.reserved_stock} | Cost: ${c.unit_cost}
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          c.status === 'CRITICAL_SHORTAGE'
                            ? 'bg-red-100 text-red-800 font-bold'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Shipments */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider text-[#888]">
                    Active Shipments ({supplierDetail.shipments.length})
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    {supplierDetail.shipments.map((sh: any) => (
                      <div key={sh.shipment_id} className="p-2 border border-[#E5E5E5] rounded flex items-center justify-between">
                        <div>
                          <div className="font-mono font-semibold text-[#171717]">{sh.shipment_id} ({sh.quantity} units)</div>
                          <div className="text-[10px] text-[#888]">Route: {sh.origin} → {sh.destination}</div>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          sh.status === 'Delayed'
                            ? 'bg-red-100 text-red-800 font-bold'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {sh.status} {sh.delay_days > 0 ? `(+${sh.delay_days}d)` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Order History */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider text-[#888]">
                    Purchase Orders ({supplierDetail.purchase_orders.length})
                  </h3>
                  <div className="space-y-1 text-xs">
                    {supplierDetail.purchase_orders.slice(0, 3).map((po: any) => (
                      <div key={po.po_id} className="p-2 bg-gray-50 rounded flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-mono font-bold text-[#171717]">{po.po_id}</span>
                          <span className="text-[#888] ml-2">{po.component_name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold">${po.total_amount.toLocaleString()}</span>
                          <div className="text-[9px] text-[#888]">{po.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
