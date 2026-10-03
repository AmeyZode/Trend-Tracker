import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, Radio, Compass, FileCode2 } from 'lucide-react';

const METHOD_COLORS = {
  RSS: '#f97316',        // Radiant Orange
  SITEMAP: '#0ea5e9',    // Electric Cyan
  DIRECT_PAGE: '#a855f7' // Vivid Purple
};

export default function PerformanceCharts({ stats }) {
  const trendData = stats?.delay_trends || [];
  const methodDist = stats?.method_distribution || { RSS: 0, SITEMAP: 0, DIRECT_PAGE: 0 };

  const pieData = [
    { name: 'RSS / Atom', value: methodDist.RSS || 0, color: METHOD_COLORS.RSS },
    { name: 'XML Sitemap', value: methodDist.SITEMAP || 0, color: METHOD_COLORS.SITEMAP },
    { name: 'Direct Page', value: methodDist.DIRECT_PAGE || 0, color: METHOD_COLORS.DIRECT_PAGE },
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-indigo-500/30 p-3.5 rounded-xl shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-bold text-white mb-1.5 line-clamp-1">{data.label}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Detection Delay:</span>
            <span className="font-mono font-bold text-cyan-400">{data.delay_min} mins ({data.delay_sec}s)</span>
          </div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <span className="text-slate-400">Method:</span>
            <span className="font-semibold text-purple-300">{data.method}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
            <span>Detected:</span>
            <span>{data.detected_at}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Chart 1: Detection Delay Timeline */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Detection Delay per Article (Minutes)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target SLA threshold benchmark is 5.0 minutes (300 seconds)
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm">
            5.0 min Target SLA
          </span>
        </div>

        <div className="h-64 w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                  unit="m"
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={5}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{ value: '5m Target SLA', fill: '#f43f5e', fontSize: 10, position: 'right' }}
                />
                <Bar dataKey="delay_min" radius={[6, 6, 0, 0]}>
                  {trendData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.delay_min <= 5 ? '#6366f1' : '#f59e0b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Activity className="h-8 w-8 mb-2 stroke-1 text-slate-600" />
              <span>No detection delay events recorded yet. Trigger a scan or publish a demo article!</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Method Distribution */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-purple-400" />
            Detection Strategy Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detections categorized across the 3 core methods
          </p>
        </div>

        <div className="h-48 w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 text-xs text-center">
              Awaiting detection events across RSS, Sitemap, and Direct Page.
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <div className="text-[10px] text-orange-400 font-bold uppercase flex items-center justify-center gap-1">
              <Radio className="h-3 w-3" /> RSS
            </div>
            <div className="text-base font-bold font-mono text-orange-200 mt-0.5">{methodDist.RSS || 0}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400 font-bold uppercase flex items-center justify-center gap-1">
              <Compass className="h-3 w-3" /> Sitemap
            </div>
            <div className="text-base font-bold font-mono text-cyan-200 mt-0.5">{methodDist.SITEMAP || 0}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <div className="text-[10px] text-purple-400 font-bold uppercase flex items-center justify-center gap-1">
              <FileCode2 className="h-3 w-3" /> Direct
            </div>
            <div className="text-base font-bold font-mono text-purple-200 mt-0.5">{methodDist.DIRECT_PAGE || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
