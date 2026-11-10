import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface FitFlowAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const FitFlowAIAssistant: React.FC<FitFlowAIAssistantProps> = ({
  isOpen,
  onClose,
  currencySymbol
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello! I am your **FitFlow AI Business Intelligence Assistant** 🏋️‍♂️.\n\nI have direct, real-time access to your gym's verified database. Ask me anything about active members, monthly revenues, coach allocations, or expiring renewals!`,
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    'How many active members do we have?',
    'How much revenue did we generate this month?',
    'Which trainer has the most clients?',
    'Which memberships are expiring this week?',
    'Who has pending or overdue payments?'
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });
      const data = await res.json();

      const assistantMsg: Message = {
        sender: 'assistant',
        text: data.reply || 'No data returned.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to analyze database state: ' + err.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full sm:max-w-xl h-full sm:h-[90vh] sm:rounded-3xl bg-[#111512] border border-[#C7FF3D]/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#171C18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C7FF3D] text-black font-bold flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white text-base">FitFlow AI Assistant</h3>
                <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-[#C7FF3D]/20 text-[#C7FF3D]">
                  Gemini 3.8 Live
                </span>
              </div>
              <p className="text-xs text-[#A1A99E]">Real-Time Gym Intelligence & Revenue Forecasting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A99E] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-b border-white/5 bg-[#090B0A] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-full bg-[#171C18] border border-white/10 hover:border-[#C7FF3D]/50 text-xs text-[#A1A99E] hover:text-white whitespace-nowrap transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#C7FF3D] text-black flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    isUser
                      ? 'bg-[#C7FF3D] text-black font-medium rounded-tr-sm shadow-md'
                      : 'bg-[#171C18] text-white border border-white/10 rounded-tl-sm whitespace-pre-line shadow-md'
                  }`}
                >
                  {m.text}
                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      isUser ? 'text-black/60 text-right' : 'text-[#A1A99E]'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#C7FF3D] text-black flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="p-3 rounded-2xl bg-[#171C18] border border-white/10 text-xs text-[#A1A99E] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing gym database and calculating financial metrics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#171C18]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about gym revenue, trainers, or renewals..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-3 rounded-xl bg-[#111512] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C7FF3D]"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputQuery.trim()}
              className="p-3 rounded-xl bg-[#C7FF3D] text-black hover:bg-[#A5D92F] transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[#A1A99E] text-center mt-2 font-mono">
            Projections & recommendations are estimates based on your verified gym database.
          </p>
        </div>
      </div>
    </div>
  );
};
