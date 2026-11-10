import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  CreditCard,
  QrCode,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Send,
  Smartphone,
  CheckCheck
} from 'lucide-react';
import { DumbbellHero3D } from '../3d/DumbbellHero3D.tsx';
import confetti from 'canvas-confetti';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenAIAssistant: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onOpenAIAssistant }) => {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [phoneMessageTone, setPhoneMessageTone] = useState<'friendly' | 'urgent' | 'motivational'>('friendly');
  const [phoneMessageSent, setPhoneMessageSent] = useState(false);

  const workflowSteps = [
    {
      title: '1. Intelligent Member Onboarding',
      desc: 'Capture fitness goals, medical history, assign a dedicated trainer, and issue a digital QR pass in 30 seconds.',
      tag: 'Member CRM',
      badgeColor: 'border-[#C7FF3D]/30 text-[#C7FF3D]'
    },
    {
      title: '2. QR Turnstiles & Trainer Shift Audit',
      desc: 'Fraud-proof QR check-in prevents expired member entries and records trainer check-in/out hours with late-arrival detection.',
      tag: 'Access Control',
      badgeColor: 'border-blue-400/30 text-blue-400'
    },
    {
      title: '3. Automated WhatsApp Renewal Sequences',
      desc: 'AI generates personalized WhatsApp reminders 7, 3, and 1 days before expiry, complete with personalized payment links.',
      tag: 'WhatsApp Engine',
      badgeColor: 'border-emerald-400/30 text-emerald-400'
    },
    {
      title: '4. Razorpay Webhook Verified Renewals',
      desc: 'Members pay with UPI/Card. Verified backend webhook marks renewal instantly, logs invoices, and prevents double billing.',
      tag: 'Fintech Gateway',
      badgeColor: 'border-purple-400/30 text-purple-400'
    },
    {
      title: '5. FitFlow AI Business Intelligence',
      desc: 'Ask questions in plain English: "How much revenue this month?", "Which coach has the most clients?", "Who has not visited?"',
      tag: 'Executive AI',
      badgeColor: 'border-amber-400/30 text-amber-400'
    }
  ];

  const handleTestWhatsAppSend = () => {
    setPhoneMessageSent(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C7FF3D', '#25D366', '#ffffff']
    });
    setTimeout(() => setPhoneMessageSent(false), 5000);
  };

  const getSimulatedMessage = () => {
    if (phoneMessageTone === 'urgent') {
      return (
        <>
          <p className="font-semibold text-red-400">⚠️ URGENT: Membership Expiry Tomorrow</p>
          <p className="mt-1">
            Hey Rahul! Tomorrow is the last active day of your 3-Month Transformation at FitFlow Iron Temple.
          </p>
          <p className="mt-2 text-white font-mono bg-black/40 p-2 rounded border border-white/10">
            👉 Tap to retain your personal trainer slot & avoid QR lockout:
            <br />
            <span className="text-[#C7FF3D] underline">fitflow.in/pay/FF-2026-001</span>
          </p>
        </>
      );
    }
    if (phoneMessageTone === 'motivational') {
      return (
        <>
          <p className="font-semibold text-[#C7FF3D]">🔥 Don't Break The Momentum, Rahul!</p>
          <p className="mt-1">
            You’ve logged 18 high-intensity workouts this month under Coach Vikram! Your pass expires in 4 days.
          </p>
          <p className="mt-2">
            Lock in your next cycle with a complimentary Body Composition Scan:
          </p>
          <p className="mt-1 text-white font-mono bg-black/40 p-2 rounded border border-white/10">
            <span className="text-[#C7FF3D] underline">fitflow.in/pay/FF-2026-001</span>
          </p>
        </>
      );
    }
    return (
      <>
        <p className="font-semibold text-white">Hello Rahul! 👋</p>
        <p className="mt-1">
          We hope you're crushing your fitness goals at FitFlow Iron Temple! Your 3-Month Membership expires on *13 Nov 2026*.
        </p>
        <p className="mt-2">
          Renew early to ensure continuous gym floor and trainer access:
        </p>
        <p className="mt-1 text-white font-mono bg-black/40 p-2 rounded border border-white/10">
          👉 1-Click UPI/Card: <span className="text-[#C7FF3D] underline">fitflow.in/pay/FF-2026-001</span>
        </p>
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#090B0A] text-[#F5F7F2] overflow-hidden">
      {/* SECTION 2: CINEMATIC 3D HERO SECTION */}
      <section className="relative pt-8 pb-20 md:pt-14 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111512] border border-[#C7FF3D]/30 text-xs text-[#A1A99E] mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#C7FF3D] shadow-[0_0_8px_#C7FF3D]" />
              <span className="font-mono uppercase tracking-widest text-white text-[11px]">
                The Future of Gym Management
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white">
              YOUR GYM. <br />
              <span className="text-[#C7FF3D] drop-shadow-[0_0_35px_rgba(199,255,61,0.25)]">
                UNDER CONTROL.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-[#A1A99E] font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
              One intelligent platform to manage members, trainers, memberships, payments and your entire gym operation.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-base hover:bg-[#A5D92F] transition-all transform hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(199,255,61,0.25)] flex items-center justify-center gap-2.5 group"
              >
                <span>Launch Gym OS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenAIAssistant}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#171C18] border border-white/10 text-white font-medium text-sm hover:border-[#C7FF3D]/50 hover:bg-[#1E241F] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C7FF3D]" />
                <span>Ask FitFlow AI</span>
              </button>
            </div>

            {/* Highlights row */}
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="font-heading font-bold text-2xl sm:text-3xl text-white">99.4%</p>
                <p className="text-xs text-[#A1A99E] mt-0.5">Renewal Capture</p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl sm:text-3xl text-[#C7FF3D]">30 Sec</p>
                <p className="text-xs text-[#A1A99E] mt-0.5">QR Turnstile Flow</p>
              </div>
              <div>
                <p className="font-heading font-bold text-2xl sm:text-3xl text-white">Zero</p>
                <p className="text-xs text-[#A1A99E] mt-0.5">Payment Chasing</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Photorealistic 3D Metallic Dumbbell */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Subtle radial glow background */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-[#C7FF3D]/10 blur-[120px] pointer-events-none -z-10" />
            <DumbbellHero3D />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center justify-center gap-2 text-[#A1A99E]">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/60">Scroll to Explore</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1.5 h-2 rounded-full bg-[#C7FF3D] animate-bounce" />
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PROBLEM */}
      <section className="py-20 bg-[#111512]/60 border-y border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              The Gym Owner Nightmare
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mt-4 tracking-tight">
              RUNNING A GYM SHOULDN'T BE THIS COMPLICATED.
            </h2>
            <p className="text-sm sm:text-base text-[#A1A99E] mt-4">
              Traditional gyms lose up to 35% of their revenue annually through silent membership churn, unrecorded trainer hours, and manual paper chasing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: 'Manual Attendance Chaos',
                desc: 'Front desk paper registers or unverified fingerprint scanners with zero audit trail or late-shift tracking.'
              },
              {
                icon: AlertCircleIcon,
                title: 'Expired Memberships Bleed',
                desc: 'Expired members walking onto the floor for weeks without anyone realizing they have not paid renewals.'
              },
              {
                icon: CreditCard,
                title: 'Missed & Unreconciled Fees',
                desc: 'Cash payments lost in registers, unverified UPI screenshots, and zero automated receipt invoicing.'
              },
              {
                icon: Users,
                title: 'Trainer Client Overload',
                desc: 'Zero visibility into which trainers are assigned to which clients, leading to client neglect and poor results.'
              },
              {
                icon: MessageSquare,
                title: 'Endless WhatsApp Follow-ups',
                desc: 'Staff spending 4 hours every evening typing manual awkward renewal messages one by one on personal phones.'
              },
              {
                icon: TrendingUp,
                title: 'Blind Financials & No Insights',
                desc: 'Owner has no idea whether the gym actually made net profit after equipment maintenance, rent, and trainer payroll.'
              }
            ].map((problem, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#171C18] border border-white/[0.07] hover:border-red-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                  <problem.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-white">{problem.title}</h3>
                <p className="text-xs sm:text-sm text-[#A1A99E] mt-2 leading-relaxed">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 & 5: THE SOLUTION & 3D WORKFLOW SHOWCASE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF3D] bg-[#C7FF3D]/10 px-3 py-1 rounded-full border border-[#C7FF3D]/20">
            Autonomous Gym Operating System
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mt-4 tracking-tight">
            EVERYTHING. CONNECTED. ONE PLATFORM.
          </h2>
          <p className="text-sm sm:text-base text-[#A1A99E] mt-4">
            Click each step below to inspect how FitFlow AI automates operations from first walk-in to verified bank settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Workflow Step Selector */}
          <div className="lg:col-span-5 space-y-3">
            {workflowSteps.map((step, idx) => {
              const active = activeWorkflowStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${
                    active
                      ? 'bg-[#171C18] border-[#C7FF3D] shadow-[0_4px_20px_rgba(199,255,61,0.1)]'
                      : 'bg-[#111512] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${step.badgeColor}`}>
                      {step.tag}
                    </span>
                    {active && <ChevronRight className="w-4 h-4 text-[#C7FF3D]" />}
                  </div>
                  <h4 className={`font-heading font-semibold text-sm ${active ? 'text-white' : 'text-[#A1A99E]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#A1A99E] mt-1 line-clamp-2">{step.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Workflow Interactive Preview Panel */}
          <div className="lg:col-span-7 rounded-2xl bg-[#171C18] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-[#C7FF3D]" />
                <span className="text-xs font-mono text-[#A1A99E] ml-2">FitFlow Engine • Live Terminal</span>
              </div>
              <span className="text-xs font-mono text-[#C7FF3D] bg-[#C7FF3D]/10 px-2.5 py-0.5 rounded">
                STAGE 0{activeWorkflowStep + 1}
              </span>
            </div>

            {/* Dynamic Content based on activeWorkflowStep */}
            {activeWorkflowStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111512] border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-[#C7FF3D] text-black font-bold flex items-center justify-center font-heading text-lg">
                    RV
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-white">Rahul Verma (Member #FF-2026-001)</h5>
                    <p className="text-xs text-[#A1A99E]">Plan: Quarterly Transformation • Coach: Vikram Rajput</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#111512] border border-white/5">
                    <span className="text-[#A1A99E]">Start Date:</span>
                    <p className="text-white font-mono mt-0.5">15 Aug 2026</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#111512] border border-white/5">
                    <span className="text-[#A1A99E]">Expiry Date:</span>
                    <p className="text-[#C7FF3D] font-mono mt-0.5">13 Nov 2026 (Expiring Soon)</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#C7FF3D]/5 border border-[#C7FF3D]/20 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C7FF3D] shrink-0" />
                  <span>Digital NFC / QR Card Generated and synchronized with Turnstile Controller.</span>
                </div>
              </div>
            )}

            {activeWorkflowStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#111512] border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-white font-semibold text-sm">QR Gate Check-In</h5>
                      <p className="text-xs text-[#A1A99E]">Live Gym Floor Headcount: <strong className="text-white">14 Athletes</strong></p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                    ACCESS GRANTED
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#111512] border border-white/5 text-xs font-mono space-y-1.5 text-[#A1A99E]">
                  <p className="text-white">&gt; Turnstile #1: Scanner active at 05:30 AM</p>
                  <p>&gt; Member FF-2026-001 valid till 13-Nov-2026: PASS</p>
                  <p>&gt; Trainer Vikram Rajput checked in 05:55 AM (On-time, +5 min early): LOGGED</p>
                </div>
              </div>
            )}

            {activeWorkflowStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Official WhatsApp Business Cloud API
                    </span>
                    <span className="font-mono text-[10px] text-white/60">T-4 Days</span>
                  </div>
                  <p className="text-white leading-relaxed">
                    "Hello Rahul! 👋 Your 3-Month Transformation expires on 13 Nov. Renew now using the link below to preserve your coach slot: fitflow.in/pay/FF-2026-001"
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-[#111512]">
                    <span className="text-[#A1A99E] text-[10px]">Delivered</span>
                    <p className="font-mono text-emerald-400 font-bold">100%</p>
                  </div>
                  <div className="p-2 rounded bg-[#111512]">
                    <span className="text-[#A1A99E] text-[10px]">Read Rate</span>
                    <p className="font-mono text-blue-400 font-bold">89.2%</p>
                  </div>
                  <div className="p-2 rounded bg-[#111512]">
                    <span className="text-[#A1A99E] text-[10px]">Conversion</span>
                    <p className="font-mono text-[#C7FF3D] font-bold">78.5%</p>
                  </div>
                </div>
              </div>
            )}

            {activeWorkflowStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#111512] border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">Razorpay Webhook Dispatch</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Signature Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A99E] font-mono">
                    EVENT: payment.captured | TXN: TXN_RZP_98234190 | AMOUNT: ₹6,499
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#C7FF3D]/10 border border-[#C7FF3D]/30 text-xs text-[#C7FF3D] flex items-center justify-between">
                  <span>Membership Auto-Extended +90 Days</span>
                  <span className="font-mono font-bold">New Expiry: 11 Feb 2027</span>
                </div>
              </div>
            )}

            {activeWorkflowStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#111512] border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">FitFlow AI Assistant Insight</span>
                  </div>
                  <p className="text-xs text-[#A1A99E] leading-relaxed">
                    "Your gym generated <strong className="text-white">₹52,996</strong> in captured revenue this week with an 84.5% renewal rate. 3 memberships expire in 7 days, representing a <strong className="text-[#C7FF3D]">₹18,500</strong> renewal pipeline."
                  </p>
                </div>
                <button
                  onClick={onOpenAIAssistant}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#171C18] to-[#252E27] border border-white/10 hover:border-[#C7FF3D] text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C7FF3D]" />
                  <span>Try Natural Language Assistant</span>
                </button>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-[#A1A99E]">Interactive Experience</span>
              <button
                onClick={onLaunchApp}
                className="text-xs font-semibold text-[#C7FF3D] hover:underline flex items-center gap-1"
              >
                <span>Launch Full System</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: WHATSAPP AUTOMATION INTERACTIVE SIMULATOR */}
      <section className="py-20 bg-[#111512]/70 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Zero Manual Follow-Ups</span>
              </div>

              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight">
                AI-Powered WhatsApp Messages That Members Actually Read.
              </h2>

              <p className="text-sm sm:text-base text-[#A1A99E] leading-relaxed">
                Connect your gym’s official WhatsApp Business Cloud API. FitFlow AI generates hyper-personalized renewal notifications, payment receipts, and trial follow-ups using Gemini.
              </p>

              {/* Tone selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#A1A99E]">Select AI Copy Tone:</label>
                <div className="flex flex-wrap gap-2">
                  {(['friendly', 'urgent', 'motivational'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPhoneMessageTone(t)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                        phoneMessageTone === t
                          ? 'bg-[#C7FF3D] text-black font-semibold shadow-md'
                          : 'bg-[#171C18] text-[#A1A99E] border border-white/10 hover:text-white'
                      }`}
                    >
                      {t} Tone
                    </button>
                  ))}
                </div>
              </div>

              {/* Send test button */}
              <div>
                <button
                  onClick={handleTestWhatsAppSend}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Simulate Real-Time WhatsApp Dispatch</span>
                </button>
                {phoneMessageSent && (
                  <p className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4" /> Message delivered to +91 98200 11223 with 200 OK webhook!
                  </p>
                )}
              </div>
            </div>

            {/* Right side Phone Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-[320px] sm:w-[350px] rounded-[36px] bg-[#0c100e] border-[6px] border-[#202722] shadow-2xl p-3 relative overflow-hidden">
                {/* Phone Speaker & Camera Notch */}
                <div className="w-28 h-4 bg-[#202722] rounded-full mx-auto mb-3" />

                {/* WhatsApp Chat Header */}
                <div className="flex items-center gap-3 p-2.5 rounded-t-2xl bg-[#171C18] border-b border-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#C7FF3D] flex items-center justify-center text-black font-bold text-xs">
                    FF
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">FitFlow Iron Temple</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Official Business Account
                    </span>
                  </div>
                </div>

                {/* WhatsApp Chat Area */}
                <div className="p-3 min-h-[300px] bg-[#090B0A] flex flex-col justify-end space-y-3">
                  <div className="text-[10px] text-center text-[#A1A99E] font-mono">Today, 09:30 AM</div>

                  {/* Incoming Gym Message Bubble */}
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-[#171C18] border border-white/10 text-xs text-white max-w-[90%] shadow-md">
                    {getSimulatedMessage()}
                    <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-[#A1A99E]">
                      <span>09:31 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Simulated Input Bar */}
                <div className="p-2 rounded-b-2xl bg-[#171C18] flex items-center justify-between text-xs text-[#A1A99E] border-t border-white/5">
                  <span>Type a reply...</span>
                  <div className="w-6 h-6 rounded-full bg-[#C7FF3D] flex items-center justify-center text-black">
                    <Send className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: HIGH PERFORMANCE FEATURES GRID */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C7FF3D] bg-[#C7FF3D]/10 px-3 py-1 rounded-full border border-[#C7FF3D]/20">
            Enterprise Grade Architecture
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mt-4 tracking-tight">
            BUILT FOR SCALE, SPEED & ACCURACY.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Trainer Shift & Shift Audit',
              desc: 'Track working hours, late arrivals, shift corrections with recorded reasons, and trainer client workload distribution.'
            },
            {
              title: 'Multi-Role Access Control',
              desc: 'Strict role separation between Gym Owner (complete management), Trainers (client progress & schedule), and Front Desk.'
            },
            {
              title: 'Fraud-Proof QR Turnstile',
              desc: 'Prevents expired or suspended members from checking in. Real-time active headcount counter inside gym.'
            },
            {
              title: 'Automated Razorpay Webhooks',
              desc: 'Idempotent webhook signature verification ensures payments are never double-counted or faked on the frontend.'
            },
            {
              title: 'Complete Financial P&L',
              desc: 'Track trainer salaries, facility lease, electricity, equipment maintenance, and net operating margins.'
            },
            {
              title: 'Enquiry CRM & Conversion',
              desc: 'Log prospective leads, schedule guest trial workouts, and convert leads into paying active members in 1-click.'
            }
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#111512] border border-white/[0.08] hover:border-[#C7FF3D]/40 transition-all hover:-translate-y-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C7FF3D]/10 border border-[#C7FF3D]/20 flex items-center justify-center text-[#C7FF3D] font-mono text-xs font-bold mb-4">
                0{i + 1}
              </div>
              <h3 className="font-heading font-bold text-lg text-white">{f.title}</h3>
              <p className="text-xs sm:text-sm text-[#A1A99E] mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-[#171C18] to-[#111512] border border-white/10 p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C7FF3D]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              STOP MANAGING CHAOS. <br />
              <span className="text-[#C7FF3D]">START BUILDING STRONGER GYMS.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A1A99E] mt-6 leading-relaxed">
              Launch the live FitFlow AI platform now. Experience real member management, trainer rosters, Razorpay testing, and AI intelligence.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-base hover:bg-[#A5D92F] transition-all transform hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(199,255,61,0.25)] flex items-center justify-center gap-2"
              >
                <span>Launch Gym OS Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAIAssistant}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#111512] border border-white/10 text-white font-medium text-sm hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C7FF3D]" />
                <span>Ask FitFlow AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#090B0A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#C7FF3D] flex items-center justify-center text-black font-bold">
              <Award className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-white tracking-tight">FITFLOW AI</span>
            <span className="text-xs text-[#A1A99E] font-mono">© 2026 Iron Temple Technologies</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#A1A99E]">
            <button onClick={onLaunchApp} className="hover:text-white transition-colors">Owner Dashboard</button>
            <button onClick={onLaunchApp} className="hover:text-white transition-colors">Trainer Portal</button>
            <button onClick={onLaunchApp} className="hover:text-white transition-colors">Front Desk System</button>
            <span className="text-white/40">•</span>
            <span className="text-[#C7FF3D] font-mono">Powered by Gemini 3.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

function AlertCircleIcon(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
