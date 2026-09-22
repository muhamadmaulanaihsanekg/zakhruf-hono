<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { link, push } from 'svelte-spa-router';
  import { Html5QrcodeScanner } from 'html5-qrcode';

  let { params = { slug: '' } } = $props<{ params?: { slug: string } }>();

  let scanResult = $state<string | null>(null);
  let scanSuccess = $state(false);
  let errorMessage = $state<string | null>(null);
  let scanner: Html5QrcodeScanner | null = null;

  onMount(() => {
    scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);
  });

  onDestroy(() => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
  });

  async function onScanSuccess(decodedText: string) {
    scanResult = decodedText;
    if (scanner) {
      scanner.clear();
    }

    try {
      const res = await fetch(`/api/events/${params.slug}/attendance/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: 1, // Current logged-in candidate
          qrToken: decodedText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        scanSuccess = true;
      } else {
        errorMessage = data.message || 'Gagal validasi QR.';
      }
    } catch (e) {
      errorMessage = 'Terjadi kesalahan saat memproses absensi.';
    }
  }

  function onScanFailure(error: any) {
    // ignore ongoing scanning frames
  }
</script>

<div class="min-h-screen p-4 flex flex-col justify-between max-w-md mx-auto bg-[#0B0B14] text-white">
  <!-- Top Bar -->
  <header class="flex items-center justify-between py-3 border-b border-white/10">
    <a href="/events/{params.slug}" use:link class="text-xs text-gray-400 hover:text-white">
      ← Kembali ke Event
    </a>
    <span class="font-bold text-xs uppercase tracking-wider text-[#A78BFA]">Absensi Scan QR</span>
  </header>

  <!-- Scanner Frame -->
  <div class="my-auto py-6">
    {#if !scanSuccess && !errorMessage}
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-white mb-1">Arahkan Kamera ke QR</h2>
        <p class="text-xs text-gray-400">Scan barcode/QR code yang ditampilkan oleh panitia event.</p>
      </div>

      <div class="bg-[#13131F] p-4 rounded-[20px] border border-white/10 overflow-hidden shadow-2xl">
        <div id="qr-reader" class="w-full text-black"></div>
      </div>

    {:else if scanSuccess}
      <div class="bg-[#13131F] border border-emerald-500/30 rounded-[20px] p-6 text-center shadow-xl space-y-4">
        <div class="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <h2 class="text-xl font-bold text-white">Absensi Berhasil!</h2>
        <p class="text-xs text-gray-300">Kamu telah tercatat hadir pada kegiatan ta'aruf ini.</p>
        <button
          onclick={() => push(`/events/${params.slug}/taaruf`)}
          class="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold rounded-full shadow-lg"
        >
          Masuk ke Bilik Ta'aruf →
        </button>
      </div>

    {:else if errorMessage}
      <div class="bg-[#13131F] border border-red-500/30 rounded-[20px] p-6 text-center shadow-xl space-y-4">
        <div class="w-14 h-14 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto text-2xl">
          ✕
        </div>
        <h2 class="text-xl font-bold text-white">Gagal Absen</h2>
        <p class="text-xs text-gray-300">{errorMessage}</p>
        <button
          onclick={() => window.location.reload()}
          class="w-full py-3 bg-[#1C1A2E] text-white text-xs font-semibold rounded-full border border-white/10"
        >
          Coba Scan Ulang
        </button>
      </div>
    {/if}
  </div>

  <div class="text-center text-xs text-gray-500 pb-4">
    Token QR diperbarui otomatis oleh panitia setiap 30 menit.
  </div>
</div>
