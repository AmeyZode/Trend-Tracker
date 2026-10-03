import React, { useState } from 'react';
import { X, Search, Sparkles, CheckCircle2, XCircle, Globe, Radio, Compass, FileCode2, ArrowRight, Loader2, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function CompetitorModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState(60);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleInspect = async () => {
    if (!url || url.length < 4) {
      setError('Please enter a valid website URL');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const data = await api.inspectWebsite(url);
      setAnalysisResult(data);
      if (!name) {
        // Auto derive name from URL domain
        try {
          const parsed = new URL(data.target_url);
          const domainName = parsed.hostname.replace('www.', '').split('.')[0];
          setName(domainName.charAt(0).toUpperCase() + domainName.slice(1) + ' Blog');
        } catch {
          setName('New Competitor');
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to inspect website. Check URL and connectivity.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !url) {
      setError('Name and Website URL are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createCompetitor({
        name,
        website_url: url,
        check_interval_sec: interval,
        auto_investigate: !analysisResult
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save competitor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl w-full max-w-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Target with AI Investigation</h2>
              <p className="text-xs text-slate-400">Autonomous probing of feeds, sitemaps, and article structure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* URL Input with Inspect Button */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Website or Blog URL to Monitor
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. techcrunch.com, aws.amazon.com/blogs, or http://127.0.0.1:8000/demo/blog"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleInspect}
                disabled={isAnalyzing || !url}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/25"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              The analyzer will investigate RSS feeds, XML sitemaps, robots.txt, and HTML article markup.
            </p>
          </div>

          {/* Autonomous Analysis Results Matrix */}
          {analysisResult && (
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Investigation Findings ({analysisResult.analysis_duration_ms}ms)
                </span>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold">
                  Selected Strategy: {analysisResult.selected_strategy}
                </span>
              </div>

              {/* 3 Methods Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Method 1: RSS */}
                <div className={`p-3.5 rounded-xl border text-xs ${
                  analysisResult.strategies_available.rss
                    ? 'bg-orange-500/15 border-orange-500/40 text-orange-200'
                    : 'bg-slate-900/40 border-white/5 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Radio className="h-3.5 w-3.5 text-orange-400" />
                      RSS / Atom
                    </span>
                    {analysisResult.strategies_available.rss ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                  <div className="text-[10px] truncate text-slate-400 font-mono">
                    {analysisResult.feed_details?.feed_url || 'None detected'}
                  </div>
                </div>

                {/* Method 2: Sitemap */}
                <div className={`p-3.5 rounded-xl border text-xs ${
                  analysisResult.strategies_available.sitemap
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-900/40 border-white/5 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <Compass className="h-3.5 w-3.5 text-cyan-400" />
                      XML Sitemap
                    </span>
                    {analysisResult.strategies_available.sitemap ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                  <div className="text-[10px] truncate text-slate-400 font-mono">
                    {analysisResult.sitemap_details?.sitemap_url || 'None detected'}
                  </div>
                </div>

                {/* Method 3: Direct Page */}
                <div className={`p-3.5 rounded-xl border text-xs ${
                  analysisResult.strategies_available.direct_page
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-200'
                    : 'bg-slate-900/40 border-white/5 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <FileCode2 className="h-3.5 w-3.5 text-purple-400" />
                      Direct Page
                    </span>
                    {analysisResult.strategies_available.direct_page ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                  <div className="text-[10px] truncate text-slate-400 font-mono">
                    {analysisResult.blog_details?.blog_url || 'Root Page'}
                  </div>
                </div>
              </div>

              {/* Metadata support signals */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Publication Metadata Signals:</span>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-md border ${analysisResult.publication_metadata_support?.json_ld ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-slate-600 border-transparent'}`}>JSON-LD</span>
                  <span className={`px-2 py-0.5 rounded-md border ${analysisResult.publication_metadata_support?.opengraph ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-slate-600 border-transparent'}`}>OpenGraph</span>
                  <span className={`px-2 py-0.5 rounded-md border ${analysisResult.publication_metadata_support?.time_tags ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-slate-600 border-transparent'}`}>&lt;time&gt; tags</span>
                </div>
              </div>
            </div>
          )}

          {/* Competitor Name & Check Interval */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Competitor Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AWS Blog"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Monitoring Check Interval
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={30}>Every 30 seconds (High Frequency)</option>
                <option value={60}>Every 1 minute (Standard)</option>
                <option value={120}>Every 2 minutes</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/80 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting || !name || !url}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Saving Target...</span>
              </>
            ) : (
              <>
                <span>Save & Start Monitoring</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
