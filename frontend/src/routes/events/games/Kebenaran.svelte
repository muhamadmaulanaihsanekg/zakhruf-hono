<script lang="ts">
  import { link } from 'svelte-spa-router';
  import EventLayout from '../../../layouts/EventLayout.svelte';
  import { mockEvents } from '../../../lib/mockData';
  import {
    IconChevronLeft,
    IconTrophy,
    IconMoodSmile,
    IconSparkles,
    IconArrowRight,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  let ronde = $state(1); // 1..3
  let writer = $state<'kamu' | 'pasangan'>('kamu');
  let phase = $state<'tulis' | 'tebak' | 'reveal' | 'selesai'>('tulis');
  let f1 = $state('');
  let f2 = $state('');
  let palsu = $state('');
  let statements = $state<Array<{ text: string; isFake: boolean }>>([]);
  let fakePos = $state(-1);
  let guessIdx = $state<number | null>(null);
  let skorKamu = $state(0);
  let skorPasangan = $state(0);
  let revealText = $state('');

  function finishWrite() {
    const items = [
      { text: f1.trim() || 'Fakta 1', isFake: false },
      { text: f2.trim() || 'Fakta 2', isFake: false },
      { text: palsu.trim() || 'Fakta Palsu', isFake: true },
    ];
    // Shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    statements = items;
    fakePos = items.findIndex((x) => x.isFake);
    phase = 'tebak';
  }

  function guess(idx: number) {
    if (phase !== 'tebak' || guessIdx !== null) return;
    guessIdx = idx;
    const benar = idx === fakePos;
    if (writer === 'kamu') {
      if (benar) skorPasangan++;
      revealText = benar
        ? 'Pasangan berhasil menemukan kebohonganmu!'
        : 'Pasangan gagal — kebohonganmu lolos!';
    } else {
      if (benar) skorKamu++;
      revealText = benar ? 'Tebakanmu benar!' : 'Tebakanmu salah.';
    }
    phase = 'reveal';
  }

  function nextTurn() {
    if (writer === 'kamu') {
      writer = 'pasangan';
    } else {
      writer = 'kamu';
      if (ronde < 3) ronde++;
      else {
        phase = 'selesai';
        return;
      }
    }
    f1 = '';
    f2 = '';
    palsu = '';
    guessIdx = null;
    phase = 'tulis';
  }

  function resetGame() {
    ronde = 1;
    writer = 'kamu';
    phase = 'tulis';
    f1 = '';
    f2 = '';
    palsu = '';
    statements = [];
    guessIdx = null;
    skorKamu = 0;
    skorPasangan = 0;
  }
</script>

<EventLayout {event} participantNumber="042">
  <div class="flex flex-col min-h-[calc(100dvh-175px)] pb-4.5">
    <!-- Top bar game -->
    <div class="flex items-center justify-between mb-2.5">
      <a
        href={`/events/${event.slug}/taaruf`}
        use:link
        class="inline-flex items-center gap-1.5 px-3 py-1.5 -ml-3 rounded-full text-[11px] text-[#8b8d9a] hover:text-[#8db36b] no-underline transition-colors"
      >
        <IconChevronLeft size={14} />
        <span>Ta'aruf</span>
      </a>
      <div class="flex gap-2">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.05] text-[#8b8d9a] border border-white/10">
          Ronde {ronde}/3
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/30">
          Skor: Kamu {skorKamu} - {skorPasangan} Pasangan
        </span>
      </div>
    </div>

    {#if phase === 'selesai'}
      <div class="flex-1 flex items-center justify-center p-2">
        <div class="w-full max-w-[420px] bg-[#13151c] border border-white/[0.06] rounded-3xl p-8 text-center shadow-2xl">
          <div class="w-14 h-14 rounded-2xl bg-[#e8b840]/15 border border-[#e8b840]/30 grid place-items-center text-[#e8b840] mx-auto mb-3">
            <IconTrophy size={28} />
          </div>
          <h2 class="text-lg font-bold text-[#e4e4ec] mb-1">Permainan Selesai!</h2>
          <p class="text-xs text-[#8b8d9a] mb-5">
            Skor Akhir: Kamu <strong class="text-white">{skorKamu}</strong> vs <strong class="text-white">{skorPasangan}</strong> Pasangan
          </p>
          <button
            type="button"
            onclick={resetGame}
            class="w-full py-3.5 rounded-full bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] font-bold text-xs cursor-pointer"
          >
            Main Lagi
          </button>
        </div>
      </div>
    {:else if phase === 'tulis'}
      <div class="flex-1 flex flex-col justify-center bg-[#13151c] border border-white/[0.06] rounded-3xl p-6 shadow-xl">
        <div class="text-center mb-4">
          <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-[#e8b840]/15 text-[#e8b840] border border-[#e8b840]/30">
            Giliran: {writer === 'kamu' ? 'Kamu Menulis' : 'Pasangan Menulis'}
          </span>
          <h3 class="text-sm font-bold text-[#e4e4ec] mt-2">Tulis 2 Kebenaran & 1 Kebohongan</h3>
          <p class="text-[11px] text-[#8b8d9a] mt-0.5">Lawan bicaramu akan menebak mana pernyataan yang bohong.</p>
        </div>

        <div class="space-y-3">
          <div>
            <label for="kb-f1" class="block text-[10px] font-bold text-[#7a9a5e] uppercase mb-1">Fakta Asli 1</label>
            <input
              id="kb-f1"
              bind:value={f1}
              placeholder="cth: Saya pernah mendaki Gunung Rinjani"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#e4e4ec] text-xs outline-none focus:border-[#7a9a5e]/50"
            />
          </div>
          <div>
            <label for="kb-f2" class="block text-[10px] font-bold text-[#7a9a5e] uppercase mb-1">Fakta Asli 2</label>
            <input
              id="kb-f2"
              bind:value={f2}
              placeholder="cth: Makanan favorit saya gado-gado"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#e4e4ec] text-xs outline-none focus:border-[#7a9a5e]/50"
            />
          </div>
          <div>
            <label for="kb-palsu" class="block text-[10px] font-bold text-[#e05555] uppercase mb-1">Kebohongan (Palsu)</label>
            <input
              id="kb-palsu"
              bind:value={palsu}
              placeholder="cth: Saya bisa fasih bahasa Rusia"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#e4e4ec] text-xs outline-none focus:border-[#e05555]/50"
            />
          </div>
        </div>

        <button
          type="button"
          onclick={finishWrite}
          class="w-full mt-5 py-3 rounded-full bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] font-bold text-xs cursor-pointer shadow-lg"
        >
          Selesai & Acak Pernyataan
        </button>
      </div>
    {:else if phase === 'tebak'}
      <div class="flex-1 flex flex-col justify-center bg-[#13151c] border border-white/[0.06] rounded-3xl p-6 shadow-xl">
        <div class="text-center mb-5">
          <h3 class="text-base font-bold text-[#e4e4ec]">Tebak Mana yang Bohong!</h3>
          <p class="text-xs text-[#8b8d9a] mt-1">Pilih 1 dari 3 pernyataan di bawah yang menurutmu adalah kebohongan:</p>
        </div>

        <div class="space-y-3">
          {#each statements as st, idx}
            <button
              type="button"
              onclick={() => guess(idx)}
              class="w-full p-4 rounded-2xl bg-white/[0.03] hover:bg-[#e8b840]/10 border border-white/[0.08] hover:border-[#e8b840]/40 text-left text-[13px] text-[#e4e4ec] font-semibold transition-all cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{st.text}</span>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Reveal -->
      <div class="flex-1 flex flex-col items-center justify-center bg-[#13151c] border border-white/[0.06] rounded-3xl p-8 text-center shadow-xl">
        <div class="w-14 h-14 rounded-2xl {guessIdx === fakePos ? 'bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b]' : 'bg-[#e05555]/15 border border-[#e05555]/30 text-[#e05555]'} grid place-items-center mx-auto mb-3">
          <IconMoodSmile size={28} />
        </div>
        <h3 class="text-lg font-bold text-[#e4e4ec] mb-1">{revealText}</h3>
        <p class="text-xs text-[#8b8d9a] mb-5">
          Pernyataan bohong sebenarnya adalah nomor <strong class="text-[#e8b840]">{fakePos + 1}</strong>:
          <br /><em class="text-white mt-1 inline-block">"{statements[fakePos]?.text}"</em>
        </p>
        <button
          type="button"
          onclick={nextTurn}
          class="w-full py-3.5 rounded-full bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] font-bold text-xs cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
        >
          <span>Lanjut ke Giliran Berikutnya</span>
          <IconArrowRight size={16} />
        </button>
      </div>
    {/if}
  </div>
</EventLayout>
