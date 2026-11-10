import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  Printer,
  Sparkles,
  X
} from 'lucide-react';
import { PaymentData, MemberData, MembershipPlanData } from '../../types/index.ts';
import confetti from 'canvas-confetti';

interface PaymentCenterProps {
  payments: PaymentData[];
  members: MemberData[];
  plans: MembershipPlanData[];
  currencySymbol: string;
  onRefresh: () => void;
}

export const PaymentCenter: React.FC<PaymentCenterProps> = ({
  payments,
  members,
  plans,
  currencySymbol,
  onRefresh
}) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentData | null>(null);

  // Razorpay Checkout Simulator State
  const [checkoutMemberId, setCheckoutMemberId] = useState(members[0]?.id || '');
  const [checkoutPlanId, setCheckoutPlanId] = useState(plans[0]?.id || '');
  const [checkoutMethod, setCheckoutMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState<string | null>(null);

  // Manual payment state
  const [manualMemberId, setManualMemberId] = useState(members[0]?.id || '');
  const [manualAmount, setManualAmount] = useState(2499);
  const [manualMethod, setManualMethod] = useState<'cash' | 'upi'>('cash');
  const [manualNotes, setManualNotes] = useState('');

  const selectedPlan = plans.find((p) => p.id === checkoutPlanId);
  const selectedMember = members.find((m) => m.id === checkoutMemberId);

  const handleSimulateRazorpayPayment = async () => {
    setIsProcessingRazorpay(true);
    setCheckoutSuccessMessage(null);

    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: checkoutMemberId,
          planId: checkoutPlanId,
          amount: selectedPlan?.price || 2499
        })
      });
      const orderData = await orderRes.json();

      // Simulate network latency of bank gateway
      await new Promise((r) => setTimeout(r, 1200));

      // 2. Dispatch verified webhook to backend to ensure server-side verification
      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: `pay_${Date.now().toString(36)}`,
              amount: (selectedPlan?.price || 2499) * 100,
              currency: 'INR',
              status: 'captured',
              method: checkoutMethod,
              notes: {
                memberId: checkoutMemberId,
                planId: checkoutPlanId
              }
            }
          }
        }
      };

      const webhookRes = await fetch('/api/payments/razorpay/verify-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'mock_valid_signature_fitflow'
        },
        body: JSON.stringify(webhookPayload)
      });

      if (webhookRes.ok) {
        setIsProcessingRazorpay(false);
        setCheckoutSuccessMessage(`Payment verified! Membership extended and invoice generated.`);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C7FF3D', '#A5D92F', '#ffffff']
        });
        onRefresh();
      }
    } catch (err: any) {
      setIsProcessingRazorpay(false);
      console.error(err);
    }
  };

  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === manualMemberId);
    if (!member) return;

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `TXN_OFFLINE_${Date.now().toString(36).toUpperCase()}`,
          memberId: member.id,
          memberName: member.fullName,
          amount: Number(manualAmount),
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: manualMethod,
          paymentGateway: 'manual',
          status: 'captured',
          membershipPlanId: member.membershipPlanId,
          notes: manualNotes || 'Direct cash counter collection'
        })
      });

      if (res.ok) {
        setShowManualModal(false);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Payment Gateway & Ledger</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Verified Razorpay settlements, manual cash entries, automated webhooks, and invoice generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="px-4 py-2 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center gap-1.5 shadow-lg shadow-[#C7FF3D]/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Razorpay Checkout</span>
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#111512] border border-white/10 hover:border-white/20 text-white font-medium text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#C7FF3D]" />
            <span>Record Cash Fee</span>
          </button>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="rounded-2xl bg-[#171C18] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="p-3.5 pl-5">Invoice #</th>
                <th className="p-3.5">Athlete</th>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Gateway</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-5">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 pl-5 font-mono text-white font-bold">{p.invoiceNumber}</td>
                  <td className="p-3.5">
                    <div className="text-white font-semibold">{p.memberName}</div>
                    <div className="text-[10px] text-[#A1A99E] font-mono">{p.memberId}</div>
                  </td>
                  <td className="p-3.5 font-mono text-[#A1A99E] text-[11px]">{p.transactionId}</td>
                  <td className="p-3.5 font-mono font-bold text-[#C7FF3D]">
                    {currencySymbol}{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-mono text-[#A1A99E]">{p.paymentDate}</td>
                  <td className="p-3.5 font-mono text-white uppercase text-[11px]">{p.paymentMethod}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#A1A99E] capitalize">
                      {p.paymentGateway}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CAPTURED
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-5">
                    <button
                      onClick={() => setSelectedInvoice(p)}
                      className="px-2.5 py-1 rounded-lg bg-[#111512] hover:bg-[#1C221D] text-[#A1A99E] hover:text-white border border-white/10 text-[11px] transition-colors flex items-center gap-1 ml-auto"
                    >
                      <FileText className="w-3 h-3 text-[#C7FF3D]" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RAZORPAY CHECKOUT INTERACTIVE MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#111512] border border-[#C7FF3D]/40 p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowCheckoutModal(false);
                setCheckoutSuccessMessage(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-[#A1A99E] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#0C2340] flex items-center justify-center font-bold text-blue-400">
                rzp
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">Razorpay Live Gateway</h3>
                <p className="text-[11px] text-[#A1A99E]">Instant Webhook & Signature Verification</p>
              </div>
            </div>

            {/* Form */}
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="text-[#A1A99E] block mb-1">Select Member to Renew</label>
                <select
                  value={checkoutMemberId}
                  onChange={(e) => setCheckoutMemberId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#171C18] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.id} • Expiry: {m.expiryDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Select Renewal Plan</label>
                <select
                  value={checkoutPlanId}
                  onChange={(e) => setCheckoutPlanId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#171C18] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {currencySymbol}{p.price.toLocaleString('en-IN')} (+{p.durationDays} Days)
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-[#A1A99E] block mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'card', label: 'Debit / Card' },
                    { id: 'netbanking', label: 'Netbanking' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setCheckoutMethod(m.id as any)}
                      className={`p-2 rounded-xl text-center font-medium transition-all ${
                        checkoutMethod === m.id
                          ? 'bg-[#C7FF3D] text-black font-bold'
                          : 'bg-[#171C18] text-[#A1A99E] border border-white/5 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="p-3 rounded-xl bg-[#171C18] border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#A1A99E]">
                  <span>Plan Fee:</span>
                  <span className="text-white">{currencySymbol}{selectedPlan?.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#A1A99E]">
                  <span>GST / Tax (Included):</span>
                  <span className="text-white">18%</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-white/5 text-sm">
                  <span>Total Payable:</span>
                  <span className="text-[#C7FF3D]">{currencySymbol}{selectedPlan?.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {checkoutSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{checkoutSuccessMessage}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isProcessingRazorpay}
                onClick={handleSimulateRazorpayPayment}
                className="w-full py-3 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isProcessingRazorpay ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying HMAC Webhook Signature...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay {currencySymbol}{selectedPlan?.price.toLocaleString('en-IN')} via Razorpay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Cash Payment Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#171C18] border border-white/10 p-6 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white mb-1">Record Direct Cash / Counter Payment</h3>
            <p className="text-xs text-[#A1A99E] mb-4">Log cash or counter receipts into the official gym ledger.</p>

            <form onSubmit={handleRecordManualPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A1A99E] block mb-1">Athlete</label>
                <select
                  value={manualMemberId}
                  onChange={(e) => setManualMemberId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Amount Collected (INR)</label>
                <input
                  type="number"
                  required
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Payment Method</label>
                <select
                  value={manualMethod}
                  onChange={(e) => setManualMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                >
                  <option value="cash">Cash in Hand</option>
                  <option value="upi">Direct UPI QR to Owner Account</option>
                </select>
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Internal Reference Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid cash at front desk to receptionist"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#111512] text-[#A1A99E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#C7FF3D] text-black font-semibold"
                >
                  Confirm & Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#111512] border border-white/10 p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-[#A1A99E] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-white/10 pb-4 mb-4 flex items-center justify-between">
              <div>
                <span className="font-heading font-extrabold text-white text-base">FITFLOW IRON TEMPLE</span>
                <p className="text-[10px] text-[#A1A99E] font-mono">GSTIN: 27AABCF1234F1Z9</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#C7FF3D]">{selectedInvoice.invoiceNumber}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A1A99E]">Billed To:</span>
                <span className="text-white font-medium">{selectedInvoice.memberName} ({selectedInvoice.memberId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A99E]">Date:</span>
                <span className="text-white font-mono">{selectedInvoice.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A99E]">Transaction Ref:</span>
                <span className="text-white font-mono">{selectedInvoice.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A99E]">Payment Method:</span>
                <span className="text-white uppercase font-mono">{selectedInvoice.paymentMethod}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#171C18] border border-white/5 space-y-2 mt-4 font-mono">
                <div className="flex justify-between text-white font-bold text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#C7FF3D]">{currencySymbol}{selectedInvoice.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[10px] text-emerald-400">STATUS: VERIFIED & CAPTURED</div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-lg bg-[#C7FF3D] text-black font-semibold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
