export type UserRole = 'owner' | 'trainer' | 'staff';

export interface GymSettingsData {
  id: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol: string;
  businessHours: string;
  lateArrivalThresholdMinutes: number;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  razorpayConfigured: boolean;
  whatsappPhoneNumberId?: string;
  whatsappAccessToken?: string;
  whatsappConfigured: boolean;
  autoRemindersEnabled: boolean;
}

export interface TrainerData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  joiningDate: string;
  salary: number;
  workingHours: string;
  avatarUrl: string;
  status: 'active' | 'inactive';
  rating: number;
  bio: string;
}

export interface MemberData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  emergencyContact: string;
  avatarUrl: string;
  joiningDate: string;
  assignedTrainerId: string;
  fitnessGoal: string;
  membershipPlanId: string;
  startDate: string;
  expiryDate: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_payment' | 'suspended';
  medicalNotes?: string;
  whatsappOptIn: boolean;
  digitalCardQr: string;
}

export interface MembershipPlanData {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description: string;
  benefits: string[];
  discountPercent?: number;
  popular?: boolean;
}

export interface TrainerAttendanceData {
  id: string;
  trainerId: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'late' | 'absent';
  totalHours?: number;
  method: 'qr' | 'manual';
  correctionReason?: string;
  auditedBy?: string;
}

export interface MemberAttendanceData {
  id: string;
  memberId: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  method: 'qr' | 'staff';
  overrideReason?: string;
}

export interface PaymentData {
  id: string;
  transactionId: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'upi' | 'card' | 'cash' | 'netbanking';
  paymentGateway: 'razorpay' | 'manual';
  status: 'captured' | 'pending' | 'failed' | 'refunded';
  invoiceNumber: string;
  membershipPlanId: string;
  notes?: string;
}

export interface ExpenseData {
  id: string;
  title: string;
  category: 'rent' | 'salary' | 'electricity' | 'equipment' | 'maintenance' | 'marketing' | 'misc';
  amount: number;
  date: string;
  notes?: string;
}

export interface WhatsAppMessageData {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  messageType: 'renewal_7d' | 'renewal_3d' | 'renewal_1d' | 'renewal_0d' | 'followup_post_3d' | 'welcome' | 'payment_receipt' | 'announcement';
  content: string;
  scheduledFor: string;
  sentAt?: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed';
  paymentLink?: string;
  retryCount: number;
}

export interface EnquiryData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  interestedPlan: string;
  date: string;
  followUpDate: string;
  status: 'new' | 'contacted' | 'trial_booked' | 'converted' | 'lost';
  notes?: string;
}

export interface GymAnnouncementData {
  id: string;
  title: string;
  content: string;
  target: 'all' | 'active' | 'trainers';
  date: string;
  priority: 'normal' | 'high' | 'urgent';
}

export interface AuditLogData {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface DashboardStatsResponse {
  gym: GymSettingsData;
  stats: {
    totalMembers: number;
    activeMembers: number;
    expiringSoon: number;
    expiredMembers: number;
    pendingPaymentMembers: number;
    newMembersThisMonth: number;
    totalTrainers: number;
    trainersPresent: number;
    trainersLate: number;
    membersCurrentlyInGym: number;
    totalRevenue: number;
    pendingFees: number;
    totalExpenses: number;
    netProfit: number;
    onlinePayments: number;
    cashPayments: number;
    upiPayments: number;
    renewalRate: number;
  };
  charts: {
    monthlyRevenueTrend: Array<{ month: string; revenue: number; expenses: number; members: number }>;
    planDistribution: Array<{ name: string; count: number; price: number }>;
    trainerDistribution: Array<{ id: string; name: string; specialization: string; clientsCount: number; rating: number }>;
    hourlyAttendance: Array<{ hour: string; count: number }>;
  };
}
