import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  Users,
  Search,
  ArrowRight
} from 'lucide-react';
import { MemberData, TrainerData, MemberAttendanceData, TrainerAttendanceData } from '../../types/index.ts';

interface AttendanceCenterProps {
  members: MemberData[];
  trainers: TrainerData[];
  memberAttendance: MemberAttendanceData[];
  trainerAttendance: TrainerAttendanceData[];
  onRefresh: () => void;
}

export const AttendanceCenter: React.FC<AttendanceCenterProps> = ({
  members,
  trainers,
  memberAttendance,
  trainerAttendance,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'turnstile' | 'trainer'>('turnstile');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'error' | 'warning';
    message: string;
    member?: MemberData;
  } | null>(null);

  // Trainer checkin state
  const [selectedTrainerId, setSelectedTrainerId] = useState(trainers[0]?.id || '');
  const [trainerActionStatus, setTrainerActionStatus] = useState<string | null>(null);

  // Active gym headcount
  const today = new Date().toISOString().split('T')[0];
  const todayMemberAttendance = memberAttendance.filter((m) => m.date === today);
  const activeMembersInGym = todayMemberAttendance.filter((m) => !m.checkOutTime);

  const handleSimulateScan = async (memberIdToScan: string) => {
    const id = memberIdToScan.trim();
    if (!id) return;

    const member = members.find((m) => m.id.toLowerCase() === id.toLowerCase() || m.phone.includes(id));

    if (!member) {
      setScanResult({
        status: 'error',
        message: `Member not found with credential "${id}". Turnstile locked.`
      });
      return;
    }

    try {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const res = await fetch('/api/attendance/members/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: member.id,
          date: today,
          checkInTime: currentTime,
          method: 'qr'
        })
      });

      const data = await res.json();
      if (data.success) {
        setScanResult({
          status: 'success',
          message: data.message,
          member
        });
        onRefresh();
      } else {
        setScanResult({
          status: 'error',
          message: data.message,
          member
        });
      }
    } catch (err: any) {
      setScanResult({
        status: 'error',
        message: 'Scanner controller error: ' + err.message
      });
    }
  };

  const handleTrainerScanCheckIn = async (trainerId: string) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const res = await fetch('/api/attendance/trainers/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerId,
          date: today,
          checkInTime: currentTime,
          status: 'present',
          method: 'qr'
        })
      });
      if (res.ok) {
        setTrainerActionStatus(`Coach marked checked in at ${currentTime}`);
        onRefresh();
        setTimeout(() => setTrainerActionStatus(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Headcount */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Attendance & Access Control</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Biometric turnstile check-ins, expired membership gatekeeping, and coach shift audits.
          </p>
        </div>

        {/* Live Headcount Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#171C18] border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#C7FF3D]/10 flex items-center justify-center text-[#C7FF3D]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white">Currently In Gym</span>
            </div>
            <p className="font-heading font-extrabold text-lg text-[#C7FF3D]">
              {activeMembersInGym.length} Athletes Active
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('turnstile')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'turnstile'
              ? 'bg-[#C7FF3D] text-black font-bold'
              : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Member QR Turnstile Simulator</span>
        </button>
        <button
          onClick={() => setActiveTab('trainer')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'trainer'
              ? 'bg-[#C7FF3D] text-black font-bold'
              : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Trainer Shift Attendance</span>
        </button>
      </div>

      {activeTab === 'turnstile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR Turnstile Terminal Simulator */}
          <div className="lg:col-span-6 rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C7FF3D] animate-ping" />
                <h3 className="font-heading font-bold text-base text-white">Optical Turnstile Scanner</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                GATE #1 ONLINE
              </span>
            </div>

            <p className="text-xs text-[#A1A99E]">
              Test real turnstile hardware behavior. Select any member below or type their ID to simulate a QR scan. Expired members are automatically blocked by the gate controller!
            </p>

            {/* Quick member scan buttons */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-[#A1A99E]">Click Athlete to Scan:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {members.slice(0, 4).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setScanInput(m.id);
                      handleSimulateScan(m.id);
                    }}
                    className="p-2.5 rounded-xl bg-[#111512] border border-white/5 hover:border-[#C7FF3D]/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-white font-medium group-hover:text-[#C7FF3D]">{m.fullName}</div>
                      <div className="text-[10px] text-[#A1A99E] font-mono">{m.id} ({m.status})</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A1A99E] group-hover:text-[#C7FF3D] transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Manual scan input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter Member ID (e.g. FF-2026-002)..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan(scanInput)}
                className="flex-1 p-2.5 rounded-xl bg-[#111512] border border-white/10 text-xs text-white focus:outline-none focus:border-[#C7FF3D]"
              />
              <button
                onClick={() => handleSimulateScan(scanInput)}
                className="px-4 py-2.5 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all"
              >
                Scan Pass
              </button>
            </div>

            {/* Turnstile Physical Feedback Box */}
            {scanResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 animate-fade-in ${
                  scanResult.status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scanResult.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span>
                    {scanResult.status === 'success' ? 'TURNSTILE UNLOCKED (GREEN)' : 'ACCESS DENIED (RED)'}
                  </span>
                </div>
                <p className="text-white text-xs">{scanResult.message}</p>
                {scanResult.member && (
                  <div className="text-[11px] text-[#A1A99E] font-mono pt-1 border-t border-white/10 flex items-center justify-between">
                    <span>Expiry: {scanResult.member.expiryDate}</span>
                    <span>Status: {scanResult.member.status.toUpperCase()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Today's Live Attendance Feed */}
          <div className="lg:col-span-6 rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-heading font-bold text-base text-white">Today's Check-In Log ({today})</h3>
              <span className="text-xs text-[#A1A99E] font-mono">{todayMemberAttendance.length} records</span>
            </div>

            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="p-2.5">Athlete</th>
                    <th className="p-2.5">In</th>
                    <th className="p-2.5">Out</th>
                    <th className="p-2.5">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {todayMemberAttendance.map((rec) => {
                    const member = members.find((m) => m.id === rec.memberId);
                    return (
                      <tr key={rec.id} className="hover:bg-white/[0.02]">
                        <td className="p-2.5">
                          <div className="font-medium text-white">{member?.fullName || rec.memberId}</div>
                          <div className="text-[10px] text-[#A1A99E] font-mono">{rec.memberId}</div>
                        </td>
                        <td className="p-2.5 font-mono text-[#C7FF3D]">{rec.checkInTime}</td>
                        <td className="p-2.5 font-mono text-[#A1A99E]">
                          {rec.checkOutTime || <span className="text-emerald-400 font-bold">On Floor</span>}
                        </td>
                        <td className="p-2.5 font-mono text-white/60 uppercase">{rec.method}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Trainer Attendance Tab */
        <div className="rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Coach Shift Verification</h3>
              <p className="text-xs text-[#A1A99E]">
                Shift start, check-out verification, and automatic late detection (&gt; 15 minutes past shift start).
              </p>
            </div>
            {trainerActionStatus && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                {trainerActionStatus}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainers.map((t) => {
              const attToday = trainerAttendance.find((a) => a.trainerId === t.id && a.date === today);

              return (
                <div key={t.id} className="p-4 rounded-xl bg-[#111512] border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={t.avatarUrl} alt={t.fullName} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-semibold text-white text-xs">{t.fullName}</h4>
                      <p className="text-[10px] text-[#A1A99E] font-mono">{t.workingHours}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[#A1A99E]">Today Status:</span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        attToday?.status === 'present'
                          ? 'text-emerald-400'
                          : attToday?.status === 'late'
                          ? 'text-amber-400'
                          : 'text-[#A1A99E]'
                      }`}
                    >
                      {attToday ? `${attToday.status.toUpperCase()} (${attToday.checkInTime})` : 'NOT CHECKED IN'}
                    </span>
                  </div>

                  {!attToday ? (
                    <button
                      onClick={() => handleTrainerScanCheckIn(t.id)}
                      className="w-full py-1.5 rounded-lg bg-[#C7FF3D] text-black font-bold text-xs hover:bg-[#A5D92F] transition-all"
                    >
                      Scan QR Check-In
                    </button>
                  ) : (
                    <div className="text-[10px] text-center text-[#A1A99E] font-mono">
                      {attToday.checkOutTime ? `Checked out at ${attToday.checkOutTime}` : 'Active on Gym Floor'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
