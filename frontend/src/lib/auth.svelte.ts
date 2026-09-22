import { mockCandidates, type Candidate } from './mockData';

const AUTH_KEY = 'zakhruf_auth_user_id';

class AuthState {
  currentUserId = $state<number | null>(
    typeof localStorage !== 'undefined' && localStorage.getItem(AUTH_KEY)
      ? Number(localStorage.getItem(AUTH_KEY))
      : 1 // Default to Fatimah (id: 1) if not set, or null if strictly required
  );

  get user(): Candidate | null {
    if (!this.currentUserId) return null;
    return mockCandidates.find((c) => c.id === this.currentUserId) || null;
  }

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  loginAs(candidateId: number) {
    this.currentUserId = candidateId;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_KEY, String(candidateId));
    }
  }

  loginWithEmail(email: string): boolean {
    const found = mockCandidates.find(
      (c) => c.email?.toLowerCase() === email.trim().toLowerCase()
    );
    if (found) {
      this.loginAs(found.id);
      return true;
    }
    // Fallback if not found: assign candidate id 1 (Fatimah) or id 4 (Ahmad)
    this.loginAs(1);
    return true;
  }

  logout() {
    this.currentUserId = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
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
}

export const auth = new AuthState();
