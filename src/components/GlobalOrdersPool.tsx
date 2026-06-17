import React from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import { Order } from '../types';

interface GlobalOrdersPoolProps {
  availableGlobalOrders: Order[];
  selectedStoreId: string;
  onClaimOrder?: (orderId: string, storeId: string) => void;
}

export default function GlobalOrdersPool({
  availableGlobalOrders,
  selectedStoreId,
  onClaimOrder
}: GlobalOrdersPoolProps) {
  return (
    <div id="order-queue" className="bg-slate-100/50 dark:bg-slate-950/10 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-505"></span>
          </span>
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase">
            Global Order Pool (Check & Choose Tasks to Work On)
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase">
          {availableGlobalOrders.length} Available City-Wide
        </span>
      </div>

      {availableGlobalOrders.length === 0 ? (
        <p className="text-[11px] text-slate-455 italic py-2 text-center">
          No unclaimed orders are currently floating in the pipeline. Check back as customers submit new food / grocery bags!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableGlobalOrders.map(ord => (
            <div 
              key={ord.id} 
              className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-xl shadow-3xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono font-bold text-indigo-655 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded">
                    #{ord.id.substring(6).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">${ord.totalPrice.toFixed(2)}</span>
                </div>
                
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mt-1.5">
                  {ord.customerName}
                </span>
                
                <div className="flex items-center gap-1 text-[10px] text-slate-450 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{ord.deliveryAddress}</span>
                </div>

                {/* List items outline */}
                <div className="mt-2.5 bg-slate-50 dark:bg-slate-850 p-2 rounded text-[10px] font-mono space-y-1">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[9px] text-slate-500 dark:text-slate-450">
                      <span className="truncate max-w-[130px]">{it.commodity.name}</span>
                      <span>x{it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onClaimOrder && onClaimOrder(ord.id, selectedStoreId)}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-705 text-white rounded text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all active:scale-97 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Select & Check Availability to work on
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
