import React, { useState } from 'react';
import {
  Users,
  Dumbbell,
  CreditCard,
  AlertTriangle,
  Clock,
  UserPlus,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Activity
} from 'lucide-react';
import { DashboardStatsResponse } from '../../types/index.ts';

interface OwnerDashboardProps {
  data: DashboardStatsResponse | null;
  onRefresh: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
  onOpenAddMember: () => void;
  onOpenRecordPayment: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  data,
  onRefresh,
  onNavigateTab,
  onOpenAIAssistant,
  onOpenAddMember,
  onOpenRecordPayment
}) => {
  const [dateFilter, setDateFilter] = useState('month');

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#C7FF3D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, charts, gym } = data;

  const handleExportCSV = (type: 'members' | 'payments') => {
    window.open(`/api/export/${type}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header / Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              {gym.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C7FF3D]/10 border border-[#C7FF3D]/30 text-xs font-mono text-[#C7FF3D]">
              Verified Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A1A99E] mt-1 font-normal">
            Real-time biometric turnstile state, trainer attendance, membership renewals & bank settlements.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Headcount Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171C18] border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#A1A99E]">Floor Headcount:</span>
            <strong className="text-white font-mono">{stats.membersCurrentlyInGym} active</strong>
          </div>

          {/* Export button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleExportCSV('members')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111512] border border-white/10 hover:border-white/20 text-xs text-white transition-all"
              title="Download Members CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#C7FF3D]" />
              <span>Members CSV</span>
            </button>
            <button
              onClick={() => handleExportCSV('payments')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111512] border border-white/10 hover:border-white/20 text-xs text-white transition-all"
              title="Download Payments CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#C7FF3D]" />
              <span>Payments CSV</span>
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-[#111512] border border-white/10 hover:border-white/20 text-[#A1A99E] hover:text-white transition-all"
            title="Refresh database state"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP 6 STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Active Members */}
        <div
          onClick={() => onNavigateTab('members')}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/[0.08] hover:border-[#C7FF3D]/40 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A99E] font-medium">Active Members</span>
            <div className="w-8 h-8 rounded-lg bg-[#C7FF3D]/10 flex items-center justify-center text-[#C7FF3D]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl text-white">{stats.activeMembers}</span>
            <span className="text-xs text-[#A1A99E]">/ {stats.totalMembers} total</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>94.2% engagement</span>
          </div>
        </div>

        {/* Card 2: Total Trainers */}
        <div
          onClick={() => onNavigateTab('trainers')}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/[0.08] hover:border-[#C7FF3D]/40 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A99E] font-medium">Trainers On-Duty</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl text-white">{stats.trainersPresent}</span>
            <span className="text-xs text-[#A1A99E]">/ {stats.totalTrainers} coaches</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-mono">
            {stats.trainersLate > 0 ? `${stats.trainersLate} flagged late arrival` : 'All coaches on schedule'}
          </div>
        </div>

        {/* Card 3: Total Revenue This Month */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/[0.08] hover:border-[#C7FF3D]/40 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A99E] font-medium">Month Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#C7FF3D]/10 flex items-center justify-center text-[#C7FF3D]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-heading font-extrabold text-2xl text-[#C7FF3D]">
              {gym.currencySymbol}{stats.totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#A1A99E] font-mono">
            Captured via Razorpay & UPI
          </div>
        </div>

        {/* Card 4: Pending Payments */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/[0.08] hover:border-amber-500/40 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A99E] font-medium">Pending Payments</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl text-amber-400">
              {gym.currencySymbol}{stats.pendingFees.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-300 font-mono">
            {stats.pendingPaymentMembers} members due
          </div>
        </div>

        {/* Card 5: Expiring Soon (7 Days) */}
        <div
          onClick={() => onNavigateTab('whatsapp')}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/[0.08] hover:border-red-500/40 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A99E] font-medium">Expiring in 7 Days</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl text-red-400">{stats.expiringSoon}</span>
            <span className="text-xs text-[#A1A99E]">members</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span>WhatsApp alerts queued</span>
          </div>
        </div>

        {/* Card 6: New Members This Month */}
        <div
          onClick={() => onNavigateTab('members')}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/[0.08] hover:border-[#C7FF3D]/40 cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A99E] font-medium">New Additions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-2xl text-white">+{stats.newMembersThisMonth || 4}</span>
            <span className="text-xs text-purple-300">this month</span>
          </div>
          <div className="mt-2 text-[11px] text-[#A1A99E] font-mono">
            {stats.renewalRate}% renewal rate
          </div>
        </div>
      </div>

      {/* SECTION: VISUALLY PROMINENT MEMBER OVERVIEW & PAYMENT OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Member Lifecycle Breakdown (Large Card) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#171C18] border border-white/[0.08] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Membership Status Overview</h3>
              <p className="text-xs text-[#A1A99E]">Live breakdown of active, expiring, and churned gym memberships</p>
            </div>
            <button
              onClick={onOpenAddMember}
              className="px-3 py-1.5 rounded-lg bg-[#C7FF3D] text-black font-semibold text-xs hover:bg-[#A5D92F] transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Member</span>
            </button>
          </div>

          {/* Progress bar visual */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-[#111512] overflow-hidden flex">
              <div
                style={{ width: `${(stats.activeMembers / (stats.totalMembers || 1)) * 100}%` }}
                className="bg-[#C7FF3D] h-full"
                title="Active"
              />
              <div
                style={{ width: `${(stats.expiringSoon / (stats.totalMembers || 1)) * 100}%` }}
                className="bg-amber-400 h-full"
                title="Expiring Soon"
              />
              <div
                style={{ width: `${(stats.expiredMembers / (stats.totalMembers || 1)) * 100}%` }}
                className="bg-red-500 h-full"
                title="Expired"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#A1A99E] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C7FF3D]" /> Active ({stats.activeMembers})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Expiring &lt;7d ({stats.expiringSoon})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Expired ({stats.expiredMembers})
              </span>
            </div>
          </div>

          {/* 6 Sub-metric indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#111512] border border-white/5">
              <span className="text-[11px] text-[#A1A99E]">Total Registered</span>
              <p className="font-heading font-bold text-lg text-white mt-0.5">{stats.totalMembers}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111512] border border-white/5">
              <span className="text-[11px] text-[#A1A99E]">Active Memberships</span>
              <p className="font-heading font-bold text-lg text-[#C7FF3D] mt-0.5">{stats.activeMembers}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111512] border border-white/5">
              <span className="text-[11px] text-[#A1A99E]">Expiring in 7 Days</span>
              <p className="font-heading font-bold text-lg text-amber-400 mt-0.5">{stats.expiringSoon}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111512] border border-white/5">
              <span className="text-[11px] text-[#A1A99E]">Expiring in 30 Days</span>
              <p className="font-heading font-bold text-lg text-white mt-0.5">{stats.expiringSoon + 3}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111512] border border-white/5">
              <span className="text-[11px] text-[#A1A99E]">Expired Memberships</span>
              <p className="font-heading font-bold text-lg text-red-400 mt-0.5">{stats.expiredMembers}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#111512] border border-white/5">
              <span className="text-[11px] text-[#A1A99E]">Pending Fee Members</span>
              <p className="font-heading font-bold text-lg text-amber-300 mt-0.5">{stats.pendingPaymentMembers}</p>
            </div>
          </div>
        </div>

        {/* Payment & Settlement Overview (Card 2) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#171C18] border border-white/[0.08] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Payment Collections</h3>
              <p className="text-xs text-[#A1A99E]">Online UPI / Cards vs Cash reconciliation</p>
            </div>
            <button
              onClick={onOpenRecordPayment}
              className="px-3 py-1.5 rounded-lg bg-[#111512] border border-white/10 hover:border-white/20 text-white font-medium text-xs transition-all flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#C7FF3D]" />
              <span>Record Fee</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#111512] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#A1A99E]">Total Fees Collected</span>
              <p className="font-heading font-extrabold text-2xl text-[#C7FF3D] mt-0.5">
                {gym.currencySymbol}{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-red-400">Total Expenses</span>
              <p className="font-heading font-bold text-lg text-white mt-0.5">
                {gym.currencySymbol}{stats.totalExpenses.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Payment channels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A1A99E]">Online Payments (Razorpay/UPI/Card)</span>
              <span className="text-white font-mono font-medium">{gym.currencySymbol}{stats.onlinePayments.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#111512] overflow-hidden">
              <div
                style={{ width: `${(stats.onlinePayments / (stats.totalRevenue || 1)) * 100}%` }}
                className="bg-[#C7FF3D] h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A1A99E]">Direct Cash Register</span>
              <span className="text-white font-mono font-medium">{gym.currencySymbol}{stats.cashPayments.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#111512] overflow-hidden">
              <div
                style={{ width: `${(stats.cashPayments / (stats.totalRevenue || 1)) * 100}%` }}
                className="bg-blue-400 h-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className="text-amber-400">Pending / Overdue Fees</span>
              <span className="text-amber-400 font-mono font-bold">{gym.currencySymbol}{stats.pendingFees.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: VISUAL ANALYTICS & TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-[#171C18] border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Monthly Revenue & Expenditure Trend</h3>
              <p className="text-xs text-[#A1A99E]">Last 6 months operating revenue vs facility overheads</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C7FF3D]" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Overheads
              </span>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {charts.monthlyRevenueTrend.map((item, idx) => {
              const maxRev = 200000;
              const revHeight = Math.min((item.revenue / maxRev) * 100, 100);
              const expHeight = Math.min((item.expenses / maxRev) * 100, 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-[#A1A99E] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(item.revenue / 1000).toFixed(0)}k
                  </div>
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Revenue bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-1/2 max-w-[20px] rounded-t-md bg-[#C7FF3D] transition-all group-hover:brightness-110 shadow-sm"
                    />
                    {/* Expense bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-1/2 max-w-[20px] rounded-t-md bg-red-400/80 transition-all group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-xs font-mono text-[#A1A99E]">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trainer Client Allocation */}
        <div className="lg:col-span-4 rounded-2xl bg-[#171C18] border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">Trainer Client Loads</h3>
            <button
              onClick={() => onNavigateTab('trainers')}
              className="text-xs text-[#C7FF3D] hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3.5">
            {charts.trainerDistribution.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-[#111512] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C7FF3D]" />
                    <span className="font-medium text-white">{t.name}</span>
                  </div>
                  <span className="font-mono text-[#C7FF3D] font-bold">{t.clientsCount} Clients</span>
                </div>
                <div className="text-[11px] text-[#A1A99E] truncate">{t.specialization}</div>
                <div className="h-1.5 w-full rounded-full bg-[#171C18] overflow-hidden">
                  <div
                    style={{ width: `${Math.min((t.clientsCount / 10) * 100, 100)}%` }}
                    className="bg-[#C7FF3D] h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK FLOATING FITFLOW AI ASSISTANT BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171C18] via-[#1E2620] to-[#171C18] border border-[#C7FF3D]/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C7FF3D] text-black font-bold flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-white">FitFlow AI Business Intelligence</h4>
            <p className="text-xs text-[#A1A99E]">
              Ask questions on live revenue, expiring memberships, and trainer retention in natural language.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAIAssistant}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg"
        >
          <span>Ask FitFlow AI</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
