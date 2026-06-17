import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, X, Send, Bot, RefreshCw, AlertCircle } from 'lucide-react';
import { TranslationSet } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantChatProps {
  t: TranslationSet;
}

export default function AIAssistantChat({ t }: AIAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am your Rapid30 AI Assistant Concierge. How can I help you navigate localized food delivery, QR certifications, driver GPS, or touch-signatures today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) {
      setInputValue('');
    }
    setIsLoading(true);
    setErrorStatus(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Assistance engine returned bad response code.");
      }

      const data = await response.json();
      const botMsg: Message = {
        role: 'assistant',
        content: data.text || "I was unable to formulate a response. Please check back shortly!",
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorStatus("Could not reach assistant server. Verify that Server is online.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const promptChips = [
    "Tell me about delivery steps",
    "How does offline GPS work?",
    "Where is the Liaison scan?",
    "How do I sign confirmations?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            className="mb-4 w-80 sm:w-96 h-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header bar */}
            <div className="bg-indigo-600 p-4 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500 rounded-lg">
                  <Bot className="w-5 h-5 text-indigo-100" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider">Rapid30 AI Concierge</h3>
                  <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Online • Powered by Gemini
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-indigo-700/60 transition-colors rounded-lg text-indigo-100 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Log Viewport */}
            <div 
              ref={listRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/20"
            >
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 max-w-[85%] rounded-2xl text-[11px] leading-relaxed shadow-3xs ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 border border-slate-105 dark:border-slate-800/80 text-slate-800 dark:text-slate-205 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Composition dot animation */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-105 dark:border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-3xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}

              {/* Error Warning */}
              {errorStatus && (
                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-550 dark:text-red-400 p-2 text-[10px] rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-505" />
                  <span>{errorStatus}</span>
                </div>
              )}
            </div>

            {/* suggestion chips */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap gap-1.5">
                {promptChips.map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSendMessage(chip)}
                    className="py-1 px-2.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-800 rounded-full text-[9px] font-bold text-slate-600 dark:text-slate-300 transition-all shadow-3xs cursor-pointer select-none"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input Panel */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-805 bg-white dark:bg-slate-900 flex gap-2 items-center">
              <input
                disabled={isLoading}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask our Rapid30 assistant..."
                className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 text-xs rounded-xl focus:outline-hidden focus:ring-1.5 focus:ring-indigo-505 placeholder-slate-400"
              />
              <button
                disabled={isLoading || !inputValue.trim()}
                onClick={() => handleSendMessage()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-500 rounded-xl transition-all shadow-3xs cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-indigo-600 hover:bg-indigo-705 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all outline-hidden cursor-pointer select-none relative animate-bounce"
        style={{ animationDuration: '3.5s' }}
        title="Open Rapid30 AI Assistant Concierge"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <MessageSquare className="w-5 h-5 absolute" />
            <span className="absolute -top-0.5 -right-0.5 bg-rose-550 border-2 border-white dark:border-slate-950 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black leading-none text-white animate-pulse">
              1
            </span>
          </>
        )}
      </button>
    </div>
  );
}
