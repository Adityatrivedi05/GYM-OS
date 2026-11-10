import React, { useState } from 'react';
import {
  Dumbbell,
  ShieldCheck,
  UserCheck,
  Users,
  Sparkles,
  Bell,
  Plus,
  CreditCard,
  QrCode,
  ChevronDown,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { UserRole } from '../../types/index.ts';

interface NavbarProps {
  currentView: 'landing' | 'app';
  setCurrentView: (view: 'landing' | 'app') => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
  onOpenAddMember: () => void;
  onOpenRecordPayment: () => void;
  onOpenQRScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  onOpenAIAssistant,
  onOpenAddMember,
  onOpenRecordPayment,
  onOpenQRScanner
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badge: string; icon: any }> = {
    owner: { title: 'Gym Owner / Admin', badge: 'Full Access', icon: ShieldCheck },
    trainer: { title: 'Trainer Portal', badge: 'Trainer Mode', icon: UserCheck },
    staff: { title: 'Front Desk / Staff', badge: 'Staff Mode', icon: Users }
  };

  const sampleNotifications = [
    { id: 1, title: 'Rahul Verma expiring in 4 days', time: '10 min ago', unread: true },
    { id: 2, title: 'Trainer Kabir Mehta marked Late (Metro delay)', time: '2 hours ago', unread: true },
    { id: 3, title: '₹14,999 payment verified via Razorpay', time: 'Today, 04:45 PM', unread: false }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090B0A]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C7FF3D] flex items-center justify-center text-black font-bold shadow-lg shadow-[#C7FF3D]/20 transition-transform group-hover:scale-105">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-tight text-white">FITFLOW</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#C7FF3D] text-black">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#A1A99E] -mt-0.5 tracking-wider font-mono">IRON TEMPLE OS</p>
            </div>
          </button>

          {/* Mode Switcher: Landing vs Live OS */}
          <div className="hidden md:flex items-center p-0.5 rounded-lg bg-[#111512] border border-white/5 text-xs font-medium">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'landing'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-[#A1A99E] hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <button
              onClick={() => setCurrentView('app')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                currentView === 'app'
                  ? 'bg-[#C7FF3D] text-black font-semibold shadow-sm'
                  : 'text-[#A1A99E] hover:text-[#C7FF3D]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Live Gym OS</span>
            </button>
          </div>
        </div>

        {/* Action Controls & User Role */}
        <div className="flex items-center gap-2.5">
          {/* AI Assistant Quick Trigger */}
          <button
            onClick={onOpenAIAssistant}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#171C18] to-[#1F2620] border border-[#C7FF3D]/30 text-xs font-semibold text-white hover:border-[#C7FF3D] transition-all hover:shadow-[0_0_15px_rgba(199,255,61,0.2)]"
            title="Ask FitFlow AI Assistant questions on your gym data"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C7FF3D] animate-spin-slow" />
            <span className="hidden sm:inline">FitFlow AI Assistant</span>
            <span className="sm:hidden">AI</span>
          </button>

          {currentView === 'app' && (
            <>
              {/* Quick Actions (Add member, record payment, QR scanner) */}
              <div className="hidden lg:flex items-center gap-1.5">
                <button
                  onClick={onOpenAddMember}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#171C18] border border-white/10 text-xs font-medium text-white hover:border-white/20 hover:bg-[#1E241F] transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C7FF3D]" />
                  <span>Member</span>
                </button>
                <button
                  onClick={onOpenRecordPayment}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#171C18] border border-white/10 text-xs font-medium text-white hover:border-white/20 hover:bg-[#1E241F] transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#C7FF3D]" />
                  <span>Payment</span>
                </button>
                <button
                  onClick={onOpenQRScanner}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#171C18] border border-white/10 text-xs font-medium text-white hover:border-white/20 hover:bg-[#1E241F] transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#C7FF3D]" />
                  <span>QR Turnstile</span>
                </button>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="w-9 h-9 rounded-lg bg-[#111512] border border-white/10 flex items-center justify-center text-[#A1A99E] hover:text-white hover:border-white/20 transition-all relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C7FF3D]" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#111512] border border-white/10 shadow-2xl p-3 z-50">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                      <span className="text-xs font-semibold text-white">Notifications</span>
                      <span className="text-[10px] text-[#C7FF3D] font-mono">2 Unread</span>
                    </div>
                    <div className="space-y-2">
                      {sampleNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded-lg bg-[#171C18] hover:bg-[#1C221D] transition-colors cursor-pointer text-xs"
                        >
                          <p className="font-medium text-white flex items-center gap-1.5">
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF3D]" />}
                            {n.title}
                          </p>
                          <p className="text-[10px] text-[#A1A99E] mt-0.5">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-[#111512] border border-white/10 hover:border-white/20 text-xs transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-[#1C221D] border border-white/10 flex items-center justify-center text-[#C7FF3D]">
                {React.createElement(roleLabels[currentRole].icon, { className: 'w-3.5 h-3.5' })}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-white font-medium leading-none">{roleLabels[currentRole].title}</div>
                <div className="text-[10px] text-[#A1A99E] leading-tight font-mono">{roleLabels[currentRole].badge}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A99E]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111512] border border-white/10 shadow-2xl p-1.5 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-[#A1A99E]">Switch User Role</div>
                {(['owner', 'trainer', 'staff'] as UserRole[]).map((role) => {
                  const item = roleLabels[role];
                  const Icon = item.icon;
                  const isActive = currentRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                        isActive
                          ? 'bg-[#C7FF3D]/10 text-[#C7FF3D] font-medium border border-[#C7FF3D]/20'
                          : 'text-[#A1A99E] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="text-white">{item.title}</div>
                        <div className="text-[10px] text-[#A1A99E]">{item.badge}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
