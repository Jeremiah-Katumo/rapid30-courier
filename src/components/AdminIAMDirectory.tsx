import React from 'react';
import { UserCheck } from 'lucide-react';
import { Role } from '../types';

export interface WebUser {
  id: string;
  name: string;
  username: string;
  role: Role;
  address: string;
  phone?: string;
  vehicle?: string;
  permissions?: string[];
}

interface AdminIAMDirectoryProps {
  users: WebUser[];
  onUpdateRole: (userId: string, targetRole: Role) => void;
  onTogglePermission: (userId: string, permission: string) => void;
}

export default function AdminIAMDirectory({
  users,
  onUpdateRole,
  onTogglePermission
}: AdminIAMDirectoryProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4.5 h-4.5 text-indigo-650" />
          <h4 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-xs tracking-wider uppercase">
            RBAC Directory assignment & Custom Permissions
          </h4>
        </div>
        <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-500 font-mono px-2 py-0.5 rounded">
          Active Registry Count: {users.length} Profiles
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 pb-2 text-[9.5px] text-slate-400 uppercase tracking-widest font-bold">
              <th className="py-2.5">Personnel Name</th>
              <th>Subscribed ID</th>
              <th>Position Assignment</th>
              <th>Permissions Granted</th>
              <th className="text-right">Platform Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {users.map((usr) => (
              <tr key={usr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                <td className="py-3.5 pr-2">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{usr.name}</div>
                  <div className="text-[10px] text-slate-400">@{usr.username} • {usr.phone || 'No phone'}</div>
                </td>
                <td className="font-mono text-[10px] text-slate-500 uppercase">{usr.id}</td>
                <td>
                  <select
                    value={usr.role}
                    onChange={(e) => onUpdateRole(usr.id, e.target.value as Role)}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="customer">Customer Access Only</option>
                    <option value="liaison">Store / Hotel Liaison</option>
                    <option value="driver">Courier Delivery Rep</option>
                    <option value="admin">Root System Admin</option>
                  </select>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1 max-w-sm">
                    {usr.permissions && usr.permissions.map((perm) => (
                      <span 
                        key={perm} 
                        className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 text-[8.5px] font-mono font-bold rounded flex items-center gap-0.5"
                      >
                        {perm}
                        <button 
                          onClick={() => onTogglePermission(usr.id, perm)}
                          className="hover:text-rose-600 font-extrabold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    
                    {/* Add quick perm shortcuts */}
                    {(!usr.permissions || usr.permissions.length === 0) && (
                      <span className="text-slate-400 italic text-[9px]">Implicit Base Only</span>
                    )}
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {[
                      { id: 'bypass_sla', label: 'Bypass SLA' },
                      { id: 'direct_payout', label: 'Direct Cash' }
                    ].map((permOpt) => {
                      const active = usr.permissions?.includes(permOpt.id);
                      return (
                        <button
                          key={permOpt.id}
                          onClick={() => onTogglePermission(usr.id, permOpt.id)}
                          className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold border transition-all cursor-pointer ${
                            active 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/20' 
                              : 'bg-slate-50 border-slate-201 text-slate-400 dark:bg-slate-800/20'
                          }`}
                        >
                          {permOpt.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
