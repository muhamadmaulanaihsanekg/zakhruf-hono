<script lang="ts">
  import { onDestroy } from 'svelte';
  import { link } from 'svelte-spa-router';

  let round = $state(1);
  let writer = $state<'kamu' | 'pasangan'>('kamu');
  let phase = $state<'tulis' | 'tebak' | 'reveal'>('tulis');

  let fact1 = $state('');
  let fact2 = $state('');
  let fake = $state('');
  let shuffledStatements = $state<{ text: string; isFake: boolean }[]>([]);
  let guessIndex = $state<number | null>(null);

  let timeLeft = $state(30);
  let isTimerRunning = $state(false);
  let timerId: any = null;

  let yourScore = $state(0);
  let partnerScore = $state(0);

  function startWriting() {
    fact1 = '';
    fact2 = '';
    fake = '';
    guessIndex = null;
    timeLeft = 30;
    isTimerRunning = true;
    phase = 'tulis';

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      if (timeLeft <= 1) {
        finishWriting();
      } else {
        timeLeft--;
      }
    }, 1000);
  }

  function finishWriting() {
    if (timerId) clearInterval(timerId);
    isTimerRunning = false;

    if (writer === 'kamu') {
      const items = [
        { text: fact1.trim() || 'Fakta 1 tentangku', isFake: false },
        { text: fact2.trim() || 'Fakta 2 tentangku', isFake: false },
        { text: fake.trim() || 'Pernyataan bohong/rekaan', isFake: true },
      ];
      // shuffle
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      shuffledStatements = items;
    }
    phase = 'tebak';
  }

  function makeGuess(index: number) {
    guessIndex = index;
    const isCorrect = shuffledStatements[index].isFake;
    if (isCorrect) {
      if (writer === 'kamu') partnerScore++;
      else yourScore++;
    }
    phase = 'reveal';
  }

  function nextRound() {
    if (writer === 'kamu') {
      writer = 'pasangan';
    } else {
      writer = 'kamu';
      round++;
    }
    phase = 'tulis';
    guessIndex = null;
  }

  onDestroy(() => {
    if (timerId) clearInterval(timerId);
  });
</script>

<div class="min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto bg-[#0B0B14] text-white">
  <!-- Top Bar -->
  <div class="flex items-center justify-between py-2 border-b border-white/10">
    <a href="/" use:link class="text-xs text-gray-400 hover:text-white">← Keluar Game</a>
    <span class="text-xs font-semibold text-[#A78BFA]">Ronde {round} / 3 • {writer === 'kamu' ? 'Giliran Kamu Tulis' : 'Giliran Pasangan'}</span>
  </div>

  <!-- Content -->
  <div class="my-auto py-4">
    {#if phase === 'tulis'}
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-white mb-1">2 Kebenaran 1 Bohong</h2>
        <p class="text-xs text-gray-400">Tulis 2 fakta asli tentang dirimu dan 1 pernyataan bohong.</p>
        <div class="mt-3 inline-block px-4 py-1 rounded-full bg-[#1C1A2E] text-xs font-mono font-bold text-[#e8b840]">
          ⏱️ Sisa Waktu: {timeLeft}s
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-1">Fakta Asli 1</div>
          <input bind:value={fact1} placeholder="Contoh: Pernah naik gunung Rinjani" class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-xs text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-1">Fakta Asli 2</div>
          <input bind:value={fact2} placeholder="Contoh: Tidak suka durian" class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-xs text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-red-400 mb-1">Pernyataan Bohong</div>
          <input bind:value={fake} placeholder="Contoh: Bisa berbicara 5 bahasa asing" class="w-full bg-[#1C1A2E] border border-red-500/30 rounded-[14px] px-4 py-3 text-xs text-white" />
        </div>
      </div>

      <button
        onclick={finishWriting}
        class="w-full mt-6 py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-full shadow-lg"
      >
        Selesai Menulis & Tampilkan ke Pasangan →
      </button>

    {:else if phase === 'tebak'}
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-white mb-1">Tebak Mana yang Bohong!</h2>
        <p class="text-xs text-gray-400">Pilih satu pernyataan di bawah yang menurutmu adalah kebohongan.</p>
      </div>

      <div class="space-y-3">
        {#each shuffledStatements as s, i}
          <button
            onclick={() => makeGuess(i)}
            class="w-full p-4 rounded-[16px] bg-[#13131F] border border-white/10 hover:border-[#8B5CF6] text-left text-xs font-semibold leading-relaxed transition"
          >
            {i + 1}. "{s.text}"
          </button>
        {/each}
      </div>

    {:else if phase === 'reveal'}
      <div class="bg-[#13131F] border border-white/10 rounded-[24px] p-6 text-center space-y-4 shadow-2xl">
        <div class="text-3xl">
          {guessIndex !== null && shuffledStatements[guessIndex].isFake ? '🎉' : '😅'}
        </div>
        <h3 class="text-xl font-bold text-white">
          {guessIndex !== null && shuffledStatements[guessIndex].isFake ? 'Tebakan Tepat!' : 'Tertipu! Itu Fakta Asli'}
        </h3>
        <p class="text-xs text-gray-300">
          Pernyataan yang bohong adalah: <br />
          <strong class="text-red-400 text-sm font-bold">
            "{shuffledStatements.find((s) => s.isFake)?.text}"
          </strong>
        </p>

        <button
          onclick={nextRound}
          class="w-full py-3.5 bg-[#8B5CF6] text-white text-xs font-bold rounded-full shadow-lg"
        >
          {round >= 3 && writer === 'pasangan' ? 'Lihat Skor Akhir' : 'Lanjut Ronde Berikutnya →'}
        </button>
      </div>
    {/if}
  </div>

  <div class="text-center text-xs text-gray-500 pb-2">
    Skor: Kamu ({yourScore}) • Pasangan ({partnerScore})
  </div>
</div>
