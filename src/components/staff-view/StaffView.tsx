import React from 'react';
import {
  Users,
  UserPlus,
  CreditCard,
  QrCode,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MemberData, MemberAttendanceData, PaymentData } from '../../types/index.ts';

interface StaffViewProps {
  members: MemberData[];
  memberAttendance: MemberAttendanceData[];
  payments: PaymentData[];
  onOpenAddMember: () => void;
  onOpenRecordPayment: () => void;
  onOpenQRScanner: () => void;
  onOpenRenewModal: (member: MemberData) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  members,
  memberAttendance,
  payments,
  onOpenAddMember,
  onOpenRecordPayment,
  onOpenQRScanner,
  onOpenRenewModal
}) => {
  const expiringSoon = members.filter((m) => m.status === 'expiring_soon');
  const expiredMembers = members.filter((m) => m.status === 'expired');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Front Desk Reception Terminal</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300">
            Staff Access
          </span>
        </div>
        <p className="text-xs text-[#A1A99E] mt-0.5">
          Process walk-in registrations, record desk payments, and manage floor attendance.
        </p>
      </div>

      {/* Quick Action Large Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={onOpenAddMember}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/10 hover:border-[#C7FF3D] transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#C7FF3D]/10 flex items-center justify-center text-[#C7FF3D] mb-3 group-hover:scale-110 transition-transform">
            <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-white group-hover:text-[#C7FF3D]">Register New Member</h3>
          <p className="text-xs text-[#A1A99E] mt-1">Issue immediate QR athlete pass and membership agreement.</p>
        </button>

        <button
          onClick={onOpenRecordPayment}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/10 hover:border-[#C7FF3D] transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-white group-hover:text-[#C7FF3D]">Collect Desk Payment</h3>
          <p className="text-xs text-[#A1A99E] mt-1">Record counter cash or direct UPI receipts with instant invoices.</p>
        </button>

        <button
          onClick={onOpenQRScanner}
          className="p-5 rounded-2xl bg-[#171C18] border border-white/10 hover:border-[#C7FF3D] transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-white group-hover:text-[#C7FF3D]">Turnstile Access Scanner</h3>
          <p className="text-xs text-[#A1A99E] mt-1">Validate athlete passes and manage check-ins and check-outs.</p>
        </button>
      </div>

      {/* Expiry & Urgent Renewal Alerts for Staff */}
      <div className="rounded-2xl bg-[#171C18] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-base text-white">Front Desk Renewal Alerts</h3>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {expiringSoon.length + expiredMembers.length} Athletes Need Action
          </span>
        </div>

        <div className="space-y-2.5">
          {[...expiringSoon, ...expiredMembers].map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-xl bg-[#111512] border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <img src={m.avatarUrl} alt={m.fullName} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-white">{m.fullName}</div>
                  <div className="text-[10px] text-[#A1A99E] font-mono">
                    ID: {m.id} • Expiry: <strong className="text-amber-400">{m.expiryDate}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenRenewModal(m)}
                className="px-3 py-1.5 rounded-lg bg-[#C7FF3D] text-black font-semibold text-xs hover:bg-[#A5D92F] transition-all flex items-center gap-1"
              >
                <span>Renew at Desk</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
