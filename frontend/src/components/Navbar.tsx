import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  PlayCircle,
  Network,
  Bell,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { scenarioActive, runScenario, resetScenario, traceImpact } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('supp') || q.includes('apex') || q.includes('taiwan')) {
      navigate('/suppliers');
    } else if (q.includes('c-101') || q.includes('mcu') || q.includes('stock') || q.includes('inv')) {
      navigate('/inventory');
    } else if (q.includes('ship') || q.includes('shp-801') || q.includes('delay')) {
      navigate('/shipments');
    } else if (q.includes('graph') || q.includes('depend') || q.includes('trace')) {
      navigate('/dependency-map');
    } else if (q.includes('risk') || q.includes('score')) {
      navigate('/risk-analysis');
    } else if (q.includes('plan') || q.includes('recov') || q.includes('option')) {
      navigate('/recovery-plans');
    } else {
      navigate('/ai-assistant');
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    await resetScenario();
    setTimeout(() => setIsResetting(false), 500);
  };

  const handleRun = async () => {
    setIsRunning(true);
    await runScenario();
    setTimeout(() => setIsRunning(false), 500);
  };

  const handleTrace = async () => {
    navigate('/dependency-map');
    await traceImpact();
  };

  return (
    <header className="h-14 bg-white border-b border-[#E5E5E5] fixed top-0 left-64 right-0 z-20 flex items-center justify-between px-6">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-80">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            type="text"
            placeholder="Search suppliers, C-101, orders, shipments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-md text-xs placeholder-[#888] focus:outline-none focus:border-[#ED6A24] focus:bg-white transition-colors"
          />
        </form>
      </div>

      {/* Center Scenario / Demo Badge */}
      <div className="flex items-center gap-2">
        {/* Prominent Demo Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-300/60 rounded-full text-[11px] font-semibold text-amber-900 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>SIMULATED DEMONSTRATION DATA</span>
        </div>

        {scenarioActive ? (
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full text-[11px] font-medium text-red-700">
            <AlertOctagon className="w-3 h-3 text-red-600" />
            <span>Supplier A Disruption Active (5d Delay)</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-medium text-green-700">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span>Baseline State (Normal Supply Flow)</span>
          </div>
        )}
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Trace Impact Action */}
        <button
          onClick={handleTrace}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#ED6A24] hover:bg-[#D85A18] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          title="Highlight affected downstream entities in knowledge graph"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Trace Impact</span>
        </button>

        {/* Run Scenario Button */}
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#171717] hover:bg-black text-white text-xs font-medium rounded-md transition-colors"
          title="Trigger Supplier A 500-unit 5-day microcontroller delay"
        >
          <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Run Scenario</span>
        </button>

        {/* Reset Demo Button */}
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#D4D4D4] hover:bg-gray-50 text-[#171717] text-xs font-medium rounded-md transition-colors"
          title="Restore original dataset and baseline demo state"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-[#686868] ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo</span>
        </button>

        <div className="h-5 w-[1px] bg-[#E5E5E5] mx-1" />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-md text-[#555] hover:bg-gray-100 hover:text-[#171717] relative"
          >
            <Bell className="w-4 h-4" />
            {scenarioActive && (
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-3 z-50 text-xs">
              <div className="font-semibold text-[#171717] pb-2 border-b border-[#EEE] flex items-center justify-between">
                <span>Operational Alerts</span>
                <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-mono">1 Critical</span>
              </div>
              <div className="py-2.5 space-y-2">
                <div className="p-2 bg-red-50/70 border border-red-200 rounded">
                  <div className="font-semibold text-red-800">Shipment SHP-801 Delayed (+5d)</div>
                  <div className="text-[11px] text-red-700 mt-0.5">Supplier A: 500 units of C-101 held at Hsinchu packaging line.</div>
                  <div className="text-[10px] text-red-600 font-mono mt-1">Impact: Siemens Energy ORD-501, Philips Medical ORD-502</div>
                </div>
              </div>
              <button
                onClick={() => { setShowNotifications(false); navigate('/shipments'); }}
                className="w-full text-center py-1 text-[11px] text-[#ED6A24] font-semibold hover:underline block pt-2 border-t border-[#EEE]"
              >
                View all shipments →
              </button>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center text-xs font-semibold">
            SC
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-[#171717] leading-none">Ops Sentinel</div>
            <div className="text-[10px] text-[#686868] leading-none mt-1">Admin / Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
};
