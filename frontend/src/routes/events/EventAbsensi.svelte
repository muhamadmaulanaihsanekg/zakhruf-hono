<script lang="ts">
  import EventLayout from '../../layouts/EventLayout.svelte';
  import { mockEvents } from '../../lib/mockData';
  import {
    IconQrcode,
    IconCheck,
    IconX,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  let singleMode = $derived(!!event.single_attendance);
  let dates = $derived(event.dates ?? []);

  // Attendance state map
  let attendance = $state<Record<number, { status: string }>>({
    1: { status: 'hadir' },
  });

  const statuses = [
    { key: 'hadir', label: 'Hadir', color: '#8db36b', bg: 'rgba(122,154,94,0.12)' },
    { key: 'izin', label: 'Izin', color: '#e8b840', bg: 'rgba(232,184,64,0.12)' },
    { key: 'tidak', label: 'Tidak', color: '#e05555', bg: 'rgba(224,85,85,0.12)' },
  ];

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  let scanModalOpen = $state(false);
  let scanning = $state(false);
  let scanSuccess = $state(false);
  let activeScanDateId = $state<number | null>(null);

  function startScan(dateId: number) {
    activeScanDateId = dateId;
    scanModalOpen = true;
    scanning = true;
    scanSuccess = false;

    // Simulate scanning after 1.5s
    setTimeout(() => {
      scanning = false;
      scanSuccess = true;
      attendance[dateId] = { status: 'hadir' };
      setTimeout(() => {
        scanModalOpen = false;
        scanSuccess = false;
      }, 1000);
    }, 1500);
  }

  function setStatus(dateId: number, status: string) {
    attendance[dateId] = { status };
  }
</script>

<EventLayout {event} participantNumber="042">
  <div class="mb-4">
    <h1 class="text-xl font-bold text-[#e4e4ec] m-0 mb-1">Absensi Kegiatan</h1>
    <p class="text-xs text-[#8b8d9a] m-0">
      Scan QR dari panitia untuk absen hadir, atau pilih status manual.
    </p>
  </div>

  {#if dates.length === 0}
    <div class="py-10 px-6 text-center text-[#5a5c6a] text-xs border border-dashed border-white/[0.08] rounded-2xl">
      Belum ada jadwal kegiatan.
    </div>
  {:else if singleMode}
    <!-- Single Mode -->
    {@const firstDateId = dates[0]?.id ?? 1}
    {@const currentStatus = attendance[firstDateId]?.status}
    {@const stObj = statuses.find((s) => s.key === currentStatus)}
    <div class="bg-gradient-to-br from-[#1a1d27]/80 to-[#0d0f15]/90 border border-white/[0.06] rounded-2xl p-4">
      <div class="flex justify-between items-center gap-2.5">
        <div class="min-w-0">
          <div class="text-[13px] font-bold text-[#e4e4ec]">{event.nama_kegiatan}</div>
          <div class="text-[11px] text-[#8b8d9a] mt-0.5">
            {dates.length === 1 ? fmtDate(dates[0].date) : `Kegiatan ${dates.length} hari`}
          </div>
        </div>
        {#if stObj}
          <span
            class="px-3 py-1 rounded-full text-[11px] font-bold"
            style="background: {stObj.bg}; color: {stObj.color};"
          >
            {stObj.label}
          </span>
        {:else}
          <span class="px-3 py-1 rounded-full text-[11px] bg-white/[0.05] text-[#5a5c6a]">
            Belum
          </span>
        {/if}
      </div>

      {#if currentStatus !== 'hadir'}
        <button
          type="button"
          onclick={() => startScan(firstDateId)}
          class="w-full mt-3 py-3 rounded-full border border-[#e8b840]/30 bg-[#e8b840]/10 text-[#e8b840] hover:bg-[#e8b840]/20 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <IconQrcode size={16} />
          <span>Scan QR Hadir</span>
        </button>

        <div class="flex gap-2 mt-2">
          {#each statuses.filter((x) => x.key !== 'hadir') as s}
            <button
              type="button"
              onclick={() => setStatus(firstDateId, s.key)}
              class="flex-1 py-2.5 rounded-full text-[11px] cursor-pointer transition-colors {currentStatus === s.key
                ? 'font-bold border'
                : 'border border-white/[0.08] bg-white/[0.03] text-[#8b8d9a]'}"
              style={currentStatus === s.key ? `background: ${s.bg}; color: ${s.color}; border-color: ${s.color};` : ''}
            >
              {s.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {:else}
    <!-- Per-Tanggal Mode -->
    <div class="space-y-2.5">
      {#each dates as d (d.id)}
        {@const cur = attendance[d.id]?.status}
        {@const st = statuses.find((s) => s.key === cur)}
        <div class="bg-gradient-to-br from-[#1a1d27]/80 to-[#0d0f15]/90 border border-white/[0.06] rounded-2xl p-4">
          <div class="flex justify-between items-center gap-2.5">
            <div class="min-w-0">
              <div class="text-[13px] font-bold text-[#e4e4ec]">{fmtDate(d.date)}</div>
              {#if d.location}
                <div class="text-[11px] text-[#8b8d9a] mt-0.5">{d.location.name}</div>
              {/if}
            </div>
            {#if st}
              <span
                class="px-3 py-1 rounded-full text-[11px] font-bold"
                style="background: {st.bg}; color: {st.color};"
              >
                {st.label}
              </span>
            {:else}
              <span class="px-3 py-1 rounded-full text-[11px] bg-white/[0.05] text-[#5a5c6a]">
                Belum
              </span>
            {/if}
          </div>

          {#if cur !== 'hadir'}
            <button
              type="button"
              onclick={() => startScan(d.id)}
              class="w-full mt-3 py-2.5 rounded-full border border-[#e8b840]/30 bg-[#e8b840]/10 text-[#e8b840] hover:bg-[#e8b840]/20 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <IconQrcode size={16} />
              <span>Scan QR Hadir</span>
            </button>

            <div class="flex gap-2 mt-2">
              {#each statuses.filter((x) => x.key !== 'hadir') as s}
                <button
                  type="button"
                  onclick={() => setStatus(d.id, s.key)}
                  class="flex-1 py-2 rounded-full text-[11px] cursor-pointer transition-colors {cur === s.key
                    ? 'font-bold border'
                    : 'border border-white/[0.08] bg-white/[0.03] text-[#8b8d9a]'}"
                  style={cur === s.key ? `background: ${s.bg}; color: ${s.color}; border-color: ${s.color};` : ''}
                >
                  {s.label}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Modal Scanner QR -->
  {#if scanModalOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" onclick={() => (scanModalOpen = false)}></div>
      <div class="relative w-full max-w-[340px] bg-[#13151c] border border-white/[0.08] rounded-3xl p-6 text-center shadow-2xl z-10">
        <h3 class="text-base font-bold text-[#e4e4ec] mb-1">Scan QR Presensi</h3>
        <p class="text-xs text-[#8b8d9a] mb-5">Arahkan kamera ke QR Code panitia</p>

        <div class="relative w-48 h-48 mx-auto bg-black/60 rounded-2xl border-2 border-dashed {scanSuccess ? 'border-[#7a9a5e]' : 'border-[#e8b840]'} grid place-items-center overflow-hidden mb-5">
          {#if scanning}
            <div class="absolute inset-x-0 top-0 h-1 bg-[#e8b840] shadow-[0_0_12px_#e8b840] animate-bounce"></div>
            <div class="text-xs text-[#e8b840] font-semibold animate-pulse flex flex-col items-center gap-1.5">
              <IconQrcode size={32} />
              <span>Memindai QR...</span>
            </div>
          {:else if scanSuccess}
            <div class="text-[#7a9a5e]"><IconCheck size={44} /></div>
            <div class="text-xs text-[#8db36b] font-bold mt-1">Presensi Berhasil!</div>
          {/if}
        </div>

        <button
          type="button"
          onclick={() => (scanModalOpen = false)}
          class="w-full py-2.5 rounded-full border border-white/[0.1] bg-transparent text-[#8b8d9a] text-xs font-bold cursor-pointer hover:bg-white/5"
        >
          Tutup
        </button>
      </div>
    </div>
  {/if}
</EventLayout>
