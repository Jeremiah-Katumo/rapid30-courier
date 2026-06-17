import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Sparkles, Plus, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { Order } from '../types';

interface AdminKPIReportProps {
  orders: Order[];
  completedCount: number;
  pendingCount: number;
  dispatchCount: number;
  totalGMV: number;
  slaFulfillmentRate: number;
}

export default function AdminKPIReport({
  orders,
  completedCount,
  pendingCount,
  dispatchCount,
  totalGMV,
  slaFulfillmentRate
}: AdminKPIReportProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
      {/* Bento metrics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-2">
        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Accumulated GMV Turnover</span>
        <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono block">
          ${totalGMV.toFixed(2)}
        </span>
        <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3 fill-current" /> +14.2% Growth (Live SLA)
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-2">
        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Overall Deliveries Completed</span>
        <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono block">
          {completedCount} <span className="text-xs font-normal text-slate-400">orders</span>
        </span>
        <div className="text-[10px] text-indigo-600 flex items-center gap-1 font-semibold">
          <Plus className="w-3 h-3" /> Average cost: ${(totalGMV / Math.max(1, orders.length)).toFixed(2)}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-2">
        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Rapid SLA Guarantee Status</span>
        <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono block">
          {slaFulfillmentRate}%
        </span>
        <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3 h-3 text-emerald-555" /> Safe under 30m constraint
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-2">
        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Pending/Active Dispatches</span>
        <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono block">
          {pendingCount + dispatchCount} <span className="text-xs font-normal text-slate-450">Active</span>
        </span>
        <div className="text-[10px] text-amber-655 flex items-center gap-1 font-semibold">
          <AlertTriangle className="w-3 h-3 animate-bounce" /> {pendingCount} unassigned in pool
        </div>
      </div>

      {/* Simulated Graphical analysis */}
      <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
          <h4 className="font-display font-medium text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase">
            Telemetry: Settle Dispatch & GMV Timeline hourly
          </h4>
          <span className="text-[9px] text-indigo-650 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/30 rounded font-bold uppercase tracking-wider">
            Real-time Replication (Replica Server 1)
          </span>
        </div>

        {/* Dynamic SVG Bar Chart */}
        <div className="relative h-64 flex flex-col justify-end p-4">
          <div className="absolute inset-0 bg-slate-50/20 bg-[linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 flex justify-around items-end h-48 w-full gap-2">
            {[
              { label: '09:00', val: 78, price: 120 },
              { label: '11:00', val: 145, price: 290 },
              { label: '13:00', val: 210, price: 540 },
              { label: '15:00', val: 180, price: 440 },
              { label: '17:00', val: 260, price: 780 },
              { label: '19:00', val: 320, price: 920 },
              { label: 'Live', val: 110, price: 340 }
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group flex-1">
                <div className="relative w-full flex items-end justify-center">
                  {/* Hover values */}
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 border border-slate-800 text-white rounded p-1 text-[8px] font-mono text-center z-20">
                    Vol: {bar.val} • ${bar.price}
                  </div>
                  {/* Primary bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(bar.val / 320) * 140}px` }}
                    className={`w-[60%] sm:w-[45%] rounded-t-lg shadow-sm transition-all ${
                      i === 6 
                        ? 'bg-indigo-500 animate-pulse' 
                        : 'bg-slate-300 dark:bg-slate-700 hover:bg-indigo-555'
                    }`}
                  />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-500">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-sans">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-700"></span> SLA Normal Log</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-505"></span> Active Target</span>
            </div>
            <span>Reporting Base Clock Cycle: 30 minutes</span>
          </div>
        </div>
      </div>

      {/* Quick distribution stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-3xs space-y-4">
        <h4 className="font-display font-medium text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase pb-2 border-b border-slate-100 dark:border-slate-800/60">
          Turnaround Distributions
        </h4>

        <div className="space-y-4 font-sans py-2">
          {[
            { label: 'Procurement (Liaisons)', val: 24, percent: '56%', color: 'bg-indigo-500' },
            { label: 'Courier Dispatch Handover', val: 12, percent: '28%', color: 'bg-emerald-500' },
            { label: 'Doorstep Transit Complete', val: 7, percent: '16%', color: 'bg-amber-500' }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-[10.5px]">
                <span className="font-medium text-slate-700 dark:text-slate-300">{stat.label}</span>
                <span className="font-mono font-black text-slate-800 dark:text-slate-100">{stat.percent}</span>
              </div>
              {/* Simulated visual bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color}`} style={{ width: stat.percent }} />
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-lg text-[9.5px] leading-relaxed text-indigo-700 dark:text-slate-300">
          <span className="font-extrabold uppercase tracking-wide block mb-0.5">SLA Advice Notice</span>
          Courier delivery speeds currently safe in all tracked postal sectors with a median speed of 24.3 minutes.
        </div>
      </div>
    </div>
  );
}
