<script lang="ts">
  import { link } from 'svelte-spa-router';
  import UserLayout from '../../layouts/UserLayout.svelte';
  import { mockEvents, type EventItem } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';
  import {
    IconCalendar,
    IconMapPin,
    IconClock,
    IconUsers,
    IconCheck,
    IconChevronLeft,
    IconChevronRight,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  let isRegistered = $state(true); // Demo: true

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
</script>

<UserLayout>
  <div class="mb-4">
    <a
      href="/events"
      use:link
      class="inline-flex items-center gap-1.5 px-3 py-1.5 -ml-3 rounded-full text-xs text-[#8b8d9a] hover:text-[#e4e4ec] no-underline transition-colors mb-2"
    >
      <IconChevronLeft size={14} />
      <span>Kembali ke Daftar Event</span>
    </a>
    <div class="flex items-center gap-2">
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8b840]/12 text-[#e8b840] border border-[#e8b840]/25">
        {event.type === 'internal' ? 'Internal LDII' : 'Terbuka'}
      </span>
      {#if isRegistered}
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/30">
          <IconCheck size={11} />
          <span>Kamu Terdaftar (No. 042)</span>
        </span>
      {/if}
    </div>
    <h1 class="text-xl font-bold text-[#e4e4ec] mt-2 mb-1">{event.nama_kegiatan}</h1>
  </div>

  <!-- Action Mode Kegiatan if Registered -->
  {#if isRegistered}
    <div class="mb-4 p-4 rounded-2xl bg-gradient-to-r from-[#e8b840]/15 via-[#7a9a5e]/15 to-[#13151c] border border-[#e8b840]/30 flex items-center justify-between gap-3">
      <div>
        <div class="text-xs font-bold text-[#e8b840]">Mode Kegiatan Aktif</div>
        <div class="text-[11px] text-[#8b8d9a] mt-0.5">Masuk ke bilik jemput jodoh, timer taaruf & absensi</div>
      </div>
      <a
        href={`/events/${event.slug}/swap`}
        use:link
        class="px-4 py-2.5 rounded-full bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] font-extrabold text-xs no-underline shrink-0 shadow-lg shadow-[#e8b840]/20 flex items-center gap-1"
      >
        <span>Masuk</span>
        <IconChevronRight size={14} />
      </a>
    </div>
  {/if}

  <!-- Jadwal & Lokasi -->
  <div class="bg-[#13151c] border border-white/[0.06] rounded-2xl p-4 mb-4">
    <div class="text-xs font-bold text-[#8b8d9a] uppercase tracking-wider mb-3">Jadwal & Lokasi</div>
    <div class="space-y-3">
      {#each event.dates ?? [] as d (d.id)}
        <div class="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-[#e4e4ec]">
            <IconCalendar size={14} class="text-[#7a9a5e]" />
            <span>{fmtDate(d.date)}</span>
          </div>

          {#if d.location}
            <div class="flex items-start gap-2 text-xs text-[#8b8d9a]">
              <IconMapPin size={14} class="text-[#64a0dc] shrink-0 mt-0.5" />
              <div>
                <div class="text-white font-semibold">{d.location.name}</div>
                {#if d.location.address}
                  <div class="text-[11px] text-[#5a5c6a] mt-0.5">{d.location.address}</div>
                {/if}
              </div>
            </div>
          {/if}

          {#if d.sessions && d.sessions.length > 0}
            <div class="pt-2 border-t border-white/[0.04] space-y-1">
              <div class="text-[10px] font-bold text-[#8b8d9a] uppercase tracking-wider">Sesi Pertemuan</div>
              {#each d.sessions as ss}
                <div class="flex justify-between text-xs py-1">
                  <span class="text-[#e4e4ec]">{ss.name}</span>
                  <span class="text-[#e8b840] font-mono text-[11px]">{ss.start_time} - {ss.end_time}</span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Deskripsi / Persyaratan -->
  <div class="bg-[#13151c] border border-white/[0.06] rounded-2xl p-4">
    <div class="text-xs font-bold text-[#8b8d9a] uppercase tracking-wider mb-2">Tentang Kegiatan</div>
    <p class="text-xs text-[#c9cad6] leading-relaxed m-0">
      Kegiatan ta'aruf bersama yang diselenggarakan secara syar'i dan tertib. Setiap peserta akan mendapatkan kuota panggilan ta'aruf mandiri didampingi oleh Tim Pembina / Penasehat (PNKB).
    </p>

    <div class="mt-4 pt-3 border-t border-white/[0.05] space-y-2">
      <div class="text-[11px] font-bold text-[#e8b840]">Ketentuan Peserta:</div>
      <ul class="text-xs text-[#8b8d9a] space-y-1.5 pl-4 list-disc">
        <li>Membawa pakaian sopan, rapi, dan menutup aurat secara sempurna.</li>
        <li>Hadir 15 menit sebelum sesi dimulai dan melakukan scan QR Absensi.</li>
        <li>Menjaga adab komunikasi islami selama sesi ta'aruf berlangsung.</li>
      </ul>
    </div>
  </div>
</UserLayout>
