import React, { useState, useEffect } from 'react';
import { Newspaper, Search, Filter, Clock, ExternalLink, ShieldCheck, AlertTriangle, Eye, ArrowUpDown, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import ArticleModal from './ArticleModal';

export default function ArticlesView({ competitors, refreshTrigger }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedSla, setSelectedSla] = useState('');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await api.getArticles({
        competitor_id: selectedCompetitor || undefined,
        detection_method: selectedMethod || undefined,
        sla_filter: selectedSla || undefined,
        search: search || undefined,
        limit: 100
      });
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCompetitor, selectedMethod, selectedSla, refreshTrigger]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-emerald-400" />
            Detected Competitor Articles ({articles.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed with verified publication timestamps and exact detection delays
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-48 transition-all"
            />
          </form>

          {/* Competitor Select */}
          <select
            value={selectedCompetitor}
            onChange={(e) => setSelectedCompetitor(e.target.value)}
            className="px-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Competitors</option>
            {competitors.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Method Select */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Methods</option>
            <option value="RSS">RSS / Atom</option>
            <option value="SITEMAP">XML Sitemap</option>
            <option value="DIRECT_PAGE">Direct Blog Page</option>
          </select>

          {/* SLA Filter */}
          <select
            value={selectedSla}
            onChange={(e) => setSelectedSla(e.target.value)}
            className="px-3 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="">All SLA Statuses</option>
            <option value="within_5min">Within 5m Target (Fast)</option>
            <option value="over_5min">Over 5m Target</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Article Title & Source</th>
                <th className="px-4 py-4">Published Time</th>
                <th className="px-4 py-4">Detected Time</th>
                <th className="px-4 py-4 text-center">Detection Delay</th>
                <th className="px-4 py-4 text-center">Method</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading detected articles feed...</span>
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Newspaper className="h-8 w-8 text-slate-600 stroke-1" />
                      <span>No articles detected matching your current filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr
                    key={art.id}
                    className="hover:bg-indigo-950/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedArticle(art)}
                  >
                    {/* Title & Competitor */}
                    <td className="px-5 py-4 max-w-md">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-400 mb-1 uppercase tracking-wider">
                        <span>{art.competitor_name}</span>
                      </div>
                      <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {art.title}
                      </div>
                      {art.author && (
                        <div className="text-[11px] text-slate-400 mt-1">
                          By {art.author}
                        </div>
                      )}
                    </td>

                    {/* Published Time */}
                    <td className="px-4 py-4 whitespace-nowrap font-mono text-xs">
                      {art.published_at ? (
                        <>
                          <div className="text-slate-200 font-medium">{new Date(art.published_at).toLocaleDateString()}</div>
                          <div className="text-[11px] text-slate-400">{new Date(art.published_at).toLocaleTimeString()}</div>
                        </>
                      ) : (
                        <span className="text-slate-500">Unspecified</span>
                      )}
                    </td>

                    {/* Detected Time */}
                    <td className="px-4 py-4 whitespace-nowrap font-mono text-xs">
                      <div className="text-slate-200 font-medium">{new Date(art.detected_at).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400">{new Date(art.detected_at).toLocaleTimeString()}</div>
                    </td>

                    {/* Detection Delay */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <div className={`inline-flex flex-col items-center px-3.5 py-1.5 rounded-xl border ${
                        art.is_within_sla
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        <span className="font-mono font-extrabold text-sm leading-tight">
                          {art.detection_delay_formatted || '0s'}
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-wider opacity-90 flex items-center gap-1 mt-0.5">
                          {art.is_within_sla ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          {art.is_within_sla ? '< 5m SLA' : '> 5m SLA'}
                        </span>
                      </div>
                    </td>

                    {/* Method */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                        art.detection_method === 'RSS'
                          ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                          : art.detection_method === 'SITEMAP'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      }`}>
                        {art.detection_method}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedArticle(art)}
                          className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="View Extracted Content"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={art.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          title="Open Original URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
