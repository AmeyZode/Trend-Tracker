import React, { useState } from 'react';
import { Globe, RefreshCw, Trash2, Power, ExternalLink, Radio, Compass, FileCode2, Clock, CheckCircle2, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function CompetitorsView({ competitors, onRefresh, onAddClick }) {
  const [checkingId, setCheckingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleCheckNow = async (id) => {
    setCheckingId(id);
    try {
      await api.checkCompetitor(id);
      onRefresh();
    } catch (err) {
      alert('Check failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setCheckingId(null);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.toggleCompetitor(id);
      onRefresh();
    } catch (err) {
      alert('Toggle failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from monitoring?`)) return;
    setDeletingId(id);
    try {
      await api.deleteCompetitor(id);
      onRefresh();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            Monitored Competitor Ecosystem ({competitors.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-target monitoring configurations with automatic source detection
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Target</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.map((comp) => {
          const isChecking = checkingId === comp.id;
          const isDeleting = deletingId === comp.id;
          const isDemo = comp.website_url?.includes('/demo');

          return (
            <div
              key={comp.id}
              className={`glass-panel glass-card-hover rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between group ${
                isDemo ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-slate-950/80' : 'border-white/10'
              }`}
            >
              {isDemo && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider text-slate-950 shadow-md flex items-center gap-1">
                  <Sparkles className="h-3 w-3 fill-slate-950" />
                  Interactive Testbed
                </div>
              )}

              {/* Top Row: Name & Status */}
              <div>
                <div className="flex items-start justify-between gap-2 pr-12">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      {comp.name}
                    </h3>
                    <a
                      href={comp.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 mt-1 font-mono truncate max-w-[200px]"
                    >
                      <span>{comp.website_url.replace('https://', '').replace('http://', '')}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Status & Last Check */}
                <div className="mt-3.5 flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    comp.status === 'active' && comp.monitoring_enabled
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : comp.status === 'error'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      comp.monitoring_enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`} />
                    {comp.monitoring_enabled ? (comp.status === 'active' ? 'Active' : 'Error') : 'Paused'}
                  </span>

                  <span className="text-slate-600">•</span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-slate-500" />
                    {comp.last_checked ? new Date(comp.last_checked).toLocaleTimeString() : 'Pending'}
                  </span>
                </div>

                {/* Discovered Strategies */}
                <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Configured Sources</div>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.sources && comp.sources.length > 0 ? (
                      comp.sources.map((s) => (
                        <span
                          key={s.id}
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border flex items-center gap-1 ${
                            s.source_type === 'RSS'
                              ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                              : s.source_type === 'SITEMAP'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          }`}
                        >
                          {s.source_type === 'RSS' && <Radio className="h-3 w-3" />}
                          {s.source_type === 'SITEMAP' && <Compass className="h-3 w-3" />}
                          {s.source_type === 'DIRECT_PAGE' && <FileCode2 className="h-3 w-3" />}
                          {s.source_type}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500">Auto direct page tracking</span>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Detected Articles:</span>
                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/10">{comp.articles_count}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggle(comp.id)}
                  title={comp.monitoring_enabled ? 'Pause monitoring' : 'Resume monitoring'}
                  className={`p-2 rounded-xl text-xs transition-colors border ${
                    comp.monitoring_enabled
                      ? 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-white/10 hover:border-slate-600'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCheckNow(comp.id)}
                    disabled={isChecking}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin text-cyan-400' : 'text-indigo-400'}`} />
                    <span>{isChecking ? 'Checking...' : 'Check Now'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(comp.id, comp.name)}
                    disabled={isDeleting}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
