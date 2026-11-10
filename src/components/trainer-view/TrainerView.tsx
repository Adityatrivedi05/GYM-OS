import React, { useState } from 'react';
import {
  UserCheck,
  Dumbbell,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  QrCode
} from 'lucide-react';
import { TrainerData, MemberData, TrainerAttendanceData } from '../../types/index.ts';

interface TrainerViewProps {
  trainers: TrainerData[];
  members: MemberData[];
  attendance: TrainerAttendanceData[];
  onRefresh: () => void;
}

export const TrainerView: React.FC<TrainerViewProps> = ({
  trainers,
  members,
  attendance,
  onRefresh
}) => {
  // Let trainer pick which coach profile they are logging in as (default to Vikram Rajput)
  const [activeTrainerId, setActiveTrainerId] = useState(trainers[0]?.id || 'tr-01');
  const [selectedClient, setSelectedClient] = useState<MemberData | null>(null);
  const [progressNotes, setProgressNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentTrainer = trainers.find((t) => t.id === activeTrainerId) || trainers[0];
  const assignedClients = members.filter((m) => m.assignedTrainerId === currentTrainer?.id);

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find((a) => a.trainerId === currentTrainer?.id && a.date === today);

  const handleSelfCheckIn = async () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const res = await fetch('/api/attendance/trainers/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerId: currentTrainer.id,
          date: today,
          checkInTime: currentTime,
          status: 'present',
          method: 'qr'
        })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelfCheckOut = async () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const res = await fetch('/api/attendance/trainers/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerId: currentTrainer.id,
          date: today,
          checkOutTime: currentTime,
          totalHours: 8.0,
          status: 'present',
          method: 'qr'
        })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveClientProgress = async () => {
    if (!selectedClient) return;
    try {
      const res = await fetch(`/api/members/${selectedClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicalNotes: (selectedClient.medicalNotes ? selectedClient.medicalNotes + ' | ' : '') + progressNotes
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setProgressNotes('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Trainer Profile Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Trainer Portal</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-400">
              Restricted Coach View
            </span>
          </div>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Manage your assigned client workouts, view your shift hours, and record QR attendance.
          </p>
        </div>

        {/* Switch Logged-in Trainer */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#A1A99E]">Logged In Coach:</label>
          <select
            value={activeTrainerId}
            onChange={(e) => {
              setActiveTrainerId(e.target.value);
              setSelectedClient(null);
            }}
            className="p-2 rounded-xl bg-[#171C18] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C7FF3D]"
          >
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName} ({t.specialization})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Coach Shift & Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="p-5 rounded-2xl bg-[#171C18] border border-white/5 flex items-center gap-4">
          <img
            src={currentTrainer?.avatarUrl}
            alt={currentTrainer?.fullName}
            className="w-14 h-14 rounded-2xl object-cover border border-[#C7FF3D]/40"
          />
          <div>
            <h3 className="font-heading font-bold text-base text-white">{currentTrainer?.fullName}</h3>
            <p className="text-xs text-[#C7FF3D] font-mono">{currentTrainer?.specialization}</p>
            <p className="text-[11px] text-[#A1A99E] mt-1">Shift: {currentTrainer?.workingHours}</p>
          </div>
        </div>

        {/* Assigned Clients Card */}
        <div className="p-5 rounded-2xl bg-[#171C18] border border-white/5 space-y-1">
          <span className="text-xs text-[#A1A99E]">Assigned Athlete Load</span>
          <p className="font-heading font-extrabold text-2xl text-white">{assignedClients.length} Clients</p>
          <p className="text-[11px] text-emerald-400 font-mono">
            {assignedClients.filter((m) => m.status === 'active').length} Active Memberships
          </p>
        </div>

        {/* Self Attendance Check-In Button */}
        <div className="p-5 rounded-2xl bg-[#171C18] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A1A99E]">Shift Status ({today}):</span>
            <span
              className={`font-mono font-bold ${
                todayAttendance ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {todayAttendance ? `${todayAttendance.status.toUpperCase()} (${todayAttendance.checkInTime})` : 'NOT CHECKED IN'}
            </span>
          </div>

          {!todayAttendance ? (
            <button
              onClick={handleSelfCheckIn}
              className="mt-3 w-full py-2 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Mark QR Check-In</span>
            </button>
          ) : !todayAttendance.checkOutTime ? (
            <button
              onClick={handleSelfCheckOut}
              className="mt-3 w-full py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs hover:bg-red-500/30 transition-all"
            >
              Check-Out of Shift
            </button>
          ) : (
            <p className="mt-3 text-xs text-center text-[#A1A99E] font-mono">
              Shift complete • Total Hours: {todayAttendance.totalHours || 8} hrs
            </p>
          )}
        </div>
      </div>

      {/* Assigned Clients Roster & Progress Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clients list */}
        <div className="lg:col-span-7 rounded-2xl bg-[#171C18] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-heading font-bold text-base text-white">Your Assigned Clients</h3>

          <div className="space-y-2.5">
            {assignedClients.map((c) => {
              const isSelected = selectedClient?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#111512] border-[#C7FF3D]'
                      : 'bg-[#111512] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={c.avatarUrl} alt={c.fullName} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-semibold text-white text-xs">{c.fullName}</h4>
                      <p className="text-[11px] text-[#A1A99E]">{c.fitnessGoal}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-mono text-[#C7FF3D] font-bold">Expires: {c.expiryDate}</span>
                    <div className="text-[10px] text-[#A1A99E] font-mono">{c.phone}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Client Workout & Permitted Progress Notes */}
        <div className="lg:col-span-5 rounded-2xl bg-[#171C18] border border-white/[0.08] p-5 space-y-4 text-xs">
          <h3 className="font-heading font-bold text-base text-white">Athlete Workout & Biometrics</h3>

          {selectedClient ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#111512] border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#A1A99E]">Athlete:</span>
                  <span className="text-white font-bold">{selectedClient.fullName} ({selectedClient.id})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A99E]">Goal:</span>
                  <span className="text-[#C7FF3D]">{selectedClient.fitnessGoal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A99E]">Medical Notes:</span>
                  <span className="text-amber-300 text-right">{selectedClient.medicalNotes || 'None'}</span>
                </div>
              </div>

              <div>
                <label className="text-[#A1A99E] block mb-1">Add Coach Progress & Session Notes</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Increased squat working set to 100kg x 5 reps. Form immaculate."
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Client session log saved!</span>
                </div>
              )}

              <button
                onClick={handleSaveClientProgress}
                disabled={!progressNotes.trim()}
                className="w-full py-2.5 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Save className="w-4 h-4" />
                <span>Save Client Progress Note</span>
              </button>
            </div>
          ) : (
            <p className="text-[#A1A99E] italic text-center py-10">
              Select an athlete from the list to view their training objectives and record session progress.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
