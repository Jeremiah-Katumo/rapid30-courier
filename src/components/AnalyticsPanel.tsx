import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Star, RefreshCw, BarChart3, Database } from 'lucide-react';
import { Order, AnalyticsMetrics, TranslationSet } from '../types';

interface AnalyticsPanelProps {
  orders: Order[];
  metrics: AnalyticsMetrics;
  syncLog: string[];
  offlineMode: boolean;
  t: TranslationSet;
}

export default function AnalyticsPanel({ orders, metrics, syncLog, offlineMode, t }: AnalyticsPanelProps) {
  // Let's filter some values for high-quality charts
  const completeOrders = orders.filter(o => o.status === 'delivered');
  const totalCompletedVal = completeOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  // compliance calculation: average under 30 mins
  const within30MinsPct = completeOrders.length > 0 
    ? Math.round((completeOrders.filter(o => o.estimatedDeliveryMinutes <= 30).length / completeOrders.length) * 100)
    : 100;

  return (
    <div id="analytics-panel" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-6 shadow-xs font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 text-sm tracking-wide uppercase">{t.analytics}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Continuous enterprise evaluation dashboard</p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Database className="w-3.5 h-3.5" />
          <span>Encrypted DB Active</span>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Metric 1 */}
        <div className="bg-slate-50 dark:bg-slate-850/30 p-4 rounded-xl border border-slate-150 dark:border-slate-820">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Capital Volume</span>
            <span className="p-1 px-1.5 rounded text-[9px] bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +12%
            </span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            ${(metrics.totalRevenue + totalCompletedVal).toFixed(2)}
          </div>
          <p className="text-[9px] text-slate-405 mt-1 font-medium">Live checkout volume</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-50 dark:bg-slate-850/30 p-4 rounded-xl border border-slate-150 dark:border-slate-820">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Velocity</span>
            <span className="p-1 px-1.5 rounded text-[9px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 font-bold">
              {within30MinsPct}% Target
            </span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {metrics.averageDeliveryTime} mins
          </div>
          <p className="text-[9px] text-slate-405 mt-1 font-medium">Under thirty-minute SLA</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-50 dark:bg-slate-850/30 p-4 rounded-xl border border-slate-150 dark:border-slate-820">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Fleet</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse"></span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {metrics.activeDriversCount} active
          </div>
          <p className="text-[9px] text-slate-405 mt-1 font-medium">Couriers on dispatch loops</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-50 dark:bg-slate-850/30 p-4 rounded-xl border border-slate-150 dark:border-slate-820">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Satisfaction</span>
            <div className="flex items-center text-indigo-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
            {metrics.averageRating.toFixed(2)} / 5.0
          </div>
          <p className="text-[9px] text-slate-405 mt-1 font-medium">Aggregated store score</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compliance Rating Vector Visualizer */}
        <div className="bg-slate-50 dark:bg-slate-850/20 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
          <h4 className="font-display text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Service Class fulfillment (30s target vs delay)
          </h4>
          <div className="flex items-center justify-center p-2">
            {/* Simple Beautiful responsive SVG Ring chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-slate-200 dark:stroke-slate-800" 
                  strokeWidth="6" fill="transparent" 
                />
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-indigo-600" 
                  strokeWidth="6" fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - within30MinsPct / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono leading-none">{within30MinsPct}%</span>
                <span className="text-[8px] text-slate-400 uppercase tracking-wider font-extrabold mt-1">On-Time Rate</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 text-center text-xs mt-2 border-t border-slate-100 dark:border-slate-800/60 pt-2.5 gap-2 font-sans">
            <div>
              <div className="font-bold text-indigo-600">Under 30 Mins</div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">{orders.filter(o => o.estimatedDeliveryMinutes <= 30).length} deliveries</div>
            </div>
            <div>
              <div className="font-semibold text-slate-400 dark:text-slate-500">Delayed / Transit</div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">{orders.filter(o => o.estimatedDeliveryMinutes > 30).length} deliveries</div>
            </div>
          </div>
        </div>

        {/* Offline Syncer Logs */}
        <div className="bg-slate-50 dark:bg-slate-850/20 p-4 rounded-xl border border-slate-150 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/40 pb-1.5">
              <h4 className="font-display text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Encryption-At-Rest Sync Terminal
              </h4>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                offlineMode 
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse' 
                  : 'bg-emerald-50/10 text-emerald-600 dark:text-emerald-400'
              }`}>
                {offlineMode ? 'Local Draft' : 'Synchronized'}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-850 rounded-lg p-3 font-mono text-[9px] text-emerald-400 min-h-[90px] max-h-[110px] overflow-y-auto space-y-1">
              <div>&gt; _ client state replication loaded securely</div>
              {offlineMode && (
                <div className="text-amber-400">! Connection offline. Buffering transaction logs client-side at dynamic index...</div>
              )}
              {syncLog.map((log, idx) => (
                <div key={idx} className="transition-all duration-300">
                  &gt; [{new Date().toLocaleTimeString()}] {log}
                </div>
              ))}
              <div className="text-slate-500 animate-pulse">_ terminal active</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-emerald-500" /> Auto-sync enabled
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Rev. v1.1 Sec-Grade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
