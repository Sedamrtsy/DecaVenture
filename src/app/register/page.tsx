'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/types';

const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  passwordConfirm: z.string().min(6, 'Şifre onayı gereklidir'),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  role: z.enum(['startup', 'investor']),
  phone: z.string().optional(),
  // Girişimci için
  companyName: z.string().optional(),
  sector: z.string().optional(),
  taxNumber: z.string().optional(),
  // Yatırımcı için
  investorType: z.enum(['individual', 'corporate']).optional(),
  investmentCapacity: z.number().optional(),
  kvkkAccepted: z.boolean().refine(val => val === true, 'KVKK onayı zorunludur'),
  termsAccepted: z.boolean().refine(val => val === true, 'Kullanım şartları onayı zorunludur'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Şifreler eşleşmiyor",
  path: ["passwordConfirm"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedRole = searchParams.get('role') as UserRole;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: preSelectedRole === 'startup' || preSelectedRole === 'investor' ? preSelectedRole : 'investor',
      investorType: 'individual',
    },
  });

  const selectedRole = watch('role');
  const selectedInvestorType = watch('investorType');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      
      // API'ye kayıt isteği gönder
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt olurken bir hata oluştu');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Kayıt olurken bir hata oluştu');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-success-50 border border-success-200 rounded-lg p-8">
            <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kayıt Başarılı!</h2>
            <p className="text-gray-600 mb-4">
              Hesabınız başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...
            </p>
            <Link href="/login">
              <Button>Giriş Sayfasına Git</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Kitle Fonlama</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900">
            Hesap Oluşturun
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Giriş yapın
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-danger-600" />
              <span className="text-danger-600 text-sm">{error}</span>
            </div>
          )}

          {/* Rol Seçimi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                {...register('role')}
                type="radio"
                value="investor"
                id="role-investor"
                className="peer sr-only"
              />
              <label
                htmlFor="role-investor"
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 peer-checked:border-primary-600 peer-checked:bg-primary-50"
              >
                <Building2 className="w-8 h-8 text-primary-600 mb-2" />
                <span className="font-medium text-gray-900">Yatırımcı</span>
                <span className="text-sm text-gray-600 text-center">
                  Girişimlere yatırım yapmak istiyorum
                </span>
              </label>
            </div>
            
            <div className="relative">
              <input
                {...register('role')}
                type="radio"
                value="startup"
                id="role-startup"
                className="peer sr-only"
              />
              <label
                htmlFor="role-startup"
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 peer-checked:border-primary-600 peer-checked:bg-primary-50"
              >
                <Building2 className="w-8 h-8 text-primary-600 mb-2" />
                <span className="font-medium text-gray-900">Girişimci</span>
                <span className="text-sm text-gray-600 text-center">
                  Projeme yatırım bulmak istiyorum
                </span>
              </label>
            </div>
          </div>

          {/* Kişisel Bilgiler */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              {...register('firstName')}
              label="Ad"
              placeholder="Adınız"
              error={errors.firstName?.message}
              required
            />
            
            <Input
              {...register('lastName')}
              label="Soyad"
              placeholder="Soyadınız"
              error={errors.lastName?.message}
              required
            />
          </div>

          <Input
            {...register('email')}
            type="email"
            label="E-posta Adresi"
            placeholder="ornek@email.com"
            error={errors.email?.message}
            required
          />

          <Input
            {...register('phone')}
            type="tel"
            label="Telefon Numarası"
            placeholder="05XX XXX XX XX"
            error={errors.phone?.message}
          />

          {/* Şifreler */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Şifre"
                placeholder="Şifrenizi girin"
                error={errors.password?.message}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                {...register('passwordConfirm')}
                type={showPasswordConfirm ? 'text' : 'password'}
                label="Şifre Onayı"
                placeholder="Şifrenizi tekrar girin"
                error={errors.passwordConfirm?.message}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPasswordConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Girişimci Bilgileri */}
          {selectedRole === 'startup' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Şirket Bilgileri</h3>
              
              <div className="space-y-4">
                <Input
                  {...register('companyName')}
                  label="Şirket Adı"
                  placeholder="Şirket adınız"
                  error={errors.companyName?.message}
                  required
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    {...register('sector')}
                    label="Sektör"
                    placeholder="Teknoloji, Fintech, vb."
                    error={errors.sector?.message}
                  />
                  
                  <Input
                    {...register('taxNumber')}
                    label="Vergi Numarası"
                    placeholder="10 haneli vergi numarası"
                    error={errors.taxNumber?.message}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Yatırımcı Bilgileri */}
          {selectedRole === 'investor' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Yatırımcı Bilgileri</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yatırımcı Türü
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        {...register('investorType')}
                        type="radio"
                        value="individual"
                        id="investor-individual"
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="investor-individual"
                        className="block p-3 border-2 border-gray-200 rounded-lg cursor-pointer text-center hover:border-primary-300 peer-checked:border-primary-600 peer-checked:bg-primary-50"
                      >
                        Bireysel
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        {...register('investorType')}
                        type="radio"
                        value="corporate"
                        id="investor-corporate"
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="investor-corporate"
                        className="block p-3 border-2 border-gray-200 rounded-lg cursor-pointer text-center hover:border-primary-300 peer-checked:border-primary-600 peer-checked:bg-primary-50"
                      >
                        Kurumsal
                      </label>
                    </div>
                  </div>
                </div>

                <Input
                  {...register('investmentCapacity', { valueAsNumber: true })}
                  type="number"
                  label="Yatırım Kapasitesi (TL)"
                  placeholder="100000"
                  error={errors.investmentCapacity?.message}
                />
              </div>
            </div>
          )}

          {/* Onaylar */}
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                {...register('kvkkAccepted')}
                type="checkbox"
                id="kvkk"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="kvkk" className="ml-2 block text-sm text-gray-900">
                <Link href="/kvkk" className="text-primary-600 hover:text-primary-500">
                  KVKK Aydınlatma Metni
                </Link>
                &apos;ni okudum ve kabul ediyorum *
              </label>
            </div>
            {errors.kvkkAccepted && (
              <p className="text-sm text-danger-600">{errors.kvkkAccepted.message}</p>
            )}

            <div className="flex items-start">
              <input
                {...register('termsAccepted')}
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                  Kullanım Şartları
                </Link>
                &apos;nı okudum ve kabul ediyorum *
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-danger-600">{errors.termsAccepted.message}</p>
            )}
          </div>

          {/* Kayıt Butonu */}
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Hesap Oluştur
          </Button>
        </form>
      </div>
    </div>
  );
} 