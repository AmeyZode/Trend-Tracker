import React, { useState } from 'react';
import { X, ExternalLink, Calendar, Clock, User, Tag, Layers, CheckCircle2, AlertTriangle, Image as ImageIcon, Link2, Sparkles } from 'lucide-react';

export default function ArticleModal({ article, onClose }) {
  const [activeTab, setActiveTab] = useState('content');

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl w-full max-w-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/10 bg-slate-900/80">
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {article.competitor_name}
              </span>
              <span className="text-slate-600">•</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                article.detection_method === 'RSS'
                  ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                  : article.detection_method === 'SITEMAP'
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              }`}>
                Detected via {article.detection_method}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{article.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Timing Performance Banner */}
        <div className="px-6 py-3.5 bg-slate-900/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Published</span>
              <span className="font-mono text-slate-200 font-medium">
                {article.published_at ? new Date(article.published_at).toLocaleString() : 'Unknown'}
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Detected</span>
              <span className="font-mono text-slate-200 font-medium">
                {article.detected_at ? new Date(article.detected_at).toLocaleString() : 'Now'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Detection Delay</span>
              <span className={`font-mono text-sm font-extrabold ${
                article.is_within_sla ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {article.detection_delay_formatted || '0s'}
              </span>
            </div>
            <div className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase flex items-center gap-1 border ${
              article.is_within_sla
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}>
              {article.is_within_sla ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {article.is_within_sla ? 'Target Met (<5m)' : 'Over 5m Target'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-white/10 bg-slate-900/30 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'content' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Extracted Content</span>
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'metadata' ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Structured Metadata & Signals</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 flex-1">
          {activeTab === 'content' ? (
            <>
              {/* Featured Image */}
              {article.featured_image && (
                <div className="rounded-2xl overflow-hidden border border-white/10 max-h-64 mb-4 shadow-lg">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Author and URL */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-indigo-400" />
                  Author: <strong className="text-slate-200">{article.author || 'Editorial Team'}</strong>
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  <span>Open Source Article</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Body Text */}
              <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans text-sm bg-slate-900/60 p-5 rounded-2xl border border-white/5">
                {article.content || article.meta_description || 'No textual content extracted.'}
              </div>

              {/* Categories & Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {article.categories?.map((cat, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {cat}
                  </span>
                ))}
                {article.tags?.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-white/10 text-[11px] flex items-center gap-1">
                    <Tag className="h-3 w-3 text-slate-500" />
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 font-mono text-[11px] space-y-2.5">
                <div><span className="text-slate-400">Canonical URL:</span> <span className="text-cyan-300 ml-2">{article.canonical_url}</span></div>
                <div><span className="text-slate-400">Original URL:</span> <span className="text-slate-300 ml-2">{article.url}</span></div>
                <div><span className="text-slate-400">Detection Method:</span> <span className="text-purple-300 font-bold ml-2">{article.detection_method}</span></div>
                <div><span className="text-slate-400">Detection Delay (sec):</span> <span className="text-amber-300 font-bold ml-2">{article.detection_delay_seconds}s</span></div>
              </div>

              {article.raw_metadata && Object.keys(article.raw_metadata).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    Raw OpenGraph & HTML Meta Signals
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 font-mono text-[11px] space-y-1.5 text-slate-400 max-h-56 overflow-y-auto">
                    {Object.entries(article.raw_metadata).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-white/5 py-1">
                        <span className="text-indigo-400">{k}:</span>
                        <span className="text-slate-200 truncate max-w-xs">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
