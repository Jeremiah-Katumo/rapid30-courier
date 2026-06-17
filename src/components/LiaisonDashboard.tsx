import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hotel, CheckCircle, PackageOpen, ClipboardList, Info, 
  HelpCircle, RefreshCw, Sparkles, Truck, Activity, QrCode, ShieldCheck
} from 'lucide-react';
import { VendorStore, Commodity, Order, TranslationSet } from '../types';
import GlobalOrdersPool from './GlobalOrdersPool';
import RealTimeSyncLogPanel from './RealTimeSyncLogPanel';
import StorePriceSheet from './StorePriceSheet';
import CommodityFormModal from './CommodityFormModal';
import QRScannerModal from './QRScannerModal';

interface LiaisonDashboardProps {
  stores: VendorStore[];
  commodities: Commodity[];
  orders: Order[];
  onUpdatePrice: (commodityId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onClaimOrder?: (orderId: string, storeId: string) => void;
  onUpdateItemAvailability?: (orderId: string, itemIdx: number, status: 'pending' | 'checking' | 'confirmed' | 'unavailable') => void;
  onUpdateVendorAction?: (orderId: string, updates: Partial<Order>) => void;
  onCreateCommodity?: (item: Omit<Commodity, 'id' | 'rating'>) => void;
  onUpdateCommodity?: (id: string, updates: Partial<Commodity>) => void;
  onDeleteCommodity?: (id: string) => void;
  syncLog?: string[];
  currentUser?: any;
  t: TranslationSet;
}

export default function LiaisonDashboard({
  stores,
  commodities,
  orders,
  onUpdatePrice,
  onUpdateOrderStatus,
  onClaimOrder,
  onUpdateItemAvailability,
  onUpdateVendorAction,
  onCreateCommodity,
  onUpdateCommodity,
  onDeleteCommodity,
  syncLog = [],
  currentUser,
  t
}: LiaisonDashboardProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    if (currentUser && currentUser.role === 'liaison' && currentUser.storeId) {
      return currentUser.storeId;
    }
    return stores[0]?.id || '';
  });

  useEffect(() => {
    if (currentUser && currentUser.role === 'liaison' && currentUser.storeId) {
      setSelectedStoreId(currentUser.storeId);
    }
  }, [currentUser]);

  // State for Commodity CRUD
  const [isCommodityModalOpen, setIsCommodityModalOpen] = useState(false);
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(null);
  
  // Local checking animation state
  const [checkingItems, setCheckingItems] = useState<Record<string, boolean>>({});
  
  // Simulated Scan states
  const [scanningOrderId, setScanningOrderId] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);

  const currentStore = stores.find(s => s.id === selectedStoreId);
  const storeCommodities = commodities.filter(c => c.storeId === selectedStoreId);
  const storeOrders = orders.filter(o => o.storeId === selectedStoreId);

  // General unassigned orders from other stores or those that are pending which could be worked on
  const availableGlobalOrders = orders.filter(
    o => o.status === 'pending' && o.storeId !== selectedStoreId
  );

  const openAddCommodityModal = () => {
    setEditingCommodity(null);
    setIsCommodityModalOpen(true);
  };

  const openEditCommodityModal = (item: Commodity) => {
    setEditingCommodity(item);
    setIsCommodityModalOpen(true);
  };

  const handleCommoditySubmit = (itemData: {
    name: string;
    price: number;
    category: 'Groceries' | 'Hotels & Restaurants' | 'Daily Essentials';
    unit: string;
    description: string;
    image: string;
    storeId: string;
  }) => {
    if (editingCommodity) {
      if (onUpdateCommodity) {
        onUpdateCommodity(editingCommodity.id, itemData);
      } else {
        onUpdatePrice(editingCommodity.id, itemData.price);
      }
    } else {
      if (onCreateCommodity) {
        onCreateCommodity(itemData);
      }
    }
    setIsCommodityModalOpen(false);
  };

  // Simulates contacting the hotel / store repository
  const handleSimulateCheck = (orderId: string, itemIdx: number, storeName: string) => {
    if (!onUpdateItemAvailability) return;
    
    const key = `${orderId}-${itemIdx}`;
    setCheckingItems(prev => ({ ...prev, [key]: true }));

    // Run callback to update to 'checking' immediately
    onUpdateItemAvailability(orderId, itemIdx, 'checking');

    setTimeout(() => {
      setCheckingItems(prev => ({ ...prev, [key]: false }));
      onUpdateItemAvailability(orderId, itemIdx, 'confirmed');
    }, 1250);
  };

  // Triggers simulated scanner modal activation
  const handleTriggerScanner = (ordId: string) => {
    setScanningOrderId(ordId);
    setIsScanningActive(true);
    
    // Auto-resolve verification scan after 1.8 seconds representing real-time detection
    setTimeout(() => {
      setIsScanningActive(false);
    }, 1800);
  };

  // Complete simulated barcode scan and auto-confirm all in-stock items
  const handleCompleteQRScan = () => {
    if (scanningOrderId && onUpdateItemAvailability) {
      const targetOrder = orders.find(o => o.id === scanningOrderId);
      if (targetOrder) {
        targetOrder.items.forEach((_, idx) => {
          onUpdateItemAvailability(scanningOrderId, idx, 'confirmed');
        });
      }
    }
    setScanningOrderId(null);
  };

  return (
    <div id="liaison-dashboard" className="space-y-6">
      
      {/* Selector of Store Context */}
      <div className="bg-gradient-to-r from-indigo-500/5 via-slate-50 to-slate-100 dark:from-indigo-950/15 dark:via-slate-900 dark:to-slate-950/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-[15px] font-semibold text-slate-850 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Hotel className="w-5 h-5 text-indigo-600" />
            Vendor / Liaison Management Hub
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-sans mt-0.5 leading-relaxed">
            Acquire localized delivery tasks, verify hotel availability, manage inventory books, or fulfill orders yourself.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center font-sans">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Active Merchant Identity:</span>
          <select 
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            disabled={currentUser?.role === 'liaison'}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-250 text-xs font-semibold focus:outline-hidden focus:ring-1.5 focus:ring-indigo-505 pointer-events-auto disabled:opacity-85 disabled:cursor-not-allowed"
          >
            {stores.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.type === 'hotel' ? 'Hotel & Bistro' : 'Grocery Store'})
              </option>
            ))}
          </select>
          {currentUser?.role === 'liaison' && (
            <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 p-1 px-2 rounded-md font-mono font-bold border border-indigo-550/20 shadow-3xs flex items-center gap-1.5 animate-pulse">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBAC LOCKED
            </span>
          )}
        </div>
      </div>

      {/* Global Available City-Wide Orders Pool */}
      <GlobalOrdersPool
        availableGlobalOrders={availableGlobalOrders}
        selectedStoreId={selectedStoreId}
        onClaimOrder={onClaimOrder}
      />

      {/* Expanded Grid System supporting Sync Log Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Commodities Registry & Price Updates */}
        <StorePriceSheet
          storeCommodities={storeCommodities}
          onUpdatePrice={onUpdatePrice}
          onEditCommodity={openEditCommodityModal}
          onDeleteCommodity={onDeleteCommodity}
          onAddCommodity={openAddCommodityModal}
        />

        {/* Incoming/Active Orders in preparation */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              Orders Under Preparation ({currentStore?.name})
            </h3>
            <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest animate-pulse">
              {storeOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length} Progressing
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[520px]">
            {storeOrders.length === 0 ? (
              <div className="text-center py-16">
                <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium leading-relaxed">No orders claimed or created for this specific merchant.</p>
                <p className="text-[10px] text-slate-450 mt-1">Claim floating packages from the city-wide pool above!</p>
              </div>
            ) : (
              storeOrders.map((ord) => {
                // Check if all items in this order are confirmed available
                const allItemsConfirmed = ord.items.every(it => it.availabilityStatus === 'confirmed');
                
                return (
                  <div 
                    key={ord.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      ord.isVendorSelfDelivering 
                        ? 'border-indigo-400/75 bg-indigo-50/20 dark:bg-indigo-950/15' 
                        : 'border-slate-150 dark:border-slate-800/90 bg-slate-50 dark:bg-slate-850/30'
                    } space-y-3 font-sans`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold font-mono text-slate-455 tracking-wider bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            #{ord.id.substring(6).toUpperCase()}
                          </span>
                          
                          {ord.isVendorSelfDelivering && (
                            <span className="text-[8px] font-extrabold bg-indigo-600 text-white px-1.5 py-0.5 rounded tracking-widest uppercase">
                              Self-Delivering Vendor
                            </span>
                          )}
                        </div>
                        <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 mt-1">
                          Deliver to: {ord.customerName}
                        </h4>
                        <span className="text-[10px] text-slate-450 underline mt-0.5 block">{ord.deliveryAddress}</span>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${
                        ord.status === 'pending' ? 'bg-amber-500/15 text-amber-700 animate-pulse' :
                        ord.status === 'liaison_accepted' ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-455' :
                        ord.status === 'picking' ? 'bg-blue-500/15 text-blue-700' :
                        ord.status === 'dispatched' ? 'bg-emerald-580/15 text-emerald-700' :
                        ord.status === 'delivering' ? 'bg-indigo-600 text-white' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* ITEMS LIST AND THEIR AVAILABILITY CHECKS */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-lg p-3 space-y-2">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-105 dark:border-slate-800 pb-1.5 mb-1.5">
                        <span>Items List ({currentStore?.name})</span>
                        <div className="flex items-center gap-1">
                          {ord.status === 'pending' && (
                            <button
                              onClick={() => handleTriggerScanner(ord.id)}
                              className="px-2 py-0.5 bg-indigo-605 hover:bg-indigo-700 text-white text-[9px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
                            >
                              <QrCode className="w-3 h-3" />
                              Scan Store QR
                            </button>
                          )}
                          <span className="text-slate-500 font-sans text-[9px]">Availability Check</span>
                        </div>
                      </div>

                      {ord.items.map((it, idx) => {
                        const checkKey = `${ord.id}-${idx}`;
                        const isChecking = checkingItems[checkKey] || it.availabilityStatus === 'checking';
                        const isConfirmed = it.availabilityStatus === 'confirmed';

                        return (
                          <div key={idx} className="flex justify-between items-center text-[11px] py-1">
                            <div className="flex items-center gap-1 max-w-[150px] truncate">
                              <span className="font-extrabold text-slate-705 dark:text-slate-300">x{it.quantity}</span>
                              <span className="text-slate-500 dark:text-slate-400 truncate">{it.commodity.name}</span>
                            </div>

                            {/* Verification Button/Badge */}
                            <div className="flex items-center gap-2">
                              {isChecking ? (
                                <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-550 animate-pulse font-sans">
                                  <RefreshCw className="w-3 h-3 text-indigo-550 animate-spin" />
                                  <span>Checking Hotel...</span>
                                </div>
                              ) : isConfirmed ? (
                                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] text-emerald-600 font-bold">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>In stock & verified</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleSimulateCheck(ord.id, idx, currentStore?.name || 'hotel')}
                                  className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-750 dark:text-amber-400 text-[9px] font-extrabold rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <HelpCircle className="w-3 h-3 text-amber-600" />
                                  Verify standard check
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* DIRECT DELIVERY WORKFLOW FOR THE CLAIMING VENDOR */}
                    {ord.isVendorSelfDelivering && ord.status !== 'delivered' && (
                      <div className="bg-indigo-50 dark:bg-indigo-950/25 border border-indigo-200 dark:border-indigo-900/40 p-3 rounded-lg space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-650 dark:text-indigo-400 flex items-center gap-1 leading-none">
                          <Activity className="w-3 h-3 animate-pulse" /> Direct Vendor Courier Track
                        </span>

                        {/* Interactive Steps */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[9px] leading-tight font-sans">
                          <div className={`p-1.5 rounded border ${
                            ord.vendorActionStep === 'at_hotel_grocer' 
                              ? 'bg-indigo-600 text-white font-bold border-indigo-600' 
                              : 'bg-white dark:bg-slate-900 border-slate-105'
                          }`}>
                            1. Procure food at Hotel / Store
                          </div>
                          
                          <div className={`p-1.5 rounded border ${
                            ord.vendorActionStep === 'transit_to_customer' 
                              ? 'bg-indigo-600 text-white font-bold border-indigo-600' 
                              : 'bg-white dark:bg-slate-900 border-slate-105'
                          }`}>
                            2. Drive to Customer residence
                          </div>

                          <div className={`p-1.5 rounded border ${
                            ord.vendorActionStep === 'completed' || (ord.status as string) === 'delivered'
                              ? 'bg-emerald-600 text-white font-bold border-emerald-600' 
                              : 'bg-white dark:bg-slate-900 border-slate-105'
                          }`}>
                            3. Customer signs confirmation
                          </div>
                        </div>

                        {/* Interactive Vendor actions */}
                        <div className="pt-1.5 flex justify-end">
                          {ord.vendorActionStep === 'at_hotel_grocer' && (
                            <button
                              onClick={() => {
                                onUpdateOrderStatus(ord.id, 'delivering');
                                onUpdateVendorAction && onUpdateVendorAction(ord.id, { vendorActionStep: 'transit_to_customer' });
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold rounded-md text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              Picked Up & Proceed to Route GPS Drive
                            </button>
                          )}

                          {ord.vendorActionStep === 'transit_to_customer' && (
                            <button
                              onClick={() => {
                                onUpdateVendorAction && onUpdateVendorAction(ord.id, { vendorActionStep: 'completed' });
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-md text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Mark Arrived: Hand Over Food to Customer
                            </button>
                          )}

                          {ord.vendorActionStep === 'completed' && (ord.status as string) !== 'delivered' && (
                            <div className="text-[10px] font-bold text-slate-500 py-1.5 flex items-center gap-1 bg-white dark:bg-slate-900 px-3 rounded border border-slate-205">
                              <span className="relative flex h-2 w-2 mr-1 animate-pulse">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                              </span>
                              Awaiting Customer to click "Confirm Delivery Received" in Customer View...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CORE BUTTON ACTIONS FOR THE VENDOR / LIAISON */}
                    <div className="flex items-center gap-2 pt-1 font-sans">
                      {ord.status === 'pending' && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => {
                              if (!allItemsConfirmed) {
                                alert("Please check and verify item availability with the hotel/store first or scan the store QR code!");
                                return;
                              }
                              onUpdateOrderStatus(ord.id, 'liaison_accepted');
                            }}
                            className={`flex-1 py-1.5 px-2.5 rounded text-[10px] font-extrabold text-center transition-all cursor-pointer ${
                              allItemsConfirmed
                                ? 'bg-indigo-600 hover:bg-indigo-705 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                            title={allItemsConfirmed ? "Accept the customer order" : "Query hotel availability of items first"}
                          >
                            Accept Order & Lock Rate Sheet
                          </button>
                        </div>
                      )}

                      {ord.status === 'liaison_accepted' && (
                        <div className="flex gap-2 w-full">
                          {/* Option 1: Standard courier handover */}
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'picking')}
                            className="flex-1 py-1.5 px-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-300 rounded text-[10px] font-extrabold transition-all text-center cursor-pointer"
                          >
                            Release with Courier Network Dispatch
                          </button>

                          {/* Option 2: Self delivery */}
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(ord.id, 'picking');
                              if (onUpdateVendorAction) {
                                onUpdateVendorAction(ord.id, { 
                                  isVendorSelfDelivering: true, 
                                  vendorActionStep: 'at_hotel_grocer' 
                                });
                              }
                            }}
                            className="flex-1 py-1.5 px-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded text-[10px] font-extrabold transition-all text-center cursor-pointer flex items-center justify-center gap-1 shadow-3xs"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Direct Deliver as Vendor
                          </button>
                        </div>
                      )}

                      {ord.status === 'picking' && !ord.isVendorSelfDelivering && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'dispatched')}
                          className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-705 text-white rounded text-[10px] font-bold transition-all text-center cursor-pointer animate-pulse"
                        >
                          Handover to Dispatch Courier
                        </button>
                      )}

                      {ord.status === 'dispatched' && !ord.isVendorSelfDelivering && (
                        <div className="text-[10px] text-slate-455 font-semibold flex items-center gap-1.5 leading-normal p-1 bg-white dark:bg-slate-900 border border-slate-105 rounded-md w-full justify-center">
                          <Info className="w-3.5 h-3.5 text-indigo-505 animate-bounce" /> Awaiting driver courier pickup...
                        </div>
                      )}

                      {ord.status === 'delivered' && (
                        <div className="text-[10px] text-emerald-650 dark:text-emerald-450 font-bold flex items-center gap-1 w-full justify-center bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-lg">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          Order Complete & Confirmed by Customer (Paid)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dedicated Real-time Sync Log side-panel */}
        <RealTimeSyncLogPanel syncLog={syncLog} />
        
      </div>

      {/* SCAN STORE QR MODAL */}
      <QRScannerModal
        isOpen={!!scanningOrderId}
        onClose={() => setScanningOrderId(null)}
        isScanningActive={isScanningActive}
        onCompleteVerification={handleCompleteQRScan}
      />

      {/* ADD / EDIT COMMODITY MODAL */}
      <CommodityFormModal
        isOpen={isCommodityModalOpen}
        onClose={() => setIsCommodityModalOpen(false)}
        onSubmit={handleCommoditySubmit}
        editingCommodity={editingCommodity}
        defaultStoreId={selectedStoreId}
        defaultCategory={currentStore?.type === 'hotel' ? 'Hotels & Restaurants' : 'Groceries'}
      />

    </div>
  );
}
