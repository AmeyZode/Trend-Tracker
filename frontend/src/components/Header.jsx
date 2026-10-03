import React from 'react';
import { Target, Radio, RefreshCw, Plus, Cpu, PlaySquare, BarChart3, Globe, Newspaper, Zap, Activity } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onAddCompetitor, onGlobalCheck, isCheckingAll, wsConnected }) {
  const navTabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3, color: 'from-indigo-500 to-cyan-500' },
    { id: 'competitors', label: 'Competitors & Sources', icon: Globe, color: 'from-blue-500 to-indigo-500' },
    { id: 'articles', label: 'Detected Articles & SLA', icon: Newspaper, color: 'from-emerald-500 to-teal-500' },
    { id: 'demo', label: 'Interactive Demo Blog', icon: PlaySquare, badge: 'Testbed', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'benchmark', label: '100-Website Scale Bench', icon: Cpu, badge: 'Scale', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080c14]/80 backdrop-blur-2xl transition-all shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
              <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-white/20 flex items-center justify-center shadow-inner">
                <Target className="h-6 w-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  TrendTracker
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                Real-Time Competitor Content Monitoring & Intelligence
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Live WebSocket Status Indicator */}
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs transition-all ${
              wsConnected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                {wsConnected ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-400"></span>
                  </>
                ) : (
                  <span className="inline-flex rounded-full h-2.5 w-2.5 bg-slate-500"></span>
                )}
              </span>
              <span className="font-mono text-[11px] font-medium">
                {wsConnected ? 'Live Stream Active' : 'Connecting Stream...'}
              </span>
            </div>

            {/* Check All Button */}
            <button
              onClick={onGlobalCheck}
              disabled={isCheckingAll}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isCheckingAll
                  ? 'bg-slate-800/60 text-slate-400 border-slate-700 cursor-not-allowed'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-white/10 hover:border-slate-600 shadow-md hover:shadow-lg'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isCheckingAll ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{isCheckingAll ? 'Checking All Sites...' : 'Trigger Scan'}</span>
            </button>

            {/* Add Competitor Button */}
            <button
              onClick={onAddCompetitor}
              className="relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 group-hover:opacity-90 transition-opacity"></div>
              <div className="relative flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span>Add Target</span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-white/5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-slate-900 text-white border border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
