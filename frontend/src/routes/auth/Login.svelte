<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { auth } from '../../lib/auth.svelte';
  import BottomSheet from '../../components/BottomSheet.svelte';
  import {
    IconUser,
    IconLock,
    IconSearch,
    IconCheck,
    IconX,
    IconKey,
    IconArrowRight,
  } from '@tabler/icons-svelte';

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
  let lookupNama = $state('');
  let lookupDaerah = $state('');
  let lookupDesa = $state('');
  let lookupLoading = $state(false);
  let lookupDone = $state(false);
  let lookupError = $state('');
  let lookupResults = $state<Array<{ nama: string; daerah: string; desa: string; kelompok: string; email: string }>>([]);

  // Bottom sheet verification state
  let sheetOpen = $state(false);
  let sheetStep = $state<'confirm' | 'detail'>('confirm');
  let selectedResult = $state<{ nama: string; daerah: string; desa: string; kelompok: string; email: string } | null>(null);
  let verifyEmail = $state('');
  let verifyLoading = $state(false);
  let verifyError = $state('');
  let resetSuccess = $state('');
  let resetError = $state('');
  let resetLoading = $state(false);

  function handleLogin(e: Event) {
    e.preventDefault();
    errors = {};
    if (!email) { errors.email = 'Email wajib diisi'; return; }
    if (!password) { errors.password = 'Password wajib diisi'; return; }
    loading = true;
    setTimeout(() => {
      loading = false;
      auth.loginWithEmail(email);
      window.location.hash = '#/';
    }, 400);
  }

  function quickLoginAs(id: number) {
    loading = true;
    setTimeout(() => {
      loading = false;
      auth.loginAs(id);
      window.location.hash = '#/';
    }, 200);
  }

  function submitLookup() {
    if (lookupNama.trim().length < 2) {
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
          nama: `${lookupNama.slice(0, 3)}***`,
          daerah: lookupDaerah || 'DKI Jakarta',
          desa: lookupDesa || 'Jakarta Selatan',
          kelompok: 'Tebet',
          email: 'fa*****@email.com',
        },
      ];
      lookupDone = true;
    }, 400);
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

<div class="min-h-screen bg-[#07090d] flex justify-center items-start md:items-center md:p-6 font-['Geist',sans-serif]">
  <div class="w-full max-w-[420px] min-h-screen md:min-h-0 bg-[#07090d] md:bg-[#0d0f15] px-4 py-6 md:px-6 md:py-8 md:rounded-3xl md:border md:border-white/[0.06] md:shadow-2xl flex flex-col justify-between">
    <!-- Brand & Hero -->
    <div>
      <div class="text-center mb-6">
        <div class="font-['Cormorant_Garamond',serif] text-4xl font-bold text-[#7a9a5e] tracking-tight">
          Zakhruf ID
        </div>
        <p class="text-xs text-[#8b8d9a] mt-1.5 leading-relaxed">
          Platform ta'aruf mandiri & pertemanan syar'i untuk generasi muslim.
        </p>
      </div>

      <!-- Hero Card with Taglines -->
      <div class="relative overflow-hidden bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.08] rounded-2xl p-4.5 mb-6 text-center shadow-lg">
        <div class="text-[10px] font-bold uppercase tracking-wider text-[#e8b840] mb-1">
          Biro Jodoh Mandiri
        </div>
        <div class="text-sm font-semibold text-[#e4e4ec] leading-relaxed [&_em]:text-[#7a9a5e] [&_em]:not-italic [&_em]:font-bold">
          {@html taglines[0]}
        </div>
      </div>

      <!-- Quick Switcher for Testing (Demo Mode) -->
      <div class="mb-5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
        <div class="text-[10px] font-bold uppercase tracking-wider text-[#8b8d9a] mb-2 text-center">
          ⚡ Demo Switch (Cepat Masuk)
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            onclick={() => quickLoginAs(1)}
            class="p-2 rounded-xl bg-[#c878b4]/10 border border-[#c878b4]/25 hover:bg-[#c878b4]/20 text-left transition-colors cursor-pointer"
          >
            <div class="text-xs font-bold text-[#c878b4]">Fatimah (Akhwat)</div>
            <div class="text-[10px] text-[#8b8d9a]">Jakarta · 24 th</div>
          </button>
          <button
            type="button"
            onclick={() => quickLoginAs(2)}
            class="p-2 rounded-xl bg-[#64a0dc]/10 border border-[#64a0dc]/25 hover:bg-[#64a0dc]/20 text-left transition-colors cursor-pointer"
          >
            <div class="text-xs font-bold text-[#64a0dc]">Ahmad (Ikhwan)</div>
            <div class="text-[10px] text-[#8b8d9a]">Surabaya · 27 th</div>
          </button>
        </div>
      </div>

      <!-- Login Form -->
      <form onsubmit={handleLogin} class="space-y-3.5">
        <div>
          <label for="lg-email" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase tracking-wider">Email</label>
          <div class="relative">
            <input
              id="lg-email"
              type="email"
              bind:value={email}
              placeholder="nama@email.com"
              class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50 transition-colors"
            />
          </div>
          {#if errors.email}
            <div class="text-xs text-[#e05555] mt-1">{errors.email}</div>
          {/if}
        </div>

        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label for="lg-pass" class="text-[11px] font-semibold text-[#8b8d9a] uppercase tracking-wider">Password</label>
            <button
              type="button"
              onclick={() => (lookupOpen = true)}
              class="text-[11px] text-[#7a9a5e] hover:text-[#8db36b] bg-transparent border-none cursor-pointer p-0"
            >
              Lupa password?
            </button>
          </div>
          <input
            id="lg-pass"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50 transition-colors"
          />
          {#if errors.password}
            <div class="text-xs text-[#e05555] mt-1">{errors.password}</div>
          {/if}
        </div>

        <div class="flex items-center justify-between pt-1">
          <label class="flex items-center gap-2 text-xs text-[#8b8d9a] cursor-pointer">
            <input
              type="checkbox"
              bind:checked={remember}
              class="rounded bg-white/5 border-white/10 text-[#7a9a5e] focus:ring-0"
            />
            <span>Ingat saya</span>
          </label>

          <button
            type="button"
            onclick={() => (lookupOpen = true)}
            class="text-xs text-[#8b8d9a] hover:text-[#e4e4ec] bg-transparent border-none cursor-pointer p-0 underline"
          >
            Cek Eksistensi Akun
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full py-3 bg-[#7a9a5e] hover:bg-[#8db36b] text-[#0a0d06] font-bold rounded-[11px] text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-lg shadow-[#7a9a5e]/20"
        >
          {#if loading}
            <span class="w-4 h-4 border-2 border-[#0a0d06]/30 border-t-[#0a0d06] rounded-full animate-spin"></span>
            <span>Memproses...</span>
          {:else}
            <span>Masuk</span>
            <IconArrowRight size={16} />
          {/if}
        </button>
      </form>
    </div>

    <!-- Footer link to Onboarding -->
    <div class="text-center pt-6 pb-2 text-xs text-[#8b8d9a] border-t border-white/[0.04] mt-6">
      Belum memiliki akun?
      <a href="/onboarding" use:link class="text-[#7a9a5e] font-bold no-underline hover:underline ml-1">
        Daftar Sebagai Kandidat
      </a>
    </div>
  </div>

  <!-- Modal Lookup Akun -->
  {#if lookupOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div class="relative w-full max-w-[420px] max-h-[88vh] overflow-y-auto bg-gradient-to-br from-[#171a24] to-[#0d0f15] border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-['Cormorant_Garamond',serif] text-xl font-bold text-[#e4e4ec]">Cari Akun Terdaftar</h3>
            <p class="text-xs text-[#8b8d9a] mt-0.5">Ketik nama dan daerah untuk mengecek akun</p>
          </div>
          <button
            type="button"
            onclick={() => (lookupOpen = false)}
            class="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#8b8d9a] hover:text-[#e4e4ec] flex items-center justify-center text-xs cursor-pointer"
          >
            <IconX size={16} />
          </button>
        </div>

        <div class="space-y-3 mb-4">
          <div>
            <label for="lk-nama" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Nama Lengkap</label>
            <input
              id="lk-nama"
              bind:value={lookupNama}
              onkeydown={(e) => e.key === 'Enter' && submitLookup()}
              placeholder="cth: Fatimah"
              class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
            />
          </div>
          <div>
            <label for="lk-daerah" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Daerah (Opsional)</label>
            <input
              id="lk-daerah"
              bind:value={lookupDaerah}
              onkeydown={(e) => e.key === 'Enter' && submitLookup()}
              placeholder="cth: Jakarta Barat"
              class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
            />
          </div>
          <div>
            <label for="lk-desa" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Desa (Opsional)</label>
            <input
              id="lk-desa"
              bind:value={lookupDesa}
              onkeydown={(e) => e.key === 'Enter' && submitLookup()}
              placeholder="cth: Kel. Kalideres"
              class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
            />
          </div>
        </div>

        {#if lookupError}
          <div class="text-xs text-[#e05555] mb-3">{lookupError}</div>
        {/if}

        <button
          type="button"
          disabled={lookupLoading}
          onclick={submitLookup}
          class="w-full py-3 px-3.5 bg-[#7a9a5e] hover:bg-[#8db36b] text-[#0a0d06] font-bold rounded-[11px] text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {#if lookupLoading}
            <span class="w-3.5 h-3.5 border-2 border-[#0a0d06]/30 border-t-[#0a0d06] rounded-full animate-spin"></span>
          {:else}
            <IconSearch size={16} />
            <span>Cari Akun</span>
          {/if}
        </button>

        {#if lookupDone}
          <div class="text-xs text-[#8db36b] font-semibold mt-4">{lookupResults.length} akun ditemukan</div>
          <div class="grid gap-2 mt-2.5">
            {#each lookupResults as r}
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                onclick={() => openSheet(r)}
                class="bg-white/[0.02] hover:bg-[#7a9a5e]/10 border border-white/[0.06] hover:border-[#7a9a5e]/30 rounded-xl p-3 cursor-pointer transition-colors"
              >
                <div class="text-sm font-bold text-[#e4e4ec]">{r.nama}</div>
                <div class="text-[11px] text-[#8b8d9a] mt-0.5">{r.daerah} · {r.desa} · {r.kelompok}</div>
                <div class="text-[11px] text-[#7a9a5e] font-semibold mt-1">{r.email}</div>
              </div>
            {/each}
          </div>
          {#if lookupResults.length === 0}
            <div class="text-xs text-[#5a5c6a] text-center mt-3.5">Tidak ada akun yang cocok. Kamu bisa daftar baru.</div>
          {/if}
        {/if}

        <div class="text-[10px] text-[#5a5c6a] text-center mt-4">
          Data nama & email ditampilkan terpotong untuk melindungi privasi.
        </div>
      </div>
    </div>
  {/if}

  <!-- Bottom Sheet: Detail & Reset Password -->
  <BottomSheet
    show={sheetOpen && selectedResult !== null}
    title={sheetStep === 'confirm' ? 'Konfirmasi Akun Kamu' : 'Detail Akun & Reset'}
    subtitle={sheetStep === 'confirm' ? 'Verifikasi email pemilik akun' : 'Informasi status akun dan opsi reset password'}
    maxWidth="420px"
    onclose={() => (sheetOpen = false)}
  >
    {#if selectedResult}
      {#if sheetStep === 'confirm'}
        <p class="text-xs text-[#8b8d9a] mb-4">
          Masukkan email lengkap kamu untuk memverifikasi kepemilikan akun <strong class="text-white">{selectedResult.nama}</strong>.
        </p>

        <div class="mb-4">
          <label for="vr-email" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase tracking-wider">Email Lengkap</label>
          <input
            id="vr-email"
            type="email"
            bind:value={verifyEmail}
            placeholder="cth: fatimah.azzahra@email.com"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
          {#if verifyError}
            <div class="text-xs text-[#e05555] mt-1.5">{verifyError}</div>
          {/if}
        </div>

        <button
          type="button"
          disabled={verifyLoading}
          onclick={submitVerify}
          class="w-full py-3 bg-[#7a9a5e] hover:bg-[#8db36b] text-[#0a0d06] font-bold rounded-[11px] text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {#if verifyLoading}
            <span class="w-3.5 h-3.5 border-2 border-[#0a0d06]/30 border-t-[#0a0d06] rounded-full animate-spin"></span>
          {:else}
            <span>Verifikasi Email</span>
          {/if}
        </button>
      {:else}
        <!-- Step: Detail -->
        <div class="space-y-3">
          <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-[#8b8d9a]">Nama:</span>
              <span class="font-bold text-[#e4e4ec]">{selectedResult.nama}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#8b8d9a]">Wilayah:</span>
              <span class="text-[#e4e4ec]">{selectedResult.daerah} · {selectedResult.desa}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#8b8d9a]">Status:</span>
              <span class="text-[#8db36b] font-bold">Terdaftar Aktif</span>
            </div>
          </div>

          {#if resetSuccess}
            <div class="p-3 rounded-xl bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-xs text-[#8db36b] flex items-center gap-2">
              <IconCheck size={16} />
              <span>{resetSuccess}</span>
            </div>
          {:else}
            <button
              type="button"
              disabled={resetLoading}
              onclick={handleReset}
              class="w-full py-3 bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] font-bold rounded-[11px] text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#e8b840]/20"
            >
              <IconKey size={16} />
              <span>{resetLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}</span>
            </button>
          {/if}
        </div>
      {/if}
    {/if}
  </BottomSheet>
</div>
