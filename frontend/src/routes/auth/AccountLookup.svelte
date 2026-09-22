<script lang="ts">
  import { link } from 'svelte-spa-router';

  let lookupNama = $state('');
  let lookupDaerah = $state('');
  let lookupDesa = $state('');
  let lookupLoading = $state(false);
  let lookupDone = $state(false);
  let lookupError = $state('');
  let lookupResults = $state<Array<{ nama: string; daerah: string; desa: string; kelompok: string; email: string }>>([]);

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
    }, 500);
  }
</script>

<div class="min-h-screen bg-[#07090d] flex justify-center items-start md:items-center md:p-6 font-['Geist',sans-serif]">
  <div class="w-full max-w-[420px] min-h-screen md:min-h-0 bg-[#07090d] md:bg-[#0d0f15] px-4 py-6 md:px-6 md:py-8 md:rounded-3xl md:border md:border-white/[0.06] md:shadow-2xl flex flex-col">
    <!-- Back to login -->
    <div class="mb-4">
      <a
        href="/login"
        use:link
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[#8b8d9a] hover:text-[#e4e4ec] no-underline transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Kembali ke Login</span>
      </a>
    </div>

    <h1 class="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#e4e4ec] mb-1">
      Cek Eksistensi Akun
    </h1>
    <p class="text-xs text-[#8b8d9a] mb-5 leading-relaxed">
      Cari tahu apakah kamu sudah terdaftar sebagai kandidat di Zakhruf ID.
    </p>

    <div class="bg-gradient-to-br from-[#1a1d27]/80 to-[#0d0f15]/90 border border-white/[0.06] rounded-2xl p-5 space-y-3.5 mb-4">
      <div>
        <label for="acc-name" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Nama Lengkap</label>
        <input
          id="acc-name"
          bind:value={lookupNama}
          placeholder="cth: Fatimah"
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
        />
      </div>

      <div>
        <label for="acc-daerah" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Daerah (Opsional)</label>
        <input
          id="acc-daerah"
          bind:value={lookupDaerah}
          placeholder="cth: DKI Jakarta"
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
        />
      </div>

      <div>
        <label for="acc-desa" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Desa (Opsional)</label>
        <input
          id="acc-desa"
          bind:value={lookupDesa}
          placeholder="cth: Jakarta Selatan"
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
        />
      </div>

      {#if lookupError}
        <div class="text-xs text-[#e05555]">{lookupError}</div>
      {/if}

      <button
        type="button"
        disabled={lookupLoading}
        onclick={submitLookup}
        class="w-full py-3 bg-[#7a9a5e] hover:bg-[#8db36b] text-[#0a0d06] font-bold rounded-[11px] text-[13px] transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        {#if lookupLoading}
          <span class="w-3.5 h-3.5 border-2 border-[#0a0d06]/30 border-t-[#0a0d06] rounded-full animate-spin"></span>
        {:else}
          <span>Cek Akun</span>
        {/if}
      </button>
    </div>

    {#if lookupDone}
      <div class="space-y-2">
        <div class="text-xs text-[#8db36b] font-semibold">{lookupResults.length} akun ditemukan</div>
        {#each lookupResults as r}
          <div class="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
            <div class="text-sm font-bold text-[#e4e4ec]">{r.nama}</div>
            <div class="text-xs text-[#8b8d9a] mt-0.5">{r.daerah} · {r.desa} · {r.kelompok}</div>
            <div class="text-xs text-[#7a9a5e] font-semibold mt-1">Email: {r.email}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
