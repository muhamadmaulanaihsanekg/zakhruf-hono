<script lang="ts">
  import { link } from 'svelte-spa-router';
  import EventLayout from '../../../layouts/EventLayout.svelte';
  import { mockEvents } from '../../../lib/mockData';
  import {
    IconHelp,
    IconChevronLeft,
    IconArrowLeft,
    IconArrowRight,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  const pertanyaanStages = [
    {
      name: 'Perkenalan',
      questions: [
        'Ceritakan sedikit tentang dirimu dan keluargamu.',
        'Apa kegiatanmu sehari-hari di luar kerja/kuliah?',
        'Apa yang paling kamu syukuri akhir-akhir ini?',
      ],
    },
    {
      name: 'Agama & Ibadah',
      questions: [
        'Bagaimana kebiasaan ibadahmu sehari-hari?',
        'Apa yang kamu lakukan untuk menjaga keistiqomahan?',
        'Bagaimana pandanganmu soal menuntut ilmu agama?',
      ],
    },
    {
      name: 'Keluarga',
      questions: [
        'Bagaimana hubunganmu dengan orang tua dan saudara?',
        'Apa harapanmu soal hubungan dengan keluarga besar?',
        'Bagaimana cara keluargamu mengambil keputusan penting?',
      ],
    },
    {
      name: 'Masa Depan',
      questions: [
        'Gambarkan rumah tangga impianmu 5-10 tahun ke depan.',
        'Bagaimana pembagian peran dalam rumah tangga menurutmu?',
        'Apa rencanamu soal pendidikan anak nanti?',
      ],
    },
    {
      name: 'Finansial & Karir',
      questions: [
        'Bagaimana cara kamu mengelola keuangan?',
        'Apa target karirmu dalam 5 tahun ke depan?',
        'Bagaimana pandanganmu soal keuangan keluarga?',
      ],
    },
  ];

  let currentStage = $state(0);
  let currentIdx = $state(0);

  let stage = $derived(pertanyaanStages[currentStage]);
  let totalSoal = $derived(pertanyaanStages.reduce((n, st) => n + st.questions.length, 0));
  let soalKe = $derived.by(() => {
    let n = currentIdx + 1;
    for (let i = 0; i < currentStage; i++) n += pertanyaanStages[i].questions.length;
    return n;
  });
  let pertanyaanText = $derived(stage.questions[currentIdx]);

  function nextPertanyaan() {
    if (currentIdx < stage.questions.length - 1) {
      currentIdx++;
    } else if (currentStage < pertanyaanStages.length - 1) {
      currentStage++;
      currentIdx = 0;
    }
  }

  function prevPertanyaan() {
    if (currentIdx > 0) {
      currentIdx--;
    } else if (currentStage > 0) {
      currentStage--;
      currentIdx = pertanyaanStages[currentStage].questions.length - 1;
    }
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
      <span class="text-[11px] text-[#8b8d9a] font-semibold">{soalKe} / {totalSoal}</span>
    </div>

    <!-- Stage progress -->
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xs font-bold text-[#e8b840]">{stage.name}</span>
      <span class="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden">
        <span
          class="block h-full bg-gradient-to-r from-[#7a9a5e] to-[#e8b840] rounded-full transition-all duration-300"
          style="width: {Math.round((soalKe / totalSoal) * 100)}%;"
        ></span>
      </span>
    </div>

    <!-- Pertanyaan Card -->
    <div class="flex-1 flex items-center justify-center py-2">
      <div class="w-full max-w-[420px] bg-[#13151c] border border-white/[0.06] rounded-3xl p-8 text-center shadow-2xl">
        <div class="w-10 h-10 rounded-xl bg-[#e8b840]/12 border border-[#e8b840]/25 grid place-items-center text-[#e8b840] mx-auto mb-4.5">
          <IconHelp size={22} />
        </div>
        <div class="text-2xl font-bold text-[#e4e4ec] leading-relaxed tracking-tight">
          {pertanyaanText}
        </div>
        <div class="text-[11px] text-[#5a5c6a] mt-4">Jawab bergantian dengan pasanganmu</div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex gap-2.5 pt-2">
      <button
        type="button"
        onclick={prevPertanyaan}
        class="flex-1 min-h-[48px] rounded-full border border-white/10 bg-white/[0.03] text-[#8b8d9a] text-[13px] font-bold cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5"
      >
        <IconArrowLeft size={16} />
        <span>Sebelum</span>
      </button>
      <button
        type="button"
        onclick={nextPertanyaan}
        class="flex-[1.5] min-h-[48px] rounded-full border-none bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] text-sm font-extrabold cursor-pointer transition-colors shadow-lg shadow-[#e8b840]/25 flex items-center justify-center gap-1.5"
      >
        <span>Berikutnya</span>
        <IconArrowRight size={16} />
      </button>
    </div>
  </div>
</EventLayout>
