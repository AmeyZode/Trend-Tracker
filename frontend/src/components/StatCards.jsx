import React from 'react';
import { Globe, Clock, Zap, ShieldCheck, TrendingUp, Sparkles, Radio } from 'lucide-react';

export default function StatCards({ stats }) {
  const comp = stats?.competitors || { total: 0, active: 0, error: 0 };
  const perf = stats?.performance || {
    avg_delay_formatted: 'N/A',
    fastest_delay_formatted: 'N/A',
    slowest_delay_formatted: 'N/A',
    within_sla_percent: 100,
    over_sla_percent: 0,
    total_articles: 0
  };
  const art = stats?.articles || { total: 0, today: 0 };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Monitored Competitors */}
      <div className="glass-panel glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monitored Fleet</span>
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Globe className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{comp.total}</span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {comp.active} Active
          </span>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2.5">
          <span className="flex items-center gap-1">
            <Radio className="h-3 w-3 text-cyan-400" /> Continuous Auto-Poll
          </span>
          <span className={`font-mono font-medium ${comp.error > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
            {comp.error} Issues
          </span>
        </div>
      </div>

      {/* Card 2: Average Detection Delay */}
      <div className="glass-panel-glow glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Avg Detection Delay</span>
          <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-sm shadow-indigo-500/20">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {perf.avg_delay_formatted || '0s'}
          </span>
          <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 rounded-full">
            Target &lt; 5m
          </span>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2.5">
          <span>Total Monitored Articles</span>
          <span className="font-mono text-indigo-300 font-semibold">{art.total} Verified</span>
        </div>
      </div>

      {/* Card 3: Fastest & Slowest Latency extremes */}
      <div className="glass-panel glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Speed Extremes</span>
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/20">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
              <span>Fastest</span>
            </div>
            <div className="text-lg font-extrabold font-mono text-white mt-0.5">{perf.fastest_delay_formatted || 'N/A'}</div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
            <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <span>Slowest</span>
            </div>
            <div className="text-lg font-extrabold font-mono text-white mt-0.5">{perf.slowest_delay_formatted || 'N/A'}</div>
          </div>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
          <span>Discovered Today</span>
          <span className="font-mono text-emerald-400 font-semibold">+{art.today} New</span>
        </div>
      </div>

      {/* Card 4: 5-Minute SLA Compliance */}
      <div className="glass-panel glass-card-hover rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">5-Min SLA Compliance</span>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {perf.within_sla_percent}%
          </span>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            Under 300s
          </span>
        </div>
        {/* Visual Progress Bar */}
        <div className="mt-3 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden flex border border-white/5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${perf.within_sla_percent}%` }}
          ></div>
          <div
            className="bg-rose-500 h-full transition-all duration-500 shadow-sm shadow-rose-500/50"
            style={{ width: `${perf.over_sla_percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
