import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMsg {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastMsg[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div 
      id="toast-notification-root" 
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onRemove }: { toast: ToastMsg; onRemove: (id: string) => void; key?: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const config = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900',
      text: 'text-rose-800 dark:text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/90 border-amber-200 dark:border-amber-900',
      text: 'text-amber-800 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
    },
    info: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/90 border-indigo-200 dark:border-indigo-900',
      text: 'text-indigo-800 dark:text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-550 dark:text-indigo-400 shrink-0" />
    }
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.15 } }}
      className={`pointer-events-auto border rounded-2xl p-4 shadow-xl flex items-start gap-3 w-full backdrop-blur-md ${config.bg}`}
    >
      {config.icon}
      
      <div className="flex-1 space-y-0.5">
        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          {toast.title}
        </h4>
        <p className="text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
          {toast.message}
        </p>
      </div>

      <button 
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
