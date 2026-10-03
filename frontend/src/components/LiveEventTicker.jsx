import React from 'react';
import { Bell, Zap, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function LiveEventTicker({ events, onArticleClick }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="mb-6 space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Live Real-Time Detection Stream</span>
      </div>

      <div className="flex flex-col gap-2">
        {events.slice(0, 3).map((evt, idx) => {
          if (evt.event === 'NEW_ARTICLE_DETECTED') {
            const art = evt.data;
            const isFast = art.detection_delay_seconds !== null && art.detection_delay_seconds <= 300;
            return (
              <div
                key={idx}
                onClick={() => onArticleClick && onArticleClick(art)}
                className="glass-panel rounded-xl p-3.5 border border-indigo-500/30 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/80 hover:border-indigo-500/60 transition-all shadow-lg shadow-black/30 animate-in slide-in-from-top duration-300 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">{art.competitor_name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-white/10">{art.detection_method}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">{art.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Detection Delay</div>
                    <div className={`font-mono text-xs font-bold ${isFast ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {art.detection_delay_formatted || '0s'}
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl text-xs border ${
                    isFast 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    {isFast ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
