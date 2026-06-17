import React from 'react';
import { Terminal } from 'lucide-react';

interface RealTimeSyncLogPanelProps {
  syncLog?: string[];
  title?: string;
  bufferLabel?: string;
  replicaLabel?: string;
}

export default function RealTimeSyncLogPanel({
  syncLog = [],
  title = 'Real-time Sync Log',
  bufferLabel = 'Buffer Cache: OK',
  replicaLabel = 'Replica Server Synced'
}: RealTimeSyncLogPanelProps) {
  return (
    <div 
      id="merchant-terminal-logs" 
      className="xl:col-span-1 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-5 shadow-xs font-mono space-y-4 flex flex-col justify-between self-start min-h-[400px] w-full"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            {title}
          </span>
          <span className="relative flex h-2 w-2 select-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {syncLog && syncLog.length > 0 ? (
            syncLog.map((log, index) => (
              <div 
                key={index} 
                className="text-[10px] leading-relaxed text-slate-350 flex items-start gap-1 p-1 bg-slate-950/20 rounded hover:bg-slate-950/50 transition-colors"
              >
                <span className="text-emerald-500 select-none font-bold">&gt;</span>
                <span>{log}</span>
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-500 italic py-4 text-center">
              No network synchronization logs logged.
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider select-none font-sans mt-4">
        <span>{bufferLabel}</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {replicaLabel}
        </span>
      </div>
    </div>
  );
}
