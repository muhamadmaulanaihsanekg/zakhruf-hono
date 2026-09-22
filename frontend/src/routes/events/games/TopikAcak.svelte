<script lang="ts">
  import { link } from 'svelte-spa-router';
  import EventLayout from '../../../layouts/EventLayout.svelte';
  import { mockEvents } from '../../../lib/mockData';
  import {
    IconCards,
    IconDice,
    IconChevronLeft,
    IconHome,
    IconWallet,
    IconSun,
    IconSparkles,
    IconHeartHandshake,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  interface Topic {
    c: string;
    t: string;
    q: string[];
    icon: any;
  }

  const defaultTopics: Topic[] = [
    {
      c: 'keluarga',
      t: 'Peran & Tanggung Jawab dalam Keluarga',
      q: [
        'Bagaimana menurutmu cara terbaik membagi tugas rumah tangga?',
        'Seberapa sering idealnya bersilaturahim ke orang tua dan mertua?',
      ],
      icon: IconHome,
    },
    {
      c: 'keuangan',
      t: 'Pengelolaan Finansial Bersama',
      q: [
        'Apakah lebih nyaman memiliki rekening bersama atau terpisah?',
        'Bagaimana cara kamu memprioritaskan antara menabung dan liburan?',
      ],
      icon: IconWallet,
    },
    {
      c: 'agama',
      t: 'Menjaga Kualitas Ibadah Rumah Tangga',
      q: [
        'Apa kebiasaan ibadah harian yang ingin kamu bangun bersama pasangan?',
        'Bagaimana sikapmu jika salah satu sedang mengalami masa futur/penurunan semangat?',
      ],
      icon: IconSparkles,
    },
    {
      c: 'masa_depan',
      t: 'Visi Jangka Panjang & Anak',
      q: [
        'Prinsip utama apa yang ingin kamu tanamkan dalam mendidik anak?',
        'Di mana dan seperti apa lingkungan tempat tinggal impianmu?',
      ],
      icon: IconSun,
    },
    {
      c: 'keseharian',
      t: 'Gaya Hidup & Komunikasi',
      q: [
        'Bagaimana caramu menyampaikan rasa tidak nyaman jika ada perselisihan?',
        'Apa yang biasanya kamu lakukan untuk menenangkan diri saat stres?',
      ],
      icon: IconHeartHandshake,
    },
  ];

  let topikSisa = $state<Topic[]>([...defaultTopics]);
  let topikSekarang = $state<Topic | null>(null);
  let shaking = $state(false);

  function tarikTopik() {
    if (shaking) return;
    shaking = true;
    setTimeout(() => {
      if (!topikSisa.length) topikSisa = [...defaultTopics];
      const i = Math.floor(Math.random() * topikSisa.length);
      topikSekarang = topikSisa.splice(i, 1)[0];
      shaking = false;
    }, 450);
  }
</script>

<EventLayout {event} participantNumber="042">
  <div class="flex flex-col min-h-[calc(100dvh-175px)] pb-4.5">
    <!-- Top bar game -->
    <div class="flex items-center justify-between mb-1">
      <a
        href={`/events/${event.slug}/taaruf`}
        use:link
        class="inline-flex items-center gap-1.5 px-3 py-1.5 -ml-3 rounded-full text-[11px] text-[#8b8d9a] hover:text-[#8db36b] no-underline transition-colors"
      >
        <IconChevronLeft size={14} />
        <span>Ta'aruf</span>
      </a>
      <span class="text-[11px] text-[#8b8d9a] font-semibold">Sisa {topikSisa.length} topik</span>
    </div>

    <!-- Tumpukan Kartu 3D -->
    <div class="flex-1 flex items-center justify-center p-5 pt-2">
      <div class="relative w-full max-w-[340px] aspect-[3/4]">
        <!-- Stack layer 1 -->
        <div class="absolute inset-0 rounded-[20px] bg-[#0d0f14] border border-white/[0.04] translate-x-3.5 translate-y-3.5 rotate-3 z-0"></div>
        <!-- Stack layer 2 -->
        <div class="absolute inset-0 rounded-[20px] bg-[#101219] border border-white/[0.05] translate-x-2 translate-y-2 -rotate-2 z-[1]"></div>
        <!-- Stack layer 3 -->
        <div class="absolute inset-0 rounded-[20px] bg-[#13151d] border border-white/[0.06] translate-x-1 translate-y-1 rotate-1 z-[2]"></div>

        <!-- Kartu Utama -->
        <div class="absolute inset-0 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.55)] z-10 transition-all">
          {#if !topikSekarang}
            <!-- BELAKANG KARTU (Tutup) -->
            <div class="absolute inset-0 rounded-[20px] overflow-hidden bg-gradient-to-br from-[#171a22] to-[#1d2119] border border-[#e8b840]/25 flex flex-col items-center justify-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-[#e8b840]/15 border border-[#e8b840]/35 grid place-items-center text-[#e8b840]">
                <IconCards size={28} />
              </div>
              <div class="text-[13px] text-[#8b8d9a] font-semibold">Kartu masih tertutup</div>
              <div class="text-[10px] text-[#5a5c6a]">Tekan Tarik Topik untuk membuka</div>
            </div>
          {:else}
            <!-- DEPAN KARTU (Buka) -->
            {@const IconComp = topikSekarang.icon}
            <div class="absolute inset-0 rounded-[20px] overflow-hidden bg-gradient-to-br from-[#171a22] via-[#13151c] to-[#0f1117] border border-white/[0.08] flex flex-col justify-between p-5">
              <div class="flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8b840]/12 border border-[#e8b840]/25 text-[#e8b840] text-[9px] font-bold uppercase tracking-wider">
                  <IconComp size={12} />
                  <span>{topikSekarang.c}</span>
                </span>
                <span class="text-[9px] text-[#5a5c6a] font-bold uppercase tracking-wider">Topik Ta'aruf</span>
              </div>

              <div class="my-auto text-center py-2">
                <h3 class="text-xl font-bold text-[#e4e4ec] leading-snug tracking-tight">
                  {topikSekarang.t}
                </h3>
              </div>

              <div class="space-y-2 mb-2">
                {#each topikSekarang.q as q, qi}
                  <div class="flex gap-2 items-start bg-white/[0.03] border border-white/[0.05] rounded-xl p-2.5">
                    <span class="w-4.5 h-4.5 rounded-full bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 grid place-items-center text-[#8db36b] text-[9px] font-bold shrink-0">
                      {qi + 1}
                    </span>
                    <span class="text-[11px] text-[#c9cad6] leading-relaxed">{q}</span>
                  </div>
                {/each}
              </div>

              <div class="text-center text-[10px] text-[#5a5c6a] tracking-wider">
                ZAKHRUF ID · SANTUN · SERIUS · HALAL
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Tombol Tarik Topik -->
    <div class="pt-2">
      <button
        type="button"
        onclick={tarikTopik}
        disabled={shaking}
        class="w-full min-h-[52px] rounded-full border-none bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] text-sm font-extrabold cursor-pointer transition-transform shadow-lg shadow-[#e8b840]/25 flex items-center justify-center gap-2.5 disabled:opacity-80 active:scale-98"
      >
        <IconDice size={20} />
        <span>{shaking ? 'Mengocok...' : 'Tarik Topik'}</span>
      </button>
    </div>
  </div>
</EventLayout>
