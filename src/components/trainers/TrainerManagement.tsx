import React, { useState } from 'react';
import {
  Users,
  Plus,
  Clock,
  Star,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Edit,
  Trash2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { TrainerData, MemberData, TrainerAttendanceData } from '../../types/index.ts';

interface TrainerManagementProps {
  trainers: TrainerData[];
  members: MemberData[];
  attendance: TrainerAttendanceData[];
  currencySymbol: string;
  onRefresh: () => void;
}

export const TrainerManagement: React.FC<TrainerManagementProps> = ({
  trainers,
  members,
  attendance,
  currencySymbol,
  onRefresh
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionRecord, setCorrectionRecord] = useState<TrainerAttendanceData | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');

  // Add form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('Hypertrophy & Strength');
  const [salary, setSalary] = useState(40000);
  const [workingHours, setWorkingHours] = useState('06:00 AM - 02:00 PM');
  const [bio, setBio] = useState('');

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          specialization,
          salary: Number(salary),
          workingHours,
          avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`,
          status: 'active',
          rating: 4.8,
          bio: bio || 'Certified fitness trainer & athlete.'
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setFullName('');
        setEmail('');
        setPhone('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCorrection = async () => {
    if (!correctionRecord) return;
    try {
      const res = await fetch(`/api/attendance/trainers/${correctionRecord.id}/correct`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'present',
          correctionReason: correctionReason || 'Owner verified on-time arrival'
        })
      });
      if (res.ok) {
        setShowCorrectionModal(false);
        setCorrectionRecord(null);
        setCorrectionReason('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Trainer Roster & Shifts</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">Manage fitness coaches, monitor shift check-ins, and assign client caseloads.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C7FF3D]/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Trainer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trainers.map((t) => {
          const assignedClients = members.filter((m) => m.assignedTrainerId === t.id);
          const activeClients = assignedClients.filter((m) => m.status === 'active');
          const isSelected = selectedTrainer?.id === t.id;

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTrainer(t)}
              className={`p-5 rounded-2xl bg-[#171C18] border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#C7FF3D] shadow-[0_0_20px_rgba(199,255,61,0.15)]'
                  : 'border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={t.avatarUrl}
                  alt={t.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                  onError={(e) => {
                    // Fallback avatar
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-white truncate">{t.fullName}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C7FF3D]/10 text-[#C7FF3D]">
                      ID: {t.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A99E] truncate mt-0.5">{t.specialization}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-mono">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{t.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#A1A99E]">
                  <span>Working Shift:</span>
                  <span className="text-white font-mono">{t.workingHours}</span>
                </div>
                <div className="flex items-center justify-between text-[#A1A99E]">
                  <span>Assigned Clients:</span>
                  <span className="text-[#C7FF3D] font-mono font-bold">
                    {assignedClients.length} ({activeClients.length} active)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#A1A99E]">
                  <span>Monthly Retainer:</span>
                  <span className="text-white font-mono font-medium">
                    {currencySymbol}{t.salary.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Trainer Detail & Assigned Clients Table */}
      {selectedTrainer && (
        <div className="p-6 rounded-2xl bg-[#171C18] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-heading font-bold text-lg text-white">{selectedTrainer.fullName}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded bg-[#C7FF3D]/10 text-[#C7FF3D] font-mono">
                  {selectedTrainer.specialization}
                </span>
              </div>
              <p className="text-xs text-[#A1A99E] mt-1">{selectedTrainer.bio}</p>
            </div>
            <div className="text-xs text-[#A1A99E] font-mono">
              Phone: <span className="text-white">{selectedTrainer.phone}</span> • Email: <span className="text-white">{selectedTrainer.email}</span>
            </div>
          </div>

          {/* Assigned Clients */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-3">
              Assigned Clients ({members.filter((m) => m.assignedTrainerId === selectedTrainer.id).length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-lg">Member ID</th>
                    <th className="p-3">Client Name</th>
                    <th className="p-3">Fitness Goal</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-lg">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members
                    .filter((m) => m.assignedTrainerId === selectedTrainer.id)
                    .map((m) => (
                      <tr key={m.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono text-white">{m.id}</td>
                        <td className="p-3 font-medium text-white">{m.fullName}</td>
                        <td className="p-3 text-[#A1A99E]">{m.fitnessGoal}</td>
                        <td className="p-3 font-mono text-[#A1A99E]">{m.expiryDate}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                              m.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : m.status === 'expiring_soon'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {m.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[#A1A99E]">{m.phone}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Trainer Attendance Audit & Correction History */}
      <div className="p-6 rounded-2xl bg-[#171C18] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-white">Daily Trainer Attendance Log & Audit</h3>
            <p className="text-xs text-[#A1A99E]">QR check-ins and late arrivals recorded with audited reasons.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Trainer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Status</th>
                <th className="p-3">Audit Note</th>
                <th className="p-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {attendance.map((att) => {
                const trainer = trainers.find((t) => t.id === att.trainerId);
                return (
                  <tr key={att.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-medium text-white">{trainer?.fullName || att.trainerId}</td>
                    <td className="p-3 font-mono text-[#A1A99E]">{att.date}</td>
                    <td className="p-3 font-mono text-white">{att.checkInTime}</td>
                    <td className="p-3 font-mono text-[#A1A99E]">{att.checkOutTime || 'On Duty'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          att.status === 'present'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : att.status === 'late'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {att.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-[#A1A99E]">{att.correctionReason || 'Verified via QR scanner'}</td>
                    <td className="p-3">
                      {att.status === 'late' && (
                        <button
                          onClick={() => {
                            setCorrectionRecord(att);
                            setShowCorrectionModal(true);
                          }}
                          className="px-2 py-1 rounded bg-[#111512] border border-white/10 hover:border-amber-400 text-amber-400 text-[11px] transition-colors"
                        >
                          Correct with Reason
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Trainer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#171C18] border border-white/10 p-6 shadow-2xl">
            <h3 className="font-heading font-bold text-lg text-white mb-4">Add Certified Coach</h3>
            <form onSubmit={handleCreateTrainer} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A1A99E] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sameer Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A1A99E] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="coach@fitflow.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A1A99E] block mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Monthly Salary (INR)</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#A1A99E] block mb-1">Shift Timings</label>
                <input
                  type="text"
                  required
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#111512] border border-white/10 text-[#A1A99E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C7FF3D] text-black font-heading font-bold hover:bg-[#A5D92F]"
                >
                  Save Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#171C18] border border-white/10 p-6 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white mb-2">Audit Attendance Correction</h3>
            <p className="text-xs text-[#A1A99E] mb-4">
              Enter the verified business reason for overturning this late arrival status.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Trainer was conducting early morning member induction at outdoor turf"
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#111512] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C7FF3D] mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#111512] text-xs text-[#A1A99E]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCorrection}
                className="px-4 py-1.5 rounded-lg bg-[#C7FF3D] text-black font-semibold text-xs"
              >
                Record Audit & Mark Present
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
