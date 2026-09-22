<script lang="ts">
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';

  let eventTitle = $state('Ta\'aruf Akbar DKI Jakarta 2026');
  let rooms = $state([
    { id: 1, name: 'Bilik 01 — Sofa Emas', status: 'occupied', candidateA: 'Ahmad (L-102)', candidateB: 'Fatimah (P-105)', timer: '08:45' },
    { id: 2, name: 'Bilik 02 — Meja Kayu', status: 'active', candidateA: 'Rizky (L-104)', candidateB: 'Aisyah (P-112)', timer: '14:20' },
    { id: 3, name: 'Bilik 03 — Sofa Hijau', status: 'waiting', candidateA: 'Fauzan (L-109)', candidateB: 'Zahra (P-108)', timer: '00:00' },
  ]);

  let queues = $state([
    { id: 1, candA: 'Zulfikar (L-110)', candB: 'Nurul (P-115)', status: 'waiting', pos: 1 },
    { id: 2, candA: 'Irfan (L-114)', candB: 'Hana (P-118)', status: 'waiting', pos: 2 },
  ]);

  let showQrModal = $state(false);
  let qrToken = $state('ZKQR_1_1_' + Date.now());

  function callQueue(queueId: number) {
    alert(`Pasangan antrean #${queueId} telah dipanggil ke bilik!`);
  }

  function generateQr() {
    qrToken = 'ZKQR_1_1_' + Date.now();
    showQrModal = true;
  }
</script>

<div class="min-h-screen bg-[#0B0B14] text-white p-6 max-w-4xl mx-auto">
  <!-- Top Admin Header -->
  <header class="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
    <div class="flex items-center space-x-3">
      <img src="/zakhruf.svg" alt="Zakhruf" class="w-8 h-8" />
      <div>
        <h1 class="font-bold text-lg text-white">Panel Panitia & Admin</h1>
        <p class="text-xs text-gray-400">{eventTitle}</p>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <button
        onclick={generateQr}
        class="px-4 py-2 bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] text-xs font-semibold rounded-full hover:bg-[#8B5CF6]/30 flex items-center gap-1.5"
      >
        <span>📱</span>
        <span>Buka QR Absensi</span>
      </button>
      <a
        href="/"
        use:link
        class="px-4 py-2 bg-[#1C1A2E] text-xs font-semibold rounded-full border border-white/10 hover:border-white/20"
      >
        Mode Peserta
      </a>
    </div>
  </header>

  <!-- Metric Overview Cards -->
  <div class="grid grid-cols-4 gap-4 mb-8">
    <div class="bg-[#13131F] border border-white/10 rounded-[18px] p-4 text-center">
      <p class="text-[11px] uppercase font-bold text-gray-400">Total Hadir</p>
      <p class="text-2xl font-extrabold text-white mt-1">48</p>
    </div>
    <div class="bg-[#13131F] border border-white/10 rounded-[18px] p-4 text-center">
      <p class="text-[11px] uppercase font-bold text-gray-400">Bilik Aktif</p>
      <p class="text-2xl font-extrabold text-emerald-400 mt-1">3 / 4</p>
    </div>
    <div class="bg-[#13131F] border border-white/10 rounded-[18px] p-4 text-center">
      <p class="text-[11px] uppercase font-bold text-gray-400">Antrean Menunggu</p>
      <p class="text-2xl font-extrabold text-yellow-400 mt-1">5</p>
    </div>
    <div class="bg-[#13131F] border border-white/10 rounded-[18px] p-4 text-center">
      <p class="text-[11px] uppercase font-bold text-gray-400">Sesi Selesai</p>
      <p class="text-2xl font-extrabold text-[#A78BFA] mt-1">12</p>
    </div>
  </div>

  <!-- Room Door-Plates Grid -->
  <div class="mb-8">
    <h2 class="text-base font-bold text-white mb-4 flex items-center gap-2">
      <span>🚪</span>
      <span>Status Bilik Ta'aruf (Live)</span>
    </h2>

    <div class="grid grid-cols-3 gap-4">
      {#each rooms as room}
        <div class="bg-[#13131F] border border-white/10 rounded-[20px] p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="font-bold text-xs text-white">{room.name}</span>
            <span class="w-2.5 h-2.5 rounded-full {room.status === 'occupied' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-yellow-400'}"></span>
          </div>

          <div class="bg-[#1C1A2E]/80 border border-white/5 rounded-xl p-3 space-y-1 mb-4 text-xs">
            <p><span class="text-gray-400">Ikhwan:</span> <strong class="text-white">{room.candidateA}</strong></p>
            <p><span class="text-gray-400">Akhwat:</span> <strong class="text-white">{room.candidateB}</strong></p>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
            <span class="text-gray-400">Timer Sesi:</span>
            <span class="text-[#e8b840] font-bold">{room.timer}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Queue Management (Match Tickets) -->
  <div>
    <h2 class="text-base font-bold text-white mb-4 flex items-center gap-2">
      <span>🎟️</span>
      <span>Antrean Ta'aruf Berikutnya</span>
    </h2>

    <div class="space-y-3">
      {#each queues as q}
        <div class="bg-[#13131F] border border-white/10 rounded-[18px] p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-[#A78BFA]">
              #{q.pos}
            </div>
            <div>
              <p class="text-sm font-bold text-white">{q.candA} & {q.candB}</p>
              <p class="text-xs text-gray-400">Menunggu panggilan ke bilik kosong</p>
            </div>
          </div>

          <button
            onclick={() => callQueue(q.id)}
            class="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-xs rounded-full shadow-md"
          >
            Panggil Pasangan 🔔
          </button>
        </div>
      {/each}
    </div>
  </div>

  <!-- QR Modal for Admin Display -->
  {#if showQrModal}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="bg-[#13131F] border border-white/15 rounded-[24px] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white">QR Code Absensi Peserta</h3>
        <p class="text-xs text-gray-400">Tampilkan layar ini di meja registrasi agar di-scan peserta.</p>

        <!-- Simulated Visual QR Box -->
        <div class="w-56 h-56 bg-white p-4 rounded-2xl mx-auto flex flex-col items-center justify-center shadow-inner">
          <div class="text-black font-mono text-[9px] break-all leading-tight">
            [QR-CODE DATA]<br />
            {qrToken}
          </div>
        </div>

        <div class="inline-block px-4 py-1.5 rounded-full bg-[#1C1A2E] text-xs text-[#e8b840] font-mono">
          Rotasi otomatis setiap 30 menit
        </div>

        <button
          onclick={() => (showQrModal = false)}
          class="w-full py-3.5 bg-[#8B5CF6] text-white text-xs font-bold rounded-full shadow-lg"
        >
          Tutup QR Modal
        </button>
      </div>
    </div>
  {/if}
</div>
