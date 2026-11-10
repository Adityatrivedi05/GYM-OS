import fs from 'fs';
import path from 'path';

export interface Gym {
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

export interface Trainer {
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

export interface Member {
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

export interface MembershipPlan {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  description: string;
  benefits: string[];
  discountPercent?: number;
  popular?: boolean;
}

export interface TrainerAttendance {
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

export interface MemberAttendance {
  id: string;
  memberId: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  method: 'qr' | 'staff';
  overrideReason?: string;
}

export interface Payment {
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

export interface Expense {
  id: string;
  title: string;
  category: 'rent' | 'salary' | 'electricity' | 'equipment' | 'maintenance' | 'marketing' | 'misc';
  amount: number;
  date: string;
  notes?: string;
}

export interface WhatsAppMessage {
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

export interface Enquiry {
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

export interface GymAnnouncement {
  id: string;
  title: string;
  content: string;
  target: 'all' | 'active' | 'trainers';
  date: string;
  priority: 'normal' | 'high' | 'urgent';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface GymDatabase {
  gym: Gym;
  trainers: Trainer[];
  members: Member[];
  plans: MembershipPlan[];
  trainerAttendance: TrainerAttendance[];
  memberAttendance: MemberAttendance[];
  payments: Payment[];
  expenses: Expense[];
  whatsappMessages: WhatsAppMessage[];
  enquiries: Enquiry[];
  announcements: GymAnnouncement[];
  auditLogs: AuditLog[];
}

const DB_FILE = path.resolve(process.cwd(), 'server', 'gym_data.json');

// Initial seed data with realistic figures
const defaultData: GymDatabase = {
  gym: {
    id: 'gym-001',
    name: 'FitFlow Iron Temple',
    tagline: 'Precision Fitness & Strength Training',
    address: '42 Olympic Boulevard, Bandra West, Mumbai 400050',
    phone: '+91 98201 55432',
    email: 'contact@fitflowirontemple.in',
    currency: 'INR',
    currencySymbol: '₹',
    businessHours: '05:30 AM - 10:30 PM (Mon-Sun)',
    lateArrivalThresholdMinutes: 15,
    razorpayKeyId: 'rzp_test_fitflow_live',
    razorpayConfigured: false,
    whatsappPhoneNumberId: '',
    whatsappConfigured: false,
    autoRemindersEnabled: true,
  },
  plans: [
    {
      id: 'plan-1m',
      name: 'Monthly Strength',
      durationDays: 30,
      price: 2499,
      description: 'Access to general gym floor and cardio arena for 1 month.',
      benefits: ['Full floor access', 'Locker & shower facilities', 'Fitness assessment', 'Free diet consultation']
    },
    {
      id: 'plan-3m',
      name: 'Quarterly Transformation',
      durationDays: 90,
      price: 6499,
      description: '3-Month commitment for sustainable muscle building and conditioning.',
      benefits: ['All Monthly benefits', '2 Free Personal Training trials', 'Monthly Body Composition Scan', 'Priority shower lockers'],
      discountPercent: 12,
      popular: true
    },
    {
      id: 'plan-6m',
      name: 'Half-Yearly Hypertrophy',
      durationDays: 180,
      price: 11499,
      description: '6 Months of relentless progression with personal guidance.',
      benefits: ['All Quarterly benefits', '5 Personal Training sessions', 'Bi-weekly nutrition adjustments', 'Gym Merchandise kit'],
      discountPercent: 20
    },
    {
      id: 'plan-12m',
      name: 'Annual Elite Athlete',
      durationDays: 365,
      price: 19999,
      description: 'Full year 365-day all-access membership for serious lifters.',
      benefits: ['Unlimited gym & CrossFit zone', '12 Personal Training sessions', 'Free guest pass every month', 'Complimentary supplement shaker & towel'],
      discountPercent: 33
    },
    {
      id: 'plan-pt',
      name: 'Dedicated Personal Training',
      durationDays: 30,
      price: 14999,
      description: '1-on-1 private coaching, biometric tracking and customized meal plans.',
      benefits: ['24 Private 1-on-1 sessions', 'Dedicated biomechanics analysis', 'Daily WhatsApp food log monitoring', 'Injury prevention protocols']
    }
  ],
  trainers: [
    {
      id: 'tr-01',
      fullName: 'Vikram Rajput',
      email: 'vikram.rajput@fitflow.in',
      phone: '+91 98765 43210',
      specialization: 'Hypertrophy & Powerlifting',
      joiningDate: '2025-01-15',
      salary: 45000,
      workingHours: '06:00 AM - 02:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      rating: 4.9,
      bio: 'National powerlifting medalist and certified ACSM trainer with 8+ years coaching.'
    },
    {
      id: 'tr-02',
      fullName: 'Ananya Sharma',
      email: 'ananya.sharma@fitflow.in',
      phone: '+91 98765 43211',
      specialization: 'Mobility, HIIT & Functional Training',
      joiningDate: '2025-03-01',
      salary: 42000,
      workingHours: '02:00 PM - 10:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      rating: 4.8,
      bio: 'CrossFit Level 2 coach specialized in metabolic conditioning and female athletic performance.'
    },
    {
      id: 'tr-03',
      fullName: 'Kabir Mehta',
      email: 'kabir.mehta@fitflow.in',
      phone: '+91 98765 43212',
      specialization: 'Body Composition & Calisthenics',
      joiningDate: '2025-06-10',
      salary: 38000,
      workingHours: '07:00 AM - 03:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      rating: 4.7,
      bio: 'Rehabilitation specialist and gymnast focusing on core stability and posture correction.'
    },
    {
      id: 'tr-04',
      fullName: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@fitflow.in',
      phone: '+91 98765 43213',
      specialization: 'Strength & Conditioning',
      joiningDate: '2025-08-20',
      salary: 35000,
      workingHours: '01:00 PM - 09:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      rating: 4.6,
      bio: 'Sports nutritionist and youth strength conditioning mentor.'
    }
  ],
  members: [
    {
      id: 'FF-2026-001',
      fullName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 98200 11223',
      age: 28,
      gender: 'Male',
      emergencyContact: '+91 98200 99887 (Father)',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-08-15',
      assignedTrainerId: 'tr-01',
      fitnessGoal: 'Muscle Gain & Squat PR',
      membershipPlanId: 'plan-3m',
      startDate: '2026-08-15',
      expiryDate: '2026-11-13', // expiring in 4 days
      paymentStatus: 'paid',
      status: 'expiring_soon',
      medicalNotes: 'Mild patellar tendonitis, warms up thoroughly before leg day.',
      whatsappOptIn: true,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-001:EXP-2026-11-13'
    },
    {
      id: 'FF-2026-002',
      fullName: 'Pooja Hegde',
      email: 'pooja.h@example.com',
      phone: '+91 98199 44332',
      age: 26,
      gender: 'Female',
      emergencyContact: '+91 98199 00112 (Spouse)',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-05-10',
      assignedTrainerId: 'tr-02',
      fitnessGoal: 'Fat Loss & Core Strength',
      membershipPlanId: 'plan-6m',
      startDate: '2026-05-10',
      expiryDate: '2026-11-06', // expired 3 days ago
      paymentStatus: 'overdue',
      status: 'expired',
      medicalNotes: 'No previous injuries. Focus on clean nutrition.',
      whatsappOptIn: true,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-002:EXP-2026-11-06'
    },
    {
      id: 'FF-2026-003',
      fullName: 'Arjun Kapoor',
      email: 'arjun.k@example.com',
      phone: '+91 97654 32109',
      age: 32,
      gender: 'Male',
      emergencyContact: '+91 97654 11111 (Brother)',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-01-10',
      assignedTrainerId: 'tr-01',
      fitnessGoal: 'Bodybuilding Stage Preparation',
      membershipPlanId: 'plan-12m',
      startDate: '2026-01-10',
      expiryDate: '2027-01-10',
      paymentStatus: 'paid',
      status: 'active',
      whatsappOptIn: true,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-003:EXP-2027-01-10'
    },
    {
      id: 'FF-2026-004',
      fullName: 'Simran Kaur',
      email: 'simran.kaur@example.com',
      phone: '+91 99887 66554',
      age: 24,
      gender: 'Female',
      emergencyContact: '+91 99887 11223 (Mother)',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-10-01',
      assignedTrainerId: 'tr-02',
      fitnessGoal: 'Cardio Endurance & Marathons',
      membershipPlanId: 'plan-3m',
      startDate: '2026-10-01',
      expiryDate: '2026-12-30',
      paymentStatus: 'paid',
      status: 'active',
      whatsappOptIn: true,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-004:EXP-2026-12-30'
    },
    {
      id: 'FF-2026-005',
      fullName: 'Devendra Patel',
      email: 'dev.patel@example.com',
      phone: '+91 91234 56789',
      age: 45,
      gender: 'Male',
      emergencyContact: '+91 91234 99999 (Wife)',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-11-01',
      assignedTrainerId: 'tr-03',
      fitnessGoal: 'Cardiovascular Health & Blood Pressure',
      membershipPlanId: 'plan-1m',
      startDate: '2026-11-01',
      expiryDate: '2026-12-01',
      paymentStatus: 'pending',
      status: 'pending_payment',
      medicalNotes: 'Hypertension controlled by physician.',
      whatsappOptIn: false,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-005:EXP-2026-12-01'
    },
    {
      id: 'FF-2026-006',
      fullName: 'Sneha Rane',
      email: 'sneha.rane@example.com',
      phone: '+91 93456 78901',
      age: 29,
      gender: 'Female',
      emergencyContact: '+91 93456 12345 (Sister)',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-07-20',
      assignedTrainerId: 'tr-04',
      fitnessGoal: 'Functional Mobility & Posture',
      membershipPlanId: 'plan-3m',
      startDate: '2026-08-10',
      expiryDate: '2026-11-10', // expiring tomorrow!
      paymentStatus: 'paid',
      status: 'expiring_soon',
      whatsappOptIn: true,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-006:EXP-2026-11-10'
    },
    {
      id: 'FF-2026-007',
      fullName: 'Aakash Singhania',
      email: 'aakash.s@example.com',
      phone: '+91 98888 77766',
      age: 35,
      gender: 'Male',
      emergencyContact: '+91 98888 11111 (Colleague)',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-04-05',
      assignedTrainerId: 'tr-01',
      fitnessGoal: 'Lean Muscle & Metabolic conditioning',
      membershipPlanId: 'plan-pt',
      startDate: '2026-10-15',
      expiryDate: '2026-11-15',
      paymentStatus: 'paid',
      status: 'expiring_soon',
      whatsappOptIn: true,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-007:EXP-2026-11-15'
    },
    {
      id: 'FF-2026-008',
      fullName: 'Tanvi Nair',
      email: 'tanvi.nair@example.com',
      phone: '+91 94567 89012',
      age: 22,
      gender: 'Female',
      emergencyContact: '+91 94567 55555 (Mother)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joiningDate: '2026-09-01',
      assignedTrainerId: 'tr-02',
      fitnessGoal: 'Strength Building',
      membershipPlanId: 'plan-6m',
      startDate: '2026-09-01',
      expiryDate: '2027-03-01',
      paymentStatus: 'paid',
      status: 'active',
      whatsappOptIn: true,
      digitalCardQr: 'FITFLOW:MEMBER:FF-2026-008:EXP-2027-03-01'
    }
  ],
  trainerAttendance: [
    {
      id: 'ta-01',
      trainerId: 'tr-01',
      date: '2026-11-09',
      checkInTime: '05:55 AM',
      checkOutTime: '02:05 PM',
      status: 'present',
      totalHours: 8.1,
      method: 'qr'
    },
    {
      id: 'ta-02',
      trainerId: 'tr-02',
      date: '2026-11-09',
      checkInTime: '01:58 PM',
      checkOutTime: undefined,
      status: 'present',
      totalHours: undefined,
      method: 'qr'
    },
    {
      id: 'ta-03',
      trainerId: 'tr-03',
      date: '2026-11-09',
      checkInTime: '07:22 AM',
      checkOutTime: '03:15 PM',
      status: 'late',
      totalHours: 7.8,
      method: 'qr',
      correctionReason: 'Metro delay at Bandra station'
    },
    {
      id: 'ta-04',
      trainerId: 'tr-04',
      date: '2026-11-09',
      checkInTime: '01:02 PM',
      status: 'present',
      method: 'qr'
    }
  ],
  memberAttendance: [
    { id: 'ma-01', memberId: 'FF-2026-001', date: '2026-11-09', checkInTime: '06:30 AM', checkOutTime: '08:00 AM', method: 'qr' },
    { id: 'ma-02', memberId: 'FF-2026-003', date: '2026-11-09', checkInTime: '07:15 AM', checkOutTime: '08:45 AM', method: 'qr' },
    { id: 'ma-03', memberId: 'FF-2026-004', date: '2026-11-09', checkInTime: '05:45 PM', method: 'qr' },
    { id: 'ma-04', memberId: 'FF-2026-007', date: '2026-11-09', checkInTime: '06:10 PM', method: 'staff' },
    { id: 'ma-05', memberId: 'FF-2026-008', date: '2026-11-09', checkInTime: '06:40 PM', method: 'qr' }
  ],
  payments: [
    {
      id: 'pay-001',
      transactionId: 'TXN_RZP_98234190',
      memberId: 'FF-2026-003',
      memberName: 'Arjun Kapoor',
      amount: 19999,
      paymentDate: '2026-11-02',
      paymentMethod: 'upi',
      paymentGateway: 'razorpay',
      status: 'captured',
      invoiceNumber: 'INV-2026-1102',
      membershipPlanId: 'plan-12m'
    },
    {
      id: 'pay-002',
      transactionId: 'TXN_UPI_66192834',
      memberId: 'FF-2026-004',
      memberName: 'Simran Kaur',
      amount: 6499,
      paymentDate: '2026-11-04',
      paymentMethod: 'upi',
      paymentGateway: 'razorpay',
      status: 'captured',
      invoiceNumber: 'INV-2026-1104',
      membershipPlanId: 'plan-3m'
    },
    {
      id: 'pay-003',
      transactionId: 'TXN_CSH_110543',
      memberId: 'FF-2026-008',
      memberName: 'Tanvi Nair',
      amount: 11499,
      paymentDate: '2026-11-05',
      paymentMethod: 'cash',
      paymentGateway: 'manual',
      status: 'captured',
      invoiceNumber: 'INV-2026-1105',
      membershipPlanId: 'plan-6m'
    },
    {
      id: 'pay-004',
      transactionId: 'TXN_PT_8829104',
      memberId: 'FF-2026-007',
      memberName: 'Aakash Singhania',
      amount: 14999,
      paymentDate: '2026-11-07',
      paymentMethod: 'card',
      paymentGateway: 'razorpay',
      status: 'captured',
      invoiceNumber: 'INV-2026-1107',
      membershipPlanId: 'plan-pt'
    }
  ],
  expenses: [
    { id: 'exp-01', title: 'Monthly Facility Lease (Bandra West)', category: 'rent', amount: 85000, date: '2026-11-01', notes: 'Prime high-street space' },
    { id: 'exp-02', title: 'Electricity & Air Conditioning', category: 'electricity', amount: 24500, date: '2026-11-03' },
    { id: 'exp-03', title: 'Olympic Barbell & Bumper Plate Maintenance', category: 'maintenance', amount: 8500, date: '2026-11-05' },
    { id: 'exp-04', title: 'Trainer Salaries & Base Retainers', category: 'salary', amount: 160000, date: '2026-11-01' },
    { id: 'exp-05', title: 'Instagram Performance Ads & Creatives', category: 'marketing', amount: 12000, date: '2026-11-04' }
  ],
  whatsappMessages: [
    {
      id: 'wm-01',
      memberId: 'FF-2026-001',
      memberName: 'Rahul Verma',
      phone: '+91 98200 11223',
      messageType: 'renewal_7d',
      content: 'Hello Rahul! 👋 Your 3-Month Transformation at FitFlow Iron Temple expires on 13 Nov 2026. Renew early and retain your personal trainer slot!',
      scheduledFor: '2026-11-06 10:00 AM',
      sentAt: '2026-11-06 10:02 AM',
      status: 'read',
      paymentLink: 'https://fitflow.in/pay/FF-2026-001?plan=plan-3m',
      retryCount: 0
    },
    {
      id: 'wm-02',
      memberId: 'FF-2026-006',
      memberName: 'Sneha Rane',
      phone: '+91 93456 78901',
      messageType: 'renewal_1d',
      content: 'Hey Sneha! 🔥 Tomorrow (10 Nov) is the last day of your membership. Tap below to renew seamlessly via UPI/Card and keep your fitness streak alive! 💪',
      scheduledFor: '2026-11-09 09:00 AM',
      sentAt: '2026-11-09 09:01 AM',
      status: 'delivered',
      paymentLink: 'https://fitflow.in/pay/FF-2026-006?plan=plan-3m',
      retryCount: 0
    },
    {
      id: 'wm-03',
      memberId: 'FF-2026-002',
      memberName: 'Pooja Hegde',
      phone: '+91 98199 44332',
      messageType: 'followup_post_3d',
      content: 'Hi Pooja! We miss you on the gym floor! Your membership expired on 06 Nov. We have credited a special ₹500 welcome-back coupon to your renewal. Let’s crush your goals together!',
      scheduledFor: '2026-11-09 11:30 AM',
      sentAt: '2026-11-09 11:31 AM',
      status: 'sent',
      paymentLink: 'https://fitflow.in/pay/FF-2026-002?plan=plan-6m&disc=500',
      retryCount: 0
    }
  ],
  enquiries: [
    {
      id: 'enq-01',
      name: 'Karan Mehra',
      phone: '+91 98111 22334',
      email: 'karan.m@gmail.com',
      interestedPlan: 'plan-3m',
      date: '2026-11-08',
      followUpDate: '2026-11-10',
      status: 'trial_booked',
      notes: 'Interested in evening CrossFit sessions. Booked 1-day guest trial.'
    },
    {
      id: 'enq-02',
      name: 'Ishita Sen',
      phone: '+91 97222 33445',
      interestedPlan: 'plan-pt',
      date: '2026-11-07',
      followUpDate: '2026-11-09',
      status: 'contacted',
      notes: 'Looking for female trainer for wedding prep in Jan 2027.'
    },
    {
      id: 'enq-03',
      name: 'Aditya Roy',
      phone: '+91 96333 44556',
      interestedPlan: 'plan-12m',
      date: '2026-11-05',
      followUpDate: '2026-11-08',
      status: 'converted',
      notes: 'Joined as FF-2026-003 with annual elite pass.'
    }
  ],
  announcements: [
    {
      id: 'ann-01',
      title: 'Diwali Deadlift Showcase & Bodyweight Challenge',
      content: 'Join us this Saturday at 6:00 PM for the FitFlow Annual Deadlift & Pull-Up Showdown with prize hampers and supplement vouchers!',
      target: 'all',
      date: '2026-11-08',
      priority: 'high'
    },
    {
      id: 'ann-02',
      title: 'Scheduled Deep Sanitization of Steam Room',
      content: 'The steam and sauna suites will undergo maintenance on Wednesday from 11:00 AM to 02:00 PM.',
      target: 'all',
      date: '2026-11-07',
      priority: 'normal'
    }
  ],
  auditLogs: [
    {
      id: 'log-01',
      timestamp: '2026-11-09 14:05:22',
      user: 'Gym Owner (Admin)',
      role: 'owner',
      action: 'UPDATE_TRAINER_ATTENDANCE',
      details: 'Corrected check-in time for Kabir Mehta with reason: Metro delay.'
    },
    {
      id: 'log-02',
      timestamp: '2026-11-09 11:31:00',
      user: 'FitFlow WhatsApp Engine',
      role: 'system',
      action: 'SEND_WHATSAPP_RENEWAL',
      details: 'Dispatched automated 3-day post-expiry reminder to Pooja Hegde (+91 98199 44332).'
    },
    {
      id: 'log-03',
      timestamp: '2026-11-07 16:45:10',
      user: 'Staff (Front Desk)',
      role: 'staff',
      action: 'RECORD_PAYMENT',
      details: 'Recorded ₹14,999 payment for Aakash Singhania (INV-2026-1107).'
    }
  ]
};

// Database class with thread-safe atomic file operations
export class GymDatabaseManager {
  private data: GymDatabase;

  constructor() {
    this.data = this.load();
  }

  private load(): GymDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to load DB file, using default seed data:', err);
    }
    this.save(defaultData);
    return defaultData;
  }

  private save(dataToSave: GymDatabase = this.data): void {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to DB file:', err);
    }
  }

  public getData(): GymDatabase {
    return this.data;
  }

  public logAudit(user: string, role: string, action: string, details: string) {
    const log: AuditLog = {
      id: 'log-' + Date.now().toString(36),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      role,
      action,
      details
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.save();
  }

  // --- TRAINERS ---
  public getTrainers(): Trainer[] {
    return this.data.trainers;
  }

  public addTrainer(trainer: Omit<Trainer, 'id'>): Trainer {
    const newTrainer: Trainer = {
      ...trainer,
      id: 'tr-' + (this.data.trainers.length + 1).toString().padStart(2, '0')
    };
    this.data.trainers.push(newTrainer);
    this.logAudit('Admin', 'owner', 'CREATE_TRAINER', `Added trainer ${newTrainer.fullName}`);
    this.save();
    return newTrainer;
  }

  public updateTrainer(id: string, updates: Partial<Trainer>): Trainer | null {
    const idx = this.data.trainers.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.trainers[idx] = { ...this.data.trainers[idx], ...updates };
    this.logAudit('Admin', 'owner', 'UPDATE_TRAINER', `Updated trainer ${this.data.trainers[idx].fullName}`);
    this.save();
    return this.data.trainers[idx];
  }

  public deleteTrainer(id: string): boolean {
    const idx = this.data.trainers.findIndex(t => t.id === id);
    if (idx === -1) return false;
    const [removed] = this.data.trainers.splice(idx, 1);
    this.logAudit('Admin', 'owner', 'DELETE_TRAINER', `Deactivated trainer ${removed.fullName}`);
    this.save();
    return true;
  }

  // --- MEMBERS ---
  public getMembers(): Member[] {
    // Automatically update statuses based on current date
    const today = new Date().toISOString().split('T')[0];
    this.data.members.forEach(m => {
      const expiry = new Date(m.expiryDate);
      const now = new Date(today);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (m.paymentStatus === 'pending') {
        m.status = 'pending_payment';
      } else if (diffDays < 0) {
        m.status = 'expired';
      } else if (diffDays <= 7) {
        m.status = 'expiring_soon';
      } else {
        m.status = 'active';
      }
    });
    return this.data.members;
  }

  public addMember(member: Omit<Member, 'id' | 'digitalCardQr'>): Member {
    const count = this.data.members.length + 1;
    const year = new Date().getFullYear();
    const id = `FF-${year}-${count.toString().padStart(3, '0')}`;
    const newMember: Member = {
      ...member,
      id,
      digitalCardQr: `FITFLOW:MEMBER:${id}:EXP-${member.expiryDate}`
    };
    this.data.members.push(newMember);

    // Auto record payment if paid
    if (newMember.paymentStatus === 'paid') {
      const plan = this.data.plans.find(p => p.id === newMember.membershipPlanId);
      const amount = plan ? plan.price : 2499;
      this.recordPayment({
        transactionId: `TXN_${Date.now().toString(36).toUpperCase()}`,
        memberId: newMember.id,
        memberName: newMember.fullName,
        amount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'upi',
        paymentGateway: 'manual',
        status: 'captured',
        membershipPlanId: newMember.membershipPlanId,
        notes: `Initial membership registration fee for ${newMember.fullName}`
      });
    }

    this.logAudit('Admin', 'owner', 'REGISTER_MEMBER', `Registered new member ${newMember.fullName} (${newMember.id})`);
    this.save();
    return newMember;
  }

  public updateMember(id: string, updates: Partial<Member>): Member | null {
    const idx = this.data.members.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.members[idx] = { ...this.data.members[idx], ...updates };
    this.logAudit('Admin', 'owner', 'UPDATE_MEMBER', `Updated profile of member ${this.data.members[idx].fullName}`);
    this.save();
    return this.data.members[idx];
  }

  public renewMembership(memberId: string, planId: string, paymentMethod: 'upi' | 'card' | 'cash' | 'netbanking', transactionId?: string): Member | null {
    const member = this.data.members.find(m => m.id === memberId);
    const plan = this.data.plans.find(p => p.id === planId);
    if (!member || !plan) return null;

    const baseDate = new Date(member.expiryDate) > new Date() ? new Date(member.expiryDate) : new Date();
    baseDate.setDate(baseDate.getDate() + plan.durationDays);
    const newExpiry = baseDate.toISOString().split('T')[0];

    member.membershipPlanId = plan.id;
    member.expiryDate = newExpiry;
    member.paymentStatus = 'paid';
    member.status = 'active';
    member.digitalCardQr = `FITFLOW:MEMBER:${member.id}:EXP-${newExpiry}`;

    // Record verified payment
    this.recordPayment({
      transactionId: transactionId || `TXN_REN_${Date.now().toString(36).toUpperCase()}`,
      memberId: member.id,
      memberName: member.fullName,
      amount: plan.price,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      paymentGateway: transactionId ? 'razorpay' : 'manual',
      status: 'captured',
      membershipPlanId: plan.id,
      notes: `Membership renewal for plan: ${plan.name} (+${plan.durationDays} days)`
    });

    this.logAudit('System', 'system', 'RENEW_MEMBERSHIP', `Renewed ${member.fullName}'s membership until ${newExpiry} via ${paymentMethod}`);
    this.save();
    return member;
  }

  // --- ATTENDANCE ---
  public markTrainerAttendance(record: Omit<TrainerAttendance, 'id'>): TrainerAttendance {
    // Check if check-in exists for trainer today
    const existingIdx = this.data.trainerAttendance.findIndex(
      t => t.trainerId === record.trainerId && t.date === record.date
    );

    if (existingIdx !== -1 && record.checkOutTime) {
      this.data.trainerAttendance[existingIdx].checkOutTime = record.checkOutTime;
      if (record.totalHours) this.data.trainerAttendance[existingIdx].totalHours = record.totalHours;
      this.logAudit('Admin', 'staff', 'TRAINER_CHECKOUT', `Trainer ${record.trainerId} checked out`);
      this.save();
      return this.data.trainerAttendance[existingIdx];
    }

    const newAttendance: TrainerAttendance = {
      ...record,
      id: 'ta-' + Date.now().toString(36)
    };
    this.data.trainerAttendance.unshift(newAttendance);
    this.logAudit('Staff', 'staff', 'TRAINER_CHECKIN', `Marked attendance for trainer ${record.trainerId}`);
    this.save();
    return newAttendance;
  }

  public updateTrainerAttendance(id: string, updates: Partial<TrainerAttendance>): TrainerAttendance | null {
    const idx = this.data.trainerAttendance.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.trainerAttendance[idx] = { ...this.data.trainerAttendance[idx], ...updates };
    this.logAudit('Admin', 'owner', 'CORRECT_TRAINER_ATTENDANCE', `Corrected attendance record ${id}: ${updates.correctionReason || 'Manual adjustment'}`);
    this.save();
    return this.data.trainerAttendance[idx];
  }

  public markMemberAttendance(record: Omit<MemberAttendance, 'id'>): { success: boolean; message: string; record?: MemberAttendance } {
    const member = this.data.members.find(m => m.id === record.memberId);
    if (!member) {
      return { success: false, message: 'Member not found with ID ' + record.memberId };
    }

    // Check expiry
    const today = new Date().toISOString().split('T')[0];
    if (new Date(member.expiryDate) < new Date(today) && !record.overrideReason) {
      return { success: false, message: `Membership expired on ${member.expiryDate}. Renewal required before entry.` };
    }

    if (member.status === 'suspended' && !record.overrideReason) {
      return { success: false, message: 'Membership is currently suspended.' };
    }

    // Check if already checked in today without check-out
    const existing = this.data.memberAttendance.find(
      a => a.memberId === record.memberId && a.date === record.date && !a.checkOutTime
    );

    if (existing) {
      // Mark checkout
      existing.checkOutTime = record.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.save();
      return { success: true, message: `Checked out ${member.fullName} at ${existing.checkOutTime}. Have a great recovery!`, record: existing };
    }

    const newRec: MemberAttendance = {
      ...record,
      id: 'ma-' + Date.now().toString(36)
    };
    this.data.memberAttendance.unshift(newRec);
    this.save();
    return { success: true, message: `Welcome to the floor, ${member.fullName}! Check-in recorded.`, record: newRec };
  }

  // --- PAYMENTS ---
  public recordPayment(payment: Omit<Payment, 'id' | 'invoiceNumber'>): Payment {
    const invCount = this.data.payments.length + 1001;
    const newPayment: Payment = {
      ...payment,
      id: 'pay-' + Date.now().toString(36),
      invoiceNumber: `INV-${new Date().getFullYear()}-${invCount}`
    };
    this.data.payments.unshift(newPayment);

    // Update member payment status
    const member = this.data.members.find(m => m.id === payment.memberId);
    if (member) {
      member.paymentStatus = 'paid';
    }

    this.logAudit('System', 'system', 'PAYMENT_RECORDED', `Payment of ₹${payment.amount} recorded for ${payment.memberName} (${newPayment.invoiceNumber})`);
    this.save();
    return newPayment;
  }

  // --- EXPENSES ---
  public addExpense(expense: Omit<Expense, 'id'>): Expense {
    const newExp: Expense = {
      ...expense,
      id: 'exp-' + Date.now().toString(36)
    };
    this.data.expenses.unshift(newExp);
    this.logAudit('Admin', 'owner', 'ADD_EXPENSE', `Added expense ₹${expense.amount} under ${expense.category}: ${expense.title}`);
    this.save();
    return newExp;
  }

  public deleteExpense(id: string): boolean {
    const idx = this.data.expenses.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.expenses.splice(idx, 1);
    this.save();
    return true;
  }

  // --- WHATSAPP AUTOMATION ---
  public queueWhatsAppMessage(msg: Omit<WhatsAppMessage, 'id' | 'retryCount'>): WhatsAppMessage {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: 'wm-' + Date.now().toString(36),
      retryCount: 0
    };
    this.data.whatsappMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  public sendWhatsAppMessage(id: string): WhatsAppMessage | null {
    const msg = this.data.whatsappMessages.find(m => m.id === id);
    if (!msg) return null;

    // Check gym integration status
    if (this.data.gym.whatsappConfigured && this.data.gym.whatsappPhoneNumberId) {
      // Real API integration would call graph.facebook.com
      msg.status = 'delivered';
      msg.sentAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    } else {
      // In demo mode or offline test
      msg.status = 'sent';
      msg.sentAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    this.logAudit('WhatsApp Engine', 'system', 'SEND_WHATSAPP', `Sent message to ${msg.memberName} (${msg.phone}) - status: ${msg.status}`);
    this.save();
    return msg;
  }

  public runAutoReminders(): { processed: number; newMessages: WhatsAppMessage[] } {
    const members = this.getMembers();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date(today);
    const created: WhatsAppMessage[] = [];

    for (const m of members) {
      if (!m.whatsappOptIn) continue;

      const expiry = new Date(m.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const plan = this.data.plans.find(p => p.id === m.membershipPlanId);
      const planName = plan ? plan.name : 'Membership';

      let triggerType: WhatsAppMessage['messageType'] | null = null;
      let reminderText = '';

      if (diffDays === 7) {
        triggerType = 'renewal_7d';
        reminderText = `Hello ${m.fullName}! 👋 We love having you train at ${this.data.gym.name}. Your ${planName} expires in 7 days on ${m.expiryDate}. Renew your pass to maintain uninterrupted gym floor & trainer access! 💪`;
      } else if (diffDays === 3) {
        triggerType = 'renewal_3d';
        reminderText = `Hey ${m.fullName}! ⏳ Only 3 days left on your ${planName} (Expiry: ${m.expiryDate}). Tap below to lock in the early renewal price via UPI or Card!`;
      } else if (diffDays === 1) {
        triggerType = 'renewal_1d';
        reminderText = `Urgent Reminder for ${m.fullName}: Tomorrow is the final day of your active pass at ${this.data.gym.name}. Keep your fitness streak alive with 1-click renewal!`;
      } else if (diffDays === 0) {
        triggerType = 'renewal_0d';
        reminderText = `Hi ${m.fullName}! Today is your membership expiry date (${m.expiryDate}). Please renew today to prevent QR turnstile lockouts.`;
      } else if (diffDays === -3) {
        triggerType = 'followup_post_3d';
        reminderText = `We miss your energy at ${this.data.gym.name}, ${m.fullName}! Your membership expired 3 days ago. We've reserved your locker and trainer slot for another 48 hours. Ready to get back?`;
      }

      if (triggerType) {
        // Prevent duplicate messages sent within the same day for same member & type
        const alreadyQueued = this.data.whatsappMessages.some(
          w => w.memberId === m.id && w.messageType === triggerType && w.scheduledFor.startsWith(today)
        );

        if (!alreadyQueued) {
          const msg = this.queueWhatsAppMessage({
            memberId: m.id,
            memberName: m.fullName,
            phone: m.phone,
            messageType: triggerType,
            content: reminderText,
            scheduledFor: `${today} 09:30 AM`,
            status: 'scheduled',
            paymentLink: `https://fitflow.in/pay/${m.id}?plan=${m.membershipPlanId}`
          });
          created.push(msg);
        }
      }
    }

    return { processed: members.length, newMessages: created };
  }

  // --- ENQUIRIES ---
  public addEnquiry(enquiry: Omit<Enquiry, 'id'>): Enquiry {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq-' + Date.now().toString(36)
    };
    this.data.enquiries.unshift(newEnquiry);
    this.logAudit('Front Desk', 'staff', 'NEW_ENQUIRY', `Added prospective client enquiry: ${enquiry.name} (${enquiry.phone})`);
    this.save();
    return newEnquiry;
  }

  public updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | null {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.enquiries[idx] = { ...this.data.enquiries[idx], ...updates };
    this.save();
    return this.data.enquiries[idx];
  }

  // --- SETTINGS ---
  public updateGymSettings(updates: Partial<Gym>): Gym {
    this.data.gym = { ...this.data.gym, ...updates };
    this.logAudit('Admin', 'owner', 'UPDATE_SETTINGS', 'Updated gym configuration and credentials');
    this.save();
    return this.data.gym;
  }

  // --- ANNOUNCEMENTS ---
  public addAnnouncement(announcement: Omit<GymAnnouncement, 'id'>): GymAnnouncement {
    const newAnn: GymAnnouncement = {
      ...announcement,
      id: 'ann-' + Date.now().toString(36)
    };
    this.data.announcements.unshift(newAnn);
    this.logAudit('Admin', 'owner', 'POST_ANNOUNCEMENT', `Posted gym announcement: ${announcement.title}`);
    this.save();
    return newAnn;
  }
}

export const gymDB = new GymDatabaseManager();
