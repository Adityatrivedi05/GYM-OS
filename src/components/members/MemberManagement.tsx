import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  QrCode,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { MemberData, MembershipPlanData, TrainerData } from '../../types/index.ts';

interface MemberManagementProps {
  members: MemberData[];
  plans: MembershipPlanData[];
  trainers: TrainerData[];
  currencySymbol: string;
  onRefresh: () => void;
  onOpenRenewModal: (member: MemberData) => void;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  members,
  plans,
  trainers,
  currencySymbol,
  onRefresh,
  onOpenRenewModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDigitalCard, setShowDigitalCard] = useState<MemberData | null>(null);

  // New Member Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [assignedTrainerId, setAssignedTrainerId] = useState(trainers[0]?.id || 'tr-01');
  const [fitnessGoal, setFitnessGoal] = useState('Muscle Building & Strength');
  const [membershipPlanId, setMembershipPlanId] = useState(plans[1]?.id || 'plan-3m');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlan = plans.find((p) => p.id === membershipPlanId);
    const durationDays = selectedPlan ? selectedPlan.durationDays : 30;

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);
    const expiryDate = expiry.toISOString().split('T')[0];

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          age: Number(age),
          gender,
          emergencyContact: emergencyContact || '+91 98000 00000',
          avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 200)}?w=150&auto=format&fit=crop&q=80`,
          joiningDate: today,
          assignedTrainerId,
          fitnessGoal,
          membershipPlanId,
          startDate: today,
          expiryDate,
          paymentStatus: 'paid',
          status: 'active',
          medicalNotes,
          whatsappOptIn
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setFullName('');
        setEmail('');
        setPhone('+91 ');
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
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Client Management & Registry</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Registered athlete profiles, QR pass issuance, renewal tracking, and trainer allocation.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C7FF3D]/15"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Member</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A1A99E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#171C18] border border-white/10 text-xs text-white placeholder-[#A1A99E] focus:outline-none focus:border-[#C7FF3D]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'expiring_soon', label: 'Expiring Soon' },
            { id: 'expired', label: 'Expired' },
            { id: 'pending_payment', label: 'Pending Fee' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-[#C7FF3D] text-black font-bold'
                  : 'bg-[#111512] text-[#A1A99E] border border-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl bg-[#171C18] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="p-3.5 pl-5">Member ID</th>
                <th className="p-3.5">Athlete</th>
                <th className="p-3.5">Plan</th>
                <th className="p-3.5">Assigned Coach</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-5">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((m) => {
                const plan = plans.find((p) => p.id === m.membershipPlanId);
                const trainer = trainers.find((t) => t.id === m.assignedTrainerId);

                return (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-white font-semibold">{m.id}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatarUrl}
                          alt={m.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-semibold text-white">{m.fullName}</div>
                          <div className="text-[11px] text-[#A1A99E]">{m.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-white font-medium">{plan?.name || m.membershipPlanId}</div>
                      <div className="text-[10px] text-[#A1A99E] font-mono">
                        {currencySymbol}{plan?.price.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#A1A99E]">
                      {trainer?.fullName || 'Unassigned'}
                    </td>
                    <td className="p-3.5 font-mono text-white">{m.expiryDate}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${
                          m.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : m.status === 'expiring_soon'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : m.status === 'expired'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                        }`}
                      >
                        {m.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setShowDigitalCard(m)}
                          className="p-1.5 rounded-lg bg-[#111512] hover:bg-[#1C221D] text-[#A1A99E] hover:text-[#C7FF3D] border border-white/10 transition-colors"
                          title="View Digital QR Pass"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenRenewModal(m)}
                          className="px-2.5 py-1 rounded-lg bg-[#C7FF3D]/10 hover:bg-[#C7FF3D]/20 text-[#C7FF3D] border border-[#C7FF3D]/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Renew</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Membership Card Modal */}
      {showDigitalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#1C221D] via-[#111512] to-[#090B0A] border border-[#C7FF3D]/40 p-6 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setShowDigitalCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-[#A1A99E] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#C7FF3D] text-black flex items-center justify-center font-bold text-xs">
                  FF
                </div>
                <span className="font-heading font-bold text-sm text-white">FITFLOW IRON TEMPLE</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C7FF3D]/20 text-[#C7FF3D] font-bold">
                ATHLETE PASS
              </span>
            </div>

            {/* Member Details */}
            <div className="mt-6 flex items-center gap-4">
              <img
                src={showDigitalCard.avatarUrl}
                alt={showDigitalCard.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C7FF3D]"
              />
              <div>
                <h4 className="font-heading font-extrabold text-lg text-white">{showDigitalCard.fullName}</h4>
                <p className="text-xs text-[#C7FF3D] font-mono">{showDigitalCard.id}</p>
                <p className="text-[11px] text-[#A1A99E] mt-0.5">{showDigitalCard.fitnessGoal}</p>
              </div>
            </div>

            {/* Simulated High-Res QR Code */}
            <div className="mt-6 p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-inner">
              <div className="w-44 h-44 bg-[#090B0A] p-2 rounded-xl flex items-center justify-center">
                {/* SVG QR Code Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                  <rect x="35" y="10" width="5" height="15" />
                  <rect x="45" y="5" width="15" height="5" />
                  <rect x="45" y="20" width="10" height="10" />
                  <rect x="15" y="35" width="20" height="5" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="45" width="10" height="15" />
                  <rect x="10" y="50" width="10" height="10" />
                  <rect x="85" y="70" width="10" height="10" />
                  <rect x="45" y="75" width="15" height="10" />
                  <rect x="70" y="85" width="15" height="10" />
                </svg>
              </div>
              <p className="text-[10px] text-black font-mono mt-2 font-bold tracking-wider">
                SCAN AT GYM TURNSTILE
              </p>
            </div>

            {/* Card Footer Details */}
            <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] font-mono pt-3 border-t border-white/10">
              <div>
                <span className="text-[#A1A99E]">Valid Until:</span>
                <p className="text-white font-bold">{showDigitalCard.expiryDate}</p>
              </div>
              <div className="text-right">
                <span className="text-[#A1A99E]">Emergency Contact:</span>
                <p className="text-white truncate">{showDigitalCard.emergencyContact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-[#171C18] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-lg text-white mb-1">Athlete Registration Form</h3>
            <p className="text-xs text-[#A1A99E] mb-4">
              Registers athlete, automatically calculates membership validity dates, and issues biometric QR pass.
            </p>

            <form onSubmit={handleRegisterMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A1A99E] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karan Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Phone Number (with WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#A1A99E] block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="+91 ... (Family)"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A1A99E] block mb-1">Membership Plan</label>
                  <select
                    value={membershipPlanId}
                    onChange={(e) => setMembershipPlanId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.durationDays}d - {currencySymbol}{p.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Assign Coach / Trainer</label>
                  <select
                    value={assignedTrainerId}
                    onChange={(e) => setAssignedTrainerId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  >
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Primary Fitness Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10kg Hypertrophy, Body fat reduction, Marathon conditioning"
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Medical / Orthopedic Considerations (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Previous ACL reconstruction, mild lower back tightness"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#111512] border border-white/5">
                <input
                  type="checkbox"
                  id="optin"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="rounded text-[#C7FF3D] focus:ring-0"
                />
                <label htmlFor="optin" className="text-white cursor-pointer select-none">
                  Member consents to automated WhatsApp workout reminders and renewal alerts
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#111512] text-[#A1A99E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C7FF3D] text-black font-heading font-bold hover:bg-[#A5D92F]"
                >
                  Confirm & Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
