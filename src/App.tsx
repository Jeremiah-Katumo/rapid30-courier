import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, ShieldCheck, HelpCircle, Star, Users, Database, Globe, 
  Moon, Sun, Wifi, WifiOff, Bell, AppWindow, MapPin, RefreshCw, BarChart3, Info, LogOut, ShieldAlert
} from 'lucide-react';

import { MOCK_STORES, MOCK_COMMODITIES, MOCK_DRIVERS, TRANSLATIONS } from './data';
import { Role, Order, Commodity, Driver, NotificationMsg, AnalyticsMetrics } from './types';

// Importing modular components
import Onboarding from './components/Onboarding';
import AnalyticsPanel from './components/AnalyticsPanel';
import LiaisonDashboard from './components/LiaisonDashboard';
import DriverDashboard from './components/DriverDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import NotificationCenter from './components/NotificationCenter';
import AIAssistantChat from './components/AIAssistantChat';
import AuthPortal from './components/AuthPortal';
import SettingsPanel from './components/SettingsPanel';
import InteractiveTour from './components/InteractiveTour';
import AdminDashboard from './components/AdminDashboard';
import ToastContainer, { ToastMsg } from './components/ToastContainer';

export default function App() {
  // Onboarding Preference Profile States
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem('rapid30_onboard') === 'true';
  });
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('rapid30_userName') || 'Noble Customer';
  });

  const [userAddress, setUserAddress] = useState(() => {
    return localStorage.getItem('rapid30_userAddress') || '883 Oakwood Drive, Apt 4C';
  });

  // Global settings
  const [lang, setLang] = useState<string>(() => {
    return localStorage.getItem('rapid30_lang') || 'en';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('rapid30_darkMode') === 'true';
  });
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<Role>('customer');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Authentication & Walkthrough States
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    username: string;
    role: Role;
    address: string;
    phone?: string;
    vehicle?: string;
    storeId?: string;
  } | null>(() => {
    const saved = localStorage.getItem('rapid30_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTour, setShowTour] = useState<boolean>(false);

  // Sync user demographics with authentication profile changes
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserAddress(currentUser.address);
      setActiveRole(currentUser.role);
      
      const tourFinished = localStorage.getItem(`rapid30_tour_completed_${currentUser.role}`) === 'true';
      if (!tourFinished) {
        setShowTour(true);
      }
    } else {
      setShowTour(false);
    }
  }, [currentUser]);

  // Dynamic registers (persisted locally)
  const [commodities, setCommodities] = useState<Commodity[]>(() => {
    const saved = localStorage.getItem('rapid30_commodities');
    return saved ? JSON.parse(saved) : MOCK_COMMODITIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rapid30_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'order-mock-01',
        customerId: 'customer-user-1',
        customerName: 'Aria Sterling',
        customerPhone: '+1 (555) 722-1082',
        deliveryAddress: '883 Oakwood Drive, Apt 4C',
        deliveryLocation: { lat: 37.7785, lng: -122.4192, name: 'Customer Residence' },
        items: [
          {
            commodity: MOCK_COMMODITIES[0],
            quantity: 2
          },
          {
            commodity: MOCK_COMMODITIES[2],
            quantity: 1
          }
        ],
        totalPrice: 20.47,
        serviceFree: 1.50,
        deliveryFee: 3.99,
        status: 'delivered',
        storeId: 'store-1',
        driverId: 'driver-1',
        estimatedDeliveryMinutes: 18,
        paymentMethod: 'card',
        paymentStatus: 'completed',
        driverRating: 5,
        vendorRating: 5
      }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationMsg[]>(() => {
    return [
      {
        id: 'notif-1',
        title: 'Welcome to Rapid30',
        body: 'Local store logistics are active and synchronized. Feel free to explore restaurant menus or grocery options.',
        time: 'Just now',
        read: false,
        type: 'general'
      }
    ];
  });

  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const showToast = (title: string, message: string, type: ToastMsg['type'] = 'success', duration = 4000) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type, duration }]);
    
    // Also push to persistent notification log
    pushTrigger(title, message, 'general');
  };

  const handleRemoveToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  // Real-time synchronization simulated terminal logs
  const [syncLog, setSyncLog] = useState<string[]>(['Secured storage initialized.', 'Awaiting checkout authorization signals.']);

  // Apply dark mode styling to document element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('rapid30_darkMode', String(darkMode));
  }, [darkMode]);

  // Save state modifiers to local storage (AES-equivalent serialization logs)
  useEffect(() => {
    localStorage.setItem('rapid30_commodities', JSON.stringify(commodities));
  }, [commodities]);

  useEffect(() => {
    localStorage.setItem('rapid30_orders', JSON.stringify(orders));
  }, [orders]);

  // Translation sets helper
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Handler functions
  const handleOnboardingComplete = (userData: { name: string; address: string; language: string }) => {
    setUserName(userData.name);
    setUserAddress(userData.address);
    setLang(userData.language);
    setOnboardingComplete(true);
    
    localStorage.setItem('rapid30_userName', userData.name);
    localStorage.setItem('rapid30_userAddress', userData.address);
    localStorage.setItem('rapid30_lang', userData.language);
    localStorage.setItem('rapid30_onboard', 'true');

    // Welcome push notification alert
    pushTrigger(
      'Profile setup finished',
      `Welcome, ${userData.name}! Coordinates calibrated to: ${userData.address}`,
      'general'
    );
  };

  const pushTrigger = (title: string, body: string, type: NotificationMsg['type']) => {
    const freshNotif: NotificationMsg = {
      id: `notif-${Date.now()}`,
      title,
      body,
      time: new Date().toLocaleTimeString(),
      read: false,
      type
    };

    setNotifications(prev => [freshNotif, ...prev]);

    // Automatically trigger on-screen Toast card synchronization
    let toastType: ToastMsg['type'] = 'info';
    if (type === 'price_alert' || type === 'offline_sync') {
      toastType = 'warning';
    } else if (type === 'order_status') {
      toastType = 'success';
    }

    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id: toastId, title, message: body, type: toastType }]);

    // Update syncer logs
    setSyncLog(prev => [
      `Alert compiled: "${title}"`,
      ...prev.slice(0, 8)
    ]);
  };

  // Connectivity Sync Handler
  const handleToggleOfflineMode = () => {
    const nextOffline = !offlineMode;
    setOfflineMode(nextOffline);
    
    if (nextOffline) {
      pushTrigger(
        t.offline,
        'Offline buffer activated. Direct network transmissions paused to save energy.',
        'offline_sync'
      );
    } else {
      pushTrigger(
        t.online,
        t.syncSuccess,
        'offline_sync'
      );
      setSyncLog(prev => [
        'Transmitting queued buffers...',
        'Sync success: DB replica set synchronized.',
        ...prev.slice(0, 7)
      ]);
    }
  };

  const handleUpdatePrice = (commodityId: string, newPrice: number) => {
    const item = commodities.find(c => c.id === commodityId);
    if (!item) return;

    const oldPrice = item.price;
    setCommodities(prev => prev.map(c => {
      if (c.id === commodityId) {
        return { ...c, price: newPrice, prevPrice: oldPrice };
      }
      return c;
    }));

    if (offlineMode) {
      setSyncLog(prev => [`Offline Buffer: Price change ${item.name} -> $${newPrice}`, ...prev]);
    } else {
      pushTrigger(
        'Price Lookup Updated',
        `Liaisons calibrated rate for "${item.name}" from $${oldPrice} to $${newPrice}.`,
        'price_alert'
      );
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    }));

    const statusNotifTitles: Record<string, string> = {
      liaison_accepted: 'Store Liaison Accepted',
      picking: 'Materials Procurement Picked',
      dispatched: 'Doorstep Courier Dispatch',
      delivering: 'GPS Route Active',
      delivered: 'Service Complete & Paid'
    };

    const statusNotifMsgs: Record<string, string> = {
      liaison_accepted: 'Vendor verifies inventory and locks price sheet.',
      picking: 'Vendor picks fresh ingredients for priority assembly.',
      dispatched: 'Packaged commodities handed to courier route dispatch.',
      delivering: 'Courier Vance initiated the fast GPS 30-minute doorstep drive.',
      delivered: 'Payment settlement completed securely. Welcome!'
    };

    pushTrigger(
      statusNotifTitles[status] || 'Order Status shift',
      `Order #${orderId.substring(6).toUpperCase()}: ${statusNotifMsgs[status] || status}`,
      'order_status'
    );
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, driverId };
      }
      return o;
    }));
  };

  const handleClaimOrder = (orderId: string, storeId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, storeId };
      }
      return o;
    }));

    pushTrigger(
      'Order Claimed by Vendor',
      `Order #${orderId.substring(6).toUpperCase()} claimed and routed for localized fulfillment.`,
      'order_status'
    );
  };

  const handleUpdateItemAvailability = (
    orderId: string, 
    itemIdx: number, 
    availabilityStatus: 'pending' | 'checking' | 'confirmed' | 'unavailable'
  ) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const nextItems = [...o.items];
        if (nextItems[itemIdx]) {
          nextItems[itemIdx] = { 
            ...nextItems[itemIdx], 
            availabilityStatus 
          };
        }
        return { ...o, items: nextItems };
      }
      return o;
    }));
  };

  const handleUpdateVendorAction = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, ...updates };
      }
      return o;
    }));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleCreateOrder = (newOrderData: Omit<Order, 'id' | 'createdAt'>) => {
    const uniqueId = `order-${Date.now()}`;
    const newOrd: Order = {
      ...newOrderData,
      id: uniqueId,
      createdAt: new Date().toLocaleTimeString()
    };

    setOrders(prev => [newOrd, ...prev]);

    pushTrigger(
      'Commodity Order Submitted',
      `Authorization successful. Total amount: $${newOrderData.totalPrice.toFixed(2)}. Courier assignment loops initialized.`,
      'order_status'
    );
  };

  const handleRateVendorDriver = (orderId: string, vendorRating: number, driverRating: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, vendorRating, driverRating };
      }
      return o;
    }));

    pushTrigger(
      'Ratings Registered',
      `Store & courier received your scores (${vendorRating}★ / ${driverRating}★). System updated.`,
      'general'
    );
  };

  // Authentication & Settings actions
  const handleAuthSuccess = (user: { name: string; username: string; role: Role; address: string; phone?: string; vehicle?: string; storeId?: string }) => {
    setCurrentUser(user);
    localStorage.setItem('rapid30_currentUser', JSON.stringify(user));
    
    // Also save simple demographics
    setUserName(user.name);
    setUserAddress(user.address);
    setActiveRole(user.role);
    localStorage.setItem('rapid30_userName', user.name);
    localStorage.setItem('rapid30_userAddress', user.address);
    
    pushTrigger(
      'Session Authorized',
      `Welcome back, ${user.name}! Authenticated with RBAC level: "${user.role.toUpperCase()}".${user.storeId ? ` Mapped to store "${user.storeId}".` : ""}`,
      'general'
    );
  };

  const handleUpdateProfile = (updated: { name: string; address: string; phone?: string; vehicle?: string }) => {
    if (!currentUser) return;
    const nextUser = { ...currentUser, ...updated };
    setCurrentUser(nextUser);
    localStorage.setItem('rapid30_currentUser', JSON.stringify(nextUser));
    
    setUserName(updated.name);
    setUserAddress(updated.address);
    localStorage.setItem('rapid30_userName', updated.name);
    localStorage.setItem('rapid30_userAddress', updated.address);

    pushTrigger(
      'Profile Synchronized',
      `Internal registry updated for displays: ${updated.name}.`,
      'general'
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rapid30_currentUser');
    handleClearCart();
    pushTrigger('Session Disconnected', 'Logged out from secure TLS container.', 'general');
  };

  // Cart operations
  const handleAddToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[itemId] <= 1) {
        delete next[itemId];
      } else {
        next[itemId] = next[itemId] - 1;
      }
      return next;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Metrics for Analytics compiled dynamically
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  
  // Average rating calculated dynamically
  const ratingSum = completedOrders.reduce((sum, o) => {
    const innerVendor = o.vendorRating || 5;
    const innerDriver = o.driverRating || 5;
    return sum + ((innerVendor + innerDriver) / 2);
  }, 0);
  
  const averageRating = completedOrders.length > 0 
    ? ratingSum / completedOrders.length 
    : 4.85;

  const metrics: AnalyticsMetrics = {
    totalRevenue,
    completedDeliveries: completedOrders.length,
    averageDeliveryTime: completedOrders.length > 0 ? 18 : 22,
    activeDriversCount: MOCK_DRIVERS.length,
    averageRating
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen transition-colors duration-305 dark:bg-slate-950 bg-slate-100 flex items-center justify-center font-sans p-4">
        <AuthPortal onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50 relative flex flex-col font-sans mb-12`}>
      {/* Onboarding screen popup */}
      {!onboardingComplete && (
        <Onboarding onComplete={handleOnboardingComplete} lang={lang} t={t} />
      )}

      {/* Primary Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold tracking-tight text-slate-850 dark:text-slate-100 flex items-center gap-1.5 leading-none">
                {t.welcome}
                <span className="text-[9px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">30M</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-medium">Rapid Commodity Logistics Pipeline</p>
            </div>
          </div>

          {/* Quick Config panel */}
          <div className="flex items-center gap-2.5">
            {/* Online / Offline switch */}
            <button 
              onClick={handleToggleOfflineMode}
              className={`p-1.5 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                offlineMode 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' 
                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}
              title="Simulate network connectivity interrupts"
            >
              {offlineMode ? <WifiOff className="w-3.5 h-3.5 animate-pulse" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{offlineMode ? t.offline : t.online}</span>
            </button>

            {/* Language Selection */}
            <div className="relative">
              <select 
                value={lang} 
                onChange={(e) => {
                  setLang(e.target.value);
                  localStorage.setItem('rapid30_lang', e.target.value);
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-semibold focus:outline-none border-transparent mr-1"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="sw">SW</option>
              </select>
            </div>

            {/* Settings trigger */}
            <button 
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-indigo-600 dark:text-indigo-400 transition-colors"
              title="Identity & Demographics Settings"
              id="settings-trigger"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Dark mode switch */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 transition-colors"
              title={t.darkMode}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
                )}
              </button>

              <NotificationCenter 
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClearNotifications={handleClearNotifications}
                onToggleActive={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Global Welcome Subheader banner */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-2.5">
          <span className="p-1 px-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold tracking-widest uppercase rounded border border-indigo-500/20">
            {t.welcome} Active Task: {userName}
          </span>
          <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-slate-800 dark:text-white leading-normal">{t.tagline}</h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 max-w-xl mx-auto font-medium">
            {t.deliveryTagline} Coordinates registered to: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{userAddress}</span>
          </p>
        </div>
      </section>

      {/* Role-based Switch Board bar */}
      <section className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AppWindow className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.roleSelect}:</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { id: 'customer', label: t.customer },
                { id: 'liaison', label: t.liaison },
                { id: 'driver', label: t.driver },
                ...(currentUser && currentUser.role === 'admin' ? [{ id: 'admin', label: 'Admin Hub' }] : [])
              ].filter((roleItem) => {
                if (!currentUser) return true;
                if (currentUser.role === 'admin') return true; // Admins are granted overview privileges
                return roleItem.id === currentUser.role; // Normal RBAC restricted
              }).map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id as Role)}
                  className={`flex-1 sm:flex-initial py-1.5 px-4.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeRole === role.id 
                      ? 'bg-indigo-600 text-white border-transparent shadow-3xs'
                      : 'border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-755'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto py-1.5 px-3.5 bg-red-650 hover:bg-red-700 text-white dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-red-400 hover:dark:text-red-300 border border-red-200 dark:border-red-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t.logout || 'Log Out'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Primary Workspace container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
               {activeRole === 'customer' && (
                <CustomerDashboard 
                  commodities={commodities}
                  stores={MOCK_STORES}
                  activeOrders={orders.filter(o => 
                    o.customerId === currentUser?.username || 
                    o.customerName === currentUser?.name ||
                    (currentUser?.username === 'aria_customer' && o.customerId === 'customer-user-1')
                  )}
                  drivers={MOCK_DRIVERS}
                  userAddress={userAddress}
                  userName={userName}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                  onCreateOrder={handleCreateOrder}
                  onRateVendorDriver={handleRateVendorDriver}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  currentUser={currentUser}
                  t={t}
                />
              )}

              {activeRole === 'liaison' && (
                <LiaisonDashboard 
                  stores={MOCK_STORES}
                  commodities={commodities}
                  orders={orders}
                  onUpdatePrice={handleUpdatePrice}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onClaimOrder={handleClaimOrder}
                  onUpdateItemAvailability={handleUpdateItemAvailability}
                  onUpdateVendorAction={handleUpdateVendorAction}
                  syncLog={syncLog}
                  currentUser={currentUser}
                  t={t}
                />
              )}

              {activeRole === 'driver' && (() => {
                const activeDriver: Driver = {
                  id: currentUser?.username || 'courier_vance',
                  name: currentUser?.name || 'Marcus Vance',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  rating: 4.95,
                  phone: currentUser?.phone || '+1 (555) 303-9000',
                  vehicle: currentUser?.vehicle || 'Trek electric cargo bicycle (Heavy Duty)',
                  location: { lat: 37.7749, lng: -122.4194, name: 'Broad Street Hub' }
                };
                return (
                  <DriverDashboard 
                    orders={orders}
                    driver={activeDriver}
                    stores={MOCK_STORES}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onAssignDriver={handleAssignDriver}
                    syncLog={syncLog}
                    t={t}
                  />
                );
              })()}

              {activeRole === 'admin' && (
                <AdminDashboard 
                  commodities={commodities}
                  orders={orders}
                  stores={MOCK_STORES}
                  onCreateCommodity={(item) => {
                    const id = `item-${Date.now()}`;
                    setCommodities(prev => [...prev, { ...item, id, rating: 4.5 }]);
                    showToast('Catalog Commodity Created', `"${item.name}" registered successfully.`, 'success');
                  }}
                  onUpdateCommodity={(id, updates) => {
                    setCommodities(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
                    showToast('Catalog Commodity Updated', `Registry properties successfully synchronized.`, 'success');
                  }}
                  onDeleteCommodity={(id) => {
                    setCommodities(prev => prev.filter(c => c.id !== id));
                    showToast('Catalog Commodity Evacuated', `Item permanently removed from catalog directory.`, 'warning');
                  }}
                  t={t}
                  showToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Performance Business Analytics */}
        <AnalyticsPanel 
          orders={orders}
          metrics={metrics}
          syncLog={syncLog}
          offlineMode={offlineMode}
          t={t}
        />
      </main>

      {/* Encrypted compliance footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-2.5">
          <div className="flex flex-wrap justify-center items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-250 Client State Rest Encryption Active
            </span>
            <span>•</span>
            <span>Estimated thirty minutes threshold fulfillment compliance: 100% SLA Standard</span>
            <span>•</span>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-indigo-600 hover:underline font-bold"
            >
              Reset Platform Data
            </button>
          </div>
          <p>© 2026 Rapid30 Courier Solutions. Licensed with secure TLS integrated billing APIs.</p>
        </div>
      </footer>

      {/* Floating Settings Console modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel 
            currentUser={currentUser}
            onUpdateUser={handleUpdateProfile}
            onLogout={handleLogout}
            lang={lang}
            onUpdateLang={(l) => {
              setLang(l);
              localStorage.setItem('rapid30_lang', l);
            }}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            offlineMode={offlineMode}
            onToggleOffline={handleToggleOfflineMode}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Interactive Onboarding Tour panel */}
      <AnimatePresence>
        {showTour && (
          <InteractiveTour 
            role={currentUser.role}
            onFinish={() => {
              localStorage.setItem(`rapid30_tour_completed_${currentUser.role}`, 'true');
              setShowTour(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating AI chatbot concierge component */}
      <AIAssistantChat t={t} />

      {/* Modern, animated screen toast status alerts container */}
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </div>
  );
}
