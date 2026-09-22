<script lang="ts">
  import { link } from 'svelte-spa-router';
  import EventLayout from '../../../layouts/EventLayout.svelte';
  import { mockEvents } from '../../../lib/mockData';
  import {
    IconChevronLeft,
    IconCheck,
    IconX,
    IconScale,
    IconArrowRight,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  const iniituDeck = [
    { a: 'Kota kecil yang tenang', b: 'Kota besar yang ramai' },
    { a: 'Masak sendiri di rumah', b: 'Makan di luar' },
    { a: 'Bangun pagi', b: 'Begadang' },
    { a: 'Liburan ke gunung', b: 'Liburan ke pantai' },
    { a: 'Hemat & menabung', b: 'Nikmati hasil kerja' },
    { a: 'Ngobrol langsung', b: 'Chatting' },
    { a: 'Kumpul keluarga besar', b: 'Quality time berdua' },
    { a: 'Rutinitas terjadwal', b: 'Spontan' },
    { a: 'Teh hangat', b: 'Kopi' },
    { a: 'Sarapan di rumah', b: 'Sarapan di luar' },
    { a: 'Membaca buku', b: 'Menonton film' },
    { a: 'Rumah bertingkat', b: 'Rumah satu lantai' },
    { a: 'Menabung dulu baru beli', b: 'Cicil barang impian' },
    { a: 'Dekat tempat kerja', b: 'Dekat keluarga' },
    { a: 'Hujan', b: 'Panas terik' },
    { a: 'Diam saat lelah', b: 'Bercerita saat lelah' },
    { a: 'Berbagi tugas rumah', b: 'Satu orang pegang penuh' },
    { a: 'Undangan keluarga sederhana', b: 'Acara meriah' },
    { a: 'Kado untuk orang tua', b: 'Kado untuk pasangan' },
    { a: 'Merayakan momen kecil', b: 'Hanya momen besar' },
  ];

  let iniituIdx = $state(0);
  let step = $state<'pilih' | 'partner' | 'hasil'>('pilih');
  let yourChoice = $state<'a' | 'b' | null>(null);
  let partnerChoice = $state<'a' | 'b' | null>(null);
  let score = $state(0);

  let iniitu = $derived(iniituDeck[iniituIdx]);
  let cocok = $derived(yourChoice !== null && yourChoice === partnerChoice);
  let selesai = $derived(iniituIdx >= iniituDeck.length);

  function pilihKamu(choice: 'a' | 'b') {
    yourChoice = choice;
    step = 'partner';
  }

  function pilihPartner(choice: 'a' | 'b') {
    partnerChoice = choice;
    if (choice === yourChoice) {
      score++;
    }
    step = 'hasil';
  }

  function nextIniitu() {
    yourChoice = null;
    partnerChoice = null;
    step = 'pilih';
    iniituIdx++;
  }

  function resetGame() {
    iniituIdx = 0;
    step = 'pilih';
    yourChoice = null;
    partnerChoice = null;
    score = 0;
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
      <div class="flex gap-1.5">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.05] text-[#8b8d9a] border border-white/10">
          Pertanyaan {selesai ? iniituDeck.length : iniituIdx + 1}/{iniituDeck.length}
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/35">
          Cocok: {score}
        </span>
      </div>
    </div>

    {#if selesai}
      <!-- Selesai -->
      <div class="flex-1 flex items-center justify-center p-2">
        <div class="w-full max-w-[420px] bg-[#13151c] border border-white/[0.06] rounded-3xl p-8 text-center shadow-2xl">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#7a9a5e]/20 to-[#e8b840]/15 border border-[#e8b840]/35 grid place-items-center text-[#e8b840] mx-auto mb-3.5">
            <IconCheck size={32} />
          </div>
          <h2 class="text-lg font-bold text-[#e4e4ec] mb-1">Permainan Selesai!</h2>
          <p class="text-xs text-[#8b8d9a] mb-4">
            Kalian sepakat di <strong class="text-white">{score}</strong> dari {iniituDeck.length} pertanyaan
          </p>
          <div class="text-4xl font-extrabold text-[#e8b840] mb-5">
            {Math.round((score / iniituDeck.length) * 100)}% cocok
          </div>
          <button
            type="button"
            onclick={resetGame}
            class="w-full py-3.5 rounded-full bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] font-bold text-xs cursor-pointer shadow-lg"
          >
            Main Lagi
          </button>
        </div>
      </div>
    {:else if step === 'hasil'}
      <!-- Hasil 1 kartu -->
      <div class="flex-1 flex items-center justify-center p-2">
        <div class="w-full max-w-[420px] bg-[#13151c] border border-white/[0.06] rounded-3xl p-7 text-center shadow-2xl">
          <div class="w-14 h-14 rounded-full grid place-items-center mx-auto mb-3 {cocok ? 'bg-[#7a9a5e]/15 border border-[#7a9a5e]/40 text-[#8db36b]' : 'bg-white/[0.04] border border-white/10 text-[#8b8d9a]'}">
            {#if cocok}
              <IconCheck size={28} />
            {:else}
              <IconX size={28} />
            {/if}
          </div>
          <h3 class="text-base font-bold mb-1 {cocok ? 'text-[#8db36b]' : 'text-[#e4e4ec]'}">
            {cocok ? '+1 Cocok!' : 'Beda Jawaban'}
          </h3>
          <p class="text-xs text-[#8b8d9a] mb-4">
            {iniitu.a} <strong class="text-[#e8b840]">vs</strong> {iniitu.b}
          </p>
          <div class="grid grid-cols-2 gap-2.5 mb-5">
            <div class="p-3 bg-[#7a9a5e]/10 border border-[#7a9a5e]/25 rounded-xl text-left">
              <div class="text-[10px] text-[#8db36b] font-bold uppercase tracking-wider mb-1">Kamu</div>
              <div class="text-xs text-[#e4e4ec] font-semibold">{yourChoice === 'a' ? iniitu.a : iniitu.b}</div>
            </div>
            <div class="p-3 bg-[#64a0dc]/10 border border-[#64a0dc]/25 rounded-xl text-left">
              <div class="text-[10px] text-[#64a0dc] font-bold uppercase tracking-wider mb-1">Pasangan</div>
              <div class="text-xs text-[#e4e4ec] font-semibold">{partnerChoice === 'a' ? iniitu.a : iniitu.b}</div>
            </div>
          </div>
          <button
            type="button"
            onclick={nextIniitu}
            class="w-full py-3.5 rounded-full bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] font-bold text-xs cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
          >
            <span>Pertanyaan Berikutnya</span>
            <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    {:else}
      <!-- Pilih (Kamu / Pasangan) -->
      <div class="flex-1 flex flex-col justify-center bg-[#13151c] border border-white/[0.06] rounded-3xl p-6 shadow-2xl">
        <div class="text-center mb-6">
          <span class="px-3 py-1 rounded-full text-[11px] font-bold {step === 'pilih' ? 'bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/30' : 'bg-[#64a0dc]/15 text-[#64a0dc] border border-[#64a0dc]/30'}">
            {step === 'pilih' ? 'Pilihan Kamu' : 'Tanyakan & Pilih Jawaban Pasangan'}
          </span>
          <h3 class="text-sm text-[#8b8d9a] mt-2 font-normal">Mana yang lebih kamu sukai?</h3>
        </div>

        <div class="space-y-3">
          <button
            type="button"
            onclick={() => (step === 'pilih' ? pilihKamu('a') : pilihPartner('a'))}
            class="w-full p-4 rounded-2xl bg-white/[0.03] hover:bg-[#e8b840]/12 border border-white/[0.08] hover:border-[#e8b840]/40 text-[#e4e4ec] text-sm font-bold text-center cursor-pointer transition-all hover:scale-[1.02] active:scale-98"
          >
            {iniitu.a}
          </button>

          <div class="text-center text-[10px] text-[#5a5c6a] font-bold uppercase tracking-widest">
            — ATAU —
          </div>

          <button
            type="button"
            onclick={() => (step === 'pilih' ? pilihKamu('b') : pilihPartner('b'))}
            class="w-full p-4 rounded-2xl bg-white/[0.03] hover:bg-[#e8b840]/12 border border-white/[0.08] hover:border-[#e8b840]/40 text-[#e4e4ec] text-sm font-bold text-center cursor-pointer transition-all hover:scale-[1.02] active:scale-98"
          >
            {iniitu.b}
          </button>
        </div>
      </div>
    {/if}
  </div>
</EventLayout>
