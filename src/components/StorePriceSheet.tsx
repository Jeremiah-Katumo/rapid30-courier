import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react';
import { Commodity } from '../types';

interface StorePriceSheetProps {
  storeCommodities: Commodity[];
  onUpdatePrice: (id: string, newPrice: number) => void;
  onEditCommodity: (item: Commodity) => void;
  onDeleteCommodity?: (id: string) => void;
  onAddCommodity: () => void;
}

export default function StorePriceSheet({
  storeCommodities,
  onUpdatePrice,
  onEditCommodity,
  onDeleteCommodity,
  onAddCommodity
}: StorePriceSheetProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');

  const handleEditStart = (item: Commodity) => {
    setEditingItemId(item.id);
    setEditingPriceValue(item.price.toString());
  };

  const handleSave = (id: string) => {
    const parsed = parseFloat(editingPriceValue);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdatePrice(id, parsed);
    }
    setEditingItemId(null);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to completely delete "${name}" from your active inventory? This action is permanent.`)) {
      if (onDeleteCommodity) {
        onDeleteCommodity(id);
      }
    }
  };

  return (
    <div 
      id="price-tag-editor" 
      className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-5 shadow-xs space-y-4 w-full"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
        <div className="space-y-0.5 animate-fade-in">
          <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-indigo-605" />
            Store Price Sheet
          </h3>
          <p className="text-[9.5px] text-slate-400 font-medium">
            {storeCommodities.length} Active Items
          </p>
        </div>
        
        <button
          onClick={onAddCommodity}
          className="py-1.5 px-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 text-indigo-650 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/30 rounded-lg text-[9.5px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
          title="Add New Commodity Item"
        >
          <Plus className="w-3.5 h-3.5" />
          + Add Item
        </button>
      </div>

      <div className="divide-y divide-slate-105 dark:divide-slate-800/60 max-h-[480px] overflow-y-auto pr-1 space-y-2">
        {storeCommodities.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 italic">
            No items registered for this merchant venue.
          </div>
        ) : (
          storeCommodities.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between group transition-colors">
              <div className="flex items-center gap-2">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-10 h-10 object-cover rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 
                    className="font-display text-[10.5px] font-semibold text-slate-850 dark:text-slate-150 leading-tight truncate max-w-[120px]" 
                    title={item.name}
                  >
                    {item.name}
                  </h4>
                  <span className="inline-block text-[8px] font-semibold tracking-wider text-slate-450 uppercase font-sans mt-0.5">
                    per {item.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {editingItemId === item.id ? (
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-[10.5px] text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-14 px-1 py-0.5 text-xs font-bold border border-indigo-300 dark:border-indigo-850 bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 rounded text-slate-800 dark:text-slate-100"
                      value={editingPriceValue}
                      onChange={(e) => setEditingPriceValue(e.target.value)}
                      onBlur={() => handleSave(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave(item.id);
                        if (e.key === 'Escape') setEditingItemId(null);
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <span 
                    onClick={() => handleEditStart(item)}
                    className="text-[10.5px] font-bold text-slate-800 dark:text-slate-205 font-mono cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline decoration-dotted decoration-slate-300"
                    title="Click to quickly calibrate retail cost"
                  >
                    ${item.price.toFixed(2)}
                  </span>
                )}
                
                {/* Action buttons (Edit & Delete inline hover) */}
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEditCommodity(item)}
                    className="p-1 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-855 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded transition-colors cursor-pointer"
                    title="Update Commodity Details"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>
                  {onDeleteCommodity && (
                    <button 
                      onClick={() => handleDeleteClick(item.id, item.name)}
                      className="p-1 bg-slate-50 hover:bg-rose-50 dark:bg-slate-855 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded transition-colors cursor-pointer"
                      title="Remove From Inventory"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
