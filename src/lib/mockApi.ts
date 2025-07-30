import { UserRole } from '@/types';

// Mock data imports
import usersData from '@/mock-data/users.json';
import startupsData from '@/mock-data/startups.json';
import roundsData from '@/mock-data/rounds.json';
import commitmentsData from '@/mock-data/commitments.json';
import evaluationsData from '@/mock-data/evaluations.json';

// Simulate API delay
const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  // Auth Methods
  static async login(email: string, password: string, role: UserRole) {
    await simulateDelay();
    
    const user = usersData.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );
    
    if (user) {
      // Create a simple mock JWT token (just base64 encoded user data)
      const mockPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };
      const token = btoa(JSON.stringify(mockPayload));
      
      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar
        }
      };
    }
    
    return {
      success: false,
      message: 'Geçersiz kullanıcı bilgileri'
    };
  }

  static async register(userData: any) {
    await simulateDelay();
    
    // Check if user already exists
    const existingUser = usersData.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'Bu e-posta adresi zaten kullanımda'
      };
    }
    
    // In real app, this would save to database
    return {
      success: true,
      message: 'Hesap başarıyla oluşturuldu'
    };
  }

  // User Methods
  static async getUser(userId: string) {
    await simulateDelay();
    const user = usersData.find(u => u.id === userId);
    return user || null;
  }

  static async getUsersByRole(role: UserRole) {
    await simulateDelay();
    return usersData.filter(u => u.role === role);
  }

  // Startup Methods
  static async getStartups() {
    await simulateDelay();
    return startupsData.map(startup => ({
      ...startup,
      user: usersData.find(u => u.id === startup.userId)
    }));
  }

  static async getStartup(id: string) {
    await simulateDelay();
    const startup = startupsData.find(s => s.id === id);
    if (startup) {
      return {
        ...startup,
        user: usersData.find(u => u.id === startup.userId)
      };
    }
    return null;
  }

  static async getStartupByUserId(userId: string) {
    await simulateDelay();
    const startup = startupsData.find(s => s.userId === userId);
    return startup || null;
  }

  // Round Methods
  static async getRounds() {
    await simulateDelay();
    return roundsData.map(round => ({
      ...round,
      startup: startupsData.find(s => s.id === round.startupId),
      commitments: commitmentsData.filter(c => c.roundId === round.id)
    }));
  }

  static async getRound(id: string) {
    await simulateDelay();
    const round = roundsData.find(r => r.id === id);
    if (round) {
      return {
        ...round,
        startup: startupsData.find(s => s.id === round.startupId),
        commitments: commitmentsData.filter(c => c.roundId === round.id)
      };
    }
    return null;
  }

  static async getRoundsByStartupId(startupId: string) {
    await simulateDelay();
    return roundsData
      .filter(r => r.startupId === startupId)
      .map(round => ({
        ...round,
        startup: startupsData.find(s => s.id === round.startupId),
        commitments: commitmentsData.filter(c => c.roundId === round.id)
      }));
  }

  static async getLiveRounds() {
    await simulateDelay();
    return roundsData
      .filter(r => r.status === 'live')
      .map(round => ({
        ...round,
        startup: startupsData.find(s => s.id === round.startupId),
        commitments: commitmentsData.filter(c => c.roundId === round.id)
      }));
  }

  // Commitment Methods
  static async getCommitments() {
    await simulateDelay();
    return commitmentsData.map(commitment => ({
      ...commitment,
      round: roundsData.find(r => r.id === commitment.roundId),
      investor: usersData.find(u => u.id === commitment.investorId)
    }));
  }

  static async getCommitmentsByInvestorId(investorId: string) {
    await simulateDelay();
    return commitmentsData
      .filter(c => c.investorId === investorId)
      .map(commitment => ({
        ...commitment,
        round: roundsData.find(r => r.id === commitment.roundId),
        startup: startupsData.find(s => s.id === roundsData.find(r => r.id === commitment.roundId)?.startupId)
      }));
  }

  static async getCommitmentsByRoundId(roundId: string) {
    await simulateDelay();
    return commitmentsData
      .filter(c => c.roundId === roundId)
      .map(commitment => ({
        ...commitment,
        investor: usersData.find(u => u.id === commitment.investorId)
      }));
  }

  static async createCommitment(commitmentData: any) {
    await simulateDelay();
    
    // Validate minimum investment
    const round = roundsData.find(r => r.id === commitmentData.roundId);
    if (!round) {
      return {
        success: false,
        message: 'Yatırım turu bulunamadı'
      };
    }

    if (commitmentData.amount < round.minInvestment) {
      return {
        success: false,
        message: `Minimum yatırım tutarı ${round.minInvestment.toLocaleString('tr-TR')}₺'dir`
      };
    }

    if (commitmentData.amount > round.maxInvestment) {
      return {
        success: false,
        message: `Maximum yatırım tutarı ${round.maxInvestment.toLocaleString('tr-TR')}₺'dir`
      };
    }

    // In real app, this would save to database
    return {
      success: true,
      message: 'Yatırım talebiniz başarıyla oluşturuldu',
      data: {
        id: `c${Date.now()}`,
        ...commitmentData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    };
  }

  // Evaluation Methods
  static async getEvaluations() {
    await simulateDelay();
    return evaluationsData.map(evaluation => ({
      ...evaluation,
      round: roundsData.find(r => r.id === evaluation.roundId),
      committee: usersData.find(u => u.id === evaluation.committeeId)
    }));
  }

  static async getEvaluationsByRoundId(roundId: string) {
    await simulateDelay();
    return evaluationsData
      .filter(e => e.roundId === roundId)
      .map(evaluation => ({
        ...evaluation,
        committee: usersData.find(u => u.id === evaluation.committeeId)
      }));
  }

  static async getEvaluationsByCommitteeId(committeeId: string) {
    await simulateDelay();
    return evaluationsData
      .filter(e => e.committeeId === committeeId)
      .map(evaluation => ({
        ...evaluation,
        round: roundsData.find(r => r.id === evaluation.roundId),
        startup: startupsData.find(s => s.id === roundsData.find(r => r.id === evaluation.roundId)?.startupId)
      }));
  }

  static async createEvaluation(evaluationData: any) {
    await simulateDelay();
    
    // Calculate scores
    const scores = evaluationData.scores;
    const totalScore = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0);
    const averageScore = totalScore / Object.keys(scores).length;

    // In real app, this would save to database
    return {
      success: true,
      message: 'Değerlendirme başarıyla kaydedildi',
      data: {
        id: `e${Date.now()}`,
        ...evaluationData,
        totalScore,
        averageScore: Math.round(averageScore * 100) / 100,
        isCompleted: true,
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  // Dashboard Stats Methods
  static async getDashboardStats(userId: string, role: UserRole) {
    await simulateDelay();
    
    switch (role) {
      case 'startup':
        const startup = startupsData.find(s => s.userId === userId);
        if (!startup) return null;
        
        const startupRounds = roundsData.filter(r => r.startupId === startup.id);
        const startupCommitments = commitmentsData.filter(c => 
          startupRounds.some(r => r.id === c.roundId)
        );
        
        return {
          totalRounds: startupRounds.length,
          activeRounds: startupRounds.filter(r => r.status === 'live').length,
          totalRaised: startupCommitments
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.amount, 0),
          totalInvestors: new Set(startupCommitments.map(c => c.investorId)).size,
        };

      case 'investor':
        const investorCommitments = commitmentsData.filter(c => c.investorId === userId);
        
        return {
          totalInvestments: investorCommitments.filter(c => c.status === 'paid').length,
          totalInvested: investorCommitments
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.amount, 0),
          activeCommitments: investorCommitments.filter(c => 
            c.status === 'pending' || c.status === 'approved'
          ).length,
          portfolioCount: new Set(
            investorCommitments
              .filter(c => c.status === 'paid')
              .map(c => c.roundId)
          ).size,
        };

      case 'admin':
      case 'super_admin':
        return {
          totalUsers: usersData.length,
          totalStartups: startupsData.length,
          totalInvestors: usersData.filter(u => u.role === 'investor').length,
          totalRounds: roundsData.length,
          activeRounds: roundsData.filter(r => r.status === 'live').length,
          totalInvestmentAmount: commitmentsData
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.amount, 0),
          averageInvestmentSize: commitmentsData
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + c.amount, 0) / 
            commitmentsData.filter(c => c.status === 'paid').length || 0,
          successfulExits: 0, // No exit data in mock
        };

      case 'committee':
        const committeeEvaluations = evaluationsData.filter(e => e.committeeId === userId);
        
        return {
          totalEvaluations: committeeEvaluations.length,
          completedEvaluations: committeeEvaluations.filter(e => e.isCompleted).length,
          averageScore: committeeEvaluations.length > 0 
            ? committeeEvaluations.reduce((sum, e) => sum + e.averageScore, 0) / committeeEvaluations.length
            : 0,
          pendingEvaluations: roundsData.filter(r => r.status === 'committee_review').length,
        };

      default:
        return null;
    }
  }

  // Recent Activities
  static async getRecentActivities(userId: string, role: UserRole) {
    await simulateDelay();
    
    // Mock recent activities based on user role
    const activities = [];
    
    switch (role) {
      case 'startup':
        activities.push(
          { 
            type: 'investment', 
            message: 'Ayşe D. 75.000₺ yatırım yaptı', 
            date: '2024-01-25T10:30:00Z',
            amount: 75000
          },
          { 
            type: 'document', 
            message: 'Mali tablolar onaylandı', 
            date: '2024-01-24T14:20:00Z' 
          },
          { 
            type: 'update', 
            message: 'Aylık rapor yayınlandı', 
            date: '2024-01-23T16:45:00Z' 
          }
        );
        break;
        
      case 'investor':
        activities.push(
          { 
            type: 'investment', 
            message: 'TechnoGrow Serie A turuna 100.000₺ yatırım yaptınız', 
            date: '2024-01-25T14:15:00Z',
            amount: 100000
          },
          { 
            type: 'document', 
            message: 'Sözleşme imzalandı', 
            date: '2024-01-24T11:30:00Z' 
          },
          { 
            type: 'notification', 
            message: 'Yeni yatırım fırsatı: FinanceAI', 
            date: '2024-01-23T09:20:00Z' 
          }
        );
        break;
        
      case 'admin':
        activities.push(
          { 
            type: 'approval', 
            message: 'TechnoGrow Serie A turu onaylandı', 
            date: '2024-01-25T16:00:00Z' 
          },
          { 
            type: 'evaluation', 
            message: 'FinanceAI komite değerlendirmesi tamamlandı', 
            date: '2024-01-24T13:45:00Z' 
          },
          { 
            type: 'document', 
            message: '3 yeni evrak onay bekliyor', 
            date: '2024-01-23T10:15:00Z' 
          }
        );
        break;
        
      case 'committee':
        activities.push(
          { 
            type: 'evaluation', 
            message: 'FinanceAI değerlendirmesi tamamlandı', 
            date: '2024-01-25T11:30:00Z' 
          },
          { 
            type: 'assignment', 
            message: 'Yeni değerlendirme atandı: EcoTech', 
            date: '2024-01-24T09:20:00Z' 
          },
          { 
            type: 'notification', 
            message: 'Değerlendirme süresi uzatıldı', 
            date: '2024-01-23T15:10:00Z' 
          }
        );
        break;
    }
    
    return activities;
  }

  // File upload simulation
  static async uploadFile(file: File, type: string) {
    await simulateDelay(1000); // Longer delay for file upload
    
    // Simulate file validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Desteklenmeyen dosya formatı'
      };
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: 'Dosya boyutu 10MB\'dan büyük olamaz'
      };
    }
    
    // Mock file URL
    const mockUrl = `/mock-files/${type}/${file.name}`;
    
    return {
      success: true,
      message: 'Dosya başarıyla yüklendi',
      data: {
        fileName: file.name,
        fileUrl: mockUrl,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      }
    };
  }
} 