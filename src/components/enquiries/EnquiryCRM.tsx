import React, { useState } from 'react';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';
import { EnquiryData } from '../../types/index.ts';

interface EnquiryCRMProps {
  enquiries: EnquiryData[];
  currencySymbol: string;
  onRefresh: () => void;
  onConvertToMember: (enquiry: EnquiryData) => void;
}

export const EnquiryCRM: React.FC<EnquiryCRMProps> = ({
  enquiries,
  currencySymbol,
  onRefresh,
  onConvertToMember
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [interestedPlan, setInterestedPlan] = useState('plan-3m');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          interestedPlan,
          date: new Date().toISOString().split('T')[0],
          followUpDate,
          status: 'new',
          notes
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setName('');
        setPhone('+91 ');
        setNotes('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, status: EnquiryData['status']) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Prospective Enquiries (CRM)</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">Track walk-in leads, book trial sessions, and convert prospects into paid members.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center gap-1.5 shadow-lg shadow-[#C7FF3D]/15"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead / Walk-In</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#171C18] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="p-3.5 pl-5">Lead Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Interested Plan</th>
                <th className="p-3.5">Enquiry Date</th>
                <th className="p-3.5">Follow-Up Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 pl-5 font-semibold text-white">{enq.name}</td>
                  <td className="p-3.5 font-mono text-[#A1A99E]">{enq.phone}</td>
                  <td className="p-3.5 text-white capitalize">{enq.interestedPlan}</td>
                  <td className="p-3.5 font-mono text-[#A1A99E]">{enq.date}</td>
                  <td className="p-3.5 font-mono text-amber-400">{enq.followUpDate}</td>
                  <td className="p-3.5">
                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value as any)}
                      className="p-1 rounded bg-[#111512] border border-white/10 text-white font-mono text-[10px]"
                    >
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="trial_booked">TRIAL BOOKED</option>
                      <option value="converted">CONVERTED</option>
                      <option value="lost">LOST</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right pr-5">
                    {enq.status !== 'converted' ? (
                      <button
                        onClick={() => onConvertToMember(enq)}
                        className="px-2.5 py-1 rounded bg-[#C7FF3D]/10 hover:bg-[#C7FF3D]/20 text-[#C7FF3D] border border-[#C7FF3D]/30 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <span>Convert</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#171C18] border border-white/10 p-6 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white mb-4">Record New Lead / Enquiry</h3>
            <form onSubmit={handleCreateEnquiry} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A1A99E] block mb-1">Prospect Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varun Dhawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>
              <div>
                <label className="text-[#A1A99E] block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A1A99E] block mb-1">Interested Membership</label>
                  <select
                    value={interestedPlan}
                    onChange={(e) => setInterestedPlan(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  >
                    <option value="plan-1m">Monthly Strength</option>
                    <option value="plan-3m">Quarterly Transformation</option>
                    <option value="plan-6m">Half-Yearly</option>
                    <option value="plan-12m">Annual Elite</option>
                    <option value="plan-pt">Personal Training</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Follow-Up Date</label>
                  <input
                    type="date"
                    required
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#A1A99E] block mb-1">Notes / Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Needs evening slots, interested in free trial on Saturday"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#111512] text-[#A1A99E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#C7FF3D] text-black font-semibold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
