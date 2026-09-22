<script lang="ts">
  import { link } from 'svelte-spa-router';
  import UserLayout from '../../layouts/UserLayout.svelte';
  import { mockEvents, type EventItem } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';
  import {
    IconCalendar,
    IconMapPin,
    IconCheck,
    IconCalendarEvent,
    IconChevronRight,
  } from '@tabler/icons-svelte';

  let me = $derived(auth.user);
  let myEventIds = $state<number[]>([1]); // default registered to event 1 for demo

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const rangeOf = (e: EventItem) => {
    const ds = [...(e.dates ?? [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (!ds.length) return null;
    return ds.length > 1
      ? fmtDate(ds[0].date) + ' — ' + fmtDate(ds[ds.length - 1].date)
      : fmtDate(ds[0].date);
  };

  const placesOf = (e: EventItem) => {
    const used = [
      ...new Map(
        (e.dates ?? [])
          .map((d) => d.location)
          .filter(Boolean)
          .map((l: any) => [l.id, l])
      ).values(),
    ];
    return used
      .slice(0, 2)
      .map((l: any) => l.name)
      .join(', ');
  };

  const statusOf = (e: EventItem) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      open: { label: 'Dibuka', color: '#8db36b', bg: 'rgba(122,154,94,0.12)' },
      closed: { label: 'Ditutup', color: '#e05555', bg: 'rgba(224,85,85,0.12)' },
      configurable: {
        label: 'Jadwal Khusus',
        color: '#e8b840',
        bg: 'rgba(232,184,64,0.12)',
      },
    };
    return map[e.registration_status] ?? null;
  };

  const isQualified = (e: EventItem) => {
    if (myEventIds.includes(e.id)) return true;
    return true;
  };

  let sortedEvents = $derived(
    [...mockEvents].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )
  );
</script>

<UserLayout>
  <div class="mb-4">
    <h1 class="text-xl font-bold text-[#e4e4ec] m-0 mb-1">Event Taaruf</h1>
    <p class="text-xs text-[#8b8d9a] m-0">Daftar agenda pertemuan taaruf mandiri & temu akrab.</p>
  </div>

  {#if sortedEvents.length === 0}
    <div class="py-12 px-6 text-center text-[#5a5c6a] border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center">
      <div class="w-12 h-12 rounded-2xl bg-white/[0.04] grid place-items-center mb-2 text-[#8b8d9a]">
        <IconCalendarEvent size={24} />
      </div>
      <div class="text-[#e4e4ec] font-bold text-sm mb-1">Belum ada event</div>
      <div class="text-xs">Pantau terus halaman ini untuk jadwal event ta'aruf mendatang.</div>
    </div>
  {:else}
    <div class="grid gap-3">
      {#each sortedEvents as ev (ev.id)}
        {@const range = rangeOf(ev)}
        {@const places = placesOf(ev)}
        {@const st = statusOf(ev)}
        {@const isRegistered = myEventIds.includes(ev.id)}
        {@const qualified = isQualified(ev)}

        <div class="bg-[#13151c] border border-white/[0.06] hover:border-[#e8b840]/30 rounded-2xl p-4 transition-all flex flex-col justify-between">
          <div>
            <!-- Banner / Header -->
            <div class="flex justify-between items-start gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8b840]/12 text-[#e8b840] border border-[#e8b840]/25">
                {ev.type === 'internal' ? 'Internal' : 'Terbuka'}
              </span>

              <div class="flex items-center gap-1.5">
                {#if isRegistered}
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/30">
                    <IconCheck size={11} />
                    <span>Terdaftar</span>
                  </span>
                {:else if st}
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style="background: {st.bg}; color: {st.color};"
                  >
                    {st.label}
                  </span>
                {/if}
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-[15px] font-bold text-[#e4e4ec] leading-snug mb-2">
              {ev.nama_kegiatan}
            </h2>

            <!-- Meta: Tanggal & Lokasi -->
            <div class="space-y-1.5 text-xs text-[#8b8d9a] mb-4">
              {#if range}
                <div class="flex items-center gap-2">
                  <IconCalendar size={14} class="text-[#7a9a5e] shrink-0" />
                  <span>{range}</span>
                </div>
              {/if}
              {#if places}
                <div class="flex items-center gap-2">
                  <IconMapPin size={14} class="text-[#64a0dc] shrink-0" />
                  <span class="truncate">{places}</span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
            <a
              href={`/events/${ev.slug}`}
              use:link
              class="flex-1 py-2.5 rounded-full border border-white/[0.1] hover:border-white/20 bg-white/[0.03] text-center text-xs font-bold text-[#e4e4ec] no-underline transition-colors"
            >
              Detail Event
            </a>

            {#if isRegistered}
              <a
                href={`/events/${ev.slug}/swap`}
                use:link
                class="flex-1 py-2.5 rounded-full bg-[#e8b840] hover:bg-[#f0c850] text-[#0a0d06] text-center text-xs font-bold no-underline transition-colors shadow-md shadow-[#e8b840]/20 flex items-center justify-center gap-1"
              >
                <span>Masuk Mode Kegiatan</span>
                <IconChevronRight size={14} />
              </a>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</UserLayout>
