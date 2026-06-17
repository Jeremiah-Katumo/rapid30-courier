import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, ShoppingBag, MapPin, Flame } from 'lucide-react';
import { TranslationSet } from '../types';

interface OnboardingProps {
  onComplete: (userData: { name: string; address: string; language: string }) => void;
  lang: string;
  t: TranslationSet;
}

export default function Onboarding({ onComplete, lang, t }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('883 Oakwood Drive, Apt 4C');
  const [selectedLanguage, setSelectedLanguage] = useState(lang);

  const steps = [
    {
      title: 'Rapid Doorstep Deliveries',
      description: 'Order fresh groceries, gourmet bites and hotel specialties delivered safely in under 30 minutes flat.',
      icon: <Flame className="w-12 h-12 text-indigo-600" />,
      color: 'from-indigo-500/10 to-indigo-600/10'
    },
    {
      title: 'Compare Prices & Liaise Live',
      description: 'Liaisons synchronize costs directly from hotels & grocery stores to guarantee the best available merchant rates.',
      icon: <Compass className="w-12 h-12 text-indigo-650" />,
      color: 'from-blue-500/10 to-indigo-550/10'
    },
    {
      title: 'Full Real-time GPS Route',
      description: 'Watch your dedicated courier navigate the route live on interactive micro-maps with step-by-step dispatch status.',
      icon: <MapPin className="w-12 h-12 text-indigo-600" />,
      color: 'from-emerald-500/10 to-indigo-600/10'
    },
    {
      title: 'Personalize Your Profile',
      description: 'Set up your delivery coordinates and favorite name to begin coordination.',
      icon: <ShoppingBag className="w-12 h-12 text-indigo-655" />,
      color: 'from-indigo-500/10 to-purple-500/10'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete({
        name: userName.trim() || 'Valued Customer',
        address: userAddress.trim() || '883 Oakwood Drive, Apt 4C',
        language: selectedLanguage
      });
    }
  };

  return (
    <div id="onboarding-root" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-8 shadow-2xl"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 flex">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-full flex-1 transition-all duration-300 ${i <= step ? 'bg-indigo-600' : 'bg-transparent'}`} 
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="flex flex-col items-center text-center mt-4">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className={`p-5 rounded-full bg-gradient-to-tr ${steps[step].color} mb-5`}
          >
            {steps[step].icon}
          </motion.div>

          <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight mb-2">
            {steps[step].title}
          </h2>
          
          <p className="text-slate-450 dark:text-slate-400 text-xs leading-relaxed max-w-sm mb-6 font-sans">
            {steps[step].description}
          </p>

          {/* Special config options on step 3 */}
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-4 max-w-sm text-left mb-6 font-sans"
            >
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  How should we address you?
                </label>
                <input 
                  type="text"
                  placeholder="Your Name (e.g. Aria Sterling)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Delivery Destination coordinates
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-805 dark:text-slate-100 text-xs focus:outline-hidden focus:ring-1.5 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  System Language Preference
                </label>
                <div className="flex gap-2 font-semibold">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' },
                    { code: 'sw', label: 'Kiswahili' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setSelectedLanguage(l.code)}
                      className={`flex-1 py-1.5 px-3 rounded-md text-[11px] border transition-colors cursor-pointer ${
                        selectedLanguage === l.code 
                          ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 font-sans">
          <button 
            type="button"
            onClick={() => setStep(steps.length - 1)}
            disabled={step === steps.length - 1}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-0 transition-opacity cursor-pointer"
          >
            Skip Walkthrough
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-semibold transition-all shadow-md active:scale-97 cursor-pointer"
          >
            {step === steps.length - 1 ? 'Get Started' : 'Continue'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
