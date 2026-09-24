<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { auth } from '../../lib/auth.svelte';

  let email = $state('admin@zakhruf.id');
  let password = $state('admin123');
  let remember = $state(false);
  let loading = $state(false);
  let error = $state('');

  async function submit(e: Event) {
    e.preventDefault();
    error = '';
    if (!email || !password) {
      error = 'Email dan password wajib diisi.';
      return;
    }
    loading = true;
    const res = await auth.adminLogin(email, password);
    loading = false;
    if (!res.success) {
      error = res.message || 'Kredensial admin tidak valid.';
      return;
    }
    window.location.hash = '#/admin/dashboard';
  }
</script>

<div class="guest-root">
  <!-- Left Panel - Branding -->
  <div class="guest-left">
    <!-- Decorative sage & gold glows -->
    <div class="glow-sage"></div>
    <div class="glow-gold"></div>

    <div class="brand-box">
      <a href="#/" use:link class="brand-logo-link">
        <div class="brand-icon">
          <span>Z</span>
        </div>
      </a>
      <h1 class="brand-title">Zakhruf.id</h1>
      <p class="brand-subtitle">Panel Administrasi & Panitia LDII DKI Jakarta</p>

      <!-- Feature highlights -->
      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon feature-sage">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7a9a5e" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p class="feature-title">Aman & Terpercaya</p>
            <p class="feature-desc">Data peserta dilindungi</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon feature-gold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a030" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
          </div>
          <div>
            <p class="feature-title">Manajemen Event</p>
            <p class="feature-desc">Antrean, room & mak comblang</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon feature-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64a0dc" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <p class="feature-title">Verifikasi Tim PNKB</p>
            <p class="feature-desc">Monitoring taaruf terpusat</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right Panel - Form -->
  <div class="guest-right">
    <div class="form-container">
      <!-- Mobile logo -->
      <div class="mobile-logo-wrap">
        <a href="#/" use:link>
          <div class="mobile-brand-icon">
            <span>Z</span>
          </div>
        </a>
      </div>

      <div>
        <h2 class="heading-title">Selamat datang kembali</h2>
        <p class="heading-subtitle">Masuk ke Panel Admin & Panitia Zakhruf ID</p>
      </div>

      {#if error}
        <div class="error-banner">
          {error}
        </div>
      {/if}

      <form onsubmit={submit} class="admin-login-form">
        <div class="form-group">
          <label for="adm-email">Email</label>
          <div class="input-wrap">
            <div class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a5c6a" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <input
              id="adm-email"
              type="email"
              bind:value={email}
              required
              autocomplete="email"
              placeholder="admin@zakhruf.id"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="adm-password">Password</label>
          <div class="input-wrap">
            <div class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a5c6a" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input
              id="adm-password"
              type="password"
              bind:value={password}
              required
              autocomplete="current-password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="form-row">
          <label class="remember-label">
            <input type="checkbox" bind:checked={remember} />
            <span>Ingat saya</span>
          </label>
          <a href="#/cek-akun" use:link class="forgot-link">Lupa password?</a>
        </div>

        <button type="submit" disabled={loading} class="btn-submit">
          {#if loading}
            <span class="spinner"></span>
            <span>Memproses...</span>
          {:else}
            <span>Masuk ke Dashboard</span>
          {/if}
        </button>
      </form>

      <p class="footer-note">
        Masuk sebagai kandidat?
        <a href="#/login" use:link>Login Peserta</a>
      </p>
    </div>
  </div>
</div>

<style>
  .guest-root {
    display: flex;
    min-height: 100vh;
    background: #07090d;
    font-family: 'Geist', sans-serif;
  }
  .guest-left {
    display: none;
    width: 50%;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0d0f15 0%, #13151c 50%, #0d0f15 100%);
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 1024px) {
    .guest-left { display: flex; }
  }
  .glow-sage {
    position: absolute;
    top: 20%;
    left: 30%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(122,154,94,0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .glow-gold {
    position: absolute;
    bottom: 20%;
    right: 20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(212,160,48,0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .brand-box {
    padding: 0 48px;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .brand-logo-link {
    display: inline-block;
  }
  .brand-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #7a9a5e 0%, #5a7a3e 100%);
    border-radius: 18px;
    display: grid;
    place-items: center;
    margin: 0 auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .brand-icon span {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
  }
  .brand-title {
    margin-top: 24px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 600;
    color: #e4e4ec;
    letter-spacing: -0.6px;
  }
  .brand-subtitle {
    margin-top: 8px;
    font-size: 14px;
    color: #8b8d9a;
  }
  .features-list {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
  }
  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
  }
  .feature-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 10px;
    display: grid;
    place-items: center;
  }
  .feature-sage { background: rgba(122,154,94,0.1); }
  .feature-gold { background: rgba(212,160,48,0.1); }
  .feature-blue { background: rgba(100,160,220,0.1); }
  .feature-title { font-size: 13px; font-weight: 600; color: #e4e4ec; margin: 0; }
  .feature-desc { font-size: 12px; color: #5a5c6a; margin: 0; }

  .guest-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    background: #0d0f15;
  }
  .form-container {
    width: 100%;
    max-width: 420px;
  }
  .mobile-logo-wrap {
    text-align: center;
    margin-bottom: 32px;
  }
  @media (min-width: 1024px) {
    .mobile-logo-wrap { display: none; }
  }
  .mobile-brand-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #7a9a5e 0%, #5a7a3e 100%);
    border-radius: 14px;
    display: grid;
    place-items: center;
    margin: 0 auto;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
  .mobile-brand-icon span {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
  }
  .heading-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 600;
    color: #e4e4ec;
    letter-spacing: -0.5px;
    margin: 0;
  }
  .heading-subtitle {
    margin-top: 6px;
    font-size: 13px;
    color: #8b8d9a;
  }
  .error-banner {
    margin-top: 20px;
    padding: 12px 16px;
    background: rgba(224,85,85,0.1);
    border: 1px solid rgba(224,85,85,0.2);
    border-radius: 10px;
    font-size: 13px;
    color: #e05555;
  }
  .admin-login-form {
    margin-top: 32px;
  }
  .form-group {
    margin-bottom: 20px;
  }
  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #8b8d9a;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .input-wrap {
    position: relative;
  }
  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    display: flex;
    align-items: center;
  }
  .input-wrap input {
    width: 100%;
    padding: 12px 16px 12px 42px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    font-size: 14px;
    color: #e4e4ec;
    font-family: inherit;
    outline: none;
    transition: all 0.25s cubic-bezier(0.32,0.72,0,1);
    box-sizing: border-box;
  }
  .input-wrap input:focus {
    border-color: rgba(122,154,94,0.25);
    box-shadow: 0 0 0 3px rgba(122,154,94,0.1);
  }
  .form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .remember-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    font-size: 13px;
    color: #8b8d9a;
  }
  .remember-label input {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.1);
    background: #13151c;
    cursor: pointer;
  }
  .forgot-link {
    font-size: 13px;
    color: #7a9a5e;
    text-decoration: none;
    font-weight: 500;
  }
  .forgot-link:hover {
    color: #8db36b;
  }
  .btn-submit {
    width: 100%;
    padding: 14px 24px;
    background: #7a9a5e;
    color: #0a0d06;
    border: none;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.35s cubic-bezier(0.32,0.72,0,1);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-submit:hover:not(:disabled) {
    background: #8db36b;
    transform: scale(1.02);
    box-shadow: 0 4px 14px rgba(0,0,0,0.4);
  }
  .btn-submit:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(10,13,6,0.3);
    border-top-color: #0a0d06;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .footer-note {
    text-align: center;
    font-size: 13px;
    color: #8b8d9a;
    margin-top: 24px;
  }
  .footer-note a {
    color: #7a9a5e;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;
  }
  .footer-note a:hover {
    color: #8db36b;
  }
</style>