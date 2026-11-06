import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Boxes,
  Truck,
  Network,
  ShieldAlert,
  Bot,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/suppliers', label: 'Suppliers', icon: Building2 },
  { path: '/inventory', label: 'Inventory & Orders', icon: Boxes },
  { path: '/shipments', label: 'Shipment Monitoring', icon: Truck, alertBadge: true },
  { path: '/dependency-map', label: 'Dependency Map', icon: Network, highlight: true },
  { path: '/risk-analysis', label: 'Risk Intelligence', icon: ShieldAlert, badgeText: '89.5' },
  { path: '/ai-assistant', label: 'AI Assistant', icon: Bot, badgeText: 'RAG' },
  { path: '/recovery-plans', label: 'Recovery Planning', icon: Lightbulb, badgeText: '4 Options' },
];

export const Sidebar: React.FC = () => {
  const { scenarioActive, kpis } = useApp();
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#ED6A24] flex items-center justify-center text-white shadow-sm font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#171717] tracking-tight leading-tight">
              SupplyChain <span className="text-[#ED6A24]">Sentinel</span>
            </h1>
            <p className="text-[11px] text-[#686868] font-medium leading-none mt-0.5">
              Control Tower & Intelligence
            </p>
          </div>
        </div>

        <div className="mt-3 px-2 py-1.5 bg-[#FFF5F0] border border-[#FDBA74]/40 rounded-md text-[11px] text-[#ED6A24] font-medium leading-tight">
          From Fragmented Supply Chains to Intelligent Decisions
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-[#8E8E8E] uppercase tracking-wider">
          Enterprise Control Tower
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#525252] hover:bg-[#F5F5F5] hover:text-[#171717]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#ED6A24]' : 'text-[#737373]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badgeText && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeText === '89.5'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-[#F0F0F0] text-[#555]'
                  }`}
                >
                  {item.badgeText}
                </span>
              )}

              {item.alertBadge && scenarioActive && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Disruption Alert Box in Sidebar */}
      {scenarioActive && (
        <div className="mx-3 mb-3 p-3 rounded-lg border border-red-200 bg-red-50/70 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-red-800 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>Active Disruption</span>
          </div>
          <p className="text-[11px] text-red-700 leading-snug">
            Supplier A delay: 500 units of C-101 delayed +5 days.
          </p>
          <NavLink
            to="/dependency-map"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 hover:text-red-950 mt-1.5 underline"
          >
            Trace Impact in Graph →
          </NavLink>
        </div>
      )}

      {/* Team & Institutional Footer */}
      <div className="p-3.5 border-t border-[#E5E5E5] bg-[#FAFAFA]">
        <div className="text-[11px] font-medium text-[#171717]">
          Team: <span className="font-semibold text-[#ED6A24]">WWI</span>
        </div>
        <div className="text-[10px] text-[#686868] truncate" title="Kakinada Institute of Engineering and Technology">
          Kakinada Inst. of Eng. & Tech.
        </div>
        <div className="mt-2 pt-2 border-t border-[#EFEFEF] flex items-center justify-between text-[10px] text-[#888]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Demo System Active
          </span>
          <span className="font-mono text-[9px] bg-gray-200 px-1 py-0.5 rounded">v1.0-RC</span>
        </div>
      </div>
    </aside>
  );
};
