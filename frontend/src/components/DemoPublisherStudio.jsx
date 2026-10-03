import React, { useState } from 'react';
import { PlaySquare, Send, Sparkles, Clock, Globe, Radio, Compass, RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';

const PRESET_ARTICLES = [
  {
    title: "Breakthrough: Sub-Second Vector Search Engine Released for Production Clouds",
    category: "Cloud Architecture",
    author: "Elena Rostova, Principal Architect",
    minutes_ago: 2,
    content: "Today we are open-sourcing our next-generation vector retrieval engine. By leveraging SIMD vectorization and lock-free in-memory index structures, latency drops from 45ms to under 800 microseconds at 100M vector scale."
  },
  {
    title: "Critical Security Advisory: Zero-Day Memory Isolation Patch Deployed",
    category: "Security & Reliability",
    author: "Marcus Vance, CISO",
    minutes_ago: 8,
    content: "Our automated telemetry detected an edge-case memory isolation anomaly in hypervisor ring 0. A hotpatch was verified and rolled out across 14 global regions within 18 minutes. No customer data was exposed."
  },
  {
    title: "Autonomous Agent Orchestration: Designing Fault-Tolerant Feedback Loops",
    category: "Artificial Intelligence",
    author: "Dr. Maya Vance",
    minutes_ago: 0,
    content: "Managing fleets of autonomous coding agents requires robust error boundaries, structured persistence, and proactive health checks. This deep-dive explores multi-agent scheduling patterns."
  }
];

export default function DemoPublisherStudio({ onArticleDetected }) {
  const [title, setTitle] = useState(PRESET_ARTICLES[0].title);
  const [content, setContent] = useState(PRESET_ARTICLES[0].content);
  const [author, setAuthor] = useState(PRESET_ARTICLES[0].author);
  const [category, setCategory] = useState(PRESET_ARTICLES[0].category);
  const [minutesAgo, setMinutesAgo] = useState(2);
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setContent(preset.content);
    setAuthor(preset.author);
    setCategory(preset.category);
    setMinutesAgo(preset.minutes_ago);
    setLastResult(null);
  };

  const handlePublishAndScan = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(null);
    setLastResult(null);

    try {
      // 1. Publish to controlled demo blog
      const publishRes = await api.publishDemoArticle({
        title,
        content,
        author,
        category,
        minutes_ago: minutesAgo
      });

      // 2. Trigger instant monitoring scan across all sources
      const scanRes = await api.checkAllCompetitors();

      setLastResult({
        published: publishRes,
        scan: scanRes
      });

      if (onArticleDetected) onArticleDetected();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to publish and monitor article.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset the demo blog to default seed articles?')) return;
    setIsResetting(true);
    try {
      await api.resetDemoBlog();
      await api.checkAllCompetitors();
      setLastResult(null);
      if (onArticleDetected) onArticleDetected();
    } catch (err) {
      alert('Reset failed: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel-glow rounded-3xl p-6 relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-amber-500/10">
                <Sparkles className="h-3 w-3" />
                Controlled Testbed Environment
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <PlaySquare className="h-5 w-5 text-amber-400" />
              Interactive Publisher & Detection Delay Testbed
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Simulate competitor publishing in real-time. Publish an article with customized publication timestamps (e.g. 0s, 3m, 10m ago), trigger continuous monitoring, and verify the exact Detection Delay calculation live!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/demo/blog"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            >
              <span>View /demo/blog</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
            <a
              href="/demo/rss.xml"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-xs font-semibold text-orange-300 transition-all shadow-sm"
            >
              <span>/demo/rss.xml</span>
              <Radio className="h-3.5 w-3.5 text-orange-400" />
            </a>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
            >
              {isResetting ? 'Resetting...' : 'Reset Seeds'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form & Presets */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
          {/* Quick Presets */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Quick Test Presets:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_ARTICLES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`p-3.5 rounded-xl text-left border transition-all text-xs ${
                    title === p.title
                      ? 'bg-gradient-to-b from-indigo-950/60 to-purple-950/60 border-indigo-500/50 text-white shadow-lg shadow-indigo-950/40'
                      : 'bg-slate-900/40 border-white/5 hover:border-white/15 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-bold text-cyan-400 uppercase mb-1">{p.category}</div>
                  <div className="font-semibold line-clamp-2 text-slate-200">{p.title}</div>
                  <div className="text-[10px] text-amber-400 mt-2 font-mono">Offset: {p.minutes_ago}m ago</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handlePublishAndScan} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Article Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Timing Simulator Slider */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Simulate Publication Timestamp
                </span>
                <span className="font-mono font-bold text-amber-300 px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  {minutesAgo === 0 ? 'Published Right Now (0m)' : `Published ${minutesAgo} minute(s) ago`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={1}
                value={minutesAgo}
                onChange={(e) => setMinutesAgo(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-emerald-400">0m (Instant target)</span>
                <span className="text-indigo-400">3m (Normal SLA)</span>
                <span className="text-amber-400">5m (SLA Boundary)</span>
                <span className="text-rose-400">15m (Over SLA Test)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Article Body Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-300" />
                  <span>Publishing & Triggering Instant Detection Scan...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Publish to Demo Blog & Trigger Live Detection Scan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Live Live Detection Proof & Flow */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Live Detection Flow Proof
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">1. Publication Event</div>
                <p className="text-slate-300 leading-relaxed">
                  Article is injected into <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">/demo/blog</code> and <code className="text-orange-300 bg-slate-800 px-1 py-0.5 rounded">/demo/rss.xml</code> with UTC timestamp.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">2. Monitoring Cycle</div>
                <p className="text-slate-300 leading-relaxed">
                  Async workers query feed & sitemap, diff discovered canonical URLs, and detect new candidate article.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">3. Timing & Delay Calculation</div>
                <div className="font-mono text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                  Delay = Detected(UTC) - Published(UTC)
                </div>
              </div>
            </div>
          </div>

          {/* Last Result Showcase */}
          {lastResult && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 animate-in fade-in shadow-lg shadow-emerald-950/30">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Detection Event Succeeded!</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-slate-300">
                <div>Published: {new Date(lastResult.published.published_at).toLocaleTimeString()}</div>
                <div>Simulated Offset: {lastResult.published.minutes_ago}m ago</div>
                <div className="text-emerald-300 font-bold">New Articles Discovered: +{lastResult.scan.newly_detected}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
