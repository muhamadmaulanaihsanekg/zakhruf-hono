<script lang="ts">
  import { link, location } from 'svelte-spa-router';
  import type { Snippet } from 'svelte';
  import type { EventItem } from '../lib/mockData';
  import {
    IconUserHeart,
    IconHourglass,
    IconMailHeart,
    IconClipboardCheck,
    IconUsers,
    IconX,
  } from '@tabler/icons-svelte';

  interface Props {
    event: EventItem;
    participantNumber?: number | string | null;
    oppositeCount?: number | null;
    queueInfo?: { memanggil: number; remaining_memanggil: number; used: number } | null;
    calledState?: {
      active: boolean;
      roomName?: string;
      location?: string;
      queueId?: number | null;
    };
    children?: Snippet;
  }

  let {
    event,
    participantNumber = '042',
    oppositeCount = 74,
    queueInfo = { memanggil: 5, remaining_memanggil: 4, used: 1 },
    calledState = $bindable({ active: false, roomName: 'Bilik 03', location: 'Lantai 2 — Sayap Barat', queueId: null }),
    children,
  }: Props = $props();

  let currentPath = $derived($location);

  function isActive(sub: string): boolean {
    return currentPath.includes(`/events/${event.slug}/${sub}`);
  }
</script>

<div class="min-h-screen bg-[#0a0d06] flex flex-col pb-[72px] text-[#e4e4ec]">
  <!-- Event Top Bar -->
  <header class="sticky top-0 z-20 bg-[#0d0f15]/95 backdrop-blur-md border-b border-[#e8b840]/15 px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2.5 min-w-0">
      <div class="min-w-0">
        <div class="text-[10px] font-bold text-[#e8b840] uppercase tracking-wider">Mode Kegiatan</div>
        <div class="text-[13px] font-bold text-[#e4e4ec] truncate leading-tight">{event.nama_kegiatan}</div>
        {#if participantNumber}
          <div class="text-[10px] text-[#8db36b] font-bold">No. Peserta {participantNumber}</div>
        {/if}
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      {#if oppositeCount !== null}
        <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[#8b8d9a]" title={`${oppositeCount} peserta lawan jenis`}>
          <IconUsers size={14} class="text-[#64a0dc]" />
          <span class="text-[11px] font-bold text-[#e4e4ec]">{oppositeCount}</span>
        </div>
      {/if}

      {#if queueInfo}
        <div class="px-3 py-1.5 rounded-full bg-[#e8b840]/12 border border-[#e8b840]/30 text-[11px] font-bold text-[#e8b840] whitespace-nowrap">
          Sisa {queueInfo.remaining_memanggil}/{queueInfo.memanggil} panggilan
        </div>
      {/if}
    </div>
  </header>

  <!-- Main Slot -->
  <main class="flex-1 max-w-[480px] w-full mx-auto p-4">
    {@render children?.()}
  </main>

  <!-- Event Bottom Navigation -->
  <nav class="zk-bottom-nav zk-bottom-nav-event">
    <a
      href={`/events/${event.slug}/swap`}
      use:link
      class="flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 rounded-full transition-all {isActive('swap')
        ? 'text-[#e8b840] bg-[#e8b840]/15 font-bold'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      <IconUserHeart size={22} />
      <span>Jemput Jodoh</span>
    </a>

    <a
      href={`/events/${event.slug}/taaruf`}
      use:link
      class="flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 rounded-full transition-all {isActive('taaruf')
        ? 'text-[#e8b840] bg-[#e8b840]/15 font-bold'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      <IconHourglass size={22} />
      <span>Ta'aruf</span>
    </a>

    <a
      href={`/events/${event.slug}/ajakanku`}
      use:link
      class="flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 rounded-full transition-all {isActive('ajakanku')
        ? 'text-[#e8b840] bg-[#e8b840]/15 font-bold'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      <IconMailHeart size={22} />
      <span>Ajakan</span>
    </a>

    <a
      href={`/events/${event.slug}/absensi`}
      use:link
      class="flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 rounded-full transition-all {isActive('absensi')
        ? 'text-[#e8b840] bg-[#e8b840]/15 font-bold'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      <IconClipboardCheck size={22} />
      <span>Absen</span>
    </a>
  </nav>

  <!-- Persistent reminder pill: a call was dismissed but the queue entry remains -->
  {#if !calledState.active && calledState.queueId}
    <button
      type="button"
      onclick={() => (calledState.active = true)}
      class="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#7aa0c3]/12 border border-[#7aa0c3]/30 text-[#7aa0c3] text-[11px] font-bold cursor-pointer shadow-lg whitespace-nowrap"
    >
      <IconUsers size={14} />
      Dipanggil ke {calledState.roomName}
    </button>
  {/if}

  <!-- Global Modal: Kamu Dipanggil! -->
  {#if calledState.active}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div class="relative w-[380px] max-w-[90vw] bg-gradient-to-br from-[#1a1d27] to-[#13151c] border border-[#7aa0c3]/30 rounded-2xl p-6 shadow-2xl text-center">
        <button
          type="button"
          onclick={() => (calledState.active = false)}
          class="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-[#8b8d9a] hover:text-[#e4e4ec] cursor-pointer"
        >
          <IconX size={14} />
        </button>

        <div class="w-14 h-14 rounded-full bg-[#7aa0c3]/15 border border-[#7aa0c3]/30 flex items-center justify-center mx-auto mb-4 text-[#7aa0c3]">
          <IconUsers size={28} />
        </div>

        <h3 class="text-lg font-extrabold text-[#e4e4ec] mb-1.5">Kamu Dipanggil!</h3>
        <p class="text-xs text-[#8b8d9a] leading-relaxed mb-4">
          Kamu dipanggil ke ruang pertemuan. Silakan datang ke lokasi yang tertera.
        </p>

        <div class="bg-[#7aa0c3]/10 border border-[#7aa0c3]/20 rounded-xl p-3.5 mb-5">
          <div class="text-sm font-bold text-[#e4e4ec]">{calledState.roomName}</div>
          {#if calledState.location}
            <div class="text-xs text-[#7aa0c3] mt-1">{calledState.location}</div>
          {/if}
        </div>

        <button
          type="button"
          onclick={() => (calledState.active = false)}
          class="w-full max-w-[200px] mx-auto py-3 rounded-full bg-[#7aa0c3] text-[#0a0d06] font-bold text-xs hover:bg-[#8eb8dc] transition-colors cursor-pointer"
        >
          Mengerti
        </button>
      </div>
    </div>
  {/if}
</div>
