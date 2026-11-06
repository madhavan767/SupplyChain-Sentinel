import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Network,
  Search,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  Building2,
  Boxes,
  Package,
  ShoppingCart,
  Truck,
  Warehouse,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ImpactTrace } from '../types';

// Custom Node: Supplier
const SupplierNodeComponent = ({ data }: NodeProps) => {
  const isImpacted = data.isImpacted;
  return (
    <div
      className={`px-3 py-2.5 rounded-lg border bg-white shadow-xs min-w-[200px] transition-all ${
        isImpacted
          ? 'border-red-500 ring-2 ring-red-400 bg-red-50/40'
          : 'border-[#E5E5E5] hover:border-gray-400'
      }`}
    >
      <div className="flex items-center justify-between text-[10px] text-[#888] pb-1">
        <span className="font-mono">{data.id as string}</span>
        <span className={`px-1 rounded font-bold font-mono ${isImpacted ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-[#555]'}`}>
          {data.risk as string} RISK
        </span>
      </div>
      <div className="font-bold text-xs text-[#171717] truncate">{data.label as string}</div>
      <div className="text-[10px] text-[#666] mt-0.5">{data.location as string}</div>
      <div className="text-[10px] text-[#888] font-mono mt-1">Reliability: {data.reliability as string}</div>
      <Handle type="source" position={Position.Right} className="!bg-[#ED6A24]" />
    </div>
  );
};

// Custom Node: Component
const ComponentNodeComponent = ({ data }: NodeProps) => {
  const isImpacted = data.isImpacted;
  return (
    <div
      className={`px-3 py-2.5 rounded-lg border bg-white shadow-xs min-w-[210px] transition-all ${
        isImpacted
          ? 'border-red-500 ring-2 ring-red-400 bg-red-50/40'
          : 'border-[#E5E5E5] hover:border-gray-400'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#ED6A24]" />
      <div className="flex items-center justify-between text-[10px] text-[#888] pb-1">
        <span className="font-mono font-bold text-[#171717]">{data.id as string}</span>
        <span className={`px-1 rounded font-bold font-mono ${isImpacted ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-[#555]'}`}>
          {data.status as string}
        </span>
      </div>
      <div className="font-semibold text-xs text-[#171717] truncate">{data.label as string}</div>
      <div className="flex items-center justify-between text-[10px] text-[#666] font-mono mt-1">
        <span>Stock: {data.available as number}</span>
        <span>Reserved: {data.reserved as number}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-[#ED6A24]" />
    </div>
  );
};

// Custom Node: Shipment
const ShipmentNodeComponent = ({ data }: NodeProps) => {
  const isImpacted = data.isImpacted;
  return (
    <div
      className={`px-2.5 py-2 rounded-md border bg-white shadow-xs min-w-[150px] text-xs transition-all ${
        isImpacted
          ? 'border-red-400 ring-1 ring-red-300 bg-red-50/50'
          : 'border-dashed border-gray-300'
      }`}
    >
      <div className="text-[10px] font-mono font-bold text-gray-500">{data.id as string}</div>
      <div className="text-[11px] font-semibold text-[#171717]">{data.label as string}</div>
      <div className={`text-[10px] font-mono font-semibold mt-0.5 ${isImpacted ? 'text-red-600' : 'text-blue-600'}`}>
        {data.status as string} ({data.delay as string})
      </div>
      <Handle type="source" position={Position.Right} className="!bg-[#ED6A24]" />
    </div>
  );
};

// Custom Node: Product
const ProductNodeComponent = ({ data }: NodeProps) => {
  const isImpacted = data.isImpacted;
  return (
    <div
      className={`px-3 py-2.5 rounded-lg border bg-white shadow-xs min-w-[210px] transition-all ${
        isImpacted
          ? 'border-red-500 ring-2 ring-red-400 bg-red-50/40'
          : 'border-[#E5E5E5] hover:border-gray-400'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#ED6A24]" />
      <div className="flex items-center justify-between text-[10px] text-[#888] pb-1">
        <span className="font-mono font-bold text-[#171717]">{data.id as string}</span>
        <span className="text-[#888] font-mono">{data.price as string}</span>
      </div>
      <div className="font-semibold text-xs text-[#171717] truncate">{data.label as string}</div>
      <div className="text-[10px] text-[#666] mt-0.5">Criticality: {data.criticality as string}</div>
      <Handle type="source" position={Position.Right} className="!bg-[#ED6A24]" />
    </div>
  );
};

// Custom Node: Customer Order
const OrderNodeComponent = ({ data }: NodeProps) => {
  const isImpacted = data.isImpacted;
  return (
    <div
      className={`px-3 py-2.5 rounded-lg border bg-white shadow-xs min-w-[220px] transition-all ${
        isImpacted
          ? 'border-red-500 ring-2 ring-red-400 bg-red-50/40'
          : 'border-[#E5E5E5] hover:border-gray-400'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#ED6A24]" />
      <div className="flex items-center justify-between text-[10px] text-[#888] pb-1">
        <span className="font-mono font-bold text-[#171717]">{data.id as string}</span>
        <span className={`px-1.5 py-0.5 rounded font-bold font-mono text-[9px] ${
          isImpacted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {data.status as string}
        </span>
      </div>
      <div className="font-bold text-xs text-[#171717] truncate">{data.label as string}</div>
      <div className="flex items-center justify-between text-[10px] text-[#666] font-mono mt-1">
        <span>Qty: {data.orderQty as string}</span>
        <span className="font-bold text-[#171717]">{data.value as string}</span>
      </div>
      <div className="text-[10px] text-[#888] font-mono mt-0.5">Due: {data.dueDate as string}</div>
    </div>
  );
};

// Custom Node: Warehouse Location
const LocationNodeComponent = ({ data }: NodeProps) => {
  return (
    <div className="px-3 py-2.5 rounded-lg border border-dashed border-blue-300 bg-blue-50/50 shadow-xs min-w-[220px]">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
        <Warehouse className="w-3.5 h-3.5" />
        <span>Strategic Buffer Hub</span>
      </div>
      <div className="font-bold text-xs text-blue-950 mt-1">{data.label as string}</div>
      <div className="text-[11px] font-mono font-semibold text-blue-800 mt-0.5">{data.stockC101 as string}</div>
      <div className="text-[10px] text-blue-600 mt-1">{data.status as string}</div>
    </div>
  );
};

export const DependencyMap: React.FC = () => {
  const { scenarioActive, impactTraced, traceImpact } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [impactTraceData, setImpactTraceData] = useState<ImpactTrace | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const navigate = useNavigate();

  const nodeTypes = useMemo(() => ({
    supplierNode: SupplierNodeComponent,
    componentNode: ComponentNodeComponent,
    shipmentNode: ShipmentNodeComponent,
    productNode: ProductNodeComponent,
    orderNode: OrderNodeComponent,
    locationNode: LocationNodeComponent,
  }), []);

  const loadGraph = useCallback(async (highlight: boolean) => {
    try {
      const graphData = await api.getDependencies(highlight);
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    } catch (err) {
      console.error('Failed to load dependency graph:', err);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadGraph(impactTraced);
    if (impactTraced) {
      api.traceDependencies().then(setImpactTraceData).catch(console.error);
    }
  }, [loadGraph, impactTraced]);

  const handleTraceDisruption = async () => {
    setIsTracing(true);
    try {
      const traceResult = await traceImpact();
      setImpactTraceData(traceResult);
      await loadGraph(true);
    } finally {
      setIsTracing(false);
    }
  };

  const onNodeClick = (_: any, node: any) => {
    setSelectedNodeData(node.data);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Dependency Intelligence Knowledge Graph</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-gray-100 text-[#555] rounded border border-gray-200">
              Interactive React Flow
            </span>
          </div>
          <p className="text-xs text-[#686868] mt-0.5">
            Full relational map connecting Suppliers → Shipments → Components → Products → Customer Orders & Buffer Warehouses.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTraceDisruption}
            disabled={isTracing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ED6A24] hover:bg-[#D85A18] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>{isTracing ? 'Tracing Ripple Impact...' : 'Trace Disruption Impact'}</span>
          </button>

          <button
            onClick={() => loadGraph(false)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#E5E5E5] hover:bg-gray-50 text-xs text-[#555] rounded-md transition-colors"
            title="Reset highlight"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Highlighting</span>
          </button>
        </div>
      </div>

      {/* React Flow Graph Container */}
      <div className="relative w-full h-[680px] bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.5}
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E5E5" />
          <Controls showInteractive={false} className="!bg-white !border !border-[#E5E5E5] !rounded-md !shadow-xs" />
          <MiniMap
            nodeStrokeColor="#ED6A24"
            nodeColor="#F4F4F5"
            className="!border !border-[#E5E5E5] !rounded-lg"
            maskColor="rgba(240, 240, 240, 0.6)"
          />
        </ReactFlow>

        {/* Legend Overlay at Top Left */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-[#E5E5E5] rounded-lg p-2.5 shadow-sm text-xs pointer-events-none z-10 space-y-1">
          <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Multi-Tier Hierarchy</div>
          <div className="flex items-center gap-3 text-[11px] text-[#555]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-gray-200 border border-gray-400 inline-block" /> Suppliers
            </span>
            <span>→</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-100 border border-blue-400 inline-block" /> Components
            </span>
            <span>→</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-100 border border-purple-400 inline-block" /> Products
            </span>
            <span>→</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-400 inline-block" /> Customer Orders
            </span>
          </div>
          {impactTraced && (
            <div className="text-[10px] text-red-600 font-bold flex items-center gap-1 pt-1 border-t border-gray-100">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Red path indicates primary disruption propagation
            </div>
          )}
        </div>

        {/* Side Panel: Impact Summary Drawer when Traced */}
        {impactTraceData && (
          <div className="absolute top-4 right-4 bottom-4 w-96 bg-white/98 backdrop-blur-md border border-[#E5E5E5] rounded-xl shadow-xl p-5 overflow-y-auto z-20 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-red-100 text-red-700 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#171717]">Disruption Impact Summary</h2>
                  <p className="text-[10px] text-[#888] font-mono">Incident {impactTraceData.incident_id}</p>
                </div>
              </div>
              <button
                onClick={() => setImpactTraceData(null)}
                className="p-1 text-[#888] hover:text-[#171717] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Root Origin */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1">
              <div className="font-bold text-red-900">{impactTraceData.source_supplier.name}</div>
              <div className="text-[11px] text-red-800">{impactTraceData.source_supplier.incident}</div>
            </div>

            {/* Component Shortage Metrics */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider">
                Component Shortage Metrics ({impactTraceData.affected_component.id})
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="text-[10px] text-[#666]">Available Unreserved</div>
                  <div className="text-sm font-bold text-[#171717] font-mono">
                    {impactTraceData.affected_component.unreserved_stock} units
                  </div>
                </div>
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <div className="text-[10px] text-red-700 font-semibold">Net Deficit</div>
                  <div className="text-sm font-bold text-red-700 font-mono">
                    −{impactTraceData.affected_component.net_shortage} units
                  </div>
                </div>
              </div>
            </div>

            {/* Downstream Customer Orders */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#888] uppercase tracking-wider">
                <span>Directly Affected Customer Orders</span>
                <span className="text-red-600 font-mono">4 Orders</span>
              </div>
              <div className="space-y-1.5">
                {impactTraceData.affected_customer_orders.map((ord) => (
                  <div key={ord.order_id} className="p-2.5 bg-gray-50 border border-[#E5E5E5] rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171717]">{ord.customer}</span>
                      <span className="font-mono font-bold text-[#171717]">${ord.order_value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#666] font-mono mt-0.5">
                      <span>Order {ord.order_id} • Due {ord.due_date}</span>
                      <span className="text-red-600 font-semibold">Req: {ord.c101_required} MCUs</span>
                    </div>
                    <div className="text-[10px] text-red-700 mt-1">{ord.sla_penalty_risk}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Financial Exposure */}
            <div className="p-3 bg-[#171717] text-white rounded-lg space-y-1">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Total Revenue at Risk</div>
              <div className="text-xl font-bold font-mono">
                ${impactTraceData.financial_exposure.total_at_risk_revenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400">
                Imminent SLA liquidated damage penalties: ${impactTraceData.financial_exposure.imminent_penalty_cost.toLocaleString()}
              </div>
            </div>

            {/* Formulate Recovery Button */}
            <button
              onClick={() => navigate('/recovery-plans')}
              className="w-full py-2 bg-[#ED6A24] hover:bg-[#D85A18] text-white font-semibold rounded-md transition-colors text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Generate Recovery Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
