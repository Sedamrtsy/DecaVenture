# Kitle Fonlama Platformu

Girişimciler ve yatırımcıları buluşturan, güvenli ve şeffaf kitle fonlama platformu. Next.js 14, TypeScript ve TailwindCSS ile geliştirilmiştir.

## 🚀 Özellikler

### Genel
- **Modern UI/UX**: TailwindCSS ile responsive tasarım
- **SEO Optimizasyonu**: Next.js app router ile dinamik meta taglar
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Modüler Yapı**: Kolay genişletilebilir ve sürdürülebilir kod

### Kullanıcı Rolleri
- **Girişimci**: Yatırım turu açma, iş planı yükleme, güncelleme paylaşma
- **Yatırımcı**: Soft/hard commitment, portföy takibi, yatırım süreci
- **Admin**: Başvuru yönetimi, komite atama, süreç kontrolü
- **Komite Üyesi**: 17 kritere göre değerlendirme, skorlama
- **Super Admin**: Platform yönetimi, yetki kontrolü

### Ana Modüller
- **Auth Sistemi**: JWT tabanlı güvenli kimlik doğrulama
- **Dashboard**: Rol bazlı özelleştirilmiş paneller
- **Yatırım Yönetimi**: Tur oluşturma, takip, yatırımcı etkileşimi
- **Doküman Yönetimi**: Evrak yükleme, onay süreçleri (AWS S3 entegrasyonu)
- **Komite Sistemi**: Değerlendirme, skorlama, karar verme
- **Bildirim Sistemi**: E-posta, SMS ve platform içi bildirimler
- **Grafik & Raporlama**: Dashboard istatistikleri ve analitik

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 14**: React framework (App Router)
- **TypeScript**: Tip güvenliği
- **TailwindCSS**: Utility-first CSS framework
- **React Hook Form**: Form yönetimi
- **Zod**: Şema validasyonu
- **Recharts**: Grafik ve veri görselleştirme
- **Lucide React**: Icon kütüphanesi

### Backend Entegrasyonlar (Opsiyonel)
- **AWS S3**: Dosya depolama
- **E-imza API**: Sözleşme imzalama
- **Mailgun**: E-posta gönderimi
- **MongoDB**: Veritabanı (API tarafında)

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth sayfaları
│   ├── startup/           # Girişimci paneli
│   ├── investor/          # Yatırımcı paneli
│   ├── admin/             # Admin paneli
│   ├── committee/         # Komite paneli
│   └── globals.css        # Global stiller
├── components/            # React bileşenleri
│   ├── ui/               # Temel UI bileşenleri
│   ├── layout/           # Layout bileşenleri
│   ├── forms/            # Form bileşenleri
│   └── charts/           # Grafik bileşenleri
├── hooks/                # Custom React hooks
├── lib/                  # Yardımcı kütüphaneler
├── types/                # TypeScript tip tanımları
└── utils/                # Utility fonksiyonlar
```

## 🚀 Kurulum

### 1. Proje Klonlama
```bash
git clone <repository-url>
cd kitle-fonlama-platform
```

### 2. Bağımlılıkları Yükleme
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 🔧 Konfigürasyon

### Environment Variables
`.env.local` dosyası oluşturun:

```env
# JWT Secret
JWT_SECRET=your-secret-key

# Database
MONGODB_URI=mongodb://localhost:27017/kitle-fonlama

# AWS S3 (Opsiyonel)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-west-1
AWS_S3_BUCKET=your-bucket-name

# Email (Opsiyonel)
MAILGUN_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-domain

# E-imza API (Opsiyonel)
ESIGN_API_URL=https://api.example.com
ESIGN_API_KEY=your-api-key
```

## 👥 Kullanıcı Rolleri ve Yetkiler

### Girişimci (Startup)
- ✅ İş planı oluşturma ve güncelleme
- ✅ Yatırım turu başlatma
- ✅ Evrak yükleme
- ✅ Güncelleme paylaşma
- ✅ Yatırımcı etkileşimi
- ✅ Rapor görüntüleme

### Yatırımcı (Investor)
- ✅ Yatırım fırsatlarını görme
- ✅ Soft/Hard commitment verme
- ✅ Sözleşme imzalama
- ✅ Dekont yükleme
- ✅ Portföy takibi
- ✅ Exit bilgilerini görme

### Admin
- ✅ Girişim başvuru yönetimi
- ✅ Komite atama
- ✅ Tur yayına alma
- ✅ Evrak kontrolü
- ✅ Bildirim yönetimi
- ✅ Dashboard analitik

### Komite Üyesi (Committee)
- ✅ Atanan girişimleri görme
- ✅ 17 kritere göre skorlama
- ✅ Değerlendirme raporu yazma
- ✅ Onay/Red/Revizyon kararı

### Super Admin
- ✅ Tüm admin yetkileri
- ✅ Kullanıcı yetki yönetimi
- ✅ Platform ayarları
- ✅ Sistem konfigürasyonu

## 📊 17 Kriter Değerlendirme Sistemi

Komite üyeleri girişimleri şu kriterlere göre değerlendirir:

1. **Takım Deneyimi** - Kurucuların geçmiş deneyimi
2. **Pazar Büyüklüğü** - Hedef pazarın potansiyeli
3. **Ürün İnovasyonu** - Ürünün yenilik derecesi
4. **İş Modeli** - Gelir modelinin sürdürülebilirliği
5. **Finansal Projeksiyonlar** - Gerçekçilik ve tutarlılık
6. **Rekabet Avantajı** - Farklılaştırıcı faktörler
7. **Pazar Çekiciliği** - Müşteri talep analizi
8. **Ölçeklenebilirlik** - Büyüme potansiyeli
9. **Risk Değerlendirmesi** - Potansiyel riskler
10. **Çıkış Stratejisi** - Exit planlaması
11. **Hukuki Yapı** - Şirket yapısı ve uyumluluk
12. **Fikri Mülkiyet** - Patent, marka hakları
13. **Müşteri Doğrulaması** - Pazar testleri
14. **Gelir Modeli** - Monetizasyon stratejisi
15. **Geçmiş Fonlama** - Önceki yatırım geçmişi
16. **Yönetişim Yapısı** - Şirket yönetimi
17. **Sürdürülebilirlik Etkisi** - Çevresel/sosyal etki

Her kriter 1-10 arası puanlanır ve ortalama skor hesaplanır.

## 🎨 UI/UX Özellikleri

### Responsive Tasarım
- Mobile-first yaklaşım
- Tablet ve desktop optimizasyonu
- Esnek grid sistemi

### Erişilebilirlik
- WCAG 2.1 uyumluluğu
- Klavye navigasyonu
- Screen reader desteği
- Yüksek kontrast renk paleti

### Performans
- Next.js Image optimizasyonu
- Lazy loading
- Code splitting
- SSR/SSG optimizasyonu

## 📱 Sayfa Yapısı

### Genel Sayfalar
- `/` - Ana sayfa (SEO optimized)
- `/login` - Giriş sayfası
- `/register` - Kayıt sayfası

### Girişimci Sayfaları
- `/startup/dashboard` - Ana panel
- `/startup/rounds` - Yatırım turları
- `/startup/business-plan` - İş planı yönetimi
- `/startup/documents` - Evrak yönetimi
- `/startup/updates` - Güncelleme paylaşımı

### Yatırımcı Sayfaları
- `/investor/dashboard` - Ana panel
- `/investor/rounds` - Yatırım fırsatları
- `/investor/portfolio` - Portföy yönetimi
- `/investor/commitments` - Yatırım takibi

### Admin Sayfaları
- `/admin/dashboard` - Yönetim paneli
- `/admin/startups` - Girişim yönetimi
- `/admin/rounds` - Tur yönetimi
- `/admin/committee` - Komite yönetimi
- `/admin/notifications` - Bildirim yönetimi

### Komite Sayfaları
- `/committee/dashboard` - Komite paneli
- `/committee/evaluations` - Değerlendirmeler

## 🔐 Güvenlik

### Authentication
- JWT token tabanlı auth
- Secure cookie storage
- Role-based access control (RBAC)
- Session management

### Data Protection
- Input validation (Zod)
- XSS protection
- CSRF protection
- SQL injection prevention

### File Upload Security
- File type validation
- Size limits
- Malware scanning
- Secure storage (AWS S3)

## 🧪 Test

```bash
# Unit testler
npm run test

# E2E testler
npm run test:e2e

# Coverage raporu
npm run test:coverage
```

## 📈 Performans Optimizasyonu

### Next.js Özellikleri
- Static Site Generation (SSG)
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)
- API Routes optimizasyonu

### Bundle Optimizasyonu
- Tree shaking
- Code splitting
- Dynamic imports
- Bundle analyzer

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker (Opsiyonel)
```bash
docker build -t kitle-fonlama .
docker run -p 3000:3000 kitle-fonlama
```

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

## 🤝 Katkı Sağlama

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Geliştirici**: [info@example.com]
- **Proje Linki**: [https://github.com/example/kitle-fonlama-platform]
- **Demo**: [https://kitle-fonlama-demo.vercel.app]

---

**Not**: Bu proje Takasbank entegrasyonu içermez. Gerçek bir üretim ortamında kullanmadan önce gerekli finansal ve yasal entegrasyonları tamamlamanız gerekmektedir. 