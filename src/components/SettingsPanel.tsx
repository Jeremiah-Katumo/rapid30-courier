import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, User, MapPin, Phone, Shield, Languages, Moon, Sun, 
  Trash2, LogOut, CheckCircle, Smartphone, Truck, ShieldCheck 
} from 'lucide-react';
import { Role } from '../types';

interface SettingsPanelProps {
  currentUser: {
    name: string;
    username: string;
    role: Role;
    address: string;
    phone?: string;
    vehicle?: string;
  };
  onUpdateUser: (updatedData: { name: string; address: string; phone?: string; vehicle?: string }) => void;
  onLogout: () => void;
  lang: string;
  onUpdateLang: (l: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  offlineMode: boolean;
  onToggleOffline: () => void;
  onClose: () => void;
}

export default function SettingsPanel({
  currentUser,
  onUpdateUser,
  onLogout,
  lang,
  onUpdateLang,
  darkMode,
  onToggleDarkMode,
  offlineMode,
  onToggleOffline,
  onClose
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  
  // Local transient states initialized from props
  const [editName, setEditName] = useState(currentUser.name);
  const [editAddress, setEditAddress] = useState(currentUser.address);
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editVehicle, setEditVehicle] = useState(currentUser.vehicle || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleApplyChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editName.trim(),
      address: editAddress.trim(),
      phone: editPhone.trim(),
      vehicle: currentUser.role === 'driver' ? editVehicle.trim() : undefined
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2800);
  };

  const handleResetStorage = () => {
    if (window.confirm('Reset all transaction histories, queued orders, and profile records? This will clear local memory.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div id="settings-panel-overlay" className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 font-sans select-none animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-155 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]"
      >
        {/* Header bar */}
        <div className="bg-slate-50 dark:bg-slate-950/80 px-5 py-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-605 dark:text-indigo-400 rounded-lg">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 tracking-wider">Settings Console</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Configure Identity & Terminal Parameters</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-205 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800/60 p-1 gap-1">
          {[
            { id: 'profile', label: 'User Profile' },
            { id: 'preferences', label: 'Preferences' },
            { id: 'security', label: 'Role Security' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-705'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content body Scroll container */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/10">
          
          {activeTab === 'profile' && (
            <form onSubmit={handleApplyChanges} className="space-y-4">
              <div className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 p-4.5 rounded-xl space-y-3.5">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-850">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Demographic Identity</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-400">Full Public Display Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-105 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-400">Delivery Address/Operational Headquarters</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-105 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1.5 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-400">Contact Telephone Line</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-105 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1.5 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                {currentUser.role === 'driver' && (
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-400">Courier Vehicle Type</label>
                    <div className="relative">
                      <Truck className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={editVehicle}
                        onChange={(e) => setEditVehicle(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-105 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1.5 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {saveSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-405 text-[10px] p-2.5 rounded-lg flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-550 shrink-0" />
                  <span>Profile parameters successfully updated. System re-calibrated.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-705 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Apply Demographics Changes
              </button>
            </form>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              {/* Theme preference */}
              <div className="bg-white dark:bg-slate-950/40 border border-slate-195 dark:border-slate-850 p-4.5 rounded-xl space-y-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Visual Interface Themes</span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-780 dark:text-slate-200">Dark Mode Interface</span>
                    <p className="text-[9.5px] text-slate-450">Toggles high contrast dark space canvas stylesheet</p>
                  </div>
                  <button 
                    onClick={onToggleDarkMode}
                    className="p-2 border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-colors cursor-pointer"
                  >
                    {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  </button>
                </div>
              </div>

              {/* Language Selection preference */}
              <div className="bg-white dark:bg-slate-950/40 border border-slate-195 dark:border-slate-850 p-4.5 rounded-xl space-y-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" /> Language preference
                </span>
                <div className="flex gap-2">
                  {[
                    { code: 'en', label: 'English (EN)' },
                    { code: 'es', label: 'Español (ES)' },
                    { code: 'sw', label: 'Kiswahili (SW)' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => onUpdateLang(l.code)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        lang === l.code
                          ? 'border-indigo-600 bg-indigo-50/10 text-indigo-650 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network status preference */}
              <div className="bg-white dark:bg-slate-950/40 border border-slate-195 dark:border-slate-850 p-4.5 rounded-xl space-y-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Logistics Sandbox State</span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-780 dark:text-slate-200">Offline Simulation Mode</span>
                    <p className="text-[9.5px] text-slate-450">Buffer transmissions locally to emulate cellular dropouts</p>
                  </div>
                  <button
                    onClick={onToggleOffline}
                    className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg border cursor-pointer ${
                      offlineMode 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                    }`}
                  >
                    {offlineMode ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-950/40 border border-slate-195 dark:border-slate-850 p-4.5 rounded-xl space-y-3 font-mono">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Access Clearance Profile</span>
                </div>

                <div className="text-[10px] space-y-1.5 leading-normal text-slate-600 dark:text-slate-400">
                  <p><span className="font-extrabold text-slate-450 dark:text-slate-500">AUTHORIZED:_ID:</span> @{currentUser.username}</p>
                  <p><span className="font-extrabold text-slate-450 dark:text-slate-500">RBAC_CLEARANCE:</span> {currentUser.role.toUpperCase()}</p>
                  <p><span className="font-extrabold text-slate-450 dark:text-slate-500">STATUS:</span> <span className="text-emerald-500 font-extrabold">VERIFIED_LOGISTICS_ACCOUNT</span></p>
                  <p><span className="font-extrabold text-slate-450 dark:text-slate-500">DEVICE_SENSORS:</span> Cap Tablet Screen, Micro Map GPS Replica</p>
                </div>
              </div>

              {/* Reset Data card */}
              <div className="bg-white dark:bg-slate-950/40 border border-slate-195 dark:border-slate-850 p-4.5 rounded-xl space-y-3">
                <span className="text-[9px] font-black uppercase text-red-500 tracking-wider block">Developer Operations</span>
                <p className="text-[9.5px] text-slate-450">Completely flush active localStorage schemas back to mock state representations.</p>
                <button
                  onClick={handleResetStorage}
                  className="py-1.5 px-3 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-650 dark:text-red-400 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" /> Reset Sandbox Database
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer log out button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-955 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center">
          <button 
            type="button"
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-97"
          >
            <LogOut className="w-3.5 h-3.5" />
            Clear Access Session & Log Out
          </button>

          <span className="text-[10px] font-mono text-slate-400">Ver 1.4 TLS Secure</span>
        </div>
      </motion.div>
    </div>
  );
}
