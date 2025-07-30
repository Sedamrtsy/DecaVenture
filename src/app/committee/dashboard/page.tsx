'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Star, 
  Target,
  Eye,
  Edit,
  ArrowUpRight,
  Building,
  AlertCircle,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import { formatDate } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { MockApiService } from '@/lib/mockApi';

interface DashboardData {
  stats: any;
  evaluations: any[];
  pendingRounds: any[];
  recentActivities: any[];
}

export default function CommitteeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Parallel fetch all data
        const [stats, evaluations, rounds, activities] = await Promise.all([
          MockApiService.getDashboardStats(user.userId, user.role),
          MockApiService.getEvaluationsByCommitteeId(user.userId),
          MockApiService.getRounds(),
          MockApiService.getRecentActivities(user.userId, user.role)
        ]);

        // Filter pending rounds
        const pendingRounds = rounds.filter((r: any) => r.status === 'committee_review');

        setData({
          stats: stats || { totalEvaluations: 0, completedEvaluations: 0, averageScore: 0, pendingEvaluations: 0 },
          evaluations: evaluations || [],
          pendingRounds: pendingRounds || [],
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

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'approve':
        return <Badge variant="success">Onaylandı</Badge>;
      case 'reject':
        return <Badge variant="destructive">Reddedildi</Badge>;
      case 'revise':
        return <Badge variant="warning">Revizyon</Badge>;
      default:
        return <Badge variant="secondary">Beklemede</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'committee_review':
        return <Badge variant="warning">Komite Değerlendirmesi</Badge>;
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
      <DashboardLayout title="Komite Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout title="Komite Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600">Veri yüklenirken bir hata oluştu.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, evaluations, pendingRounds, recentActivities } = data;

  return (
    <DashboardLayout title="Komite Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Değerlendirme</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvaluations}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedEvaluations}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageScore?.toFixed(1) || '0.0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingEvaluations}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Değerlendirme Bekleyen Turlar */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Değerlendirme Bekleyen Turlar</h2>
                <Badge variant="warning" className="px-3 py-1">
                  {pendingRounds.length} Bekliyor
                </Badge>
              </div>

              <div className="space-y-4">
                {pendingRounds.map((round) => (
                  <div key={round.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <h3 className="font-medium text-gray-900">{round.startup?.name}</h3>
                          {getStatusBadge(round.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{round.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Hedef: {round.targetAmount?.toLocaleString('tr-TR')}₺</span>
                          <span>•</span>
                          <span>Sektör: {round.startup?.sector}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        Başvuru: {formatDate(round.createdAt)}
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Link href={`/committee/evaluation/${round.id}`}>
                          <Button size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Değerlendir
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {pendingRounds.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Şu anda değerlendirme bekleyen tur bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Son Değerlendirmeler */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Son Değerlendirmelerim</h2>
                <Link href="/committee/evaluations">
                  <Button variant="outline" size="sm">
                    Tümünü Gör
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {evaluations.slice(0, 5).map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {evaluation.startup?.name || evaluation.round?.title}
                        </span>
                        {getDecisionBadge(evaluation.decision)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Puan: {evaluation.averageScore?.toFixed(1)}/10</span>
                        <span>•</span>
                        <span>{formatDate(evaluation.submittedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{evaluation.averageScore?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}

                {evaluations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Henüz değerlendirmeniz bulunmuyor.</p>
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
                      {activity.type === 'evaluation' && <FileText className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'assignment' && <Target className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'notification' && <AlertCircle className="w-4 h-4 text-primary-600" />}
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
                <Link href="/committee/pending">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Bekleyen Değerlendirmeler
                  </Button>
                </Link>
                <Link href="/committee/evaluations">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Tüm Değerlendirmelerim
                  </Button>
                </Link>
                <Link href="/committee/criteria">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Değerlendirme Kriterleri
                  </Button>
                </Link>
                <Link href="/committee/guidelines">
                  <Button variant="outline" className="w-full justify-start">
                    <Building className="w-4 h-4 mr-2" />
                    Değerlendirme Kılavuzu
                  </Button>
                </Link>
              </div>
            </div>

            {/* Değerlendirme İstatistikleri */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Değerlendirme İstatistikleri</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Onay Oranı</span>
                  <span className="font-medium">
                    {evaluations.length > 0 
                      ? Math.round((evaluations.filter(e => e.decision === 'approve').length / evaluations.length) * 100)
                      : 0
                    }%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revizyon Oranı</span>
                  <span className="font-medium">
                    {evaluations.length > 0 
                      ? Math.round((evaluations.filter(e => e.decision === 'revise').length / evaluations.length) * 100)
                      : 0
                    }%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">En Yüksek Puan</span>
                  <span className="font-medium">
                    {evaluations.length > 0 
                      ? Math.max(...evaluations.map(e => e.averageScore)).toFixed(1)
                      : '0.0'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Değerlendirme Süresi</span>
                  <span className="font-medium">2.3 gün</span>
                </div>
              </div>
            </div>

            {/* Değerlendirme Kriterleri Özeti */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Değerlendirme Kriterleri</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ekip Deneyimi</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pazar Büyüklüğü</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ürün İnovasyonu</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">İş Modeli</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="text-center pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">+13 kriter daha</span>
                </div>
                
                <Link href="/committee/criteria">
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    Tüm Kriterleri Gör
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