import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Clock, 
  DollarSign, 
  Building2,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kitle Fonlama Platformu - Girişimciler ve Yatırımcıları Buluşturan Platform',
  description: 'Girişimciler projelerini hayata geçirmek için yatırım bulur, yatırımcılar gelecek vaat eden startuplara yatırım yapar. Güvenli ve şeffaf kitle fonlama platformu.',
  keywords: ['kitle fonlama', 'crowdfunding', 'startup yatırımı', 'angel yatırım', 'girişim sermayesi'],
  openGraph: {
    title: 'Kitle Fonlama Platformu',
    description: 'Girişimciler ve yatırımcıları buluşturan güvenli platform',
    type: 'website',
  },
};

const features = [
  {
    icon: Shield,
    title: 'Güvenli Yatırım',
    description: 'Tüm girişimler komite tarafından değerlendirilir ve onaylanır'
  },
  {
    icon: Users,
    title: 'Uzman Komite',
    description: '17 kritere göre detaylı değerlendirme ve skorlama'
  },
  {
    icon: TrendingUp,
    title: 'Şeffaf Süreç',
    description: 'Tüm süreçler şeffaf ve takip edilebilir'
  },
  {
    icon: Clock,
    title: 'Hızlı Süreç',
    description: 'Kolay başvuru ve değerlendirme süreci'
  },
];

const stats = [
  { label: 'Aktif Girişim', value: '150+' },
  { label: 'Toplam Yatırım', value: '50M₺' },
  { label: 'Yatırımcı Sayısı', value: '2.500+' },
  { label: 'Başarılı Exit', value: '25' },
];

const benefits = {
  startup: [
    'Kolay başvuru süreci',
    'Uzman komite değerlendirmesi',
    'Geniş yatırımcı ağına erişim',
    'Mentoring desteği',
    'Platform ücreti sadece başarılı fonlamada'
  ],
  investor: [
    'Seçilmiş yatırım fırsatları',
    'Detaylı due diligence',
    'Çeşitlendirilmiş portföy',
    'Şeffaf süreç takibi',
    'Exit imkanları'
  ]
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Kitle Fonlama</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Giriş Yap</Button>
              </Link>
              <Link href="/register">
                <Button>Kayıt Ol</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Geleceğin Girişimlerine
              <span className="text-primary-600 block">Yatırım Yapın</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Türkiye&apos;nin güvenilir kitle fonlama platformunda girişimciler 
              projelerini hayata geçiriyor, yatırımcılar geleceğin şirketlerine erken aşamada yatırım yapıyor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register?role=startup">
                <Button size="lg" className="w-full sm:w-auto">
                  Girişimci Olarak Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register?role=investor">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Yatırımcı Olarak Katıl
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden Bizimle Çalışmalısınız?
            </h2>
            <p className="text-xl text-gray-600">
              Güvenli, şeffaf ve uzman değerlendirmeli yatırım süreci
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Girişimciler İçin */}
            <div className="card">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Girişimciler İçin
                </h3>
                <p className="text-gray-600">
                  Projenizi hayata geçirmek için ihtiyacınız olan yatırımı bulun
                </p>
              </div>
              
              <ul className="space-y-3">
                {benefits.startup.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link href="/register?role=startup">
                  <Button className="w-full">
                    Girişimci Olarak Başla
                  </Button>
                </Link>
              </div>
            </div>

            {/* Yatırımcılar İçin */}
            <div className="card">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Yatırımcılar İçin
                </h3>
                <p className="text-gray-600">
                  Geleceğin şirketlerine erken aşamada yatırım yapın
                </p>
              </div>
              
              <ul className="space-y-3">
                {benefits.investor.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link href="/register?role=investor">
                  <Button variant="outline" className="w-full">
                    Yatırımcı Olarak Katıl
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Girişimciler ve yatırımcılar için fırsatlar sizi bekliyor
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Ücretsiz Kayıt Ol
              </Button>
            </Link>
            <Link href="/rounds">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary-600">
                Yatırım Fırsatlarını Gör
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Kitle Fonlama</span>
              </div>
              <p className="text-gray-400">
                Türkiye&apos;nin güvenilir kitle fonlama platformu
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/how-it-works" className="hover:text-white">Nasıl Çalışır</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Ücretlendirme</Link></li>
                <li><Link href="/success-stories" className="hover:text-white">Başarı Hikayeleri</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Yardım Merkezi</Link></li>
                <li><Link href="/contact" className="hover:text-white">İletişim</Link></li>
                <li><Link href="/faq" className="hover:text-white">SSS</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="hover:text-white">Kullanım Şartları</Link></li>
                <li><Link href="/kvkk" className="hover:text-white">KVKK</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kitle Fonlama Platformu. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 