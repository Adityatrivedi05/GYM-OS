import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Award,
  QrCode,
  CreditCard,
  MessageSquare,
  HelpCircle,
  TrendingDown,
  Sparkles,
  Settings,
  Bell,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  ChevronRight
} from 'lucide-react';

import {
  UserRole,
  DashboardStatsResponse,
  MemberData,
  TrainerData,
  MembershipPlanData,
  TrainerAttendanceData,
  MemberAttendanceData,
  PaymentData,
  ExpenseData,
  WhatsAppMessageData,
  EnquiryData,
  GymSettingsData
} from './types/index.ts';

import { Navbar } from './components/layout/Navbar.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard.tsx';
import { TrainerManagement } from './components/trainers/TrainerManagement.tsx';
import { MemberManagement } from './components/members/MemberManagement.tsx';
import { MembershipPlans } from './components/memberships/MembershipPlans.tsx';
import { AttendanceCenter } from './components/attendance/AttendanceCenter.tsx';
import { PaymentCenter } from './components/payments/PaymentCenter.tsx';
import { WhatsAppAutomation } from './components/whatsapp/WhatsAppAutomation.tsx';
import { EnquiryCRM } from './components/enquiries/EnquiryCRM.tsx';
import { FinancialManagement } from './components/finance/FinancialManagement.tsx';
import { GymSettings } from './components/settings/GymSettings.tsx';
import { FitFlowAIAssistant } from './components/ai/FitFlowAIAssistant.tsx';
import { TrainerView } from './components/trainer-view/TrainerView.tsx';
import { StaffView } from './components/staff-view/StaffView.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Dialogs & Modals
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [renewModalMember, setRenewModalMember] = useState<MemberData | null>(null);

  // Live Database State
  const [dashboardData, setDashboardData] = useState<DashboardStatsResponse | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [plans, setPlans] = useState<MembershipPlanData[]>([]);
  const [trainerAttendance, setTrainerAttendance] = useState<TrainerAttendanceData[]>([]);
  const [memberAttendance, setMemberAttendance] = useState<MemberAttendanceData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessageData[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
  const [gymSettings, setGymSettings] = useState<GymSettingsData | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [
        dashRes,
        membersRes,
        trainersRes,
        plansRes,
        trainerAttRes,
        memberAttRes,
        paymentsRes,
        expensesRes,
        waRes,
        enqRes,
        settingsRes
      ] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/members'),
        fetch('/api/trainers'),
        fetch('/api/plans'),
        fetch('/api/attendance/trainers'),
        fetch('/api/attendance/members'),
        fetch('/api/payments'),
        fetch('/api/expenses'),
        fetch('/api/whatsapp/messages'),
        fetch('/api/enquiries'),
        fetch('/api/settings')
      ]);

      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (membersRes.ok) setMembers(await membersRes.json());
      if (trainersRes.ok) setTrainers(await trainersRes.json());
      if (plansRes.ok) setPlans(await plansRes.json());
      if (trainerAttRes.ok) setTrainerAttendance(await trainerAttRes.json());
      if (memberAttRes.ok) setMemberAttendance(await memberAttRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());
      if (expensesRes.ok) setExpenses(await expensesRes.json());
      if (waRes.ok) setWhatsappMessages(await waRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (settingsRes.ok) setGymSettings(await settingsRes.json());
    } catch (err) {
      console.error('Error fetching gym data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Sidebar navigation items for Gym Owner
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trainers', label: 'Trainers', icon: Dumbbell },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'memberships', label: 'Memberships', icon: Award },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'whatsapp', label: 'WhatsApp Automation', icon: MessageSquare, badge: 'AI' },
    { id: 'enquiries', label: 'Enquiries', icon: HelpCircle },
    { id: 'finance', label: 'Expenses & P&L', icon: TrendingDown },
    { id: 'settings', label: 'Gym Settings', icon: Settings }
  ];

  const handleOpenRenewModal = (member: MemberData) => {
    setRenewModalMember(member);
    setActiveTab('memberships');
  };

  const handleConvertToMember = (enquiry: EnquiryData) => {
    setActiveTab('members');
  };

  return (
    <div className="min-h-screen bg-[#090B0A] text-[#F5F7F2] flex flex-col selection:bg-[#C7FF3D] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenAddMember={() => {
          setCurrentView('app');
          setActiveTab('members');
        }}
        onOpenRecordPayment={() => {
          setCurrentView('app');
          setActiveTab('payments');
        }}
        onOpenQRScanner={() => {
          setCurrentView('app');
          setActiveTab('attendance');
        }}
      />

      {/* Main Content Router */}
      {currentView === 'landing' ? (
        <LandingPage
          onLaunchApp={() => {
            setCurrentView('app');
            setActiveTab('dashboard');
          }}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />
      ) : (
        /* GYM OPERATING SYSTEM VIEW */
        <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Collapsible / Responsive Dark Sidebar */}
          {currentRole === 'owner' && (
            <aside
              className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111512] border-r border-white/[0.08] p-4 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:w-60 lg:rounded-2xl lg:border lg:bg-[#111512]/90 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="space-y-6">
                {/* Mobile close button */}
                <div className="flex items-center justify-between lg:hidden pb-3 border-b border-white/5">
                  <span className="font-heading font-bold text-white text-sm">Navigation</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-[#A1A99E]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-[#C7FF3D] text-black font-bold shadow-md shadow-[#C7FF3D]/15'
                            : 'text-[#A1A99E] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#A1A99E] group-hover:text-white'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              isActive ? 'bg-black text-[#C7FF3D]' : 'bg-[#C7FF3D]/10 text-[#C7FF3D]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer Info */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#171C18] to-[#1E2620] border border-[#C7FF3D]/30 hover:border-[#C7FF3D] text-xs font-semibold text-white transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C7FF3D]" />
                  <span>FitFlow AI Assistant</span>
                </button>
                <div className="text-[10px] font-mono text-[#A1A99E] px-2">
                  System: Online • INR ₹
                </div>
              </div>
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Mobile Sidebar Toggle */}
            {currentRole === 'owner' && (
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#171C18] border border-white/10 text-xs text-white"
                >
                  <Menu className="w-4 h-4 text-[#C7FF3D]" />
                  <span>Menu</span>
                </button>
              </div>
            )}

            {/* Role-Based Content Render */}
            {currentRole === 'trainer' ? (
              <TrainerView
                trainers={trainers}
                members={members}
                attendance={trainerAttendance}
                onRefresh={fetchAllData}
              />
            ) : currentRole === 'staff' ? (
              <StaffView
                members={members}
                memberAttendance={memberAttendance}
                payments={payments}
                onOpenAddMember={() => setActiveTab('members')}
                onOpenRecordPayment={() => setActiveTab('payments')}
                onOpenQRScanner={() => setActiveTab('attendance')}
                onOpenRenewModal={handleOpenRenewModal}
              />
            ) : (
              /* Owner Views */
              <>
                {activeTab === 'dashboard' && (
                  <OwnerDashboard
                    data={dashboardData}
                    onRefresh={fetchAllData}
                    onNavigateTab={setActiveTab}
                    onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                    onOpenAddMember={() => setActiveTab('members')}
                    onOpenRecordPayment={() => setActiveTab('payments')}
                  />
                )}

                {activeTab === 'trainers' && (
                  <TrainerManagement
                    trainers={trainers}
                    members={members}
                    attendance={trainerAttendance}
                    currencySymbol={gymSettings?.currencySymbol || '₹'}
                    onRefresh={fetchAllData}
                  />
                )}

                {activeTab === 'members' && (
                  <MemberManagement
                    members={members}
                    plans={plans}
                    trainers={trainers}
                    currencySymbol={gymSettings?.currencySymbol || '₹'}
                    onRefresh={fetchAllData}
                    onOpenRenewModal={handleOpenRenewModal}
                  />
                )}

                {activeTab === 'memberships' && (
                  <MembershipPlans
                    plans={plans}
                    members={members}
                    currencySymbol={gymSettings?.currencySymbol || '₹'}
                    onRefresh={fetchAllData}
                    renewModalMember={renewModalMember}
                    onCloseRenewModal={() => setRenewModalMember(null)}
                  />
                )}

                {activeTab === 'attendance' && (
                  <AttendanceCenter
                    members={members}
                    trainers={trainers}
                    memberAttendance={memberAttendance}
                    trainerAttendance={trainerAttendance}
                    onRefresh={fetchAllData}
                  />
                )}

                {activeTab === 'payments' && (
                  <PaymentCenter
                    payments={payments}
                    members={members}
                    plans={plans}
                    currencySymbol={gymSettings?.currencySymbol || '₹'}
                    onRefresh={fetchAllData}
                  />
                )}

                {activeTab === 'whatsapp' && (
                  <WhatsAppAutomation
                    messages={whatsappMessages}
                    members={members}
                    gymSettings={gymSettings || dashboardData?.gym || ({} as any)}
                    onRefresh={fetchAllData}
                  />
                )}

                {activeTab === 'enquiries' && (
                  <EnquiryCRM
                    enquiries={enquiries}
                    currencySymbol={gymSettings?.currencySymbol || '₹'}
                    onRefresh={fetchAllData}
                    onConvertToMember={handleConvertToMember}
                  />
                )}

                {activeTab === 'finance' && (
                  <FinancialManagement
                    expenses={expenses}
                    payments={payments}
                    currencySymbol={gymSettings?.currencySymbol || '₹'}
                    onRefresh={fetchAllData}
                  />
                )}

                {activeTab === 'settings' && gymSettings && (
                  <GymSettings
                    gym={gymSettings}
                    onRefresh={fetchAllData}
                  />
                )}
              </>
            )}
          </main>
        </div>
      )}

      {/* Global FitFlow AI Assistant Drawer */}
      <FitFlowAIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        currencySymbol={gymSettings?.currencySymbol || '₹'}
      />
    </div>
  );
}
