'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  role: z.enum(['startup', 'investor', 'admin', 'committee', 'super_admin']),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'investor',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const success = await login(data.email, data.password, data.role);
      
      if (success) {
        // Kullanıcı rolüne göre yönlendirme
        switch (data.role) {
          case 'startup':
            router.push('/startup/dashboard');
            break;
          case 'investor':
            router.push('/investor/dashboard');
            break;
          case 'admin':
          case 'super_admin':
            router.push('/admin/dashboard');
            break;
          case 'committee':
            router.push('/committee/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        setError('E-posta, şifre veya rol bilgileri hatalı');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Kitle Fonlama</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Kayıt olun
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

          <div className="space-y-4">
            {/* Rol Seçimi */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Giriş Türü *
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="investor">Yatırımcı</option>
                <option value="startup">Girişimci</option>
                <option value="committee">Komite Üyesi</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-danger-600">{errors.role.message}</p>
              )}
            </div>

            {/* E-posta */}
            <Input
              {...register('email')}
              type="email"
              label="E-posta Adresi"
              placeholder="ornek@email.com"
              error={errors.email?.message}
              required
            />

            {/* Şifre */}
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
          </div>

          {/* Şifremi Unuttum */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Şifremi unuttum
              </Link>
            </div>
          </div>

          {/* Giriş Butonu */}
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Giriş Yap
          </Button>

          {/* Demo Hesapları */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 text-center mb-4">
              Demo hesapları ile test edebilirsiniz:
            </p>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">Yatırımcı: investor@demo.com / 123456</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">Girişimci: startup@demo.com / 123456</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">Admin: admin@demo.com / 123456</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 