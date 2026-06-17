import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag } from 'lucide-react';
import { Commodity, VendorStore } from '../types';

interface CommodityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: { 
    name: string; 
    price: number; 
    category: 'Groceries' | 'Hotels & Restaurants' | 'Daily Essentials'; 
    unit: string; 
    description: string; 
    image: string; 
    storeId: string; 
  }) => void;
  editingCommodity: Commodity | null;
  stores?: VendorStore[];
  showStoreSelect?: boolean;
  defaultStoreId?: string;
  defaultCategory?: 'Groceries' | 'Hotels & Restaurants' | 'Daily Essentials';
}

export default function CommodityFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCommodity,
  stores = [],
  showStoreSelect = false,
  defaultStoreId = 'store-1',
  defaultCategory = 'Groceries'
}: CommodityFormModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Groceries' | 'Hotels & Restaurants' | 'Daily Essentials'>('Groceries');
  const [unit, setUnit] = useState('pack');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [storeId, setStoreId] = useState(defaultStoreId);

  // Initialize form options
  useEffect(() => {
    if (editingCommodity) {
      setName(editingCommodity.name);
      setPrice(editingCommodity.price.toString());
      setCategory(editingCommodity.category);
      setUnit(editingCommodity.unit);
      setDescription(editingCommodity.description);
      setImage(editingCommodity.image);
      setStoreId(editingCommodity.storeId);
    } else {
      setName('');
      setPrice('');
      setCategory(defaultCategory);
      setUnit('pack');
      setDescription('');
      setImage('');
      setStoreId(defaultStoreId);
    }
  }, [editingCommodity, isOpen, defaultStoreId, defaultCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const defaultImages = {
      'Groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
      'Hotels & Restaurants': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
      'Daily Essentials': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80',
    };
    const finalImage = image.trim() || defaultImages[category] || defaultImages['Groceries'];

    onSubmit({
      name: name.trim(),
      price: priceNum,
      category,
      unit,
      description: description.trim() || 'Premium retail catalog item verified for compliance delivery.',
      image: finalImage,
      storeId
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/85">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-650" />
                <h3 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-xs uppercase tracking-wide">
                  {editingCommodity ? 'Update Commodity Registry' : 'New Commodity Registry'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-705 dark:hover:text-slate-200 p-1 rounded-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Commodity Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Organic Blueberries Pint"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden dark:text-slate-100"
                />
              </div>

              {/* Price & Unit Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="4.99"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-505 text-indigo-600 dark:text-indigo-400 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Measurement Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden dark:text-slate-200"
                  >
                    <option value="pack">Pack / Bag</option>
                    <option value="lb">Pound (lb)</option>
                    <option value="oz">Ounce (oz)</option>
                    <option value="item">Each / Piece</option>
                    <option value="pint">Pint / Box</option>
                    <option value="bottle">Bottle</option>
                  </select>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Commodity Category Group
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden dark:text-slate-200"
                >
                  <option value="Groceries">Groceries / Direct Store</option>
                  <option value="Hotels & Restaurants">Hotels & Restaurants Provisioning</option>
                  <option value="Daily Essentials">Daily Essentials / Pharmacies</option>
                </select>
              </div>

              {/* Conditionally draw store selector for Admin Dashboard */}
              {showStoreSelect && stores.length > 0 && (
                <div className="space-y-1 animate-fade-in">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Associate Store / Venue
                  </label>
                  <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden dark:text-slate-200"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.type === 'hotel' ? 'Hotel & Bistro' : 'Grocery Store'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Brief Retail Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Freshly sourced, organic, pre-harvested..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-505 focus:outline-hidden dark:text-slate-100 resize-none"
                />
              </div>

              {/* Image URL (Optional) */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Item Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Leave empty for category-themed smart image"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 font-medium">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-650 dark:text-slate-350 font-extrabold text-[10px] tracking-wide uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] tracking-wide uppercase shadow-3xs transition-all cursor-pointer"
                >
                  {editingCommodity ? 'Update Registry' : 'Publish & Sync'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
