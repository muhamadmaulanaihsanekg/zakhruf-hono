<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { auth } from '../../lib/auth.svelte';

  let email = $state('fatimah.azzahra@email.com');
  let password = $state('password123');
  let remember = $state(false);
  let loading = $state(false);
  let errors = $state<{ email?: string; password?: string }>({});

  const taglines = [
    'Sopan di layar, <em>serius di niat.</em>',
    'Tak kenal maka <em>taaruf</em>',
    'Dijaga, <em>bukan dipertontonkan</em>',
    'Bukan swipe genit, <em>tapi taaruf beradab</em>',
  ];

  // Lookup state
  let lookupOpen = $state(false);
  const lookup = $state({ nama: '', daerah: '', desa: '' });
  let lookupResults = $state<Array<{ nama: string; daerah: string; desa: string; kelompok: string; email: string }>>([]);
  let lookupCount = $state(0);
  let lookupDone = $state(false);
  let lookupLoading = $state(false);
  let lookupError = $state('');

  // Sheet state
  let sheetOpen = $state(false);
  let sheetStep = $state<'confirm' | 'detail'>('confirm');
  let selectedResult = $state<{ nama: string; daerah: string; desa: string; kelompok: string; email: string } | null>(null);
  let verifyEmail = $state('');
  let verifyLoading = $state(false);
  let verifyError = $state('');
  let resetLoading = $state(false);
  let resetSuccess = $state('');
  let resetError = $state('');

  async function handleLogin(e: Event) {
    e.preventDefault();
    errors = {};
    if (!email) { errors.email = 'Email wajib diisi'; return; }
    if (!password) { errors.password = 'Password wajib diisi'; return; }
    loading = true;
    const res = await auth.login(email, password);
    loading = false;
    if (!res.success) {
      errors.email = res.message || 'Kredensial tidak ditemukan.';
      return;
    }
    window.location.hash = '#/';
  }

  function submitLookup() {
    if (lookup.nama.trim().length < 2) {
      lookupError = 'Masukkan minimal 2 huruf nama.';
      lookupDone = false;
      return;
    }
    lookupError = '';
    lookupLoading = true;
    lookupDone = false;
    setTimeout(() => {
      lookupLoading = false;
      lookupResults = [
        {
          nama: `${lookup.nama.slice(0, 3)}***`,
          daerah: lookup.daerah || 'DKI Jakarta',
          desa: lookup.desa || 'Jakarta Selatan',
          kelompok: 'Tebet',
          email: 'fa*****@email.com',
        },
      ];
      lookupCount = lookupResults.length;
      lookupDone = true;
    }, 400);
  }

  function resetLookup() {
    lookup.nama = '';
    lookup.daerah = '';
    lookup.desa = '';
    lookupResults = [];
    lookupCount = 0;
    lookupDone = false;
    lookupError = '';
  }

  function openSheet(r: { nama: string; daerah: string; desa: string; kelompok: string; email: string }) {
    selectedResult = r;
    sheetStep = 'confirm';
    verifyEmail = '';
    verifyError = '';
    resetSuccess = '';
    resetError = '';
    sheetOpen = true;
  }

  function closeSheet() {
    sheetOpen = false;
    selectedResult = null;
  }

  function submitVerify() {
    if (!verifyEmail.includes('@')) {
      verifyError = 'Format email tidak valid';
      return;
    }
    verifyLoading = true;
    verifyError = '';
    setTimeout(() => {
      verifyLoading = false;
      sheetStep = 'detail';
    }, 500);
  }

  function handleReset() {
    resetLoading = true;
    resetError = '';
    setTimeout(() => {
      resetLoading = false;
      resetSuccess = 'Link reset password telah dikirim ke email kamu.';
    }, 600);
  }
</script>

<div class="hume-root">
  <div class="hume-phone">
    <div class="hume-hero">
      <img src="/storage/register-hero.jpg" alt="Taaruf Terjaga" class="hume-hero-img" />
      <div class="hume-hero-gradient"></div>
    </div>

    <div class="hume-roll" aria-live="polite">
      {#each taglines as t, i}
        <span class="hume-roll-slide t{i + 1}">{@html t}</span>
      {/each}
    </div>

    <h1 class="hume-title">Login to Your Account</h1>
    <p class="hume-subtitle">Masuk untuk melanjutkan pencarian jodoh terjaga</p>

    <div class="admin-card">
      <form onsubmit={handleLogin}>
        <div class="hume-grid">
          <div>
            <label class="hume-label" for="lg-email">Email</label>
            <input id="lg-email" type="email" bind:value={email} placeholder="kamu@email.com" autocomplete="email" class="hume-input" />
            {#if errors.email}
              <div class="hume-input-error">{errors.email}</div>
            {/if}
          </div>
          <div>
            <label class="hume-label" for="lg-pass">Password</label>
            <input id="lg-pass" type="password" bind:value={password} placeholder="••••••••" autocomplete="current-password" class="hume-input" />
            {#if errors.password}
              <div class="hume-input-error">{errors.password}</div>
            {/if}
          </div>
        </div>

        <div class="hume-row">
          <label class="hume-remember">
            <input type="checkbox" bind:checked={remember} />
            Ingat saya
          </label>
          <button type="button" onclick={() => (lookupOpen = true)} class="hume-forgot-link">Lupa password?</button>
        </div>

        <button type="submit" disabled={loading} class="hume-btn-primary">
          {#if loading}
            <span class="hume-spinner"></span>
          {:else}
            <span>Masuk</span>
          {/if}
        </button>

        <div class="hume-divider"><span>atau lanjutkan dengan</span></div>

        <div class="hume-socials">
          <button type="button" class="hume-social" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#7a9a5e"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button type="button" class="hume-social" aria-label="Google">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a2.5 2.5 0 01-1.08 1.64v1.36h1.74c1.02-.94 1.6-2.32 1.6-3.96z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.57-2.77c-.98.66-2.23 1.06-3.71 1.06z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          </button>
          <button type="button" class="hume-social" aria-label="Apple">
            <svg width="15" height="16" viewBox="0 0 24 24" fill="white"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.34-2.365-2.04-.165-3.356.96-4.156.96z"/></svg>
          </button>
        </div>

        <p class="hume-footer">Belum punya akun? <a href="/onboarding" use:link class="hume-link">Daftar sekarang</a></p>
        <p class="hume-footer hume-footer-lookup">
          <button type="button" class="hume-lookup-link" onclick={() => { lookupOpen = true; resetLookup(); }}>Lupa &mdash; cek eksistensi akun</button>
        </p>
      </form>
    </div>
  </div>

  <!-- Modal: Cek Eksistensi Akun -->
  {#if lookupOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="lk-overlay" onclick={(e) => (e.target === e.currentTarget ? (lookupOpen = false) : undefined)}>
      <div class="lk-modal">
        <div class="lk-head">
          <div>
            <div class="lk-title">Cek Eksistensi Akun</div>
            <div class="lk-sub">Cari tahu apakah kamu sudah punya akun Zakhruf ID</div>
          </div>
          <button type="button" class="lk-close" onclick={() => (lookupOpen = false)}>&#10005;</button>
        </div>

        <div class="lk-field">
          <label for="lk-nama">Nama</label>
          <input id="lk-nama" bind:value={lookup.nama} placeholder="Nama lengkap" onkeydown={(e) => e.key === 'Enter' && submitLookup()} />
        </div>
        <div class="lk-field">
          <label for="lk-daerah">Daerah (opsional)</label>
          <input id="lk-daerah" bind:value={lookup.daerah} placeholder="cth: DKI Jakarta" onkeydown={(e) => e.key === 'Enter' && submitLookup()} />
        </div>
        <div class="lk-field">
          <label for="lk-desa">Desa (opsional)</label>
          <input id="lk-desa" bind:value={lookup.desa} placeholder="cth: Kel. Kalideres" onkeydown={(e) => e.key === 'Enter' && submitLookup()} />
        </div>

        {#if lookupError}
          <div class="lk-error">{lookupError}</div>
        {/if}

        <button type="button" class="lk-submit" disabled={lookupLoading} onclick={submitLookup}>
          {#if lookupLoading}
            <span class="hume-spinner hume-spinner-sm"></span>
          {:else}
            <span>Cari Akun</span>
          {/if}
        </button>

        {#if lookupDone}
          <div class="lk-count">{lookupCount} akun ditemukan</div>
        {/if}
        <div class="lk-results">
          {#each lookupResults as r}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="lk-item" onclick={() => openSheet(r)}>
              <div class="lk-name">{r.nama}</div>
              <div class="lk-meta">{r.daerah} &middot; {r.desa} &middot; {r.kelompok}</div>
              <div class="lk-email">{r.email}</div>
            </div>
          {/each}
        </div>
        {#if lookupDone && lookupCount === 0}
          <div class="lk-empty">Tidak ada akun yang cocok. Kamu bisa daftar baru.</div>
        {/if}
        <div class="lk-note">Data nama &amp; email ditampilkan terpotong untuk melindungi privasi.</div>
      </div>
    </div>
  {/if}

  <!-- Bottom Sheet: Konfirmasi Email & Detail Akun -->
  {#if sheetOpen && selectedResult}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="bs-overlay" onclick={(e) => (e.target === e.currentTarget ? closeSheet() : undefined)}>
      <div class="bs-sheet">
        <div class="bs-handle"><div class="bs-handle-bar"></div></div>

        {#if sheetStep === 'confirm'}
          <div class="bs-pad">
            <div class="bs-head">
              <div>
                <div class="bs-title">Konfirmasi Akun</div>
                <div class="bs-sub">Masukkan email untuk memverifikasi akun ini</div>
              </div>
              <button onclick={closeSheet} class="bs-close">✕</button>
            </div>

            <div class="bs-account-card">
              <div class="bs-account-label">Akun Ditemukan</div>
              <div class="bs-account-name">{selectedResult.nama}</div>
              <div class="bs-account-meta">{selectedResult.daerah} · {selectedResult.desa} · {selectedResult.kelompok}</div>
              <div class="bs-account-email">{selectedResult.email}</div>
            </div>

            <form onsubmit={(e) => { e.preventDefault(); submitVerify(); }}>
              <div class="bs-field">
                <label for="bs-vr-email">Email</label>
                <input id="bs-vr-email" type="email" bind:value={verifyEmail} placeholder="Masukkan email lengkap kamu" />
              </div>
              {#if verifyError}
                <div class="bs-error">{verifyError}</div>
              {/if}
              <button type="submit" disabled={verifyLoading} class="bs-btn-primary">
                {#if verifyLoading}
                  <span class="hume-spinner hume-spinner-sm"></span>
                {:else}
                  <span>Verifikasi Email</span>
                {/if}
              </button>
            </form>
          </div>
        {:else}
          <div class="bs-pad">
            <div class="bs-head">
              <div>
                <div class="bs-title">Detail Akun</div>
                <div class="bs-sub">Data lengkap akun kamu</div>
              </div>
              <button onclick={closeSheet} class="bs-close">✕</button>
            </div>

            <div class="bs-detail-card">
              <div class="bs-detail-grid">
                <div><div class="bs-label">Email</div><div class="bs-value">{selectedResult.email}</div></div>
                <div><div class="bs-label">Nama</div><div class="bs-value">{selectedResult.nama}</div></div>
                <div><div class="bs-label">Daerah</div><div class="bs-value">{selectedResult.daerah}</div></div>
                <div><div class="bs-label">Kelompok</div><div class="bs-value">{selectedResult.kelompok}</div></div>
              </div>
            </div>

            <div class="bs-reset-card">
              <div class="bs-reset-label">Reset Password</div>
              {#if resetSuccess}
                <div class="bs-success-card">
                  <div class="bs-success-title">Link sudah dikirim!</div>
                  <div>{resetSuccess}</div>
                  <div class="bs-success-note">Cek inbox atau spam folder email kamu.</div>
                </div>
              {:else}
                <div class="bs-reset-sub">Kami akan mengirimkan link reset password ke email <strong>{verifyEmail}</strong></div>
                {#if resetError}
                  <div class="bs-error">{resetError}</div>
                {/if}
                <button type="button" disabled={resetLoading} onclick={handleReset} class="bs-btn-warning">
                  {#if resetLoading}
                    <span class="hume-spinner hume-spinner-sm hume-spinner-dark"></span>
                  {:else}
                    <span>Kirim Link Reset Password</span>
                  {/if}
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .hume-root { min-height: 100vh; min-height: 100dvh; background: #07090d; display: flex; justify-content: center; align-items: flex-start; font-family: 'Geist', sans-serif; }
  .hume-phone { width: 100%; max-width: 420px; min-height: 100vh; min-height: 100dvh; background: #07090d; padding: 0 16px 28px; display: flex; flex-direction: column; }
  .hume-hero { margin: 0 -16px; height: 240px; position: relative; overflow: hidden; background: #07090d; }
  .hume-hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hume-hero-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(7,9,13,0) 45%, rgba(7,9,13,0.55) 75%, #07090d 100%); pointer-events: none; }
  .hume-roll { position: relative; height: 28px; margin: 12px 0 4px; display: grid; place-items: center; overflow: hidden; }
  .hume-roll-slide { grid-area: 1/1; font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic; font-size: 17px; color: #8db36b; opacity: 0; transform: translateY(8px); animation: rollCycle 16s infinite; text-align: center; }
  :global(.hume-roll-slide em) { color: #e4e4ec; font-style: italic; }
  .hume-roll-slide.t2 { animation-delay: 4s; } .hume-roll-slide.t3 { animation-delay: 8s; } .hume-roll-slide.t4 { animation-delay: 12s; }
  @keyframes rollCycle { 0%{opacity:0;transform:translateY(8px)} 5%{opacity:1;transform:translateY(0)} 20%{opacity:1;transform:translateY(0)} 25%{opacity:0;transform:translateY(-8px)} 100%{opacity:0} }
  .hume-title { text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: #e4e4ec; letter-spacing: -0.3px; margin: 10px 0 6px; }
  .hume-subtitle { text-align: center; font-size: 12px; color: #8b8d9a; margin-bottom: 16px; }
  .admin-card { background: linear-gradient(135deg, rgba(26,29,39,0.8), rgba(13,15,21,0.9)); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; backdrop-filter: blur(10px); }
  .hume-grid { display: grid; gap: 16px; }
  .hume-label { display: block; font-size: 11px; font-weight: 600; color: rgb(139, 141, 154); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .hume-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; font-size: 13px; color: rgb(228,228,236); font-family: inherit; outline: none; transition: 0.2s; box-sizing: border-box; }
  .hume-input:focus { border-color: rgba(122,154,94,0.35); box-shadow: 0 0 0 3px rgba(122,154,94,0.12); }
  .hume-input-error { color: rgb(224,85,85); font-size: 11px; margin-top: 6px; }
  .hume-row { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }
  .hume-remember { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #8b8d9a; cursor: pointer; }
  .hume-remember input { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); cursor: pointer; }
  .hume-forgot-link { font-size: 13px; color: #7a9a5e; text-decoration: none; font-weight: 500; background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
  .hume-forgot-link:hover { color: #8db36b; }
  .hume-btn-primary { width: 100%; padding: 11px 14px; background: #7a9a5e; color: #0a0d06; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; }
  .hume-btn-primary:hover:not(:disabled) { background: #8db36b; }
  .hume-btn-primary:disabled { opacity: 0.6; cursor: default; }
  .hume-spinner { width: 16px; height: 16px; border: 2px solid rgba(10,13,6,0.3); border-top-color: #0a0d06; border-radius: 50%; animation: humeSpin 0.6s linear infinite; display: inline-block; }
  .hume-spinner-sm { width: 14px; height: 14px; }
  .hume-spinner-dark { border-color: rgba(26,18,0,0.3); border-top-color: #1a1200; }
  @keyframes humeSpin { to { transform: rotate(360deg); } }
  .hume-divider { display: flex; align-items: center; gap: 12px; margin: 16px 0 4px; }
  .hume-divider::before, .hume-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .hume-divider span { font-size: 11px; color: #5a5c6a; white-space: nowrap; }
  .hume-socials { display: flex; justify-content: center; gap: 12px; margin-top: 10px; }
  .hume-social { width: 48px; height: 48px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: grid; place-items: center; cursor: pointer; transition: 0.2s; }
  .hume-social:hover { border-color: rgba(122,154,94,0.25); background: rgba(122,154,94,0.06); }
  .hume-footer { text-align: center; font-size: 12px; color: #8b8d9a; margin-top: 16px; }
  .hume-footer-lookup { margin-top: 8px; }
  .hume-link { color: #8db36b; font-weight: 700; text-decoration: none; }
  .hume-link:hover { color: #7a9a5e; text-decoration: underline; }
  .hume-lookup-link { background: none; border: none; padding: 0; font-size: 12px; color: #5a5c6a; cursor: pointer; font-family: inherit; text-decoration: underline dotted rgba(90,92,106,0.6); transition: color 0.2s; }
  .hume-lookup-link:hover { color: #8db36b; }

  .lk-overlay { position: fixed; inset: 0; z-index: 60; background: rgba(4,5,8,0.72); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .lk-modal { width: 100%; max-width: 420px; max-height: 86vh; overflow-y: auto; background: linear-gradient(160deg, #171a24, #0d0f15); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 24px; box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
  .lk-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
  .lk-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #e4e4ec; }
  .lk-sub { font-size: 12px; color: #8b8d9a; margin-top: 3px; line-height: 1.5; }
  .lk-close { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #8b8d9a; width: 30px; height: 30px; border-radius: 9px; cursor: pointer; font-size: 12px; font-family: inherit; flex-shrink: 0; }
  .lk-close:hover { color: #e4e4ec; border-color: rgba(255,255,255,0.16); }
  .lk-field { margin-bottom: 14px; }
  .lk-field label { display: block; font-size: 11px; font-weight: 600; color: #8b8d9a; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .lk-field input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; font-size: 13px; color: #e4e4ec; font-family: inherit; outline: none; transition: 0.2s; box-sizing: border-box; }
  .lk-field input:focus { border-color: rgba(122,154,94,0.4); box-shadow: 0 0 0 3px rgba(122,154,94,0.12); }
  .lk-error { font-size: 12px; color: #e05555; margin: 4px 0 12px; }
  .lk-submit { width: 100%; padding: 12px 14px; background: #7a9a5e; color: #0a0d06; border: none; border-radius: 11px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; }
  .lk-submit:hover:not(:disabled) { background: #8db36b; }
  .lk-submit:disabled { opacity: 0.6; cursor: default; }
  .lk-count { font-size: 12px; color: #8db36b; font-weight: 600; margin-top: 16px; }
  .lk-results { display: grid; gap: 8px; margin-top: 10px; }
  .lk-item { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px 14px; }
  .lk-item:hover { border-color: rgba(122,154,94,0.25); background: rgba(122,154,94,0.04); }
  .lk-name { font-size: 14px; font-weight: 700; color: #e4e4ec; }
  .lk-meta { font-size: 11px; color: #8b8d9a; margin-top: 3px; }
  .lk-email { font-size: 11px; color: #7a9a5e; margin-top: 4px; font-weight: 600; }
  .lk-empty { font-size: 12px; color: #5a5c6a; margin-top: 14px; text-align: center; }
  .lk-note { font-size: 10px; color: #3e4050; margin-top: 16px; text-align: center; }

  .bs-overlay { position: fixed; inset: 0; z-index: 80; background: rgba(4,5,8,0.72); backdrop-filter: blur(6px); display: flex; align-items: flex-end; justify-content: center; }
  .bs-sheet { width: 100%; max-width: 420px; background: linear-gradient(160deg, #171a24, #0d0f15); border-top: 1px solid rgba(255,255,255,0.08); border-radius: 18px 18px 0 0; max-height: 85vh; overflow-y: auto; box-shadow: 0 -10px 40px rgba(0,0,0,0.5); animation: bsSlideUp 0.3s cubic-bezier(0.32,0.72,0,1); }
  @keyframes bsSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .bs-handle { display: flex; justify-content: center; padding: 12px 0 4px; }
  .bs-handle-bar { width: 36px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.12); }
  .bs-pad { padding: 8px 24px 28px; }
  .bs-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .bs-title { font-size: 16px; font-weight: 700; color: #e4e4ec; }
  .bs-sub { font-size: 12px; color: #8b8d9a; margin-top: 2px; }
  .bs-close { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #8b8d9a; width: 30px; height: 30px; border-radius: 9px; cursor: pointer; font-size: 12px; font-family: inherit; flex-shrink: 0; transition: 0.2s; }
  .bs-close:hover { color: #e4e4ec; border-color: rgba(255,255,255,0.16); }
  .bs-account-card { background: rgba(100,160,220,0.06); border: 1px solid rgba(100,160,220,0.15); border-radius: 10px; padding: 14px; margin-bottom: 16px; }
  .bs-account-label { font-size: 10px; font-weight: 700; color: #64a0dc; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
  .bs-account-name { font-size: 14px; font-weight: 700; color: #e4e4ec; }
  .bs-account-meta { font-size: 11px; color: #8b8d9a; margin-top: 2px; }
  .bs-account-email { font-size: 11px; color: #7a9a5e; margin-top: 4px; font-weight: 600; }
  .bs-field { margin-bottom: 14px; }
  .bs-field label { display: block; font-size: 11px; font-weight: 600; color: #8b8d9a; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .bs-field input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; font-size: 13px; color: #e4e4ec; font-family: inherit; outline: none; transition: 0.2s; box-sizing: border-box; }
  .bs-field input:focus { border-color: rgba(122,154,94,0.4); box-shadow: 0 0 0 3px rgba(122,154,94,0.12); }
  .bs-error { font-size: 12px; color: #e05555; margin: 4px 0 12px; }
  .bs-btn-primary { width: 100%; padding: 12px 14px; background: #7a9a5e; color: #0a0d06; border: none; border-radius: 11px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; }
  .bs-btn-primary:hover:not(:disabled) { background: #8db36b; }
  .bs-btn-primary:disabled { opacity: 0.6; cursor: default; }
  .bs-detail-card { background: rgba(100,160,220,0.06); border: 1px solid rgba(100,160,220,0.15); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .bs-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .bs-label { font-size: 10px; color: #5a5c6a; margin-bottom: 2px; }
  .bs-value { font-size: 13px; font-weight: 600; color: #e4e4ec; }
  .bs-reset-card { background: rgba(212,160,48,0.06); border: 1px solid rgba(212,160,48,0.15); border-radius: 12px; padding: 16px; }
  .bs-reset-label { font-size: 10px; font-weight: 700; color: #e8b840; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; }
  .bs-reset-sub { font-size: 12px; color: #8b8d9a; margin-bottom: 12px; }
  .bs-reset-sub strong { color: #e4e4ec; }
  .bs-success-card { padding: 12px 14px; background: rgba(122,154,94,0.08); border: 1px solid rgba(122,154,94,0.2); border-radius: 8px; font-size: 12px; color: #8db36b; margin-bottom: 12px; }
  .bs-success-title { font-weight: 700; margin-bottom: 4px; }
  .bs-success-note { margin-top: 8px; font-size: 11px; color: #8b8d9a; }
  .bs-btn-warning { width: 100%; padding: 12px 14px; background: #e8b840; color: #1a1200; border: none; border-radius: 11px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; }
  .bs-btn-warning:hover:not(:disabled) { background: #f0c850; }
  .bs-btn-warning:disabled { opacity: 0.6; cursor: default; }

  @media (min-width: 768px) {
    .hume-root { align-items: center; padding: 24px; }
    .hume-phone { max-width: 420px; min-height: auto; border-radius: 24px; background: #0d0f15; border: 1px solid rgba(255,255,255,0.06); padding: 0 20px 28px; box-shadow: 0 24px 64px rgba(0,0,0,0.5); overflow: hidden; }
    .hume-hero { margin: 0 -20px; border-radius: 20px 20px 0 0; }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active { -webkit-box-shadow: 0 0 0 1000px #1e212e inset !important; -webkit-text-fill-color: rgb(228,228,236) !important; caret-color: rgb(228,228,236); transition: background-color 9999s ease-in-out 0s; border: 1px solid rgba(255,255,255,0.08) !important; }
</style>