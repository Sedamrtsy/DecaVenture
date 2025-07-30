import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind sınıflarını birleştir
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Para formatı
export function formatCurrency(amount: number, currency = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Sayı formatı (binlik ayırıcı ile)
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR').format(num);
}

// Yüzde formatı
export function formatPercentage(value: number, decimals = 1): string {
  return `%${value.toFixed(decimals)}`;
}

// Tarih formatı
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Kısa tarih formatı
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Zaman ago formatı
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Az önce';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} hafta önce`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ay önce`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} yıl önce`;
}

// Dosya boyutu formatı
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// String'i slug'a çevir
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Sadece harfler, sayılar, boşluk ve tire
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Birden fazla tireyi tek tire yap
    .trim();
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Telefon numarası validation (Türkiye)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+90|0)?[5]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// TC Kimlik No validation
export function isValidTCKN(tckn: string): boolean {
  if (!tckn || tckn.length !== 11) return false;
  
  const digits = tckn.split('').map(Number);
  
  // İlk rakam 0 olamaz
  if (digits[0] === 0) return false;
  
  // 10. rakam kontrol
  const sum10 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - 
                (digits[1] + digits[3] + digits[5] + digits[7]);
  if (sum10 % 10 !== digits[9]) return false;
  
  // 11. rakam kontrol
  const sum11 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  if (sum11 % 10 !== digits[10]) return false;
  
  return true;
}

// Vergi numarası validation
export function isValidTaxNumber(taxNumber: string): boolean {
  if (!taxNumber || taxNumber.length !== 10) return false;
  
  const digits = taxNumber.split('').map(Number);
  
  // Son rakam haricindeki rakamların toplamı
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = (digits[i] + (9 - i)) % 10;
    sum += digit * Math.pow(2, 9 - i) % 9;
    if (sum >= 10) sum -= 9;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[9];
}

// Rastgele string oluştur
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastExecTime = 0;
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(null, args);
      lastExecTime = currentTime;
    }
  };
}

// Local storage yardımcıları
export const localStorage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  },
};

// API helper
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Role display names
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'Admin',
    super_admin: 'Süper Admin',
    investor: 'Yatırımcı',
    startup: 'Girişimci',
    committee: 'Komite Üyesi',
  };
  
  return roleNames[role] || role;
}

// Status display names
export function getStatusDisplayName(status: string): string {
  const statusNames: Record<string, string> = {
    draft: 'Taslak',
    submitted: 'Başvuru Yapıldı',
    committee_review: 'Komite Değerlendirmesi',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    live: 'Canlı',
    closed: 'Kapandı',
    cancelled: 'İptal Edildi',
    pending: 'Beklemede',
    paid: 'Ödendi',
    soft: 'Soft Commitment',
    hard: 'Hard Commitment',
  };
  
  return statusNames[status] || status;
} 