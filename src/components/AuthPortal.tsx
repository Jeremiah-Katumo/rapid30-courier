import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, LogIn, UserPlus, Key, User, Landmark, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { Role } from '../types';
import { MOCK_STORES } from '../data';

interface AuthPortalProps {
  onAuthSuccess: (user: { name: string; username: string; role: Role; address: string; phone?: string; vehicle?: string; storeId?: string }) => void;
}

export default function AuthPortal({ onAuthSuccess }: AuthPortalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [roleSelection, setRoleSelection] = useState<Role>('customer');
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regVehicle, setRegVehicle] = useState('');
  const [regStoreId, setRegStoreId] = useState('store-1');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Demo accounts data
  const DEMO_ACCOUNTS = [
    {
      name: 'Aria Sterling',
      username: 'aria_customer',
      password: 'password123',
      role: 'customer' as Role,
      address: '883 Oakwood Drive, Apt 4C',
      phone: '+1 (555) 722-1082',
      hint: 'Customer (Order groceries & track live GPS)'
    },
    {
      name: 'Ritz-Carlton Liaison',
      username: 'ritz_liaison',
      password: 'password123',
      role: 'liaison' as Role,
      address: 'Hotel & Bistro Suite A, Union Sq',
      phone: '+1 (555) 890-4100',
      storeId: 'store-2',
      hint: 'Store/Hotel Liaison (Manage menus, claim & prepare orders)'
    },
    {
      name: 'Marcus Vance',
      username: 'courier_vance',
      password: 'password123',
      role: 'driver' as Role,
      address: 'Rapid30 Dispatch Hub 12',
      phone: '+1 (555) 303-9000',
      vehicle: 'Trek electric cargo bicycle (Heavy Duty)',
      hint: 'Courier Courier (Route deliveries on offline GPS map)'
    },
    {
      name: 'System Chief Admin',
      username: 'admin_security',
      password: 'password123',
      role: 'admin' as Role,
      address: 'Central Admin Headquarters',
      phone: '+1 (555) 777-9999',
      hint: 'Central Admin (Reports, assigning of roles, CRUD commodities, settings)'
    }
  ];

  // Load custom registered accounts in local storage
  const getRegisteredUsers = () => {
    const stored = localStorage.getItem('rapid30_registered_users');
    return stored ? JSON.parse(stored) : DEMO_ACCOUNTS;
  };

  const saveRegisteredUsers = (users: any[]) => {
    localStorage.setItem('rapid30_registered_users', JSON.stringify(users));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    const users = getRegisteredUsers();
    const match = users.find(
      (u: any) => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && u.password === loginPassword
    );

    if (match) {
      onAuthSuccess({
        name: match.name,
        username: match.username,
        role: match.role,
        address: match.address || 'Rapid30 Hub',
        phone: match.phone,
        vehicle: match.vehicle,
        storeId: match.storeId
      });
    } else {
      setErrorMsg('Incorrect credentials. Feel free to use a demo account below.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMsg('Please enter all required fields.');
      return;
    }

    const users = getRegisteredUsers();
    const alreadyExists = users.some((u: any) => u.username.toLowerCase() === regUsername.trim().toLowerCase());

    if (alreadyExists) {
      setErrorMsg('Username already taken. Please choose another one.');
      return;
    }

    const newUser = {
      name: regName.trim(),
      username: regUsername.trim(),
      password: regPassword,
      role: roleSelection,
      address: regAddress.trim() || (roleSelection === 'customer' ? '883 Oakwood Drive, Apt 4C' : 'City-Gate Depot'),
      phone: regPhone.trim() || '+1 (555) 900-1100',
      vehicle: roleSelection === 'driver' ? (regVehicle.trim() || 'Rapid30 Cargo Bike') : undefined,
      storeId: roleSelection === 'liaison' ? regStoreId : undefined
    };

    const nextUsers = [...users, newUser];
    saveRegisteredUsers(nextUsers);

    // Automatically log in the registered user
    onAuthSuccess({
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      address: newUser.address,
      phone: newUser.phone,
      vehicle: newUser.vehicle,
      storeId: newUser.storeId
    });
  };

  const triggerQuickDemoLogin = (demo: typeof DEMO_ACCOUNTS[0]) => {
    onAuthSuccess({
      name: demo.name,
      username: demo.username,
      role: demo.role,
      address: demo.address,
      phone: demo.phone,
      vehicle: demo?.vehicle,
      storeId: demo?.storeId
    });
  };

  return (
    <div id="auth-portal" className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-slate-900/95 dark:bg-slate-950/98 overflow-y-auto px-4 py-8 font-sans">
      
      {/* Container Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative"
      >
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-1.5 pb-2">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-850 dark:text-white tracking-tight pt-1">
            Rapid30 Access Controller
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 max-w-sm">
            Failsafe secure sign-in with granular Role-Based Access Control (RBAC) authorization models.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl gap-1">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-3xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-705'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Account Authentication
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-3xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-705'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Registry Sign-Up
          </button>
        </div>

        {/* Error reporting */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl p-3 text-xs flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Switch Render based on Tab state */}
        <div className="min-h-[220px]">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Authentication Nickname / E-Mail
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter e.g. aria_customer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Credentials Code (Password)
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all active:scale-98 shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Proceed & Request Authorization
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Authorized Role Assignment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'customer', icon: <User className="w-3.5 h-3.5" />, label: 'Customer' },
                    { id: 'liaison', icon: <Landmark className="w-3.5 h-3.5" />, label: 'Liaison' },
                    { id: 'driver', icon: <Truck className="w-3.5 h-3.5" />, label: 'Courier' },
                    { id: 'admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Admin' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setRoleSelection(role.id as Role)}
                      className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer ${
                        roleSelection === role.id
                          ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400 font-extrabold dark:border-indigo-550'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      {role.icon}
                      <span className="text-[10px]">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-205 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    User ID Nickname
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. maria99"
                    className="w-full px-3 py-2 rounded-xl border border-slate-250 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    Credentials Code
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Type a password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-250 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    System Contact Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-250 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {roleSelection === 'liaison' && (
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    Associated Merchant Venue
                  </label>
                  <select
                    value={regStoreId}
                    onChange={(e) => setRegStoreId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-250 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600 cursor-pointer"
                  >
                    {MOCK_STORES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                  {roleSelection === 'customer' 
                    ? 'Default Delivery Street Coordinates' 
                    : roleSelection === 'liaison' 
                      ? 'Liaison Merchant Store Headquarters' 
                      : 'Assigned Dispatch Depot Depot'}
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder={
                    roleSelection === 'customer' 
                      ? 'e.g. 102 Pine St, Apt 2B' 
                      : roleSelection === 'liaison' 
                        ? 'e.g. Ritz-Carlton Kitchen Suite C' 
                        : 'e.g. Rapid30 Main Garage, Bay 3'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-250 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                />
              </div>

              {roleSelection === 'driver' && (
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                    Courier Vehicle Configuration
                  </label>
                  <input
                    type="text"
                    value={regVehicle}
                    onChange={(e) => setRegVehicle(e.target.value)}
                    placeholder="e.g. Specialized Turbo Vado Cargo E-Bike"
                    className="w-full px-3 py-2 rounded-xl border border-slate-250 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all active:scale-98 shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Register, Set Role & Sign In
              </button>
            </form>
          )}
        </div>

        {/* Demo Fast Account Switcher Container */}
        {showDemoBanner && (
          <div className="pt-4 border-t border-slate-150 dark:border-slate-800/80 space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1 leading-none">
                <Sparkles className="w-3.5 h-3.5 text-indigo-550 animate-pulse animate-spin" style={{ animationDuration: '4s' }} /> Fast RBAC Sandbox bypasses
              </span>
              <button 
                onClick={() => setShowDemoBanner(false)}
                className="text-[9px] text-slate-400 hover:underline cursor-pointer"
              >
                dismiss
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((demo) => {
                const isCustomer = demo.role === 'customer';
                const isLiaison = demo.role === 'liaison';
                return (
                  <button
                    key={demo.username}
                    type="button"
                    onClick={() => triggerQuickDemoLogin(demo)}
                    className="p-2 w-full text-left bg-slate-50 hover:bg-indigo-50/10 dark:bg-slate-950/30 hover:dark:bg-indigo-950/10 border border-slate-150 dark:border-slate-850 hover:border-indigo-500/30 rounded-xl transition-all flex items-center justify-between text-[11px] cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800 dark:text-slate-150">{demo.name}</span>
                        <span className="text-[7.5px] font-bold text-slate-400">(@{demo.username})</span>
                      </div>
                      <p className="text-[9.5px] text-slate-450 dark:text-slate-400 mt-0.5">{demo.hint}</p>
                    </div>

                    <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                      demo.role === 'customer' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/55 dark:text-indigo-400' :
                      demo.role === 'liaison' ? 'bg-amber-100 text-amber-805 dark:bg-amber-950/55 dark:text-amber-400' :
                      demo.role === 'driver' ? 'bg-emerald-100 text-emerald-805 dark:bg-emerald-950/55 dark:text-emerald-400' :
                      'bg-rose-100 text-rose-805 dark:bg-rose-950/55 dark:text-rose-400'
                    }`}>
                      {demo.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
