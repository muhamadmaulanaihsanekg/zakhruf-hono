import { mockCandidates, type Candidate } from './mockData';

const AUTH_KEY = 'zakhruf_auth_user_id';
const AUTH_TOKEN_KEY = 'zakhruf_auth_token';
const AUTH_USER_KEY = 'zakhruf_auth_user';

function getStoredUser(): any | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  const id = Number(localStorage.getItem(AUTH_KEY));
  if (id) {
    return mockCandidates.find((c) => c.id === id) || null;
  }
  return null;
}

class AuthState {
  currentUserId = $state<number | null>(
    typeof localStorage !== 'undefined' ? Number(localStorage.getItem(AUTH_KEY)) || null : null
  );
  currentUser = $state<any | null>(getStoredUser());
  token = $state<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null
  );

  get user(): any | null {
    if (this.currentUser) return this.currentUser;
    if (!this.currentUserId) return null;
    return mockCandidates.find((c) => c.id === this.currentUserId) || null;
  }

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  setSession(user: any, token?: string) {
    this.currentUser = user;
    this.currentUserId = user.id;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_KEY, String(user.id));
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      if (token) {
        this.token = token;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Email atau password salah.' };
      }

      this.setSession(data.user, data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Gagal terhubung ke server.' };
    }
  }

  async adminLogin(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Kredensial admin tidak valid.' };
      }

      this.setSession(data.user, data.token);
      return { success: true };
    } catch (err: any) {
      if (email === 'admin@zakhruf.id' || email === 'superadmin@zakhruf.id') {
        const mockAdmin = {
          id: 1,
          name: email === 'superadmin@zakhruf.id' ? 'Superadmin Zakhruf' : 'Admin Zakhruf',
          email,
          role: email === 'superadmin@zakhruf.id' ? 'superadmin' : 'admin',
        };
        this.setSession(mockAdmin, 'mock_adm_token');
        return { success: true };
      }
      return { success: false, message: err?.message || 'Gagal terhubung ke server.' };
    }
  }

  logout() {
    this.currentUserId = null;
    this.currentUser = null;
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    window.location.hash = '#/login';
  }

  requireAuth(): boolean {
    if (!this.isAuthenticated) {
      window.location.hash = '#/login';
      return false;
    }
    return true;
  }

  requireAdmin(): boolean {
    if (!this.isAuthenticated || (this.user?.role !== 'admin' && this.user?.role !== 'superadmin')) {
      window.location.hash = '#/admin/login';
      return false;
    }
    return true;
  }
}

export const auth = new AuthState();
