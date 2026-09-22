<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { pertanyaanStages } from '../../../lib/taarufData';

  let stage = $state(0);
  let idx = $state(0);
  let done = $state<number[]>([]);

  let currentStage = $derived(pertanyaanStages[stage]);
  let totalQuestions = $derived(pertanyaanStages.reduce((acc, s) => acc + s.questions.length, 0));
  let currentQuestionNumber = $derived(
    pertanyaanStages.slice(0, stage).reduce((acc, s) => acc + s.questions.length, 0) + idx + 1
  );
  let currentQuestion = $derived(currentStage.questions[idx]);

  function next() {
    if (idx < currentStage.questions.length - 1) {
      idx++;
    } else if (stage < pertanyaanStages.length - 1) {
      if (!done.includes(stage)) done = [...done, stage];
      stage++;
      idx = 0;
    } else {
      if (!done.includes(stage)) done = [...done, stage];
    }
  }

  function prev() {
    if (idx > 0) {
      idx--;
    } else if (stage > 0) {
      stage--;
      idx = pertanyaanStages[stage].questions.length - 1;
    }
  }
</script>

<div class="min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto bg-[#0B0B14] text-white">
  <!-- Top Bar -->
  <div>
    <div class="flex items-center justify-between py-2 mb-2">
      <a href="/" use:link class="text-xs text-gray-400 hover:text-white flex items-center gap-1">
        ← Keluar Game
      </a>
      <span class="text-xs font-semibold text-gray-400">{currentQuestionNumber} / {totalQuestions}</span>
    </div>

    <!-- Progress Bar -->
    <div class="flex items-center gap-3 mb-6">
      <span class="text-xs font-bold text-[#e8b840]">{currentStage.name}</span>
      <div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          class="bg-gradient-to-r from-[#8B5CF6] to-[#e8b840] h-full transition-all duration-300"
          style="width: {Math.round((currentQuestionNumber / totalQuestions) * 100)}%"
        ></div>
      </div>
    </div>
  </div>

  <!-- Question Card -->
  <div class="my-auto py-6">
    <div class="bg-[#13131F] border border-white/10 rounded-[24px] p-8 shadow-2xl relative overflow-hidden text-center min-h-[220px] flex flex-col justify-center">
      <div class="w-10 h-10 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] flex items-center justify-center mx-auto mb-4 text-sm font-bold">
        ?
      </div>
      <p class="text-lg font-semibold text-white leading-relaxed">
        "{currentQuestion}"
      </p>
    </div>
  </div>

  <!-- Actions -->
  <div class="grid grid-cols-2 gap-3 pt-4">
    <button
      onclick={prev}
      disabled={stage === 0 && idx === 0}
      class="py-3.5 px-4 rounded-full bg-[#1C1A2E] text-gray-300 font-semibold text-xs border border-white/10 hover:bg-white/5 disabled:opacity-40"
    >
      Sebelumnya
    </button>
    <button
      onclick={next}
      class="py-3.5 px-4 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-xs shadow-lg shadow-[#8B5CF6]/30"
    >
      {currentQuestionNumber === totalQuestions ? 'Selesai' : 'Berikutnya →'}
    </button>
  </div>
</div>
