'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  FileText, 
  Users, 
  DollarSign, 
  Plus,
  Eye,
  Edit,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { MockApiService } from '@/lib/mockApi';

interface DashboardData {
  stats: any;
  rounds: any[];
  startup: any;
  recentActivities: any[];
}

export default function StartupDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || authLoading) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First get startup info to get the startup ID
        const startup = await MockApiService.getStartupByUserId(user.userId);
        const startupId = startup?.id || 's1'; // fallback to s1
        
        // Parallel fetch remaining data
        const [stats, rounds, activities] = await Promise.all([
          MockApiService.getDashboardStats(user.userId, user.role),
          MockApiService.getRoundsByStartupId(startupId),
          MockApiService.getRecentActivities(user.userId, user.role)
        ]);

        setData({
          stats: stats || { totalRounds: 0, activeRounds: 0, totalRaised: 0, totalInvestors: 0 },
          rounds: rounds || [],
          startup: startup,
          recentActivities: activities || []
        });
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="success">Canlı</Badge>;
      case 'closed':
        return <Badge variant="secondary">Kapandı</Badge>;
      case 'draft':
        return <Badge variant="warning">Taslak</Badge>;
      case 'approved':
        return <Badge variant="success">Onaylandı</Badge>;
      case 'pending':
        return <Badge variant="warning">Beklemede</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Reddedildi</Badge>;
      case 'committee_review':
        return <Badge variant="warning">Komite Değerlendirmesi</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <DashboardLayout title="Girişimci Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Yetkilendirme kontrol ediliyor...</span>
        </div>
      </DashboardLayout>
    );
  }

  // User not authenticated
  if (!user) {
    return (
      <DashboardLayout title="Girişimci Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Lütfen giriş yapın.</p>
          <Link href="/auth/login">
            <Button>Giriş Yap</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Data loading state
  if (loading) {
    return (
      <DashboardLayout title="Girişimci Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Dashboard yükleniyor...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="Girişimci Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600">Veri yüklenirken bir hata oluştu.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, rounds, startup, recentActivities } = data;

  return (
    <DashboardLayout title="Girişimci Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Tur</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRounds}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Tur</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeRounds}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Yatırım</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRaised)}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yatırımcı</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInvestors}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Yatırım Turları */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Yatırım Turlarım</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Tur
                </Button>
              </div>

              <div className="space-y-4">
                {rounds.map((round) => {
                  const progress = Math.round((round.currentAmount / round.targetAmount) * 100);
                  
                  return (
                    <div key={round.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{round.title}</h3>
                        {getStatusBadge(round.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Hedef</p>
                          <p className="font-medium">{formatCurrency(round.targetAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Toplanan</p>
                          <p className="font-medium">{formatCurrency(round.currentAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Yatırımcı</p>
                          <p className="font-medium">{round.investorCount}</p>
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
                        <p className="text-sm text-gray-600">
                          {round.startDate && formatDate(round.startDate)} 
                          {round.endDate && ` - ${formatDate(round.endDate)}`}
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {rounds.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Henüz yatırım turunuz bulunmuyor.</p>
                    <Button className="mt-4" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      İlk Turunuzu Oluşturun
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Şirket Bilgileri */}
            {startup && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Şirket Bilgileri</h2>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{startup.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{startup.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sektör:</span>
                        <span className="text-sm font-medium">{startup.sector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Kuruluş:</span>
                        <span className="text-sm font-medium">{formatDate(startup.foundingDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Çalışan:</span>
                        <span className="text-sm font-medium">{startup.employeeCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Takım</h4>
                    <div className="space-y-2">
                      {startup.team?.map((member: any, index: number) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-gray-600">{member.position}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                      {activity.type === 'document' && <FileText className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'update' && <AlertCircle className="w-4 h-4 text-primary-600" />}
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
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Yatırım Turu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Evrak Yükle
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Güncelleme Paylaş
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Rapor Görüntüle
                </Button>
              </div>
            </div>

            {/* İş Planı Durumu */}
            {startup?.businessPlan && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">İş Planı</h3>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                </div>

                <div className="space-y-3">
                  {startup.businessPlan
                    .filter((bp: any) => bp.isActive)
                    .map((bp: any) => (
                      <div key={bp.id} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">v{bp.version}</span>
                            {getStatusBadge(bp.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(bp.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 