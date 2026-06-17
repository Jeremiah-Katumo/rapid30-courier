import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Truck, Users, Star, Compass, Flame, Terminal, CheckSquare, Sparkles, Layers } from 'lucide-react';
import { Order, Driver, TranslationSet, VendorStore } from '../types';

interface DriverDashboardProps {
  orders: Order[];
  driver: Driver;
  stores: VendorStore[];
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onAssignDriver: (orderId: string, driverId: string) => void;
  syncLog?: string[];
  t: TranslationSet;
}

export default function DriverDashboard({
  orders,
  driver,
  stores,
  onUpdateOrderStatus,
  onAssignDriver,
  syncLog = [],
  t
}: DriverDashboardProps) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [gpsProgress, setGpsProgress] = useState<number>(0); // 0 to 100%
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [etaState, setEtaState] = useState<number>(20); // mins remaining

  // Filter dispatch awaiting or actively delivering for this driver
  const dispatchPool = orders.filter(o => o.status === 'dispatched' && !o.driverId);
  const driverOrders = orders.filter(o => o.driverId === driver.id);
  const ongoingMyDeliveries = driverOrders.filter(o => o.status === 'delivering');

  // Sync active order if changed
  useEffect(() => {
    if (ongoingMyDeliveries.length > 0) {
      setActiveOrder(ongoingMyDeliveries[0]);
    } else {
      setActiveOrder(null);
      setGpsProgress(0);
      setIsSimulating(false);
    }
  }, [orders]);

  // GPS routing coordinates simulation loop
  useEffect(() => {
    let interval: any = null;
    if (isSimulating && activeOrder) {
      interval = setInterval(() => {
        setGpsProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            clearInterval(interval);
            return 100;
          }
          const next = prev + 10;
          // decrease ETA dynamically
          setEtaState(Math.max(1, Math.round(activeOrder.estimatedDeliveryMinutes * (1 - next / 100))));
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulating, activeOrder]);

  const handlePickOrder = (orderId: string) => {
    onAssignDriver(orderId, driver.id);
    onUpdateOrderStatus(orderId, 'delivering');
    setGpsProgress(0);
    setEtaState(18);
  };

  const handleBatchAccept = () => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach((id) => {
      onAssignDriver(id, driver.id);
      onUpdateOrderStatus(id, 'delivering');
    });
    // Auto select first entry in batch as active route marker focus
    const firstId = selectedOrderIds[0];
    const firstOrd = orders.find(o => o.id === firstId);
    if (firstOrd) {
      setActiveOrder(firstOrd);
    }
    setSelectedOrderIds([]);
    setGpsProgress(0);
    setEtaState(18);
  };

  const handleStartSimulate = () => {
    setIsSimulating(true);
  };

  const handleCompleteDelivery = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'delivered');
    setActiveOrder(null);
    setGpsProgress(0);
    setIsSimulating(false);
  };

  // Helper to find store address
  const getStoreName = (storeId: string) => {
    return stores.find(s => s.id === storeId)?.name || 'Local Grocery Hub';
  };

  return (
    <div id="driver-dashboard" className="space-y-6">
      {/* Driver profile segment */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
        {/* Abstract design nodes */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img 
              src={driver.avatar} 
              alt={driver.name} 
              className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-[15px] font-semibold tracking-tight">{driver.name}</h3>
                <span className="px-2 py-0.5 bg-indigo-505/10 text-indigo-400 border border-indigo-500/20 rounded text-[8px] font-extrabold tracking-widest uppercase">
                  Level 4 Courier
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Vehicle: {driver.vehicle}</p>
              
              <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold mt-1 font-sans">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{driver.rating.toFixed(1)} star delivery representative</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-750/35 text-right min-w-[170px]">
            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest">Courier Dispatch State</span>
            <span className="text-xs font-semibold text-emerald-400 block mt-1">Available for Delivery</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Assigned Shift Zone: Mission District</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Dispatch queue (orders waiting for Courier pickup) */}
        <div id="driver-claimed-orders" className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex flex-col gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase">
                Broadband Dispatch Pool
              </h3>
              <span className="ml-auto text-[8px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">
                {dispatchPool.length} Awaiting
              </span>
            </div>
            
            {/* Batch execution controls if multi items checked */}
            {selectedOrderIds.length > 0 && (
              <button
                onClick={handleBatchAccept}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-750 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-[9.5px] uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse"
              >
                <CheckSquare className="w-3.5 h-3.5" /> Batch Accept & Optimize ({selectedOrderIds.length})
              </button>
            )}
          </div>

          {dispatchPool.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Navigation className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              There are currently no active dispatches waiting for courier handover in your local zone.
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
              {dispatchPool.map((poolOrd) => {
                const isChecked = selectedOrderIds.includes(poolOrd.id);
                return (
                  <div 
                    key={poolOrd.id} 
                    className={`p-3 rounded-xl border space-y-3 transition-all ${
                      isChecked 
                        ? 'border-indigo-600 bg-indigo-50/10 dark:border-indigo-550 dark:bg-indigo-950/10' 
                        : 'bg-slate-50 dark:bg-slate-850/30 border-slate-150 dark:border-slate-820'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrderIds(prev => [...prev, poolOrd.id]);
                            } else {
                              setSelectedOrderIds(prev => prev.filter(id => id !== poolOrd.id));
                            }
                          }}
                          className="mt-0.5 w-3.5 h-3.5 text-indigo-600 rounded border-slate-300/80 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div>
                          <span className="text-[9px] font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                            FAST DISPATCH #{poolOrd.id.substring(6).toUpperCase()}
                          </span>
                          <span className="font-display text-xs font-semibold text-slate-850 dark:text-slate-100 block mt-1">
                            {getStoreName(poolOrd.storeId)}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-650 dark:text-slate-300 font-mono">
                        ${poolOrd.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 space-y-1 pl-5">
                      <div><span className="font-medium text-slate-605 dark:text-slate-400">Pickup:</span> Sector 4 Hub</div>
                      <div className="truncate"><span className="font-medium text-slate-605 dark:text-slate-400">Deliver:</span> {poolOrd.deliveryAddress}</div>
                    </div>

                    <div className="flex gap-1.5 pt-1.5 pl-5">
                      <button
                        onClick={() => handlePickOrder(poolOrd.id)}
                        className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Accept Solo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* GPS Simulation Module */}
        <div id="driver-route-map" className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              {t.realtimeGPS}
            </h3>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
              Status ID: Live Pathing
            </span>
          </div>

          {activeOrder ? (
            <div className="space-y-4 font-sans">
              {/* Route sequence optimization for multi-deliveries */}
              {ongoingMyDeliveries.length > 1 && (
                <div className="bg-slate-50 dark:bg-slate-850/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Route Optimized: {ongoingMyDeliveries.length} Near Stops Active
                    </span>
                    <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-805 dark:text-emerald-400 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                      Batch Enabled
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ongoingMyDeliveries.map((ord, idx) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => {
                          setActiveOrder(ord);
                          setGpsProgress(0);
                          setIsSimulating(false);
                          setEtaState(ord.estimatedDeliveryMinutes || 20);
                        }}
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-lg border transition-all cursor-pointer ${
                          activeOrder?.id === ord.id
                            ? 'bg-indigo-600 border-indigo-650 text-white shadow-3xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        Stop {idx + 1}: #{ord.id.substring(6).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-850/30 p-3.5 rounded-xl border border-slate-150 dark:border-slate-820">
                <div>
                  <span className="text-[9px] text-slate-450 font-bold block uppercase tracking-wider">Client Name</span>
                  <span className="text-[11px] font-bold text-slate-805 dark:text-slate-100">{activeOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-455 font-bold block uppercase tracking-wider">Destination</span>
                  <span className="text-[11px] font-bold text-slate-805 dark:text-slate-100 truncate block">{activeOrder.deliveryAddress}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-455 font-bold block uppercase tracking-wider">Est. Delay Counter</span>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 animate-pulse" /> {etaState} mins left (under 30m)
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-455 font-bold block uppercase tracking-wider">Completed</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{gpsProgress}%</span>
                </div>
              </div>

              {/* Graphical Map Simulation Block */}
              <div className="relative h-60 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 overflow-hidden flex flex-col justify-end p-3.5">
                {/* Simulated Grid Background */}
                <div className="absolute inset-0 bg-slate-200/15 dark:bg-slate-900/30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Simulated Route Pathway */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 50,180 L 120,50 L 280,120 L 410,30 L 590,140" 
                    fill="none; outline: none" 
                    stroke="#cbd5e1" 
                    strokeWidth="2.5" 
                    strokeDasharray="6,4"
                  />
                  <path 
                    d="M 50,180 L 120,50 L 280,120 L 410,30 L 590,140" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="3.5" 
                    strokeDasharray="300"
                    strokeDashoffset={`${300 * (1 - gpsProgress / 100)}`}
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>

                {/* Point A: Vendor store Node */}
                <div 
                  className="absolute p-1 py-1.5 rounded bg-slate-900 border border-slate-800 text-white z-10 flex items-center gap-1 shadow-md"
                  style={{ left: '20px', top: '160px' }}
                >
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  <span className="text-[8px] font-bold uppercase truncate max-w-[85px]">{getStoreName(activeOrder.storeId)}</span>
                </div>

                {/* Point B: Destination doorstep Node */}
                <div 
                  className="absolute p-1 py-1.5 rounded bg-slate-900 border border-slate-800 text-white z-10 flex items-center gap-1 shadow-md"
                  style={{ left: '530px', top: '125px' }}
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span className="text-[8px] font-bold uppercase truncate max-w-[85px]">Customer Home</span>
                </div>

                {/* Simulating Courier Car movement */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-full text-white z-20 shadow-xl border border-white transition-all duration-1000 ease-in-out font-mono font-bold text-xs"
                  style={{
                    left: `${50 + (540 * (gpsProgress / 100))}px`,
                    top: `${180 - (60 * (gpsProgress / 100))}px`
                  }}
                >
                  <Truck className="w-3.5 h-3.5 animate-bounce" />
                </div>

                {/* Grid Overlay bottom info */}
                <div className="relative z-10 flex justify-between items-center bg-white/95 dark:bg-slate-900/95 border border-slate-150 dark:border-slate-800 p-2 rounded-lg w-full gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                    <span className="text-[9px] font-bold font-mono text-slate-800 dark:text-slate-205">
                      GPS COURIER: CO-V{driver.id} {gpsProgress > 0 && gpsProgress < 100 ? ' - IN_TRANSIT' : gpsProgress === 100 ? ' - ARRIVED' : ' - HANDOVER'}
                    </span>
                  </div>

                  <div className="text-[9px] font-mono text-slate-400 text-right">
                    LAT: 37.77{Math.round(49 + gpsProgress)} / LNG: -122.41{Math.round(94 - gpsProgress)}
                  </div>
                </div>
              </div>

              {/* Operator Controller actions */}
              <div className="flex gap-2">
                <button
                  disabled={gpsProgress === 100 || isSimulating}
                  onClick={handleStartSimulate}
                  className="flex-1 py-2.5 rounded-lg bg-indigo-650 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-xs transition-all shadow-3xs text-center cursor-pointer"
                >
                  {isSimulating ? 'Calibrating GPS...' : 'Simulate 30-Minute GPS Drive'}
                </button>

                <button
                  disabled={gpsProgress < 100}
                  onClick={() => handleCompleteDelivery(activeOrder.id)}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-750 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold text-xs transition-all shadow-3xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" /> Finalize Delivery & Request Ratings
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-405 text-xs text-center p-6 bg-slate-50/50 dark:bg-slate-950/10">
              <Truck className="w-8 h-8 text-slate-300 mx-auto mb-3 animate-pulse" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No active assignment in courier cart</p>
              <p className="text-slate-400 max-w-sm mt-1 leading-relaxed">
                Select an entry from the Broadband Dispatch Pool on the left to start driving commodities.
              </p>
            </div>
          )}
        </div>

        {/* Dedicated Real-time Sync Log side-panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-5 shadow-xs font-mono space-y-4 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 font-sans">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Real-time Sync Log
              </span>
              <span className="relative flex h-2 w-2 select-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {syncLog && syncLog.length > 0 ? (
                syncLog.map((log, index) => (
                  <div key={index} className="text-[10px] leading-relaxed text-slate-350 flex items-start gap-1 p-1 bg-slate-950/20 rounded hover:bg-slate-950/50 transition-colors">
                    <span className="text-emerald-500 font-bold select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-slate-500 italic py-4 text-center">No network synchronization logs logged.</div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider select-none font-sans mt-4">
            <span>Transmission Log: OK</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Replica Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
