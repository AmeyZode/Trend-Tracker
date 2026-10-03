import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import StatCards from './components/StatCards';
import PerformanceCharts from './components/PerformanceCharts';
import CompetitorsView from './components/CompetitorsView';
import ArticlesView from './components/ArticlesView';
import DemoPublisherStudio from './components/DemoPublisherStudio';
import BenchmarkStudio from './components/BenchmarkStudio';
import CompetitorModal from './components/CompetitorModal';
import ArticleModal from './components/ArticleModal';
import LiveEventTicker from './components/LiveEventTicker';
import { api } from './services/api';
import { ShieldCheck, ArrowRight, Activity, Clock, Layers, Sparkles, ExternalLink, RefreshCw, Radio, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectArticle, setInspectArticle] = useState(null);

  // Live WebSocket stream
  const [wsConnected, setWsConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch Core Data
  const fetchData = async () => {
    try {
      const [statsData, compsData] = await Promise.all([
        api.getDashboardStats(),
        api.getCompetitors()
      ]);
      setStats(statsData);
      setCompetitors(compsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Background polling interval every 15s to keep stats fresh
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  // WebSocket Connection
  useEffect(() => {
    let ws;
    let wsUrl = '';
    if (import.meta.env.VITE_API_URL) {
      let base = import.meta.env.VITE_API_URL;
      if (!base.startsWith('http')) base = 'https://' + base;
      wsUrl = base.replace(/^http/, 'ws') + '/ws/live';
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsUrl = `${protocol}//${host}/ws/live`;
    }

    const connectWs = () => {
      try {
        ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          setWsConnected(true);
        };
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLiveEvents((prev) => [data, ...prev.slice(0, 9)]);
            if (data.event === 'NEW_ARTICLE_DETECTED') {
              fetchData();
              setRefreshKey((k) => k + 1);
            }
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };
        ws.onclose = () => {
          setWsConnected(false);
          // Retry connect after 3s
          setTimeout(connectWs, 3000);
        };
        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (e) {
        console.error('WebSocket connection failed:', e);
      }
    };

    connectWs();
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleGlobalCheck = async () => {
    setIsCheckingAll(true);
    try {
      await api.checkAllCompetitors();
      await fetchData();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Global check failed:', err);
    } finally {
      setIsCheckingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background light orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddCompetitor={() => setIsAddModalOpen(true)}
        onGlobalCheck={handleGlobalCheck}
        isCheckingAll={isCheckingAll}
        wsConnected={wsConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Live Notification Ticker */}
        <LiveEventTicker
          events={liveEvents}
          onArticleClick={(art) => setInspectArticle(art)}
        />

        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <StatCards stats={stats} />

            {/* Performance Charts */}
            <PerformanceCharts stats={stats} />

            {/* Bottom 2 Grid: Recent Detected Articles & Active Targets Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Articles */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-400" />
                      Latest Detected Articles
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Live feed with calculated detection delays</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View All Feed</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {stats?.recent_articles && stats.recent_articles.length > 0 ? (
                    stats.recent_articles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => setInspectArticle(art)}
                        className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-4 cursor-pointer group shadow-sm"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                            <span>{art.competitor_name}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 font-medium">{art.detection_method}</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                            {art.title}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className={`text-right px-3 py-1.5 rounded-xl border text-xs ${
                            art.is_within_sla
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          }`}>
                            <div className="font-mono font-bold">{art.detection_delay_formatted || '0s'}</div>
                            <div className="text-[9px] uppercase font-semibold opacity-80">
                              {art.is_within_sla ? '< 5m SLA' : '> 5m SLA'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No articles detected yet. Click "Trigger Scan" or publish a demo article.
                    </div>
                  )}
                </div>
              </div>

              {/* Active Monitoring Sources */}
              <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="h-4 w-4 text-purple-400" />
                        Monitored Targets
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Status & Article Totals</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('competitors')}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {competitors.slice(0, 5).map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between hover:border-white/15 transition-all">
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-white truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                            {c.website_url.replace('https://', '').replace('http://', '')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`h-2 w-2 rounded-full ${c.monitoring_enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                          <span className="text-[11px] font-mono text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-white/5">{c.articles_count} arts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-3 w-3 text-cyan-400" />
                    Continuous Engine Polling
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">60s interval</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Competitors */}
        {activeTab === 'competitors' && (
          <CompetitorsView
            competitors={competitors}
            onRefresh={fetchData}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        )}

        {/* Tab 3: Detected Articles */}
        {activeTab === 'articles' && (
          <ArticlesView
            competitors={competitors}
            refreshTrigger={refreshKey}
          />
        )}

        {/* Tab 4: Interactive Demo Publisher */}
        {activeTab === 'demo' && (
          <DemoPublisherStudio
            onArticleDetected={() => {
              fetchData();
              setRefreshKey((k) => k + 1);
            }}
          />
        )}

        {/* Tab 5: 100-Website Scale Benchmark */}
        {activeTab === 'benchmark' && (
          <BenchmarkStudio />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-5 text-xs text-slate-400 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">TrendTracker</span>
            <span className="text-slate-600">•</span>
            <span>Real-Time Competitor Content Monitoring & Intelligence</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>Detection Intelligence • SLA Timing Engine • Non-Blocking Concurrency</span>
          </div>
        </div>
      </footer>

      {/* Add Competitor Modal */}
      <CompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={() => {
          fetchData();
          setRefreshKey((k) => k + 1);
        }}
      />

      {/* Article Detail Inspector Modal */}
      {inspectArticle && (
        <ArticleModal
          article={inspectArticle}
          onClose={() => setInspectArticle(null)}
        />
      )}
    </div>
  );
}
