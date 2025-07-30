import Cookies from 'js-cookie';
import { User, UserRole } from '@/types';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export class AuthService {
  // Token oluştur (Mock için basitleştirildi)
  static generateToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };

    return btoa(JSON.stringify(payload));
  }

  // Token doğrula (Mock için basitleştirildi)
  static verifyToken(token: string): TokenPayload | null {
    try {
      // Mock JWT - just decode base64
      if (token.startsWith('mock_token_')) {
        // Old style mock token - extract user ID
        const parts = token.split('_');
        const userId = parts[2];
        return {
          userId,
          email: 'demo@girisim.com',
          role: 'startup' as UserRole
        };
      }
      
      // New style mock token - base64 encoded JSON
      const decoded = JSON.parse(atob(token)) as TokenPayload;
      
      // Check if token is expired
      if (decoded.exp && decoded.exp < Date.now()) {
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Browser'da token sakla
  static setToken(token: string): void {
    Cookies.set('auth_token', token, {
      expires: 7, // 7 gün
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  // Browser'dan token al
  static getToken(): string | null {
    return Cookies.get('auth_token') || null;
  }

  // Token'dan kullanıcı bilgilerini al
  static getCurrentUser(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    return this.verifyToken(token);
  }

  // Kullanıcı giriş yapmış mı?
  static isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null;
  }

  // Kullanıcının rolü kontrol et
  static hasRole(requiredRole: UserRole): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return user.role === requiredRole;
  }

  // Kullanıcının birden fazla rolden birini kontrol et
  static hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    return roles.includes(user.role);
  }

  // Admin yetkisi var mı?
  static isAdmin(): boolean {
    return this.hasAnyRole(['admin', 'super_admin']);
  }

  // Çıkış yap
  static logout(): void {
    Cookies.remove('auth_token');
    // Sayfayı yenile veya login'e yönlendir
    window.location.href = '/login';
  }

  // Token yenile (opsiyonel)
  static async refreshToken(): Promise<string | null> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) return null;

      // API'den yeni token al
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      const newToken = data.token;

      if (newToken) {
        this.setToken(newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }
}

// Route koruması için yardımcı fonksiyonlar
export const requireAuth = (allowedRoles?: UserRole[]) => {
  const user = AuthService.getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }

  return user;
};

// Middleware factory
export const createAuthMiddleware = (allowedRoles?: UserRole[]) => {
  return (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const user = AuthService.verifyToken(token);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
}; 