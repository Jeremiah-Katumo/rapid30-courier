import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Sparkles, Navigation, ShieldCheck } from 'lucide-react';
import { Role } from '../types';

interface InteractiveTourProps {
  role: Role;
  onFinish: () => void;
}

interface TourStep {
  title: string;
  description: string;
  highlightId?: string; // HTML ID of the element to "highlight" or hover near
  fallbackSelector?: string; // Optional CSS path selector fallback
  position: 'top' | 'bottom' | 'center' | 'left' | 'right';
}

export default function InteractiveTour({ role, onFinish }: InteractiveTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Define steps according to authorization role
  const customerSteps: TourStep[] = [
    {
      title: "🍔 Gourmet Markets & Groceries Menu",
      description: "Search local rate sheets, switch inventory categories, and add delicious food or household commodities directly into your delivery cart.",
      highlightId: "markets-marketgrid",
      fallbackSelector: "[id^='markets-']",
      position: 'bottom'
    },
    {
      title: "🛒 Unified Shopping Basket & Checkout",
      description: "Review checked rates, finalize payment authorizations (card or digital wallets), and dispatch high-priority orders within 30 minutes flat.",
      highlightId: "shopping-cart-panel",
      fallbackSelector: ".checkout-btn",
      position: 'top'
    },
    {
      title: "⚡ Step-by-Step Delivery Tracker",
      description: "Watch your active orders progress through the four crucial stages: Inventory check, Merchant Procured, Out-for-Transit, and Touch Authorized Receipt Handover.",
      highlightId: "active-orders-tracker",
      fallbackSelector: ".orders-terminal",
      position: 'bottom'
    },
    {
      title: "🤖 Gemini Live Assistant Concierge",
      description: "Have questions about offline GPS, liaison certifications, or driver credentials? Open our floating smart chatbot assistant at any time!",
      highlightId: "assistant-trigger",
      fallbackSelector: "button[title*='Assistant']",
      position: 'top'
    }
  ];

  const liaisonSteps: TourStep[] = [
    {
      title: "📦 Local Incoming Delivery Requests",
      description: "Instantly view customer requests. Claim open orders, update commodity item-by-item availabilities, and prepare high-speed packages.",
      highlightId: "order-queue",
      fallbackSelector: ".claims-pool",
      position: 'bottom'
    },
    {
      title: "🏷️ Real-time Price Sheet Modifiers",
      description: "Instantly update price tags of your store options to balance daily supplies. Rates are broadcast and locked live across the TLS networks.",
      highlightId: "price-tag-editor",
      fallbackSelector: ".prices-editor",
      position: 'bottom'
    },
    {
      title: "📑 Real-time Sync Terminal Logs",
      description: "Watch background sync loops in real-time. Buffers are secured and queued whenever the offline simulator is toggled.",
      highlightId: "merchant-terminal-logs",
      fallbackSelector: ".sync-terminal",
      position: 'top'
    }
  ];

  const driverSteps: TourStep[] = [
    {
      title: "🚴 Courier Assigned Pipeline",
      description: "Review mapped deliveries, client contact lines, and destination coordinates assigned dynamically by organizational Dispatch.",
      highlightId: "driver-claimed-orders",
      fallbackSelector: ".driver-orders-list",
      position: 'bottom'
    },
    {
      title: "🗺️ Simulated Map Navigator",
      description: "Track route transit coordinates. Mark package arrival at your destination and prompt secure touchscreen receipt authorization fields for the client.",
      highlightId: "driver-route-map",
      fallbackSelector: ".gps-map-view",
      position: 'top'
    }
  ];

  const tourSteps = role === 'customer' ? customerSteps : role === 'liaison' ? liaisonSteps : driverSteps;

  const currentStep = tourSteps[currentStepIndex];

  // Dynamically calculate the highlighted element coordinates for spotlight overlays
  useEffect(() => {
    const updateSpotlightPosition = () => {
      let element: HTMLElement | null = null;
      if (currentStep?.highlightId) {
        element = document.getElementById(currentStep.highlightId);
      }
      if (!element && currentStep?.fallbackSelector) {
        element = document.querySelector(currentStep.fallbackSelector) as HTMLElement;
      }

      if (element) {
        setTargetRect(element.getBoundingClientRect());
        // Auto scroll elements into view comfortably
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    };

    // Delay slightly to allow transition animations to settle
    const timer = setTimeout(updateSpotlightPosition, 150);
    window.addEventListener('resize', updateSpotlightPosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSpotlightPosition);
    };
  }, [currentStepIndex, role, currentStep]);

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div id="interactive-tour-overlay" className="fixed inset-0 z-50 pointer-events-none font-sans select-none">
      
      {/* Dimmed backdrop spotlight */}
      <div 
        className="absolute inset-0 bg-slate-950/65 dark:bg-slate-950/75 transition-all duration-300 pointer-events-auto"
        style={{
          clipPath: targetRect 
            ? `polygon(
                0% 0%, 
                0% 100%, 
                ${targetRect.left}px 100%, 
                ${targetRect.left}px ${targetRect.top}px, 
                ${targetRect.right}px ${targetRect.top}px, 
                ${targetRect.right}px ${targetRect.bottom}px, 
                ${targetRect.left}px ${targetRect.bottom}px, 
                ${targetRect.left}px 100%, 
                100% 100%, 
                100% 0%
              )`
            : 'none'
        }}
        onClick={(e) => {
          // Prevent standard background interaction, except the spotlight region
          e.stopPropagation();
        }}
      />

      {/* Target spotlight border highlight */}
      {targetRect && (
        <div 
          className="absolute border-2 border-indigo-500 rounded-2xl shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-300 animate-pulse pointer-events-none"
          style={{
            left: targetRect.left - 4,
            top: targetRect.top - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      )}

      {/* Floating Guided Popover */}
      <div className="absolute inset-x-0 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 flex justify-center items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 30 }}
          className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 shadow-2xl pointer-events-auto mx-4 space-y-4"
        >
          {/* Top Info bar */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-bounce" />
              <span className="text-[9px] font-black uppercase text-indigo-605 tracking-wider">
                {role.toUpperCase()} ONBOARDING GUIDE
              </span>
            </div>
            <button 
              onClick={onFinish}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-655"
              title="Close Walkthrough"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Guide Explanation content */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100 leading-tight">
              {currentStep.title}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-350">
              {currentStep.description}
            </p>
          </div>

          {/* Action and step pagination bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-855">
            <div className="flex items-center gap-1">
              {tourSteps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentStepIndex ? 'bg-indigo-600 px-1.5' : 'bg-slate-205 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 text-[10px] font-bold">
              {currentStepIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg flex items-center gap-1 hover:bg-slate-105 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Back
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-lg flex items-center gap-1 shadow-3xs cursor-pointer"
              >
                {currentStepIndex === tourSteps.length - 1 ? 'Finish Tour ✓' : 'Next Step'}
                {currentStepIndex < tourSteps.length - 1 && <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
