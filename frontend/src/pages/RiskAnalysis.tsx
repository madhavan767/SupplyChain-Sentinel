import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  FileText,
  Building2,
  Boxes,
  Truck,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { RiskAnalysisResponse } from '../types';
import { useApp } from '../context/AppContext';

export const RiskAnalysis: React.FC = () => {
  const { scenarioActive } = useApp();
  const [data, setData] = useState<RiskAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Configurable sliders for illustrative model demonstration
  const [urgencyVal, setUrgencyVal] = useState(92);
  const [shortageVal, setShortageVal] = useState(88);
  const [criticalityVal, setCriticalityVal] = useState(90);
  const [dependencyVal, setDependencyVal] = useState(85);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getRiskAnalysis()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [scenarioActive]);

  // Dynamic score recalculation based on interactive sliders
  const calculatedScore = Number((
    (0.35 * urgencyVal) +
    (0.25 * shortageVal) +
    (0.25 * criticalityVal) +
    (0.15 * dependencyVal)
  ).toFixed(2));

  const classification = calculatedScore >= 70 ? 'HIGH' : calculatedScore >= 40 ? 'MEDIUM' : 'LOW';

  const resetSliders = () => {
    setUrgencyVal(92);
    setShortageVal(88);
    setCriticalityVal(90);
    setDependencyVal(85);
  };

  if (loading || !data) {
    return <div className="py-16 text-center text-xs text-[#888]">Computing risk intelligence matrix...</div>;
  }

  const assessment = data.disruption_assessment;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Risk Intelligence Dashboard</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold border border-red-200">
              {classification} RISK
            </span>
          </div>
          <p className="text-xs text-[#686868] mt-1">
            Explainable multi-factor scoring model, factor sensitivity decomposition, and evidence-grounded risk rationales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E5E5] hover:bg-gray-50 text-xs text-[#171717] font-medium rounded-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ED6A24]" />
            <span>Ask AI Assistant</span>
          </button>
          <button
            onClick={() => navigate('/recovery-plans')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ED6A24] hover:bg-[#D85A18] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <span>Mitigation Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prominent Model Disclaimer */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2.5 text-xs text-[#555]">
        <Info className="w-4 h-4 text-[#888] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#171717]">PROTOTYPE RISK SCORING MODEL NOTICE: </span>
          This scoring model is an initial rule-based prototype engine implementing normalized weighted operational factors, not a trained predictive AI model or calibrated probability.
        </div>
      </div>

      {/* Main Grid: Scoring Engine (Left) & Risk Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Formula & Factor Decomposition */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-6 shadow-xs">
          {/* Header Score Display */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
            <div>
              <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Composite Risk Exposure</div>
              <div className="text-3xl font-extrabold text-[#171717] font-mono mt-0.5">
                {calculatedScore} <span className="text-sm font-normal text-[#888]">/ 100</span>
              </div>
              <div className="text-xs text-[#686868] mt-1 font-mono">
                Formula: (0.35 × U) + (0.25 × S) + (0.25 × C) + (0.15 × D)
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold font-mono ${
                classification === 'HIGH'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : classification === 'MEDIUM'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {classification} RISK
              </span>
              <div className="mt-2">
                <button
                  onClick={resetSliders}
                  className="inline-flex items-center gap-1 text-[11px] text-[#686868] hover:text-[#171717]"
                  title="Reset to verified baseline scenario parameters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Baseline</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Factor Sliders & Weights */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider text-[#888]">
              Risk Factor Decomposition (Interactive Sensitivity Analysis)
            </h2>

            {/* Factor 1: Delivery Urgency */}
            <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#171717]">1. Delivery Urgency</span>
                  <span className="text-[10px] text-[#888] font-mono ml-2">(Weight: 35%)</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="font-bold text-[#171717]">{urgencyVal}</span> / 100
                  <span className="text-red-700 font-semibold ml-2">(+{(0.35 * urgencyVal).toFixed(2)} pts)</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={urgencyVal}
                onChange={(e) => setUrgencyVal(Number(e.target.value))}
                className="w-full accent-[#ED6A24] cursor-pointer"
              />
              <p className="text-[11px] text-[#666]">
                5-day shipment delay with imminent customer due dates starting Nov 10 (Siemens ORD-501).
              </p>
            </div>

            {/* Factor 2: Inventory Shortage Severity */}
            <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#171717]">2. Inventory Shortage Severity</span>
                  <span className="text-[10px] text-[#888] font-mono ml-2">(Weight: 25%)</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="font-bold text-[#171717]">{shortageVal}</span> / 100
                  <span className="text-red-700 font-semibold ml-2">(+{(0.25 * shortageVal).toFixed(2)} pts)</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={shortageVal}
                onChange={(e) => setShortageVal(Number(e.target.value))}
                className="w-full accent-[#ED6A24] cursor-pointer"
              />
              <p className="text-[11px] text-[#666]">
                Available unreserved inventory (30 units) vs. required demand (470 units) yields an acute −320 unit deficit.
              </p>
            </div>

            {/* Factor 3: Component Criticality */}
            <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#171717]">3. Component Criticality</span>
                  <span className="text-[10px] text-[#888] font-mono ml-2">(Weight: 25%)</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="font-bold text-[#171717]">{criticalityVal}</span> / 100
                  <span className="text-red-700 font-semibold ml-2">(+{(0.25 * criticalityVal).toFixed(2)} pts)</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={criticalityVal}
                onChange={(e) => setCriticalityVal(Number(e.target.value))}
                className="w-full accent-[#ED6A24] cursor-pointer"
              />
              <p className="text-[11px] text-[#666]">
                C-101 microcontroller is the single processing CPU across 4 finished product lines with no on-board bypass.
              </p>
            </div>

            {/* Factor 4: Supplier Dependency Risk */}
            <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#171717]">4. Supplier Dependency Risk</span>
                  <span className="text-[10px] text-[#888] font-mono ml-2">(Weight: 15%)</span>
                </div>
                <div className="font-mono text-xs">
                  <span className="font-bold text-[#171717]">{dependencyVal}</span> / 100
                  <span className="text-red-700 font-semibold ml-2">(+{(0.15 * dependencyVal).toFixed(2)} pts)</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dependencyVal}
                onChange={(e) => setDependencyVal(Number(e.target.value))}
                className="w-full accent-[#ED6A24] cursor-pointer"
              />
              <p className="text-[11px] text-[#666]">
                Supplier A reliability score is 78.4% (Tier-2 Watchlist) with single-source lot lock.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Risk Detail Panel */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-[#E5E5E5] p-5 space-y-4 shadow-xs">
          <div className="pb-3 border-b border-[#E5E5E5]">
            <h2 className="text-sm font-bold text-[#171717]">Incident Risk Detail Panel</h2>
            <p className="text-xs text-[#686868]">Explainable diagnosis with operational evidence</p>
          </div>

          {/* What Happened? */}
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-[#171717] flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ED6A24]" />
              What happened?
            </h3>
            <p className="text-[#555] leading-relaxed pl-3 border-l-2 border-orange-200">
              {assessment.explanation.what_happened}
            </p>
          </div>

          {/* Why is this risky? */}
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-[#171717] flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Why is this risky?
            </h3>
            <p className="text-[#555] leading-relaxed pl-3 border-l-2 border-red-200">
              {assessment.explanation.why_is_this_risky}
            </p>
          </div>

          {/* Affected Entities */}
          <div className="space-y-1.5 text-xs">
            <h3 className="font-bold text-[#171717] flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
              What entities are affected?
            </h3>
            <div className="space-y-1 pl-3">
              {assessment.explanation.entities_affected.map((ent, i) => (
                <div key={i} className="text-[#555] flex items-start gap-1.5">
                  <span className="text-[#888]">•</span>
                  <span>{ent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="space-y-1.5 text-xs">
            <h3 className="font-bold text-[#171717] flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              What evidence supports the assessment?
            </h3>
            <div className="space-y-1.5 pl-3">
              {assessment.explanation.supporting_evidence.map((ev, i) => (
                <div key={i} className="p-2 bg-gray-50 border border-gray-200 rounded text-[11px] text-[#444] font-mono">
                  {ev}
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-[#EFEFEF]">
            <h3 className="font-bold text-[#171717] flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              Suggested Immediate Actions:
            </h3>
            <div className="space-y-1.5 pl-3">
              {assessment.explanation.suggested_actions.map((act, i) => (
                <div key={i} className="text-[#333] text-[11px] flex items-start gap-1.5">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/recovery-plans')}
              className="w-full mt-3 py-2 bg-[#ED6A24] hover:bg-[#D85A18] text-white text-xs font-semibold rounded transition-colors text-center shadow-xs"
            >
              Open Recovery Action Planner →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
