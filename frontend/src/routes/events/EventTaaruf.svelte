<script lang="ts">
  import { link } from 'svelte-spa-router';
  import EventLayout from '../../layouts/EventLayout.svelte';
  import { mockEvents, mockCandidates } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';
  import {
    IconHelp,
    IconCards,
    IconMoodSmile,
    IconScale,
    IconChevronRight,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let me = $derived(auth.user);

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  let oppositeOpponents = $derived.by(() => {
    if (!me) return [];
    return mockCandidates.filter((c) => c.gender !== me.gender && c.id !== me.id);
  });

  const tools = [
    {
      key: 'pertanyaan',
      name: "Pertanyaan Ta'aruf",
      desc: "Tahap demi tahap biar nggak bingung",
      icon: IconHelp,
    },
    {
      key: 'topik',
      name: 'Kartu Topik Acak',
      desc: 'Tarik topik, langsung bahas',
      icon: IconCards,
    },
    {
      key: 'kebenaran',
      name: '2 Kebenaran 1 Bohong',
      desc: 'Tebak fakta mana yang bohong',
      icon: IconMoodSmile,
    },
    {
      key: 'iniitu',
      name: 'Ini atau Itu',
      desc: 'Pilih satu, bandingkan jawaban',
      icon: IconScale,
    },
  ];

  // Duration config (default 15 min)
  const durationMin = 15;
  const totalSec = durationMin * 60;
  let remaining = $state(totalSec);
  let timerRunning = $state(false);
  let timerStarted = $state(false);
  let myReady = $state(false);
  let partnerReady = $state(false);
  let partnerReadyName = $state('Pasangan');
  let assignedToMeeting = $state(true); // Demo: true so user can test the timer immediately

  let ringC = 2 * Math.PI * 82; // 515.22
  let progress = $derived(totalSec ? Math.round((remaining / totalSec) * 100) : 100);

  let mmss = $derived.by(() => {
    const s = Math.max(0, remaining);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  });

  let timerId: number | null = null;

  function clearTick() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    if (!assignedToMeeting) return;
    if (remaining <= 0) remaining = totalSec;
    clearTick();
    timerRunning = true;
    timerStarted = true;
    timerId = window.setInterval(() => {
      if (remaining <= 1) {
        clearTick();
        timerRunning = false;
        remaining = 0;
      } else {
        remaining--;
      }
    }, 1000);
  }

  function pauseTimer() {
    clearTick();
    timerRunning = false;
  }

  function resetTimer() {
    clearTick();
    timerRunning = false;
    timerStarted = false;
    myReady = false;
    partnerReady = false;
    remaining = totalSec;
  }

  function signalReady() {
    myReady = true;
    // Simulate partner readiness after 1.2s for interactive feedback
    setTimeout(() => {
      partnerReady = true;
      partnerReadyName = oppositeOpponents[0]?.nickname || 'Pasangan';
      startTimer();
    }, 1200);
  }

  let timerLabel = $derived.by(() => {
    if (!assignedToMeeting) return 'Siap — mulai timer saat dipanggil / pertemuan dimulai';
    if (myReady && !partnerReady) return 'Menunggu pasangan siap...';
    if (!myReady && partnerReady) return `${partnerReadyName} sudah siap — tekan Mulai Timer`;
    if (timerRunning) return 'Sesi berjalan — jaga adab pertemuan';
    if (timerStarted && remaining === 0) return 'Sesi selesai — catat hasil di bawah';
    if (timerStarted) return 'Sesi dijeda';
    return 'Siap — mulai timer saat dipanggil / pertemuan dimulai';
  });

  // Mock past results
  let myResults = $derived.by(() => [
    {
      id: 1,
      partner: oppositeOpponents[0] || null,
      result: 'lanjut',
      created_at: '2025-05-18',
      session_name: 'Sesi 1 (Pagi)',
    },
  ]);

  const resultMeta: Record<string, { label: string; bg: string; color: string }> = {
    lanjut: { label: 'Lanjut', bg: 'rgba(122,154,94,0.12)', color: '#8db36b' },
    pending: { label: 'Ragu-ragu', bg: 'rgba(232,184,64,0.12)', color: '#e8b840' },
    tidak: { label: 'Tidak Lanjut', bg: 'rgba(224,85,85,0.10)', color: '#e05555' },
  };

  const calcAge = (dob?: string) => {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };
</script>

<EventLayout {event} participantNumber="042">
  <div class="mb-4">
    <h1 class="text-xl font-bold text-[#e4e4ec] m-0 mb-1">Ta'aruf</h1>
    <p class="text-xs text-[#8b8d9a] m-0">
      Timer sesi pertemuan, taaruf mandiri, dan catat hasil — semua di satu halaman.
    </p>
  </div>

  <!-- Timer Sesi Card -->
  <div class="bg-[#13151c] border border-white/[0.06] rounded-[20px] p-5 mb-4 shadow-xl">
    <div class="flex justify-between items-center mb-3.5">
      <div class="text-sm font-bold text-[#e4e4ec]">Timer Sesi</div>
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8b840]/12 text-[#e8b840] border border-[#e8b840]/30">
        Bilik Taaruf
      </span>
    </div>

    <div class="flex flex-col items-center gap-3.5">
      <!-- Circular SVG Ring -->
      <div class="relative w-[190px] h-[190px]">
        <svg width="190" height="190" viewBox="0 0 190 190">
          <defs>
            <linearGradient id="taarufRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7a9a5e" />
              <stop offset="100%" stop-color="#e8b840" />
            </linearGradient>
          </defs>
          <circle cx="95" cy="95" r="82" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10" />
          <circle
            cx="95"
            cy="95"
            r="82"
            fill="none"
            stroke={assignedToMeeting ? 'url(#taarufRing)' : '#3a3d4a'}
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray={ringC}
            stroke-dashoffset={ringC * (1 - progress / 100)}
            transform="rotate(-90 95 95)"
            class="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>

        <div class="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div class="text-[42px] font-extrabold tabular-nums tracking-wide {timerRunning ? 'text-[#e8b840]' : 'text-[#e4e4ec]'}">
            {mmss}
          </div>
          <div class="text-[11px] text-[#8b8d9a] font-semibold">{durationMin} menit</div>
        </div>
      </div>

      <!-- Timer Label -->
      <div class="text-center text-xs text-[#8b8d9a] leading-relaxed min-h-[36px] flex items-center justify-center">
        {timerLabel}
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 w-full">
        {#if !timerRunning && !myReady}
          <button
            type="button"
            onclick={signalReady}
            disabled={!assignedToMeeting}
            class="flex-1 py-3 rounded-full border-none text-[13px] font-bold cursor-pointer transition-colors shadow-lg {assignedToMeeting
              ? 'bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] shadow-[#e8b840]/25'
              : 'bg-[#2a2c34] text-[#5a5c6a]'}"
          >
            Mulai Timer
          </button>
        {:else if myReady && !partnerReady}
          <button
            type="button"
            disabled
            class="flex-1 py-3 rounded-full border border-[#7aa0c3]/40 bg-[#7aa0c3]/12 text-[#7aa0c3] text-[13px] font-bold cursor-not-allowed animate-pulse"
          >
            Menunggu Pasangan...
          </button>
        {:else if !timerRunning && myReady}
          <button
            type="button"
            onclick={startTimer}
            class="flex-1 py-3 rounded-full border-none bg-[#7a9a5e] hover:bg-[#8db36b] text-[#0a0d06] text-[13px] font-bold cursor-pointer transition-colors shadow-lg shadow-[#7a9a5e]/25"
          >
            Lanjutkan Timer
          </button>
        {:else}
          <button
            type="button"
            onclick={pauseTimer}
            class="flex-1 py-3 rounded-full border border-[#e8b840]/40 bg-[#e8b840]/12 text-[#e8b840] text-[13px] font-bold cursor-pointer hover:bg-[#e8b840]/25 transition-colors"
          >
            Jeda
          </button>
        {/if}

        <button
          type="button"
          onclick={resetTimer}
          disabled={!assignedToMeeting}
          class="px-5 py-3 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] hover:text-white text-[13px] font-bold cursor-pointer transition-colors hover:bg-white/5"
        >
          Ulang
        </button>
      </div>
    </div>
  </div>

  <!-- Alat Bantu Ta'aruf -->
  <div class="mb-4">
    <div class="text-sm font-bold text-[#e4e4ec] mb-2.5">Alat Bantu Ta'aruf</div>
    <div class="grid gap-2">
      {#each tools as t (t.key)}
        {@const IconComponent = t.icon}
        <a
          href={`/events/${event.slug}/games/${t.key}`}
          use:link
          class="flex items-center gap-3 p-3.5 bg-[#13151c] border border-white/[0.06] hover:border-[#e8b840]/30 rounded-2xl no-underline transition-all group"
        >
          <span class="w-10 h-10 rounded-xl bg-[#e8b840]/12 border border-[#e8b840]/25 grid place-items-center text-[#e8b840] shrink-0">
            <IconComponent size={20} />
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-[13px] font-bold text-[#e4e4ec] group-hover:text-[#e8b840] transition-colors">{t.name}</span>
            <span class="block text-[11px] text-[#8b8d9a] mt-0.5">{t.desc}</span>
          </span>
          <IconChevronRight size={16} class="text-[#5a5c6a] group-hover:text-[#e8b840] transition-colors" />
        </a>
      {/each}
    </div>
  </div>

  <!-- Hasil Saya -->
  {#if myResults.length > 0}
    <div class="bg-[#13151c] border border-white/[0.06] rounded-[20px] p-5">
      <div class="text-sm font-bold text-[#e4e4ec] mb-3">Hasil Saya</div>
      <div class="grid gap-2.5">
        {#each myResults as r (r.id)}
          <div class="flex items-center gap-3 bg-[#0d0f15] border border-white/[0.05] rounded-xl p-3">
            <div class="flex-1 min-w-0">
              <div class="text-[13px] font-bold text-[#e4e4ec]">
                {r.partner?.nickname || r.partner?.full_name || 'Kandidat'}
                {#if calcAge(r.partner?.date_of_birth)}
                  <span class="text-xs font-normal text-[#8b8d9a] ml-1.5">{calcAge(r.partner?.date_of_birth)}</span>
                {/if}
              </div>
              <div class="text-[11px] text-[#5a5c6a] mt-0.5">
                {r.created_at} · {r.session_name}
              </div>
            </div>
            <span
              class="px-2.5 py-1 rounded-full text-[10px] font-bold"
              style="background: {resultMeta[r.result]?.bg ?? 'rgba(255,255,255,0.06)'}; color: {resultMeta[r.result]?.color ?? '#8b8d9a'};"
            >
              {resultMeta[r.result]?.label ?? r.result}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</EventLayout>
