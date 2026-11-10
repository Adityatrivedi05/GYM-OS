import React, { useState } from 'react';
import {
  Award,
  Check,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  X
} from 'lucide-react';
import { MembershipPlanData, MemberData } from '../../types/index.ts';

interface MembershipPlansProps {
  plans: MembershipPlanData[];
  members: MemberData[];
  currencySymbol: string;
  onRefresh: () => void;
  renewModalMember: MemberData | null;
  onCloseRenewModal: () => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({
  plans,
  members,
  currencySymbol,
  onRefresh,
  renewModalMember,
  onCloseRenewModal
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || 'plan-3m');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState<string | null>(null);

  const targetPlan = plans.find((p) => p.id === selectedPlanId);

  const handleConfirmRenewal = async () => {
    if (!renewModalMember || !targetPlan) return;
    setIsRenewing(true);
    setRenewSuccess(null);

    try {
      const res = await fetch(`/api/members/${renewModalMember.id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: targetPlan.id,
          paymentMethod,
          transactionId: `TXN_REN_${Date.now().toString(36).toUpperCase()}`
        })
      });

      if (res.ok) {
        setIsRenewing(false);
        setRenewSuccess(
          `Membership for ${renewModalMember.fullName} renewed successfully! Extended +${targetPlan.durationDays} days.`
        );
        onRefresh();
        setTimeout(() => {
          onCloseRenewModal();
          setRenewSuccess(null);
        }, 2000);
      }
    } catch (err: any) {
      setIsRenewing(false);
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Membership Plans & Pricing</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Configured membership tiers, athlete benefits, duration schedules, and renewal policies.
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {plans.map((p) => {
          const enrolledCount = members.filter((m) => m.membershipPlanId === p.id).length;

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-[#171C18] border transition-all flex flex-col justify-between relative ${
                p.popular
                  ? 'border-[#C7FF3D] shadow-[0_0_25px_rgba(199,255,61,0.12)]'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#C7FF3D] text-black font-heading font-extrabold text-[10px] uppercase tracking-wider">
                  Most Popular Commitment
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#A1A99E] uppercase">
                    {p.durationDays} Days Duration
                  </span>
                  {p.discountPercent && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C7FF3D]/10 text-[#C7FF3D] font-bold">
                      Save {p.discountPercent}%
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-base text-white">{p.name}</h3>
                <p className="text-xs text-[#A1A99E] mt-1 leading-relaxed">{p.description}</p>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-baseline gap-1">
                  <span className="font-heading font-extrabold text-2xl text-[#C7FF3D]">
                    {currencySymbol}{p.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#A1A99E] font-mono">/ pass</span>
                </div>

                {/* Benefits */}
                <div className="mt-4 space-y-2 text-xs">
                  {p.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-white/90">
                      <Check className="w-3.5 h-3.5 text-[#C7FF3D] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 text-[11px] text-[#A1A99E] font-mono flex items-center justify-between">
                <span>Enrolled Athletes:</span>
                <span className="text-white font-bold">{enrolledCount} active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RENEWAL MODAL */}
      {renewModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#111512] border border-[#C7FF3D]/40 p-6 shadow-2xl relative">
            <button
              onClick={onCloseRenewModal}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-[#A1A99E] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="pb-3 border-b border-white/10 mb-4">
              <span className="text-[10px] font-mono uppercase text-[#C7FF3D] font-bold">RENEWAL DISPATCH</span>
              <h3 className="font-heading font-bold text-base text-white mt-0.5">
                Renew Membership: {renewModalMember.fullName}
              </h3>
              <p className="text-xs text-[#A1A99E]">Current Expiry: {renewModalMember.expiryDate}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#A1A99E] block mb-1">Select Renewal Package</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#171C18] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.durationDays}d — {currencySymbol}{p.price.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'card', label: 'Debit / Card' },
                    { id: 'cash', label: 'Cash Counter' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2 rounded-xl text-center font-medium transition-all ${
                        paymentMethod === m.id
                          ? 'bg-[#C7FF3D] text-black font-bold'
                          : 'bg-[#171C18] text-[#A1A99E] border border-white/5 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {renewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  {renewSuccess}
                </div>
              )}

              <button
                type="button"
                disabled={isRenewing}
                onClick={handleConfirmRenewal}
                className="w-full py-3 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isRenewing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Renewal Extension...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Confirm Extension & Record Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
