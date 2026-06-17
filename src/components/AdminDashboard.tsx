import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Tag, BarChart3, Settings, Trash2, Edit2, Plus, Sparkles
} from 'lucide-react';
import { Commodity, Order, Role, VendorStore, TranslationSet } from '../types';
import AdminKPIReport from './AdminKPIReport';
import AdminIAMDirectory, { WebUser } from './AdminIAMDirectory';
import AdminParameterTuner from './AdminParameterTuner';
import CommodityFormModal from './CommodityFormModal';

interface AdminDashboardProps {
  commodities: Commodity[];
  orders: Order[];
  stores: VendorStore[];
  onCreateCommodity: (item: Omit<Commodity, 'id' | 'rating'>) => void;
  onUpdateCommodity: (id: string, updates: Partial<Commodity>) => void;
  onDeleteCommodity: (id: string) => void;
  t: TranslationSet;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function AdminDashboard({
  commodities,
  orders,
  stores,
  onCreateCommodity,
  onUpdateCommodity,
  onDeleteCommodity,
  showToast
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'kpi' | 'users' | 'commodities' | 'parameters'>('kpi');
  const [users, setUsers] = useState<WebUser[]>([]);
  
  // Managing local user directories and permission roles
  useEffect(() => {
    const rawUsers = localStorage.getItem('rapid30_registered_users');
    if (rawUsers) {
      try {
        setUsers(JSON.parse(rawUsers));
      } catch (err) {
        console.error("Error decoding administrative users registry", err);
      }
    } else {
      // Fallback defaults representing our ecosystem
      const mockAdminRegistry: WebUser[] = [
        { id: 'u-1', name: 'Zack Roberts', username: 'cust_demo', role: 'customer', address: '883 Oakwood Drive, Apt 4C', phone: '415-555-0199', permissions: ['order_priority'] },
        { id: 'u-2', name: 'Preston Wells', username: 'liai_demo', role: 'liaison', address: 'Sector 4 Hub', phone: '415-555-0142', permissions: ['edit_pricing', 'confirm_stock'] },
        { id: 'u-3', name: 'Ethan Hunt', username: 'courier_demo', role: 'driver', address: 'Mission District', phone: '415-555-0181', vehicle: 'KTM 390 Adventure Bi-fuel', permissions: ['gps_simulate', 'route_optimization'] },
        { id: 'u-4', name: 'Super Administrator', username: 'admin_demo', role: 'admin', address: 'Rapid30 HQ Base', phone: '415-555-0100', permissions: ['all_permissions'] }
      ];
      setUsers(mockAdminRegistry);
      localStorage.setItem('rapid30_registered_users', JSON.stringify(mockAdminRegistry));
    }
  }, []);

  const saveUsersToStorage = (updatedUsers: WebUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('rapid30_registered_users', JSON.stringify(updatedUsers));
  };

  // State for Admin Commodity CRUD Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Commodity | null>(null);

  // Parameters State
  const [platformFee, setPlatformFee] = useState('3.99');
  const [slaMinutes, setSlaMinutes] = useState('30');
  const [surgeMultiplier, setSurgeMultiplier] = useState('1.0');
  const [onDutyDrivers, setOnDutyDrivers] = useState(4);

  // Calculation metrics
  const totalGMV = orders.reduce((acc, current) => acc + current.totalPrice, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const dispatchCount = orders.filter(o => o.status === 'dispatched' || o.status === 'delivering').length;
  const completedCount = orders.filter(o => o.status === 'delivered').length;
  
  // SLA metrics
  const slaFulfillmentRate = completedCount > 0 ? 94.6 : 100;

  const handleOpenAddCom = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditCom = (item: Commodity) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdminComSubmit = (itemData: {
    name: string;
    price: number;
    category: 'Groceries' | 'Hotels & Restaurants' | 'Daily Essentials';
    unit: string;
    description: string;
    image: string;
    storeId: string;
  }) => {
    if (editingItem) {
      onUpdateCommodity(editingItem.id, itemData);
    } else {
      onCreateCommodity(itemData);
    }
    setIsModalOpen(false);
  };

  const handleAdminDeleteCom = (id: string, name: string) => {
    if (confirm(`Administratively remove "${name}" from the global delivery catalog?`)) {
      onDeleteCommodity(id);
    }
  };

  // Change user role
  const handleUpdateRole = (userId: string, targetRole: Role) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, role: targetRole };
      }
      return u;
    });
    saveUsersToStorage(updated);
    showToast('Credentials Updated', `Security assigned role redefined for personnel profile.`, 'success');
  };

  // Switch permissions
  const handleTogglePermission = (userId: string, permission: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const currentPerms = u.permissions || [];
        const nextPerms = currentPerms.includes(permission)
          ? currentPerms.filter(p => p !== permission)
          : [...currentPerms, permission];
        return { ...u, permissions: nextPerms };
      }
      return u;
    });
    saveUsersToStorage(updated);
  };

  const getStoreLabel = (storeId: string) => {
    return stores.find(s => s.id === storeId)?.name || 'Local Store Hub';
  };

  return (
    <div id="admin-dashboard" className="space-y-6">
      {/* Admin header card */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-505/10 rounded-full blur-2xl"></div>
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/20 rounded-xl">
              <ShieldAlert className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold tracking-tight">RAPID30 Master Control Room</h3>
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-450 border border-rose-500/20 rounded text-[8px] font-extrabold tracking-widest uppercase">
                  Root Admin Authority
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Manage global commodities, map RBAC permissions, and tune system thresholds.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 self-end">
            {[
              { id: 'kpi', icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'KPI Reports' },
              { id: 'users', icon: <Users className="w-3.5 h-3.5" />, label: 'IAM Directories' },
              { id: 'commodities', icon: <Tag className="w-3.5 h-3.5" />, label: 'Commodities CRUD' },
              { id: 'parameters', icon: <Settings className="w-3.5 h-3.5" />, label: 'Tuner Parameters' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-3xs'
                    : 'bg-slate-800 text-slate-300 border border-slate-750/30 hover:bg-slate-750'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main dashboard content switchboard */}
      <div className="w-full">
        {activeTab === 'kpi' && (
          <AdminKPIReport
            orders={orders}
            completedCount={completedCount}
            pendingCount={pendingCount}
            dispatchCount={dispatchCount}
            totalGMV={totalGMV}
            slaFulfillmentRate={slaFulfillmentRate}
          />
        )}

        {activeTab === 'users' && (
          <AdminIAMDirectory
            users={users}
            onUpdateRole={handleUpdateRole}
            onTogglePermission={handleTogglePermission}
          />
        )}

        {activeTab === 'commodities' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Tag className="w-4.5 h-4.5 text-indigo-650" />
                <h4 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase">
                  Global Commodities Directory Registry
                </h4>
              </div>
              <button
                onClick={handleOpenAddCom}
                className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold uppercase rounded-lg flex items-center gap-1 transition-all shadow-3xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {commodities.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3.5 bg-slate-50 dark:bg-slate-850/30 rounded-xl border border-slate-150 dark:border-slate-800 relative group flex flex-col justify-between font-sans space-y-3.5"
                >
                  <div className="space-y-2">
                    <div className="relative h-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-150 dark:border-slate-800">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/90 text-white rounded text-[8px] font-black uppercase tracking-wider">
                        {item.category}
                      </div>

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                        <button
                          onClick={() => handleOpenEditCom(item)}
                          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                          title="Edit Detailed Registry"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdminDeleteCom(item.id, item.name)}
                          className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                          title="Ecosystem evacuation deletion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-850 dark:text-slate-100 text-[11px] leading-tight line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] uppercase font-bold">
                    <span className="text-[9px] text-slate-400 font-medium">per {item.unit}</span>
                    <span className="text-indigo-650 dark:text-indigo-400 font-mono font-extrabold flex items-center gap-1">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'parameters' && (
          <AdminParameterTuner
            platformFee={platformFee}
            setPlatformFee={setPlatformFee}
            slaMinutes={slaMinutes}
            setSlaMinutes={setSlaMinutes}
            surgeMultiplier={surgeMultiplier}
            setSurgeMultiplier={setSurgeMultiplier}
            onDutyDrivers={onDutyDrivers}
            setOnDutyDrivers={setOnDutyDrivers}
            onPurgeBuffer={() => {
              localStorage.removeItem('rapid30_registered_users');
              localStorage.removeItem('rapid30_commodities');
              localStorage.removeItem('rapid30_orders');
              showToast('Buffer purged', 'Settings resets loaded values. Please reload the frame.', 'warning');
              setTimeout(() => window.location.reload(), 1500);
            }}
            onApplyCalibration={() => {
              showToast('Configurations Adjusted', 'Base tariff parameters updated successfully.', 'success');
            }}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* ADMIN COMMODITY CREATE / EDIT MODAL */}
      <CommodityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdminComSubmit}
        editingCommodity={editingItem}
        stores={stores}
        showStoreSelect={true}
        defaultStoreId={stores[0]?.id || 'store-1'}
      />
    </div>
  );
}
