<script lang="ts">
  import { link } from 'svelte-spa-router';
  import type { EventItem } from '../lib/mockData';

  interface Props {
    events?: EventItem[];
  }

  let { events = [] }: Props = $props();

  let dismissed = $state(false);
  let showModal = $state(false);
  let selectedEvent = $state<EventItem | null>(null);

  function openModal(e?: EventItem) {
    selectedEvent = e || events[0] || null;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedEvent = null;
  }

  function closeBadge(e: MouseEvent) {
    e.stopPropagation();
    dismissed = true;
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  let badgeLabel = $derived(
    events.length === 1 ? events[0].nama_kegiatan : `${events.length} Event Terbuka`
  );
</script>

{#if !dismissed && events.length > 0}
  <!-- Floating badge -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={() => openModal()}
    class="fixed top-3 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-md z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0d0f15]/95 backdrop-blur-md border border-[#e8b840]/30 shadow-xl shadow-black/40 cursor-pointer hover:bg-[#13151c]"
  >
    <span class="w-2 h-2 rounded-full bg-[#8db36b] animate-pulse shrink-0"></span>
    <span class="flex-1 min-w-0 text-xs font-bold text-[#e8b840] truncate leading-tight">{badgeLabel}</span>
    <button
      type="button"
      onclick={closeBadge}
      class="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-[#e05555]/20 text-[#8b8d9a] hover:text-[#e05555] transition-colors shrink-0"
    >
      ✕
    </button>
  </div>
{/if}

{#if showModal && selectedEvent}
  <!-- Detail Modal -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0" onclick={closeModal}></div>

    <!-- Modal box -->
    <div class="relative z-10 w-full max-w-[420px] max-h-[80vh] overflow-y-auto bg-[#0d0f15] rounded-3xl border border-white/[0.08] shadow-2xl">
      <button
        type="button"
        onclick={closeModal}
        class="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-[#0d0f15]/80 backdrop-blur-md border border-white/10 text-[#8b8d9a] hover:text-[#e05555] cursor-pointer transition-colors"
      >
        ✕
      </button>

      {#if selectedEvent.banner_url}
        <div class="rounded-t-3xl overflow-hidden max-h-[180px]">
          <img src={selectedEvent.banner_url} alt="" class="w-full h-[180px] object-cover" />
        </div>
      {/if}

      <div class="p-5">
        <h2 class="text-lg font-bold text-[#e4e4ec] mb-1">{selectedEvent.nama_kegiatan}</h2>
        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] mb-3">
          Pendaftaran Dibuka
        </span>

        {#if selectedEvent.deskripsi}
          <p class="text-[13px] text-[#8b8d9a] mb-4 leading-relaxed">{selectedEvent.deskripsi}</p>
        {/if}

        <div class="flex flex-col gap-2 mb-4">
          {#if selectedEvent.dates?.length}
            <div class="flex items-center gap-2.5 p-2.5 bg-black/40 rounded-xl">
              <span class="text-[#e8b840]">📅</span>
              <div>
                <div class="text-[10px] text-[#5a5c6a] font-bold uppercase tracking-wider">Tanggal</div>
                <span class="text-xs text-[#e4e4ec]">{fmtDate(selectedEvent.dates[0].date)}</span>
              </div>
            </div>
          {/if}
        </div>

        <a
          href={`/events/${selectedEvent.slug}`}
          use:link
          onclick={closeModal}
          class="block w-full py-3 rounded-full bg-[#7a9a5e] text-[#0a0d06] font-bold text-xs text-center no-underline hover:bg-[#8db36b] transition-colors"
        >
          Lihat Detail & Daftar
        </a>
      </div>
    </div>
  </div>
{/if}
