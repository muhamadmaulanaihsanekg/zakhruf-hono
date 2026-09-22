<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { link, push } from 'svelte-spa-router';

  let { params = { slug: 'event-taaruf-dki' } } = $props<{ params?: { slug: string } }>();

  let isCalled = $state(false);
  let roomName = $state('Bilik 03 — Sofa Hijau');
  let partnerName = $state('Kandidat P-108');
  let isReady = $state(false);
  let isPartnerReady = $state(false);
  let sessionActive = $state(false);
  let secondsLeft = $state(15 * 60); // 15 minutes session
  let timerInterval: any = null;

  let showResultModal = $state(false);
  let selectedResult = $state<'lanjut' | 'ragu_ragu' | 'tidak_lanjut'>('lanjut');
  let notes = $state('');

  onMount(() => {
    // Check initial status or simulate live call
    setTimeout(() => {
      isCalled = true;
    }, 1500);
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  function confirmReady() {
    isReady = true;
    // simulate partner confirming ready
    setTimeout(() => {
      isPartnerReady = true;
      sessionActive = true;
      startSessionTimer();
    }, 1000);
  }

  function startSessionTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (secondsLeft <= 1) {
        clearInterval(timerInterval);
        sessionActive = false;
        showResultModal = true;
      } else {
        secondsLeft--;
      }
    }, 1000);
  }

  function formatTime(s: number) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  async function submitResult() {
    showResultModal = false;
    alert('Hasil ta\'aruf berhasil dicatat!');
    push('/');
  }
</script>

<div class="min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto bg-[#0B0B14] text-white">
  <!-- Top Bar -->
  <header class="flex items-center justify-between py-2 border-b border-white/10">
    <a href="/" use:link class="text-xs text-gray-400 hover:text-white">← Kembali</a>
    <span class="font-bold text-xs uppercase tracking-wider text-[#A78BFA]">Bilik Sesi Ta'aruf</span>
  </header>

  <!-- Global Called Modal / Popup -->
  {#if isCalled && !sessionActive && !isReady}
    <div class="my-auto bg-[#13131F] border border-[#8B5CF6]/50 rounded-[24px] p-6 text-center space-y-4 shadow-2xl animate-pulse">
      <div class="w-14 h-14 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] flex items-center justify-center mx-auto text-2xl">
        🔔
      </div>
      <div>
        <span class="text-[10px] uppercase font-bold tracking-wider text-[#e8b840]">Panggilan Ta'aruf</span>
        <h2 class="text-xl font-bold text-white mt-1">Kamu Dipanggil ke {roomName}</h2>
        <p class="text-xs text-gray-300 mt-1">Bersama: <strong>{partnerName}</strong></p>
      </div>

      <div class="bg-[#1C1A2E] p-4 rounded-xl border border-white/5 text-xs text-gray-400 text-left space-y-1">
        <p>• Silakan menuju ke bilik yang ditentukan.</p>
        <p>• Klik konfirmasi jika kamu dan pendamping sudah berada di bilik.</p>
      </div>

      <button
        onclick={confirmReady}
        class="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-full shadow-lg shadow-[#8B5CF6]/30"
      >
        Saya Sudah Siap di Bilik (Konfirmasi) →
      </button>
    </div>

  {:else if isReady && !sessionActive}
    <div class="my-auto bg-[#13131F] border border-white/10 rounded-[24px] p-8 text-center space-y-4 shadow-2xl">
      <div class="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto text-2xl">
        ⏳
      </div>
      <h3 class="text-lg font-bold">Menunggu Pasangan Konfirmasi</h3>
      <p class="text-xs text-gray-400">
        Konfirmasi kesiapanmu sudah tercatat. Sesi akan dimulai otomatis setelah pasangan menekan "Siap".
      </p>
    </div>

  {:else if sessionActive}
    <!-- Active Session with Live Countdown Timer Ring -->
    <div class="my-auto py-4 space-y-6">
      <div class="bg-[#13131F] border border-white/10 rounded-[24px] p-6 text-center shadow-xl space-y-4">
        <div class="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
          ● Sesi Berlangsung
        </div>

        <h2 class="text-xl font-bold">{roomName}</h2>
        <p class="text-xs text-gray-400">Pasangan: <strong class="text-white">{partnerName}</strong></p>

        <!-- Stopwatch / Ring Countdown -->
        <div class="w-36 h-36 rounded-full border-4 border-[#8B5CF6] flex flex-col items-center justify-center mx-auto shadow-lg shadow-[#8B5CF6]/20">
          <span class="text-3xl font-mono font-bold tracking-tight text-white">{formatTime(secondsLeft)}</span>
          <span class="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Sisa Waktu</span>
        </div>

        <button
          onclick={() => (showResultModal = true)}
          class="text-xs text-red-400 hover:underline pt-2"
        >
          Selesaikan Sesi Lebih Awal
        </button>
      </div>

      <!-- Ice Breaking Mini-Game Tools Drawer -->
      <div class="space-y-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Alat Bantu Ta'aruf:</p>
        <div class="grid grid-cols-2 gap-2.5">
          <a href="/games/pertanyaan" use:link class="p-3 bg-[#13131F] border border-white/10 rounded-xl hover:border-[#8B5CF6] text-left">
            <span class="text-base">❓</span>
            <p class="text-xs font-bold text-white mt-1">Pertanyaan</p>
            <p class="text-[10px] text-gray-400">5 Tahap Terarah</p>
          </a>
          <a href="/games/topik-acak" use:link class="p-3 bg-[#13131F] border border-white/10 rounded-xl hover:border-[#8B5CF6] text-left">
            <span class="text-base">🎲</span>
            <p class="text-xs font-bold text-white mt-1">Topik Acak</p>
            <p class="text-[10px] text-gray-400">70 Kartu Dadu</p>
          </a>
          <a href="/games/ini-itu" use:link class="p-3 bg-[#13131F] border border-white/10 rounded-xl hover:border-[#8B5CF6] text-left">
            <span class="text-base">⚖️</span>
            <p class="text-xs font-bold text-white mt-1">Ini atau Itu</p>
            <p class="text-[10px] text-gray-400">20 Kartu Pilihan</p>
          </a>
          <a href="/games/kebenaran" use:link class="p-3 bg-[#13131F] border border-white/10 rounded-xl hover:border-[#8B5CF6] text-left">
            <span class="text-base">🎭</span>
            <p class="text-xs font-bold text-white mt-1">2K1B</p>
            <p class="text-[10px] text-gray-400">2 Fakta 1 Palsu</p>
          </a>
        </div>
      </div>
    </div>
  {:else}
    <div class="my-auto text-center space-y-4 py-8">
      <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-2xl">
        🛋️
      </div>
      <h3 class="text-lg font-bold text-white">Menunggu Panggilan Bilik</h3>
      <p class="text-xs text-gray-400 max-w-xs mx-auto">
        Panitia akan memanggil giliranmu ke bilik ta'aruf. Pastikan selalu memantau layar ini.
      </p>
    </div>
  {/if}

  <!-- Catat Hasil Modal -->
  {#if showResultModal}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#13131F] border border-white/10 rounded-[24px] p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white text-center">Catat Hasil Ta'aruf</h3>
        <p class="text-xs text-gray-400 text-center">Bagaimana kesimpulan sesi ta'aruf bersama {partnerName}?</p>

        <div class="space-y-2">
          {#each [{ id: 'lanjut', label: '💚 Lanjut ke Tahap Berikutnya' }, { id: 'ragu_ragu', label: '🤔 Masih Ragu-ragu (Perlu Pikirkan)' }, { id: 'tidak_lanjut', label: '❌ Tidak Lanjut' }] as opt}
            <button
              onclick={() => (selectedResult = opt.id as any)}
              class="w-full p-3 text-xs font-semibold rounded-xl border text-left transition {selectedResult === opt.id ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white' : 'bg-[#1C1A2E] border-white/10 text-gray-300'}"
            >
              {opt.label}
            </button>
          {/each}
        </div>

        <div>
          <div class="block text-[10px] font-semibold uppercase text-gray-400 mb-1">Catatan Pribadi (Opsional)</div>
          <textarea
            bind:value={notes}
            rows="2"
            placeholder="Catatan untuk evaluasi pribadi..."
            class="w-full bg-[#1C1A2E] border border-white/10 rounded-xl p-3 text-xs text-white"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <button
            onclick={() => (showResultModal = false)}
            class="py-3 bg-[#1C1A2E] rounded-full text-xs font-semibold text-gray-400 border border-white/10"
          >
            Batal
          </button>
          <button
            onclick={submitResult}
            class="py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-full text-xs font-semibold text-white shadow-lg shadow-[#8B5CF6]/30"
          >
            Simpan Hasil
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="text-center text-xs text-gray-500 pb-2">
    Zakhruf ID • Sesi terjaga & adab ta'aruf
  </div>
</div>
