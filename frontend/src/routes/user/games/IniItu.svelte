<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { iniituDeck } from '../../../lib/taarufData';

  let idx = $state(0);
  let step = $state<'pilih' | 'partner' | 'hasil'>('pilih');
  let yourChoice = $state<string | null>(null);
  let partnerChoice = $state<string | null>(null);
  let score = $state(0);

  let currentCard = $derived(iniituDeck[idx]);
  let isMatch = $derived(yourChoice !== null && yourChoice === partnerChoice);
  let isDone = $derived(idx >= iniituDeck.length);

  function pickYou(val: string) {
    yourChoice = val;
    step = 'partner';
  }

  function pickPartner(val: string) {
    partnerChoice = val;
    if (val === yourChoice) {
      score++;
    }
    step = 'hasil';
  }

  function next() {
    yourChoice = null;
    partnerChoice = null;
    step = 'pilih';
    idx++;
  }

  function reset() {
    idx = 0;
    step = 'pilih';
    yourChoice = null;
    partnerChoice = null;
    score = 0;
  }
</script>

<div class="min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto bg-[#0B0B14] text-white">
  <!-- Header -->
  <div>
    <div class="flex items-center justify-between py-2 mb-2">
      <a href="/" use:link class="text-xs text-gray-400 hover:text-white">← Keluar Game</a>
      <span class="text-xs font-semibold text-gray-400">
        {#if !isDone}
          Kartu {idx + 1} / {iniituDeck.length}
        {/if}
      </span>
    </div>
  </div>

  <!-- Game Body -->
  <div class="my-auto py-4">
    {#if !isDone}
      <div class="text-center mb-6">
        <h2 class="text-lg font-bold text-white mb-1">Ini atau Itu?</h2>
        <p class="text-xs text-gray-400">
          {#if step === 'pilih'}
            Pilihan <span class="text-[#A78BFA] font-bold">Kamu</span>:
          {:else if step === 'partner'}
            Tebak Pilihan <span class="text-[#e8b840] font-bold">Pasanganmu</span>:
          {:else}
            Hasil Kecocokan:
          {/if}
        </p>
      </div>

      {#if step === 'pilih'}
        <div class="space-y-4">
          <button
            onclick={() => pickYou(currentCard.a)}
            class="w-full p-6 bg-[#13131F] hover:bg-[#8B5CF6]/20 border border-white/10 hover:border-[#8B5CF6] rounded-[20px] text-center font-bold text-base transition shadow-xl"
          >
            {currentCard.a}
          </button>
          <div class="text-center text-xs font-bold text-gray-500 uppercase">ATAU</div>
          <button
            onclick={() => pickYou(currentCard.b)}
            class="w-full p-6 bg-[#13131F] hover:bg-[#8B5CF6]/20 border border-white/10 hover:border-[#8B5CF6] rounded-[20px] text-center font-bold text-base transition shadow-xl"
          >
            {currentCard.b}
          </button>
        </div>

      {:else if step === 'partner'}
        <div class="space-y-4">
          <button
            onclick={() => pickPartner(currentCard.a)}
            class="w-full p-6 bg-[#13131F] hover:bg-[#e8b840]/20 border border-white/10 hover:border-[#e8b840] rounded-[20px] text-center font-bold text-base transition shadow-xl"
          >
            {currentCard.a}
          </button>
          <div class="text-center text-xs font-bold text-gray-500 uppercase">ATAU</div>
          <button
            onclick={() => pickPartner(currentCard.b)}
            class="w-full p-6 bg-[#13131F] hover:bg-[#e8b840]/20 border border-white/10 hover:border-[#e8b840] rounded-[20px] text-center font-bold text-base transition shadow-xl"
          >
            {currentCard.b}
          </button>
        </div>

      {:else if step === 'hasil'}
        <div class="bg-[#13131F] border {isMatch ? 'border-emerald-500/40' : 'border-red-500/40'} rounded-[24px] p-6 text-center space-y-4 shadow-2xl">
          <div class="text-3xl">
            {isMatch ? '💖' : '🤝'}
          </div>
          <h3 class="text-xl font-bold text-white">
            {isMatch ? 'Sama-sama Cocok!' : 'Berbeda Tapi Saling Melengkapi'}
          </h3>
          <div class="bg-[#1C1A2E] p-4 rounded-xl text-xs space-y-2 border border-white/5">
            <p><span class="text-gray-400">Pilihanmu:</span> <strong class="text-white">{yourChoice}</strong></p>
            <p><span class="text-gray-400">Pilihan Pasangan:</span> <strong class="text-white">{partnerChoice}</strong></p>
          </div>
          <button
            onclick={next}
            class="w-full py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-full shadow-lg"
          >
            Lanjut ke Kartu Berikutnya →
          </button>
        </div>
      {/if}

    {:else}
      <!-- Final Score Recap -->
      <div class="bg-[#13131F] border border-white/10 rounded-[24px] p-8 text-center space-y-4 shadow-2xl">
        <div class="w-16 h-16 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] flex items-center justify-center mx-auto text-3xl font-bold">
          {Math.round((score / iniituDeck.length) * 100)}%
        </div>
        <h2 class="text-2xl font-bold text-white">Selesai 20 Pertanyaan!</h2>
        <p class="text-xs text-gray-300">
          Tingkat keselarasan jawaban kalian: <strong class="text-white">{score} dari {iniituDeck.length}</strong> pertanyaan cocok.
        </p>
        <button
          onclick={reset}
          class="w-full py-3.5 bg-[#8B5CF6] text-white font-bold text-xs rounded-full shadow-lg"
        >
          Main Ulang
        </button>
      </div>
    {/if}
  </div>

  <div class="text-center text-xs text-gray-500 pb-2">
    Skor Kecocokan: {score} Poin
  </div>
</div>
