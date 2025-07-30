'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  PieChart,
  DollarSign,
  Users2,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  // Ortak
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  
  // Girişimci
  { href: '/startup/rounds', label: 'Yatırım Turlarım', icon: TrendingUp, roles: ['startup'] },
  { href: '/startup/business-plan', label: 'İş Planı', icon: FileText, roles: ['startup'] },
  { href: '/startup/documents', label: 'Evraklar', icon: FileText, roles: ['startup'] },
  { href: '/startup/updates', label: 'Güncellemeler', icon: Bell, roles: ['startup'] },
  
  // Yatırımcı
  { href: '/investor/rounds', label: 'Yatırım Fırsatları', icon: TrendingUp, roles: ['investor'] },
  { href: '/investor/portfolio', label: 'Portföyüm', icon: PieChart, roles: ['investor'] },
  { href: '/investor/commitments', label: 'Yatırımlarım', icon: DollarSign, roles: ['investor'] },
  
  // Admin
  { href: '/admin/startups', label: 'Girişimler', icon: Building2, roles: ['admin', 'super_admin'] },
  { href: '/admin/investors', label: 'Yatırımcılar', icon: Users, roles: ['admin', 'super_admin'] },
  { href: '/admin/rounds', label: 'Tur Yönetimi', icon: TrendingUp, roles: ['admin', 'super_admin'] },
  { href: '/admin/committee', label: 'Komite', icon: Users2, roles: ['admin', 'super_admin'] },
  { href: '/admin/notifications', label: 'Bildirimler', icon: Bell, roles: ['admin', 'super_admin'] },
  { href: '/admin/settings', label: 'Ayarlar', icon: Settings, roles: ['super_admin'] },
  
  // Komite
  { href: '/committee/evaluations', label: 'Değerlendirmeler', icon: FileText, roles: ['committee'] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, hasAnyRole } = useAuth();

  // Kullanıcının rolüne göre menü öğelerini filtrele
  const filteredItems = sidebarItems.filter(item => {
    if (!item.roles) return true; // Rol belirtilmemişse herkese göster
    return hasAnyRole(item.roles as any);
  });

  const handleLinkClick = () => {
    onClose(); // Mobile'da sidebar'ı kapat
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        'fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Kitle Fonlama</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'sidebar-link',
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </>
  );
} 