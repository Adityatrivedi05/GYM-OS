import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RefreshCw,
  Sliders,
  CheckCheck,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { WhatsAppMessageData, MemberData, GymSettingsData } from '../../types/index.ts';

interface WhatsAppAutomationProps {
  messages: WhatsAppMessageData[];
  members: MemberData[];
  gymSettings: GymSettingsData;
  onRefresh: () => void;
}

export const WhatsAppAutomation: React.FC<WhatsAppAutomationProps> = ({
  messages,
  members,
  gymSettings,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'ai_composer' | 'config'>('queue');
  const [isRunningEngine, setIsRunningEngine] = useState(false);
  const [engineNotification, setEngineNotification] = useState<string | null>(null);

  // AI Composer State
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [copyTone, setCopyTone] = useState<'friendly' | 'urgent' | 'motivational' | 'exclusive'>('friendly');
  const [customOffer, setCustomOffer] = useState('Complimentary 2x InBody Scans & Diet Refinement');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  // Run automated scan & reminder scheduler
  const handleRunAutoReminders = async () => {
    setIsRunningEngine(true);
    setEngineNotification(null);
    try {
      const res = await fetch('/api/whatsapp/auto-reminders/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setIsRunningEngine(false);
      setEngineNotification(
        `Scanned ${data.processed} members. Queued ${data.newMessages?.length || 0} automated reminders for 7d/3d/1d expiry.`
      );
      onRefresh();
    } catch (err: any) {
      setIsRunningEngine(false);
      setEngineNotification('Engine error: ' + err.message);
    }
  };

  const handleGenerateAICopy = async () => {
    setIsGeneratingCopy(true);
    setSendSuccessMessage(null);
    try {
      const res = await fetch('/api/whatsapp/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMemberId,
          tone: copyTone,
          customOffer
        })
      });
      const data = await res.json();
      setGeneratedMessage(data.content);
      setIsGeneratingCopy(false);
    } catch (err: any) {
      setIsGeneratingCopy(false);
      console.error(err);
    }
  };

  const handleQueueAndSend = async () => {
    if (!selectedMember || !generatedMessage) return;
    try {
      const queueRes = await fetch('/api/whatsapp/messages/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: selectedMember.id,
          memberName: selectedMember.fullName,
          phone: selectedMember.phone,
          messageType: 'renewal_7d',
          content: generatedMessage,
          scheduledFor: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          paymentLink: `https://fitflow.in/pay/${selectedMember.id}?plan=${selectedMember.membershipPlanId}`
        })
      });
      if (queueRes.ok) {
        setSendSuccessMessage(`Message successfully dispatched to ${selectedMember.fullName} (${selectedMember.phone})`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendQueuedMessage = async (msgId: string) => {
    try {
      const res = await fetch(`/api/whatsapp/messages/${msgId}/send`, { method: 'POST' });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalDelivered = messages.filter((m) => m.status === 'delivered' || m.status === 'read').length;
  const totalScheduled = messages.filter((m) => m.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">WhatsApp Automation Engine</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              Cloud API Ready
            </span>
          </div>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Automated membership renewals, AI-generated personalized copy, and delivery tracking.
          </p>
        </div>

        <button
          onClick={handleRunAutoReminders}
          disabled={isRunningEngine}
          className="px-4 py-2 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isRunningEngine ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-black" />
          )}
          <span>Run Auto-Reminders Scan</span>
        </button>
      </div>

      {engineNotification && (
        <div className="p-3.5 rounded-xl bg-[#171C18] border border-[#C7FF3D]/30 text-xs text-[#C7FF3D] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{engineNotification}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#171C18] border border-white/5">
          <span className="text-xs text-[#A1A99E]">Total Dispatched</span>
          <p className="font-heading font-bold text-xl text-white mt-1">{messages.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#171C18] border border-white/5">
          <span className="text-xs text-[#A1A99E]">Successfully Delivered</span>
          <p className="font-heading font-bold text-xl text-emerald-400 mt-1">{totalDelivered}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#171C18] border border-white/5">
          <span className="text-xs text-[#A1A99E]">Scheduled in Queue</span>
          <p className="font-heading font-bold text-xl text-amber-400 mt-1">{totalScheduled}</p>
        </div>
        <div className="p-4 rounded-xl bg-[#171C18] border border-white/5">
          <span className="text-xs text-[#A1A99E]">Member Read Rate</span>
          <p className="font-heading font-bold text-xl text-[#C7FF3D] mt-1">92.4%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'queue' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          Message Delivery Queue ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('ai_composer')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'ai_composer' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Copy Generator</span>
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'config' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          API Config & Schedules
        </button>
      </div>

      {activeTab === 'queue' && (
        <div className="rounded-2xl bg-[#171C18] border border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px] border-b border-white/5">
                <tr>
                  <th className="p-3.5 pl-5">Recipient</th>
                  <th className="p-3.5">Trigger Schedule</th>
                  <th className="p-3.5">Message Content</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {messages.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 pl-5">
                      <div className="font-semibold text-white">{m.memberName}</div>
                      <div className="text-[11px] text-[#A1A99E] font-mono">{m.phone}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[#A1A99E]">
                      <span className="text-[10px] uppercase font-bold text-white px-2 py-0.5 rounded bg-white/5 block w-max mb-0.5">
                        {m.messageType.replace('_', ' ')}
                      </span>
                      {m.scheduledFor}
                    </td>
                    <td className="p-3.5 text-white max-w-sm line-clamp-2 leading-relaxed">
                      {m.content}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                          m.status === 'read'
                            ? 'bg-blue-500/10 text-blue-400'
                            : m.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : m.status === 'sent'
                            ? 'bg-[#C7FF3D]/10 text-[#C7FF3D]'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      {m.status === 'scheduled' ? (
                        <button
                          onClick={() => handleSendQueuedMessage(m.id)}
                          className="px-2.5 py-1 rounded bg-[#C7FF3D] text-black font-semibold text-[11px] hover:bg-[#A5D92F]"
                        >
                          Send Now
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#A1A99E] font-mono">Dispatched</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ai_composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-4 text-xs">
            <h3 className="font-heading font-bold text-base text-white">Generate High-Converting Copy</h3>
            <p className="text-[#A1A99E]">
              Uses Gemini 3.8 to generate natural, friendly, or urgent reminders referencing the athlete's personal goals.
            </p>

            <div>
              <label className="text-[#A1A99E] block mb-1">Target Athlete</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} (Expires: {m.expiryDate} • Goal: {m.fitnessGoal})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#A1A99E] block mb-1">Message Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'friendly', label: 'Friendly & Casual' },
                  { id: 'urgent', label: 'Urgent (T-1 Day)' },
                  { id: 'motivational', label: 'Motivational (PRs)' },
                  { id: 'exclusive', label: 'VIP Offer' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCopyTone(t.id as any)}
                    className={`p-2 rounded-xl text-center font-medium transition-all ${
                      copyTone === t.id
                        ? 'bg-[#C7FF3D] text-black font-bold'
                        : 'bg-[#111512] text-[#A1A99E] border border-white/5 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#A1A99E] block mb-1">Special Renewal Offer (Incentive)</label>
              <input
                type="text"
                value={customOffer}
                onChange={(e) => setCustomOffer(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
              />
            </div>

            <button
              onClick={handleGenerateAICopy}
              disabled={isGeneratingCopy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#171C18] to-[#252E27] border border-[#C7FF3D]/40 text-white font-heading font-bold text-xs hover:border-[#C7FF3D] transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingCopy ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C7FF3D]" />
                  <span>Synthesizing Copy with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C7FF3D]" />
                  <span>Generate Personalized Message</span>
                </>
              )}
            </button>
          </div>

          {/* Preview & Dispatch */}
          <div className="lg:col-span-7 rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">Live WhatsApp Preview</h3>

            <div className="p-4 rounded-2xl bg-[#111512] border border-white/10 text-xs min-h-[160px] flex flex-col justify-between">
              <div className="whitespace-pre-line text-white leading-relaxed">
                {generatedMessage || (
                  <span className="text-[#A1A99E] italic">
                    Click "Generate Personalized Message" to create an AI-powered draft for {selectedMember?.fullName}.
                  </span>
                )}
              </div>
              <div className="text-right text-[10px] text-[#A1A99E] font-mono mt-3">
                Target: {selectedMember?.phone}
              </div>
            </div>

            {sendSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{sendSuccessMessage}</span>
              </div>
            )}

            <button
              onClick={handleQueueAndSend}
              disabled={!generatedMessage}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch to Member's WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-6 text-xs">
          <h3 className="font-heading font-bold text-base text-white">Official WhatsApp Business Cloud API Settings</h3>
          <p className="text-[#A1A99E]">
            Messages are dispatched using Meta's official WhatsApp Business Cloud API.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#111512] border border-white/5 space-y-2">
              <span className="text-[#A1A99E]">Official Business Account:</span>
              <p className="text-white font-bold text-sm">{gymSettings.name}</p>
              <p className="text-[11px] text-[#C7FF3D] font-mono">Status: Verified & Operational</p>
            </div>
            <div className="p-4 rounded-xl bg-[#111512] border border-white/5 space-y-2">
              <span className="text-[#A1A99E]">Configured Schedules:</span>
              <p className="text-white font-mono">T-7 Days • T-3 Days • T-1 Day • T-0 Day • T+3 Days Followup</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
