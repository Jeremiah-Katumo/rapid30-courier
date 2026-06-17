import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, CheckCircle } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isScanningActive: boolean;
  onCompleteVerification: () => void;
  title?: string;
  description?: string;
}

export default function QRScannerModal({
  isOpen,
  onClose,
  isScanningActive,
  onCompleteVerification,
  title = 'Simulating Camera QR Scan...',
  description = "Scanning the hotel or store's live QR stamp to instantly register all order items as checked, verified, and in-stock."
}: QRScannerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 relative font-sans space-y-4"
          >
            <div className="text-center space-y-2">
              <span className="p-1 px-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-extrabold uppercase rounded tracking-wider">
                RAPID30 Procurement Barcode
              </span>
              <h3 className="font-display font-semibold text-slate-850 dark:text-slate-100 text-sm">
                {title}
              </h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-450 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Graphical QR Scanner Animation */}
            <div className="relative w-44 h-44 mx-auto border border-indigo-600/30 dark:border-indigo-500/20 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 overflow-hidden">
              {/* Neon scanning brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-500 rounded-tl"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-500 rounded-tr"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-500 rounded-bl"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-500 rounded-br"></div>

              {/* Laser scanline */}
              {isScanningActive && (
                <motion.div 
                  className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-lg shadow-indigo-550"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              )}

              <QrCode className={`w-20 h-20 text-indigo-600/20 dark:text-indigo-500/10 ${isScanningActive ? 'animate-pulse' : ''}`} />
            </div>

            {/* Progress and Action details */}
            <div className="space-y-3">
              <div className="text-center font-mono text-[9px] text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase">
                {isScanningActive ? 'DECRYPTING SIGNATURE...' : 'SCANNING SECURE & SUCCESSFUL'}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-550 dark:text-slate-400 font-extrabold text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isScanningActive}
                  onClick={onCompleteVerification}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-extrabold text-[10px] rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer shadow-3xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Complete Verification
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
