import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';
import { RecoveryOption } from '../types';
import { useApp } from '../context/AppContext';

export const RecoveryPlans: React.FC = () => {
  const { scenarioActive } = useApp();
  const [options, setOptions] = useState<RecoveryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const res = await api.getRecoveryPlans();
      setOptions(res.options);
    } catch (err) {
      console.error('Failed to load recovery plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [scenarioActive]);

  const handleUpdateStatus = async (optionId: string, newStatus: string, notes: string = '') => {
    try {
      await api.updateRecoveryPlanStatus(optionId, newStatus, notes);
      setActionFeedback(`Plan ${optionId} status updated to "${newStatus}"`);
      await fetchOptions();
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to update plan status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Recovery Planning Engine</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-green-50 text-green-700 rounded font-semibold border border-green-200">
              4 Evaluated Pathways
            </span>
          </div>
          <p className="text-xs text-[#686868] mt-1">
            AI-assisted mitigation strategies for Supplier A delay on Component C-101. Evaluate feasibility, cost, lead-time, and operational risk.
          </p>
        </div>

        {/* Toggle Compare Mode */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              compareMode
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-white text-[#171717] border-[#E5E5E5] hover:bg-gray-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{compareMode ? 'Exit Comparison Table' : 'Compare All 4 Options'}</span>
          </button>
        </div>
      </div>

      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-900 rounded-lg text-xs font-medium flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{actionFeedback}</span>
          </div>
          <span className="text-[10px] text-green-700 font-mono">Workflow Synchronized</span>
        </div>
      )}

      {/* Disruption Context Banner */}
      <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-lg flex items-start gap-3">
        <div className="p-2 bg-[#ED6A24] text-white rounded-md shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-orange-900 uppercase tracking-wider text-[11px]">
            Target Problem Statement & Constraints
          </div>
          <p className="text-orange-950 leading-relaxed">
            Supplier A shipment SHP-801 delayed 5 days (Nov 08 → Nov 13, 2026). Acute net shortage of <strong>320 units</strong> against critical orders: Siemens Energy ORD-501 (due Nov 10, req 240 MCUs), Philips Medical ORD-502 (due Nov 12, req 80 MCUs), and Schneider Electric ORD-503 (due Nov 14, req 150 MCUs).
          </p>
        </div>
      </div>

      {/* Comparison Table View */}
      {compareMode && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs">
          <div className="p-3 bg-gray-50 border-b border-[#E5E5E5] text-xs font-bold text-[#171717]">
            Side-by-Side Operational Recovery Comparison
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E5E5] text-[#686868] font-semibold">
                  <th className="py-2.5 px-3">Option</th>
                  <th className="py-2.5 px-3">Strategy</th>
                  <th className="py-2.5 px-3 text-center">Resolution Time</th>
                  <th className="py-2.5 px-3 text-right">Est. Direct Cost</th>
                  <th className="py-2.5 px-3 text-center">Feasibility</th>
                  <th className="py-2.5 px-3">Key Advantage</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {options.map((opt) => (
                  <tr key={opt.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-semibold text-[#171717]">{opt.title}</td>
                    <td className="py-3 px-3 font-mono text-[#555]">{opt.strategy}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#171717]">{opt.time_to_resolve_display}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#171717]">${opt.estimated_cost.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        {opt.feasibility_score}% ({opt.feasibility})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#555] max-w-xs truncate">{opt.operational_impact}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        opt.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : opt.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : opt.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {opt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cards List for Each Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((opt, idx) => {
          const isApproved = opt.status === 'Approved';
          const isUnderReview = opt.status === 'Under Review';
          const isRejected = opt.status === 'Rejected';

          return (
            <div
              key={opt.id}
              className={`bg-white rounded-xl border p-5 space-y-4 shadow-xs transition-all ${
                isApproved
                  ? 'border-green-500 ring-2 ring-green-300'
                  : opt.is_recommended
                  ? 'border-[#ED6A24] ring-1 ring-[#ED6A24]/30'
                  : 'border-[#E5E5E5] hover:border-gray-400'
              }`}
            >
              {/* Option Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                      Option {idx + 1} • {opt.strategy}
                    </span>
                    {opt.is_recommended && (
                      <span className="text-[9px] font-bold bg-[#FFF5F0] text-[#ED6A24] border border-[#FDBA74]/50 px-1.5 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-[#171717] mt-1">{opt.title}</h2>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded font-mono ${
                    isApproved
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : isUnderReview
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : isRejected
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-gray-100 text-[#555] border border-gray-200'
                  }`}
                >
                  {opt.status}
                </span>
              </div>

              {/* Action Description */}
              <p className="text-xs text-[#333] leading-relaxed bg-[#FAFAFA] p-3 rounded-lg border border-[#EFEFEF]">
                {opt.action_description}
              </p>

              {/* Key Quantitative Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="text-[10px] text-[#686868] flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-[#888]" /> Resolution
                  </div>
                  <div className="text-xs font-bold text-[#171717] font-mono mt-0.5">
                    {opt.time_to_resolve_display}
                  </div>
                </div>

                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="text-[10px] text-[#686868] flex items-center justify-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#888]" /> Est. Cost
                  </div>
                  <div className="text-xs font-bold text-[#171717] font-mono mt-0.5">
                    ${opt.estimated_cost.toLocaleString()}
                  </div>
                </div>

                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="text-[10px] text-[#686868] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#888]" /> Feasibility
                  </div>
                  <div className="text-xs font-bold text-green-700 font-mono mt-0.5">
                    {opt.feasibility_score}%
                  </div>
                </div>
              </div>

              {/* Operational Impact */}
              <div className="space-y-1 text-xs">
                <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Operational Impact</div>
                <p className="text-[#444] text-[11px] leading-relaxed">{opt.operational_impact}</p>
              </div>

              {/* Supporting Evidence & Contract Reference */}
              <div className="space-y-1 text-xs">
                <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Supporting Evidence</div>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-[11px] font-mono text-[#555]">
                  {opt.supporting_evidence}
                </div>
              </div>

              {/* Assumptions & Constraints */}
              <div className="space-y-1 text-xs">
                <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Assumptions & Constraints</div>
                <div className="text-[11px] text-[#666] italic">{opt.assumptions_and_constraints}</div>
              </div>

              {/* Action Buttons to update state */}
              <div className="pt-3 border-t border-[#EFEFEF] flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(opt.id, 'Approved', 'Approved by Enterprise Supply Chain Director')}
                  disabled={isApproved}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1 ${
                    isApproved
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-[#171717] hover:bg-black text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isApproved ? 'Approved' : 'Approve for Execution'}</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(opt.id, 'Under Review', 'Sent to Logistics Desk for air courier quote validation')}
                  className="px-3 py-1.5 bg-white border border-[#D4D4D4] hover:bg-gray-50 text-[#171717] text-xs font-medium rounded transition-colors"
                >
                  Under Review
                </button>

                <button
                  onClick={() => handleUpdateStatus(opt.id, 'Rejected', 'Rejected due to cost or timeline priority')}
                  disabled={isRejected}
                  className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 text-xs font-medium rounded transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
