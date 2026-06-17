import React from 'react';
import { Settings, Sparkles, FileText, AlertTriangle } from 'lucide-react';

interface AdminParameterTunerProps {
  platformFee: string;
  setPlatformFee: (val: string) => void;
  slaMinutes: string;
  setSlaMinutes: (val: string) => void;
  surgeMultiplier: string;
  setSurgeMultiplier: (val: string) => void;
  onDutyDrivers: number;
  setOnDutyDrivers: (val: number) => void;
  onPurgeBuffer: () => void;
  onApplyCalibration: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function AdminParameterTuner({
  platformFee,
  setPlatformFee,
  slaMinutes,
  setSlaMinutes,
  surgeMultiplier,
  setSurgeMultiplier,
  onDutyDrivers,
  setOnDutyDrivers,
  onPurgeBuffer,
  onApplyCalibration,
  onShowToast
}: AdminParameterTunerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      {/* Control card 1 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h4 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-indigo-600" /> Platform Fee Calibrationer
        </h4>
        
        <div className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">Base Delivery Surcharge Fee ($)</label>
            <input 
              type="number"
              step="0.5"
              className="w-full p-2 bg-slate-50 dark:bg-slate-805 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-350 focus:outline-hidden"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
            />
            <p className="text-[9px] text-slate-455">Charged comprehensively to final customer upon direct checkout.</p>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">Default Delivery Target Limit (mins)</label>
            <input 
              type="number"
              className="w-full p-2 bg-slate-50 dark:bg-slate-805 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-350 focus:outline-hidden"
              value={slaMinutes}
              onChange={(e) => setSlaMinutes(e.target.value)}
            />
            <p className="text-[9px] text-slate-455">SLA alarm goes off internally if tracking metrics overshoot this threshold.</p>
          </div>

          <button 
            onClick={onApplyCalibration}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-transform cursor-pointer"
          >
            Apply Calibration Rates
          </button>
        </div>
      </div>

      {/* Control card 2: Surge Calibrator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h4 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-650" /> Surge Traffic multiplier
        </h4>
        
        <div className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Multiplier Rate (x)</label>
            <div className="flex gap-1.5">
              {['1.0', '1.3', '1.6', '2.0'].map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => {
                    setSurgeMultiplier(mult);
                    onShowToast('Surge Multiplier Configured', `Ecosystem multiplier is now calibrated at ${mult}x.`, 'info');
                  }}
                  className={`py-1.5 px-2.5 rounded-md border text-[10px] font-black uppercase text-center flex-1 cursor-pointer transition-colors ${
                    surgeMultiplier === mult
                      ? 'bg-rose-50 border-rose-300 text-rose-750 font-extrabold dark:bg-rose-950/20'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800/40'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Global Simulated Drivers Available State</label>
            <input
              type="range"
              min="1"
              max="10"
              value={onDutyDrivers}
              onChange={(e) => {
                setOnDutyDrivers(Number(e.target.value));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9.5px] font-semibold text-slate-400">
              <span>1 Driver Minimal</span>
              <span className="text-indigo-650 font-extrabold">{onDutyDrivers} Active</span>
              <span>10 Drivers Peak</span>
            </div>
            <p className="text-[9.5px] text-slate-500 mt-1 leading-normal">Influences simulated courier densities in the Broadband Pool.</p>
          </div>
        </div>
      </div>

      {/* Control card 3: Ecosystem Logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h4 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-555" /> Admin Diagnostics
        </h4>

        <div className="space-y-3 text-[10.5px] font-mono leading-relaxed text-slate-650 dark:text-slate-300">
          <div className="p-1.5 px-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-md">
            &gt; DB_MIGRATION: COMPLETED_OK<br />
            &gt; ACTIVE_SESSIONS: {onDutyDrivers + 2}<br />
            &gt; API_SSL_ENCRYPT: TSL_1.3_STABLE<br />
            &gt; CACHE_STRAT: LOCAL_PERSISTENT
          </div>

          <button
            onClick={onPurgeBuffer}
            className="w-full py-2 bg-rose-50/50 hover:bg-rose-100/50 border border-rose-200/50 dark:bg-rose-950/15 text-rose-650 text-[10px] font-extrabold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Purge Platform Buffer Logs
          </button>
        </div>
      </div>
    </div>
  );
}
