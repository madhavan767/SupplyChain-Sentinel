import React, { useState, useEffect } from 'react';
import {
  Boxes,
  ShoppingCart,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Info,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { Component, CustomerOrder, PurchaseOrder } from '../types';
import { useApp } from '../context/AppContext';

export const Inventory: React.FC = () => {
  const { scenarioActive } = useApp();
  const [activeTab, setActiveTab] = useState<'inventory' | 'customer_orders' | 'purchase_orders'>('inventory');
  const [components, setComponents] = useState<Component[]>([]);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

  useEffect(() => {
    api.getInventory(search, statusFilter).then(setComponents).catch(console.error);
    api.getOrders('customer').then(setCustomerOrders).catch(console.error);
    api.getOrders('purchase').then(setPurchaseOrders).catch(console.error);
  }, [search, statusFilter, scenarioActive]);

  // Set default selected component to C-101 for immediate demo visibility
  useEffect(() => {
    if (components.length > 0 && !selectedComponent) {
      const c101 = components.find(c => c.component_id === 'C-101');
      if (c101) setSelectedComponent(c101);
    }
  }, [components, selectedComponent]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Inventory & Orders</h1>
          <p className="text-xs text-[#686868] mt-1">
            Component stock availability, warehouse buffer tracking, Bill of Materials (BOM) explosion, and customer order fulfillment.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white border border-[#E5E5E5] rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'inventory' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#686868] hover:text-[#171717]'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Components ({components.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customer_orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'customer_orders' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#686868] hover:text-[#171717]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Customer Orders ({customerOrders.length})</span>
            {scenarioActive && (
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('purchase_orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'purchase_orders' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#686868] hover:text-[#171717]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Purchase Orders ({purchaseOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Primary Mathematical Shortage Summary Banner */}
      {scenarioActive && (
        <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#ED6A24] text-white rounded-md shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-orange-900 uppercase tracking-wider">
                Active Component Shortage Calculation (C-101 MCU)
              </div>
              <p className="text-xs text-orange-950 mt-0.5 leading-relaxed">
                Available unreserved inventory: <strong>30 units</strong> (150 on hand − 120 committed WIP). Immediate customer order demand: <strong>470 units</strong> across Siemens (240), Philips (80), and Schneider (150).
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs font-mono font-bold text-red-700">
                <span>Net Shortage Deficit = 470 − 150 = −320 Units</span>
                <span>•</span>
                <span className="text-orange-900 font-sans font-medium text-[11px]">Delayed shipment SHP-801 contains 500 units</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content by Tab */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inventory Table */}
          <div className={`${selectedComponent ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs`}>
            <div className="p-3 border-b border-[#E5E5E5] flex items-center justify-between bg-gray-50/50">
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                <input
                  type="text"
                  placeholder="Search components, suppliers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1 bg-white border border-[#E5E5E5] rounded text-xs focus:outline-none focus:border-[#ED6A24]"
                />
              </div>

              <div className="flex items-center gap-1 text-xs">
                {['ALL', 'CRITICAL_SHORTAGE', 'LOW_STOCK', 'NORMAL'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      statusFilter === st
                        ? 'bg-[#171717] text-white'
                        : 'text-[#686868] hover:text-[#171717] bg-white border border-gray-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#686868] font-semibold">
                    <th className="py-2.5 px-3">Component ID & Name</th>
                    <th className="py-2.5 px-3">Primary Supplier</th>
                    <th className="py-2.5 px-3 text-right">Available</th>
                    <th className="py-2.5 px-3 text-right">Reserved</th>
                    <th className="py-2.5 px-3 text-right">Reorder Lvl</th>
                    <th className="py-2.5 px-3 text-right">Unit Cost</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEFEF]">
                  {components.map((c) => {
                    const isSelected = selectedComponent?.component_id === c.component_id;
                    const isC101 = c.component_id === 'C-101';

                    return (
                      <tr
                        key={c.component_id}
                        onClick={() => setSelectedComponent(c)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-orange-50/50'
                            : isC101 && scenarioActive
                            ? 'bg-red-50/40 hover:bg-red-50/70'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[#171717] flex items-center gap-1.5">
                            {c.component_name}
                            {isC101 && (
                              <span className="text-[9px] bg-red-600 text-white font-mono px-1 rounded">DELAY IMPACT</span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#888] font-mono">{c.component_id} • {c.package_type}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[#555]">{c.supplier_name}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#171717]">{c.available_stock}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-[#666]">{c.reserved_stock}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-[#666]">{c.reorder_level}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">${c.unit_cost.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              c.status === 'CRITICAL_SHORTAGE'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : c.status === 'LOW_STOCK'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-green-100 text-green-800 border border-green-200'
                            }`}
                          >
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Component Deep-Dive Side Panel */}
          {selectedComponent && (
            <div className="lg:col-span-4 bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4 shadow-xs sticky top-20">
              <div className="pb-3 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[#555]">
                    {selectedComponent.component_id}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    selectedComponent.status === 'CRITICAL_SHORTAGE'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedComponent.status}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-[#171717] mt-1">{selectedComponent.component_name}</h2>
                <div className="text-[11px] text-[#686868] mt-0.5">{selectedComponent.warehouse_location}</div>
              </div>

              {/* Stock Numbers breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="text-[10px] text-[#686868]">On Hand</div>
                  <div className="text-sm font-bold text-[#171717] font-mono">{selectedComponent.available_stock}</div>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="text-[10px] text-[#686868]">Committed</div>
                  <div className="text-sm font-bold text-[#666] font-mono">{selectedComponent.reserved_stock}</div>
                </div>
                <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                  <div className="text-[10px] text-orange-800 font-semibold">Unreserved</div>
                  <div className="text-sm font-bold text-orange-950 font-mono">
                    {selectedComponent.available_stock - selectedComponent.reserved_stock}
                  </div>
                </div>
              </div>

              {/* Sourcing details */}
              <div className="space-y-2 text-xs">
                <div className="text-[#888] font-bold uppercase tracking-wider text-[10px]">Primary Sourcing</div>
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <div className="font-semibold text-[#171717]">{selectedComponent.supplier_name}</div>
                  <div className="text-[11px] text-[#666] mt-0.5">Supplier ID: {selectedComponent.supplier_id}</div>
                  <div className="text-[11px] text-[#666]">Unit Cost: ${selectedComponent.unit_cost.toFixed(2)} USD</div>
                </div>
              </div>

              {/* Alternate Supplier */}
              {selectedComponent.alternate_supplier_id && (
                <div className="space-y-2 text-xs">
                  <div className="text-[#888] font-bold uppercase tracking-wider text-[10px]">Pre-Qualified Backup Supplier</div>
                  <div className="p-2.5 bg-green-50/60 rounded border border-green-200">
                    <div className="font-semibold text-green-900">Vanguard Microdevices (SUP-007)</div>
                    <div className="text-[11px] text-green-800 mt-0.5">Pin-compatible MCU-32 variant (VM-3200)</div>
                    <div className="text-[11px] text-green-800 font-medium">Spot availability: 350 units (72h delivery)</div>
                  </div>
                </div>
              )}

              {/* Disruption Warning */}
              {selectedComponent.component_id === 'C-101' && scenarioActive && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs space-y-1">
                  <div className="font-bold text-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>Line Stoppage Trigger</span>
                  </div>
                  <p className="text-[11px] text-red-700 leading-snug">
                    Unreserved stock (30 units) is insufficient for upcoming production batches. Shipment SHP-801 delay causes an unbuffered 320 unit deficit.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Customer Orders Tab */}
      {activeTab === 'customer_orders' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs">
          <div className="p-3 border-b border-[#E5E5E5] flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Downstream Customer Delivery Commitments</h2>
              <p className="text-[11px] text-[#686868]">Customer orders evaluated against component availability</p>
            </div>
            <div className="text-xs text-[#686868]">
              Total Orders: <strong className="text-[#171717]">{customerOrders.length}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#686868] font-semibold">
                  <th className="py-2.5 px-3">Order ID & Customer</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3 text-center">Order Qty</th>
                  <th className="py-2.5 px-3 text-center">C-101 Required</th>
                  <th className="py-2.5 px-3 text-right">Order Value</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3 text-center">Priority</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {customerOrders.slice(0, 15).map((o) => {
                  const isAtRisk = o.status === 'At Risk';

                  return (
                    <tr
                      key={o.order_id}
                      className={`transition-colors ${
                        isAtRisk && scenarioActive
                          ? 'bg-red-50/40 hover:bg-red-50/70'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#171717]">{o.customer_name}</div>
                        <div className="text-[10px] text-[#888] font-mono">{o.order_id} • {o.destination_facility}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[#555] font-medium">{o.product_name}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#171717]">{o.quantity} units</td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {o.c101_required > 0 ? (
                          <span className={`font-bold ${isAtRisk ? 'text-red-700 bg-red-100/80 px-1.5 py-0.5 rounded' : 'text-[#555]'}`}>
                            {o.c101_required} MCUs
                          </span>
                        ) : (
                          <span className="text-[#888]">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#171717]">
                        ${o.order_value.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#555]">{o.due_date}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          o.priority === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : o.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-[#555]'
                        }`}>
                          {o.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          o.status === 'At Risk'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Purchase Orders Tab */}
      {activeTab === 'purchase_orders' && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs">
          <div className="p-3 border-b border-[#E5E5E5] flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Active Upstream Purchase Orders</h2>
              <p className="text-[11px] text-[#686868]">Component replenishment orders issued to suppliers</p>
            </div>
            <div className="text-xs text-[#686868]">
              Total POs: <strong className="text-[#171717]">{purchaseOrders.length}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#686868] font-semibold">
                  <th className="py-2.5 px-3">PO Number</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">Component</th>
                  <th className="py-2.5 px-3 text-center">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Shipment Ref</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {purchaseOrders.slice(0, 15).map((po) => {
                  const isDelayed = po.status.includes('Delayed');

                  return (
                    <tr
                      key={po.po_id}
                      className={`transition-colors ${
                        isDelayed && scenarioActive ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#171717]">{po.po_id}</td>
                      <td className="py-2.5 px-3 text-[#555] font-medium">{po.supplier_name}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[#171717]">{po.component_name}</span>
                        <span className="text-[10px] text-[#888] font-mono ml-1.5">[{po.component_id}]</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#171717]">{po.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#171717]">${po.total_amount.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-[#555]">{po.due_date}</td>
                      <td className="py-2.5 px-3 font-mono text-[#666]">{po.associated_shipment}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          isDelayed
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : po.status === 'Received'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
