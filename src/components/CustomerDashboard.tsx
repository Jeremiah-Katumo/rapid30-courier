import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, Plus, Minus, Search, CreditCard, ShieldCheck, 
  MapPin, CheckCircle, Star, ThumbsUp, BellRing, Sparkles, AlertCircle 
} from 'lucide-react';
import { Commodity, VendorStore, Order, Driver, TranslationSet } from '../types';

interface CustomerDashboardProps {
  commodities: Commodity[];
  stores: VendorStore[];
  activeOrders: Order[];
  drivers: Driver[];
  userAddress: string;
  userName: string;
  cart: { [itemId: string]: number };
  onAddToCart: (itemId: string) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  onCreateOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  onRateVendorDriver: (orderId: string, vendorRating: number, driverRating: number) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  currentUser?: any;
  t: TranslationSet;
}

import FulfillmentSignatureCanvas from './FulfillmentSignatureCanvas';

export default function CustomerDashboard({
  commodities,
  stores,
  activeOrders,
  drivers,
  userAddress,
  userName,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCreateOrder,
  onRateVendorDriver,
  onUpdateOrderStatus,
  currentUser,
  t
}: CustomerDashboardProps) {
  const [signingOrderId, setSigningOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Groceries' | 'Hotels & Restaurants' | 'Daily Essentials'>('All');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cardName, setCardName] = useState(userName);
  const [cardNumber, setCardNumber] = useState('4111 8802 9912 3004');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('382');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Rating states per delivered order
  const [orderRatings, setOrderRatings] = useState<Record<string, { vendor: number; driver: number }>>({});

  // Filter commodities
  const filteredCommodities = commodities.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate cart metrics
  const uniqueItemIds = Object.keys(cart).filter(id => cart[id] > 0);
  const subtotal = uniqueItemIds.reduce((sum, id) => {
    const item = commodities.find(c => c.id === id);
    if (!item) return sum;
    return sum + (item.price * cart[id]);
  }, 0);

  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const serviceFee = subtotal > 0 ? 1.50 : 0;
  const grandTotal = subtotal + deliveryFee + serviceFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uniqueItemIds.length === 0) return;

    setIsProcessingPayment(true);

    // Simulate standard card tokenization and secured transaction protocol
    setTimeout(() => {
      // Find the store of the first item to route the order to that store
      const firstItemId = uniqueItemIds[0];
      const firstItem = commodities.find(c => c.id === firstItemId);
      const storeId = firstItem?.storeId || 'store-1';

      const orderItems = uniqueItemIds.map(id => {
        const c = commodities.find(item => item.id === id)!;
        return {
          commodity: c,
          quantity: cart[id]
        };
      });

      onCreateOrder({
        customerId: currentUser?.username || 'customer-user-1',
        customerName: currentUser?.name || userName,
        customerPhone: currentUser?.phone || '+1 (555) 722-1082',
        deliveryAddress: userAddress,
        deliveryLocation: { lat: 37.7785, lng: -122.4192, name: 'Customer Residence' },
        items: orderItems,
        totalPrice: grandTotal,
        serviceFree: serviceFee,
        deliveryFee: deliveryFee,
        status: 'pending',
        storeId: storeId,
        estimatedDeliveryMinutes: 25, // default
        paymentMethod: 'card',
        paymentStatus: 'completed'
      });

      setIsProcessingPayment(false);
      setShowCheckoutModal(false);
      onClearCart();
    }, 2000); // 2 seconds simulated transaction duration
  };

  const getStoreNameOfCommodity = (storeId: string) => {
    return stores.find(s => s.id === storeId)?.name || 'Local Store';
  };

  const handleSetRating = (orderId: string, type: 'vendor' | 'driver', rating: number) => {
    setOrderRatings(prev => {
      const current = prev[orderId] || { vendor: 5, driver: 5 };
      return {
        ...prev,
        [orderId]: {
          ...current,
          [type]: rating
        }
      };
    });
  };

  const submitRatings = (orderId: string) => {
    const ratings = orderRatings[orderId] || { vendor: 5, driver: 5 };
    onRateVendorDriver(orderId, ratings.vendor, ratings.driver);
  };

  const getDriverDetails = (driverId?: string) => {
    if (!driverId) return null;
    return drivers.find(d => d.id === driverId);
  };

  return (
    <div id="customer-dashboard" className="space-y-6">
      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600 text-slate-850 dark:text-slate-100 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Category Pill selectors */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Groceries', 'Hotels & Restaurants', 'Daily Essentials'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-55 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 border border-slate-150/40 dark:border-slate-750'
              }`}
            >
              {cat === 'All' ? 'Everything' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Commodities Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase">
              {selectedCategory === 'All' ? 'Aesthetic Local Commodities' : selectedCategory}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {filteredCommodities.length} items verified
            </span>
          </div>

          <div id="markets-marketgrid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommodities.map((item) => (
              <motion.div 
                layout
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800/80 overflow-hidden flex flex-col justify-between group hover:border-indigo-600/30 dark:hover:border-indigo-500/30 hover:shadow-2xs transition-all p-3.5"
              >
                <div>
                  <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-slate-50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase bg-slate-950/85 backdrop-blur-xs text-white">
                      {item.category}
                    </div>
                    {item.prevPrice && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider bg-indigo-600 text-white">
                        OFFER
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block font-sans">
                    {getStoreNameOfCommodity(item.storeId)}
                  </span>
                  
                  <h4 className="font-display text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 mt-1">
                    {item.name}
                  </h4>
                  
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 line-clamp-2 min-h-[30px] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100 font-mono">${item.price.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-400">/ {item.unit}</span>
                    </div>
                    {item.prevPrice && (
                      <span className="text-[9px] text-slate-400 line-through font-mono">${item.prevPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {cart[item.id] > 0 ? (
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-150 dark:border-slate-700">
                      <button 
                        onClick={() => onRemoveFromCart(item.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      >
                        <Minus className="w-3 h-3 text-slate-550" />
                      </button>
                      <span className="text-xs font-bold px-1 text-slate-800 dark:text-slate-150 font-mono">{cart[item.id]}</span>
                      <button 
                        onClick={() => onAddToCart(item.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3 text-slate-550" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAddToCart(item.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-97 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Bag
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Local Cart Panel & Order Statuses Tracker */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Orders Status Tracking Tracker */}
          <div id="active-orders-tracker" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-indigo-600" />
              Active Tracking & Reviews
            </h3>

            {activeOrders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active delivery coordinate tasks initialized.</p>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((ord) => {
                  const activeDriver = getDriverDetails(ord.driverId);
                  
                  return (
                    <div 
                      key={ord.id} 
                      className="bg-slate-50 dark:bg-slate-850/30 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold font-mono text-slate-500 uppercase">
                          ID: #{ord.id.substring(6).toUpperCase()}
                        </span>
                        
                        <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${
                          ord.status === 'pending' ? 'bg-amber-500/10 text-amber-605 animate-pulse' :
                          ord.status === 'liaison_accepted' ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400' :
                          ord.status === 'picking' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' :
                          ord.status === 'delivering' ? 'bg-indigo-605 text-white animate-pulse' :
                          'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                        }`}>
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Visual Horizontal Step-Indicator representing Checking -> Procured -> Transit -> Arrived */}
                      <div className="py-2 flex items-center justify-between relative mt-2 mb-3.5 font-sans">
                        {/* Connecting Line Track */}
                        <div className="absolute top-[10px] left-3 right-3 h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-0" />
                        
                        {/* Connecting Active Accent Highlight line */}
                        <div 
                          className="absolute top-[10px] left-3 h-[2px] bg-indigo-650 -translate-y-1/2 -z-0 transition-all duration-550" 
                          style={{ 
                            width: `${Math.max(0, (
                              ord.status === 'pending' ? 0 :
                              (ord.status === 'liaison_accepted' || ord.status === 'picking') ? 1 :
                              (ord.status === 'dispatched' || ord.status === 'delivering') ? 2 : 3
                            ) * 33.333)}%` 
                          }}
                        />

                        {/* Steps mapping */}
                        {['Inventory Check', 'Procured', 'Out/Transit', 'Completed'].map((lvlName, lIndex) => {
                          const currentStep = 
                            ord.status === 'pending' ? 0 :
                            (ord.status === 'liaison_accepted' || ord.status === 'picking') ? 1 :
                            (ord.status === 'dispatched' || ord.status === 'delivering') ? 2 : 3;

                          const isDone = lIndex < currentStep;
                          const isActive = lIndex === currentStep;

                          return (
                            <div key={lIndex} className="flex flex-col items-center relative z-10 w-12 text-center select-none">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 text-[8px] font-extrabold ${
                                isDone 
                                  ? 'bg-indigo-600 text-white shadow-3xs' 
                                  : isActive 
                                    ? 'bg-indigo-50 border-2 border-indigo-605 text-indigo-600 animate-pulse dark:bg-indigo-950/40 dark:border-indigo-400 dark:text-indigo-400' 
                                    : 'bg-white border border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 font-medium'
                              }`}>
                                {isDone ? '✓' : lIndex + 1}
                              </div>
                              <span className={`text-[7px] font-extrabold mt-1 uppercase tracking-wider block leading-tight ${
                                isActive ? 'text-indigo-600 dark:text-indigo-400 font-black' : isDone ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {lvlName}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Display Courier assigned details if available */}
                      {activeDriver ? (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-lg">
                          <img 
                            src={activeDriver.avatar} 
                            alt={activeDriver.name} 
                            className="w-7 h-7 rounded-full border border-slate-105 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Assigned Courier</span>
                            <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-205">{activeDriver.name}</span>
                          </div>
                          <span className="text-[9px] font-sans font-medium text-slate-400 ml-auto truncate max-w-[100px]">{activeDriver.vehicle}</span>
                        </div>
                      ) : ord.isVendorSelfDelivering ? (
                        <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-2.5 rounded-lg text-[10px] font-medium text-indigo-800 dark:text-indigo-300">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" />
                          <div>
                            <span className="font-bold block uppercase text-[8px] tracking-wide text-indigo-650 dark:text-indigo-400">Direct Vendor Fulfillment</span>
                            <span>
                              {ord.vendorActionStep === 'at_hotel_grocer' && 'Vendor is currently at hotel / store procuring items...'}
                              {ord.vendorActionStep === 'transit_to_customer' && 'Vendor has completed picking and is heading to your residence!'}
                              {ord.vendorActionStep === 'completed' && 'Vendor has arrived at your doorstep!'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[9px] text-slate-400 italic">Merchant liaison examining standard rate sheets...</p>
                      )}

                      {/* Confirm Delivery Button & Signature canvas for Customer */}
                      {(ord.status === 'delivering' || ord.status === 'dispatched' || ord.vendorActionStep === 'transit_to_customer') && (
                        <div className="pt-1.5">
                          {signingOrderId === ord.id ? (
                            <FulfillmentSignatureCanvas 
                              onCancel={() => setSigningOrderId(null)}
                              onConfirm={() => {
                                onUpdateOrderStatus(ord.id, 'delivered');
                                setSigningOrderId(null);
                              }}
                            />
                          ) : (
                            <button
                              onClick={() => {
                                setSigningOrderId(ord.id);
                              }}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-705 text-white font-bold text-[10px] rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Authorize Receipt & Sign Handover
                            </button>
                          )}
                        </div>
                      )}

                      {/* RATING SUBMISSION SYSTEM (Driver + Vendor) once status is delivered */}
                      {ord.status === 'delivered' && (
                        <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/40 p-2.5 rounded-lg space-y-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span className="text-[10px] font-bold text-indigo-805 dark:text-indigo-400 uppercase tracking-widest">
                              Deliver Completed. Rate Experience!
                            </span>
                          </div>

                          {ord.driverRating && ord.vendorRating ? (
                            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-normal">
                              <span>Rated Vendor: {ord.vendorRating}★ • Rated Courier: {ord.driverRating}★. Feedback recorded. Thank you!</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5 pt-1.5 border-t border-indigo-100 dark:border-indigo-900/30">
                              {/* Vendor Rating */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Vendor Quality:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                      key={star} 
                                      onClick={() => handleSetRating(ord.id, 'vendor', star)}
                                      className={`text-sm tracking-tight ${star <= (orderRatings[ord.id]?.vendor ?? 5) ? 'text-indigo-605' : 'text-slate-300 dark:text-slate-700'}`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Driver Rating */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Courier Delivery:</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                      key={star} 
                                      onClick={() => handleSetRating(ord.id, 'driver', star)}
                                      className={`text-sm tracking-tight ${star <= (orderRatings[ord.id]?.driver ?? 5) ? 'text-indigo-605' : 'text-slate-300 dark:text-slate-700'}`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => submitRatings(ord.id)}
                                className="w-full mt-1.5 py-1.5 text-[9px] uppercase font-bold tracking-widest text-white bg-indigo-600 hover:bg-indigo-750 rounded transition-all text-center"
                              >
                                Submit Rating Scores
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Bag checkout module */}
          <div id="shopping-cart-panel" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase pb-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              {t.cart}
            </h3>

            {uniqueItemIds.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs leading-relaxed">
                Your delivery bag is empty. Choose delicious recipes or green groceries above to fill.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {uniqueItemIds.map((id) => {
                    const item = commodities.find(c => c.id === id)!;
                    return (
                      <div key={id} className="flex justify-between items-center text-xs">
                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="font-display text-xs font-semibold text-slate-800 dark:text-slate-150 truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-450">${item.price.toFixed(2)} each</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400">x{cart[id]}</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">${(item.price * cart[id]).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery service fee</span>
                    <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Secure processing</span>
                    <span className="font-mono">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 dark:text-slate-100 font-bold text-sm pt-2 border-t border-dashed border-slate-200 dark:border-slate-800/60">
                    <span>Total Amount due</span>
                    <span className="font-mono">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-750 text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-xs active:scale-97 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  {t.checkout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECURE INTEGRATED PAYMENT GATEWAY MODAL POPUP */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div id="payment-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 p-6 shadow-2xl max-w-md w-full relative overflow-hidden"
            >
              {/* Security pattern badge */}
              <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-xl text-emerald-600 flex items-center gap-1 text-[9px] font-bold tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> SECURE TLS
              </div>

              <h3 className="font-display text-base font-semibold text-slate-805 dark:text-slate-100 flex items-center gap-2 mb-1.5 pt-1">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Secured Payment Gateway
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 mb-4 leading-relaxed">
                Your credentials are encrypted under high-entropy client protocols prior to token exchange.
              </p>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {/* Visual card mockup */}
                <div className="bg-slate-900 dark:bg-slate-950 text-white p-4.5 rounded-xl space-y-4 shadow-sm border border-slate-800 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] tracking-widest font-mono text-slate-400">CREDIT CARD TRANSIT</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="font-mono text-sm tracking-widest text-center py-1 text-slate-100 font-extrabold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-2">
                    <div>
                      <span>CARDHOLDER:</span>
                      <div className="uppercase font-bold text-slate-205 mt-0.5 truncate max-w-[170px]">{cardName || 'Valued Client'}</div>
                    </div>
                    <div>
                      <span>VALID THRU:</span>
                      <div className="font-bold text-slate-205 mt-0.5">{cardExpiry || '12/28'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Card Holder Name</label>
                  <input 
                    type="text" 
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 hover:border-slate-300 transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 font-sans">
                  <div className="col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 font-mono hover:border-slate-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">CVV</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 font-mono text-center hover:border-slate-300 transition-all"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-2.5 border border-slate-150 dark:border-slate-800 flex justify-between items-center text-xs font-sans">
                  <span className="font-semibold text-slate-500">Total Settlement:</span>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</span>
                </div>

                <div className="flex gap-2 pt-1 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-605 dark:text-slate-303 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 disabled:brightness-75"
                  >
                    {isProcessingPayment ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Applying SHA3 Auth...</span>
                      </div>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
