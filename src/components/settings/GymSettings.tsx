import React, { useState } from 'react';
import {
  Settings,
  Database,
  CreditCard,
  MessageSquare,
  Building,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Save,
  Code
} from 'lucide-react';
import { GymSettingsData } from '../../types/index.ts';

interface GymSettingsProps {
  gym: GymSettingsData;
  onRefresh: () => void;
}

export const GymSettings: React.FC<GymSettingsProps> = ({ gym, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'database'>('general');
  const [gymName, setGymName] = useState(gym.name);
  const [tagline, setTagline] = useState(gym.tagline);
  const [address, setAddress] = useState(gym.address);
  const [phone, setPhone] = useState(gym.phone);
  const [businessHours, setBusinessHours] = useState(gym.businessHours);
  const [lateThreshold, setLateThreshold] = useState(gym.lateArrivalThresholdMinutes);

  // Razorpay credentials
  const [razorpayKeyId, setRazorpayKeyId] = useState(gym.razorpayKeyId || 'rzp_test_fitflow_live');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(gym.razorpayKeySecret || 'test_secret_key');
  const [razorpayConfigured, setRazorpayConfigured] = useState(gym.razorpayConfigured);

  // WhatsApp credentials
  const [whatsappPhoneId, setWhatsappPhoneId] = useState(gym.whatsappPhoneNumberId || '');
  const [whatsappToken, setWhatsappToken] = useState(gym.whatsappAccessToken || '');
  const [whatsappConfigured, setWhatsappConfigured] = useState(gym.whatsappConfigured);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gymName,
          tagline,
          address,
          phone,
          businessHours,
          lateArrivalThresholdMinutes: Number(lateThreshold),
          razorpayKeyId,
          razorpayKeySecret,
          razorpayConfigured,
          whatsappPhoneNumberId: whatsappPhoneId,
          whatsappAccessToken: whatsappToken,
          whatsappConfigured
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fullPostgresSchema = `-- ==========================================
-- FITFLOW AI — FULL POSTGRESQL & SUPABASE SCHEMA
-- Normalized Multi-Tenant Gym Operating System
-- ==========================================

-- 1. GYMS (Multi-tenant master)
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'INR',
    business_hours VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS & ROLES
CREATE TYPE user_role AS ENUM ('owner', 'trainer', 'staff');

CREATE TABLE IF NOT EXISTS gym_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    role user_role DEFAULT 'staff',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TRAINERS
CREATE TABLE IF NOT EXISTS trainers (
    id VARCHAR(50) PRIMARY KEY,
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(50),
    specialization VARCHAR(100),
    salary NUMERIC(12,2) DEFAULT 0,
    working_hours VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    rating NUMERIC(3,2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MEMBERSHIP PLANS
CREATE TABLE IF NOT EXISTS membership_plans (
    id VARCHAR(50) PRIMARY KEY,
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration_days INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MEMBERS
CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(50) PRIMARY KEY,
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    age INT,
    gender VARCHAR(20),
    emergency_contact VARCHAR(100),
    assigned_trainer_id VARCHAR(50) REFERENCES trainers(id) ON DELETE SET NULL,
    membership_plan_id VARCHAR(50) REFERENCES membership_plans(id),
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'paid',
    status VARCHAR(20) DEFAULT 'active',
    whatsapp_opt_in BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ATTENDANCE (MEMBER & TRAINER)
CREATE TABLE IF NOT EXISTS member_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME,
    method VARCHAR(20) DEFAULT 'qr'
);

CREATE TABLE IF NOT EXISTS trainer_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    trainer_id VARCHAR(50) REFERENCES trainers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME,
    status VARCHAR(20) DEFAULT 'present',
    correction_reason TEXT
);

-- 7. PAYMENTS & WEBHOOK IDEMPOTENCY
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_gateway VARCHAR(20) DEFAULT 'razorpay',
    status VARCHAR(20) DEFAULT 'captured',
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT
);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullPostgresSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Gym Configuration & APIs</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Facility branding, Razorpay payment gateway credentials, WhatsApp Business Cloud API, and Supabase database.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'general' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          General & Operations
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'integrations' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          Razorpay & WhatsApp APIs
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'database' ? 'bg-[#C7FF3D] text-black font-bold' : 'text-[#A1A99E] hover:text-white bg-[#111512]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>PostgreSQL / Supabase Schema</span>
        </button>
      </div>

      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A1A99E] block mb-1">Gym Facility Name</label>
              <input
                type="text"
                required
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
              />
            </div>
            <div>
              <label className="text-[#A1A99E] block mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#A1A99E] block mb-1">Full Facility Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#A1A99E] block mb-1">Official Gym Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
              />
            </div>
            <div>
              <label className="text-[#A1A99E] block mb-1">Operating Hours</label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
              />
            </div>
            <div>
              <label className="text-[#A1A99E] block mb-1">Late Arrival Threshold (Minutes)</label>
              <input
                type="number"
                value={lateThreshold}
                onChange={(e) => setLateThreshold(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold hover:bg-[#A5D92F] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* Razorpay Setup */}
          <div className="rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  rzp
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">Razorpay Payment Gateway</h3>
                  <p className="text-[11px] text-[#A1A99E]">Accepts UPI, Credit/Debit cards, and Netbanking with webhook sync.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                SANDBOX / LIVE READY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#A1A99E] block mb-1">Razorpay Key ID</label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D] font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-[#A1A99E] block mb-1">Razorpay Key Secret</label>
                <input
                  type="password"
                  value={razorpayKeySecret}
                  onChange={(e) => setRazorpayKeySecret(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D] font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#111512] border border-white/5 space-y-1 font-mono text-[11px] text-[#A1A99E]">
              <span className="text-white font-bold">Webhook Endpoint for Razorpay Dashboard:</span>
              <p className="text-[#C7FF3D]">https://fitflow.in/api/payments/razorpay/verify-webhook</p>
              <p className="text-[10px] text-white/50">Events to subscribe: payment.captured, payment.failed, order.paid</p>
            </div>
          </div>

          {/* WhatsApp Cloud API */}
          <div className="rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  WA
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">Meta WhatsApp Business Cloud API</h3>
                  <p className="text-[11px] text-[#A1A99E]">Sends automated renewal reminders directly from your verified business number.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#A1A99E] block mb-1">Phone Number ID</label>
                <input
                  type="text"
                  placeholder="e.g. 104829104829"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D] font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-[#A1A99E] block mb-1">System User Access Token</label>
                <input
                  type="password"
                  placeholder="EAAB..."
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D] font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="rounded-2xl bg-[#171C18] border border-white/10 p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="font-heading font-bold text-base text-white">PostgreSQL & Supabase Multi-Tenant DDL</h3>
              <p className="text-[#A1A99E]">
                Production-grade normalized schema with Row Level Security (RLS) and multi-gym isolation.
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-[#C7FF3D] text-black font-semibold text-xs hover:bg-[#A5D92F] transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#090B0A] border border-white/5 font-mono text-[11px] text-[#A1A99E] max-h-[380px] overflow-y-auto leading-relaxed">
            <pre className="text-[#C7FF3D]/90 whitespace-pre-wrap">{fullPostgresSchema}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
