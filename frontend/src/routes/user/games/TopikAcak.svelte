<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { taarufTopics, topicCategories, type Topic } from '../../../lib/taarufData';

  let currentTopic = $state<Topic>(taarufTopics[0]);
  let isRolling = $state(false);
  let diceNumber = $state(1);

  function rollTopic() {
    if (isRolling) return;
    isRolling = true;

    // Fast dice number cycling animation
    let count = 0;
    const interval = setInterval(() => {
      diceNumber = Math.floor(Math.random() * 6) + 1;
      count++;
      if (count > 10) {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * taarufTopics.length);
        currentTopic = taarufTopics[randomIndex];
        isRolling = false;
      }
    }, 80);
  }
</script>

<div class="min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto bg-[#0B0B14] text-white">
  <!-- Top Bar -->
  <div class="flex items-center justify-between py-2 border-b border-white/10">
    <a href="/" use:link class="text-xs text-gray-400 hover:text-white">← Keluar Game</a>
    <span class="text-xs font-semibold text-[#A78BFA] uppercase tracking-wider">Topik Acak</span>
  </div>

  <!-- Physical Card Style (3:4 ratio) -->
  <div class="my-auto py-6 flex flex-col items-center">
    <div
      class="w-full max-w-[300px] aspect-[3/4] bg-[#13131F] border border-white/15 rounded-[24px] p-6 shadow-2xl relative flex flex-col justify-between transition-transform duration-300 {isRolling ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}"
    >
      <!-- Category Badge -->
      <div class="flex items-center justify-between">
        <span class="px-3 py-1 bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] text-[11px] font-bold uppercase tracking-wider rounded-full">
          {topicCategories[currentTopic.c]?.label || currentTopic.c}
        </span>
        <span class="text-lg">🎲 {diceNumber}</span>
      </div>

      <!-- Main Topic Text -->
      <div class="text-center my-auto">
        <h2 class="text-2xl font-extrabold text-white tracking-tight leading-snug">
          {currentTopic.t}
        </h2>
      </div>

      <!-- Prompts / Pertanyaan Pemantik -->
      <div class="bg-[#1C1A2E]/80 border border-white/5 rounded-xl p-3.5 space-y-2 text-left">
        <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pertanyaan Pemantik:</p>
        <p class="text-xs text-gray-200">1. {currentTopic.q[0]}</p>
        <p class="text-xs text-gray-200">2. {currentTopic.q[1]}</p>
      </div>
    </div>
  </div>

  <!-- Roll Button -->
  <div class="pt-4">
    <button
      onclick={rollTopic}
      disabled={isRolling}
      class="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm rounded-full shadow-lg shadow-[#8B5CF6]/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
    >
      <span>🎲</span>
      <span>{isRolling ? 'Mengocok Topik...' : 'Kocok & Tarik Topik'}</span>
    </button>
  </div>
</div>
