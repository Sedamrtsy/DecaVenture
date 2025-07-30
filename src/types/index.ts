// Kullanıcı rolleri
export type UserRole = 'admin' | 'investor' | 'startup' | 'committee' | 'super_admin';

// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Yatırımcı tipi (bireysel/kurumsal)
export interface Investor extends User {
  role: 'investor';
  investorType: 'individual' | 'corporate';
  taxNumber?: string;
  companyName?: string;
  investmentCapacity: number;
  score: number;
  badges: string[];
  completedInvestments: number;
  totalInvestmentAmount: number;
}

// Girişimci tipi
export interface Startup extends User {
  role: 'startup';
  companyName: string;
  foundingDate: string;
  sector: string;
  taxNumber: string;
  description: string;
  website?: string;
  logo?: string;
}

// Admin tipi
export interface Admin extends User {
  role: 'admin' | 'super_admin';
  permissions: string[];
}

// Komite üyesi tipi
export interface CommitteeMember extends User {
  role: 'committee';
  expertise: string[];
  evaluationCount: number;
  averageScore: number;
}

// Versiyonlu doküman
export interface VersionedDocument {
  id: string;
  version: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  isActive: boolean;
}

// İş planı
export interface BusinessPlan {
  id: string;
  startupId: string;
  title: string;
  description: string;
  documents: VersionedDocument[];
  currentVersion: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Yatırım turu durumları
export type RoundStatus = 'draft' | 'committee_review' | 'live' | 'closed' | 'cancelled';

// Yatırım turu
export interface Round {
  id: string;
  startupId: string;
  startup?: Startup;
  title: string;
  description: string;
  targetAmount: number;
  minInvestment: number;
  maxInvestment: number;
  valuationPre: number;
  valuationPost: number;
  status: RoundStatus;
  startDate?: string;
  endDate?: string;
  currentAmount: number;
  investorCount: number;
  documents: string[];
  businessPlanId: string;
  businessPlan?: BusinessPlan;
  commitments: Commitment[];
  platformFeePercentage: number;
  createdAt: string;
  updatedAt: string;
}

// Commitment tipi
export type CommitmentType = 'soft' | 'hard';

// Yatırım commitment
export interface Commitment {
  id: string;
  roundId: string;
  round?: Round;
  investorId: string;
  investor?: Investor;
  amount: number;
  type: CommitmentType;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  contractSigned: boolean;
  receiptUploaded: boolean;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Komite değerlendirmesi skorları (17 kriter)
export interface EvaluationScores {
  teamExperience: number; // Takım deneyimi
  marketSize: number; // Pazar büyüklüğü
  productInnovation: number; // Ürün inovasyonu
  businessModel: number; // İş modeli
  financialProjections: number; // Finansal projeksiyonlar
  competitiveAdvantage: number; // Rekabet avantajı
  marketTraction: number; // Pazar çekiciliği
  scalability: number; // Ölçeklenebilirlik
  riskAssessment: number; // Risk değerlendirmesi
  exitStrategy: number; // Çıkış stratejisi
  legalStructure: number; // Hukuki yapı
  intellectualProperty: number; // Fikri mülkiyet
  customerValidation: number; // Müşteri doğrulaması
  revenueModel: number; // Gelir modeli
  fundingHistory: number; // Geçmiş fonlama
  governanceStructure: number; // Yönetişim yapısı
  sustainabilityImpact: number; // Sürdürülebilirlik etkisi
}

// Komite değerlendirmesi
export interface CommitteeEvaluation {
  id: string;
  roundId: string;
  round?: Round;
  committeeId: string;
  committee?: CommitteeMember;
  scores: EvaluationScores;
  totalScore: number;
  averageScore: number;
  decision: 'approve' | 'revise' | 'reject';
  comments: string;
  isCompleted: boolean;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Ön talep
export interface PreDemand {
  id: string;
  roundId: string;
  round?: Round;
  investorId: string;
  investor?: Investor;
  estimatedAmount: number;
  interests: string[];
  createdAt: string;
}

// Exit bilgisi
export interface Exit {
  id: string;
  roundId: string;
  round?: Round;
  exitType: 'acquisition' | 'ipo' | 'secondary_sale' | 'liquidation';
  exitAmount: number;
  exitDate: string;
  description: string;
  profitDistributions: ProfitDistribution[];
  createdAt: string;
  updatedAt: string;
}

// Kar payı dağılımı
export interface ProfitDistribution {
  id: string;
  exitId: string;
  commitmentId: string;
  commitment?: Commitment;
  distributionAmount: number;
  distributionPercentage: number;
  status: 'pending' | 'paid';
  paidAt?: string;
}

// Bildirim tipi
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Bildirim şablonu
export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  emailTemplate: string;
  smsTemplate?: string;
  inAppTemplate: string;
  triggers: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard istatistikleri
export interface DashboardStats {
  totalUsers: number;
  totalStartups: number;
  totalInvestors: number;
  totalRounds: number;
  activeRounds: number;
  totalInvestmentAmount: number;
  averageInvestmentSize: number;
  successfulExits: number;
}

// API Response tipi
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form validation types
export interface LoginForm {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterForm {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  // Girişimci için ek alanlar
  companyName?: string;
  sector?: string;
  taxNumber?: string;
  // Yatırımcı için ek alanlar
  investorType?: 'individual' | 'corporate';
  investmentCapacity?: number;
  kvkkAccepted: boolean;
  termsAccepted: boolean;
} 