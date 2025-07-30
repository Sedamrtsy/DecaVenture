'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Plus,
  Eye,
  Calendar,
  Award,
  BarChart3,
  ArrowUpRight,
  Building,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { MockApiService } from '@/lib/mockApi';

interface DashboardData {
  stats: any;
  commitments: any[];
  liveRounds: any[];
  recentActivities: any[];
}

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Parallel fetch all data
        const [stats, commitments, liveRounds, activities] = await Promise.all([
          MockApiService.getDashboardStats(user.userId, user.role),
          MockApiService.getCommitmentsByInvestorId(user.userId),
          MockApiService.getLiveRounds(),
          MockApiService.getRecentActivities(user.userId, user.role)
        ]);

        setData({
          stats: stats || { totalInvestments: 0, totalInvested: 0, activeCommitments: 0, portfolioCount: 0 },
          commitments: commitments || [],
          liveRounds: liveRounds || [],
          recentActivities: activities || []
        });
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Ödendi</Badge>;
      case 'approved':
        return <Badge variant="warning">Onaylandı</Badge>;
      case 'pending':
        return <Badge variant="warning">Beklemede</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Reddedildi</Badge>;
      case 'live':
        return <Badge variant="success">Canlı</Badge>;
      case 'closed':
        return <Badge variant="secondary">Kapandı</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Yatırımcı Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="Yatırımcı Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600">Veri yüklenirken bir hata oluştu.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, commitments, liveRounds, recentActivities } = data;

  return (
    <DashboardLayout title="Yatırımcı Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Yatırım</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInvestments}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yatırılan Tutar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalInvested)}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Taahhüt</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCommitments}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portföy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.portfolioCount}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Aktif Yatırım Fırsatları */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Aktif Yatırım Fırsatları</h2>
                <Link href="/investor/opportunities">
                  <Button variant="outline" size="sm">
                    Tümünü Gör
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {liveRounds.slice(0, 3).map((round) => {
                  const progress = Math.round((round.currentAmount / round.targetAmount) * 100);
                  
                  return (
                    <div key={round.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Building className="w-4 h-4 text-gray-400" />
                            <h3 className="font-medium text-gray-900">{round.startup?.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{round.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{round.startup?.sector}</span>
                            <span>•</span>
                            <span>{round.investorCount} yatırımcı</span>
                          </div>
                        </div>
                        {getStatusBadge(round.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Hedef</p>
                          <p className="font-medium">{formatCurrency(round.targetAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Toplanan</p>
                          <p className="font-medium">{formatCurrency(round.currentAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">İlerleme</p>
                          <p className="font-medium">%{progress}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="progress-bar mb-4">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <span>Min: {formatCurrency(round.minInvestment)}</span>
                          <span className="mx-2">•</span>
                          <span>Max: {formatCurrency(round.maxInvestment)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            Yatırım Yap
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {liveRounds.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Şu anda aktif yatırım fırsatı bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Yatırım Taahhütlerim */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Yatırım Taahhütlerim</h2>
                <Link href="/investor/commitments">
                  <Button variant="outline" size="sm">
                    Tümünü Gör
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {commitments.slice(0, 5).map((commitment) => (
                  <div key={commitment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{commitment.startup?.name || commitment.round?.title}</span>
                        <Badge variant={commitment.type === 'hard' ? 'default' : 'secondary'}>
                          {commitment.type === 'hard' ? 'Kesin' : 'Yumuşak'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{formatCurrency(commitment.amount)}</span>
                        <span>•</span>
                        <span>{formatDate(commitment.createdAt)}</span>
                      </div>
                    </div>
                    {getStatusBadge(commitment.status)}
                  </div>
                ))}

                {commitments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Henüz yatırım taahhüdünüz bulunmuyor.</p>
                    <Link href="/investor/opportunities">
                      <Button className="mt-4" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Yatırım Fırsatlarını Keşfet
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            {/* Son Aktiviteler */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Son Aktiviteler</h3>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'investment' && <DollarSign className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'document' && <Building className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'notification' && <Users className="w-4 h-4 text-primary-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-600">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hızlı Eylemler */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Hızlı Eylemler</h3>
              
              <div className="space-y-3">
                <Link href="/investor/opportunities">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Yatırım Fırsatları
                  </Button>
                </Link>
                <Link href="/investor/portfolio">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Portföy Analizi
                  </Button>
                </Link>
                <Link href="/investor/commitments">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Taahhütlerim
                  </Button>
                </Link>
                <Link href="/investor/documents">
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="w-4 h-4 mr-2" />
                    Evraklarım
                  </Button>
                </Link>
              </div>
            </div>

            {/* Yatırım İstatistikleri */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Yatırım İstatistikleri</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ortalama Yatırım</span>
                  <span className="font-medium">
                    {stats.totalInvestments > 0 
                      ? formatCurrency(Math.round(stats.totalInvested / stats.totalInvestments))
                      : formatCurrency(0)
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Başarı Oranı</span>
                  <span className="font-medium">%85</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">En Çok Yatırım</span>
                  <span className="font-medium">Teknoloji</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Yatırımcı Puanı</span>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">850</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Trends */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Piyasa Trendleri</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fintech</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+15%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AgriTech</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+12%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">E-ticaret</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+8%</span>
                  </div>
                </div>

                <Link href="/market-insights" className="block">
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Detaylı Analiz
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 