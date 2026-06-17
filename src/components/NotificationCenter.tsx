import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Sparkles, Database, Tag } from 'lucide-react';
import { NotificationMsg } from '../types';

interface NotificationCenterProps {
  notifications: NotificationMsg[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onToggleActive: boolean;
  onClose: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onToggleActive,
  onClose
}: NotificationCenterProps) {
  if (!onToggleActive) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div id="notification-center-drawer" className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-40 space-y-3.5 mr-4 max-h-[440px] overflow-y-auto font-sans text-xs">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800/60 font-sans">
        <div className="flex items-center gap-1.5 font-sans">
          <Bell className="w-4 h-4 text-indigo-650" />
          <h4 className="font-display font-semibold text-slate-800 dark:text-slate-150 text-xs">
            Push Alerts Center
          </h4>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white font-mono text-[8px] font-black px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex gap-2.5 items-center">
          {notifications.length > 0 && (
            <button 
              onClick={onMarkAllAsRead}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-750 transition-colors"
              title="Mark all as read"
            >
              Mark Read
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-0.5 font-sans">
        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <Sparkles className="w-5 h-5 text-slate-305 mx-auto mb-2 animate-bounce" />
            <p className="text-[10px] text-slate-400 font-medium">All quiet! No current notifications.</p>
          </div>
        ) : (
          notifications.map((msg) => (
            <motion.div 
              layout
              key={msg.id}
              className={`p-2.5 rounded-lg border text-xs relative ${
                !msg.read 
                  ? 'bg-indigo-50/20 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-900/30' 
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-850'
              }`}
            >
              {!msg.read && (
                <span className="absolute top-2.5 right-2 a w-1.5 h-1.5 bg-indigo-650 rounded-full"></span>
              )}

              <div className="flex gap-2 items-start">
                <span className="mt-0.5">
                  {msg.type === 'order_status' && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                  {msg.type === 'offline_sync' && <Database className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />}
                  {msg.type === 'price_alert' && <Tag className="w-3.5 h-3.5 text-indigo-605" />}
                  {msg.type === 'general' && <Sparkles className="w-3.5 h-3.5 text-slate-500" />}
                </span>
                <div>
                  <h5 className="font-display font-semibold text-slate-800 dark:text-slate-150 text-[11px] leading-tight">
                    {msg.title}
                  </h5>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 leading-relaxed">
                    {msg.body}
                  </p>
                  <span className="text-[8px] text-slate-400 block mt-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <button
          onClick={onClearNotifications}
          className="w-full text-center py-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] text-slate-500 font-bold tracking-wider uppercase transition-colors rounded-md border border-slate-150 dark:border-slate-800 cursor-pointer"
        >
          Clear History
        </button>
      )}
    </div>
  );
}
