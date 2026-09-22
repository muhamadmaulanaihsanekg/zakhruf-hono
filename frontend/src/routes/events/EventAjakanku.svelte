<script lang="ts">
  import { link } from 'svelte-spa-router';
  import EventLayout from '../../layouts/EventLayout.svelte';
  import CandidateDetailModal from '../../components/CandidateDetailModal.svelte';
  import { mockEvents, mockCandidates, type Candidate } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';
  import {
    IconMailHeart,
    IconInbox,
    IconTrash,
    IconX,
  } from '@tabler/icons-svelte';

  interface Props {
    params?: { slug?: string };
  }

  let { params = { slug: 'temu-akrab-2025' } }: Props = $props();

  let me = $derived(auth.user);

  let event = $derived(
    mockEvents.find((e) => e.slug === params.slug) || mockEvents[0]
  );

  let oppositePool = $derived.by(() => {
    if (!me) return [];
    return mockCandidates.filter((c) => c.gender !== me.gender && c.id !== me.id);
  });

  let tab = $state<'terkirim' | 'diterima'>('terkirim');

  interface SentItem {
    id: number;
    target: Candidate;
    created_at: string;
    status: string;
  }

  interface IncomingItem {
    id: number;
    room_name: string;
    status: 'waiting' | 'called' | 'done' | 'cancelled';
    callers: Candidate[];
    session_name: string;
    tim_pnkb: string;
    created_at: string;
  }

  let sentList = $state<SentItem[]>([]);
  let incomingList = $state<IncomingItem[]>([]);
  let initialized = $state(false);
  let detailCandidate = $state<Candidate | null>(null);

  $effect(() => {
    if (me && !initialized && oppositePool.length > 0) {
      sentList = [
        {
          id: 201,
          target: oppositePool[0],
          created_at: '2025-05-18',
          status: 'waiting',
        },
        ...(oppositePool.length > 1
          ? [
              {
                id: 202,
                target: oppositePool[1],
                created_at: '2025-05-18',
                status: 'waiting',
              },
            ]
          : []),
      ];

      incomingList = [
        {
          id: 301,
          room_name: 'Bilik 02 — Mawar',
          status: 'waiting',
          callers: [oppositePool[0]],
          session_name: 'Sesi Siang (13:30 - 15:30)',
          tim_pnkb: 'Ust. H. Bambang',
          created_at: '18 Mei 2025 10:15',
        },
      ];
      initialized = true;
    }
  });

  let deleteTarget = $state<SentItem | null>(null);

  function confirmDelete() {
    if (!deleteTarget) return;
    sentList = sentList.filter((s) => s.id !== deleteTarget!.id);
    deleteTarget = null;
  }

  const calcAge = (dob?: string) => {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const statusLabels: Record<string, string> = {
    waiting: 'Menunggu',
    called: 'Dipanggil',
    done: 'Selesai',
    cancelled: 'Batal',
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    waiting: { bg: 'rgba(232,184,64,0.12)', color: '#e8b840' },
    called: { bg: 'rgba(122,160,195,0.12)', color: '#7aa0c3' },
    done: { bg: 'rgba(122,154,94,0.12)', color: '#8db36b' },
    cancelled: { bg: 'rgba(224,85,85,0.10)', color: '#e05555' },
  };
</script>

<EventLayout {event} participantNumber="042">
  <div class="mb-4">
    <h1 class="text-xl font-bold text-[#e4e4ec] m-0 mb-1">Ajakan Ta'aruf</h1>
    <p class="text-xs text-[#8b8d9a] m-0">
      Kelola ajakan taaruf kamu di event ini — yang kamu kirim dan yang masuk ke kamu.
    </p>
  </div>

  <!-- Tab Terkirim / Diterima -->
  <div class="flex gap-1.5 bg-[#13151c] border border-white/[0.06] rounded-full p-1 mb-4">
    <button
      type="button"
      onclick={() => (tab = 'terkirim')}
      class="flex-1 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all {tab === 'terkirim'
        ? 'bg-[#e8b840]/15 text-[#e8b840]'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      Terkirim {#if sentList.length}<span class="opacity-75">({sentList.length})</span>{/if}
    </button>
    <button
      type="button"
      onclick={() => (tab = 'diterima')}
      class="flex-1 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all {tab === 'diterima'
        ? 'bg-[#e8b840]/15 text-[#e8b840]'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      Diterima {#if incomingList.length}<span class="opacity-75">({incomingList.length})</span>{/if}
    </button>
  </div>

  {#if tab === 'terkirim'}
    {#if sentList.length === 0}
      <div class="py-10 px-6 text-center text-[#5a5c6a] border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center">
        <div class="w-12 h-12 rounded-2xl bg-[#e8b840]/12 border border-[#e8b840]/25 grid place-items-center text-[#e8b840] mb-2.5">
          <IconMailHeart size={24} />
        </div>
        <div class="text-[#e4e4ec] font-bold text-sm mb-1.5">Belum ada ajakan terkirim</div>
        <div class="text-xs mb-4">Ajak peserta dari menu Jemput Jodoh — ajakanmu masuk antrean pemanggilan.</div>
        <a
          href={`/events/${event.slug}/swap`}
          use:link
          class="inline-block px-5 py-2.5 rounded-full bg-[#e8b840] text-[#0a0d06] font-bold text-xs no-underline hover:bg-[#f0c850] transition-colors"
        >
          Cari Peserta
        </a>
      </div>
    {:else}
      <div class="grid gap-2.5">
        {#each sentList as item (item.id)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="flex items-center gap-3 bg-[#13151c] border border-white/[0.06] rounded-2xl p-3 cursor-pointer hover:border-white/15 transition-colors"
            onclick={() => (detailCandidate = item.target)}
          >
            <div class="w-13 h-16 rounded-xl overflow-hidden bg-[#0d0f15] grid place-items-center shrink-0 text-[#8db36b] font-bold">
              {#if item.target.photos?.[0]}
                <img src={item.target.photos[0].url} alt="" class="w-full h-full object-cover" />
              {:else}
                <span>{(item.target.nickname || '?').slice(0, 2).toUpperCase()}</span>
              {/if}
            </div>

            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-[#e4e4ec]">
                {item.target.nickname || 'Kandidat'}
                {#if calcAge(item.target.date_of_birth)}
                  <span class="text-xs font-normal text-[#8b8d9a] ml-1.5">{calcAge(item.target.date_of_birth)}</span>
                {/if}
              </div>
              <div class="text-[11px] text-[#8b8d9a] mt-0.5 truncate">
                {typeof item.target.daerah === 'object' ? item.target.daerah.name : item.target.daerah ?? '—'}
                {#if item.target.education}
                  <span class="opacity-70"> · {item.target.education}</span>
                {/if}
              </div>
              <div class="text-[10px] text-[#5a5c6a] mt-1">Diajukan {item.created_at}</div>
            </div>

            <div class="flex flex-col items-end gap-1.5 shrink-0">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e8b840]/12 text-[#e8b840] border border-[#e8b840]/25">
                Dalam antrean
              </span>
              <button
                type="button"
                onclick={(e) => { e.stopPropagation(); deleteTarget = item; }}
                class="px-3 py-1 rounded-full border border-[#e05555]/20 bg-transparent text-[#e05555] hover:bg-[#e05555]/10 text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1"
              >
                <IconTrash size={12} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <!-- Diterima -->
    {#if incomingList.length === 0}
      <div class="py-10 px-6 text-center text-[#5a5c6a] border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center">
        <div class="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 grid place-items-center text-[#8b8d9a] mb-2.5">
          <IconInbox size={24} />
        </div>
        <div class="text-[#e4e4ec] font-bold text-sm mb-1.5">Belum ada ajakan masuk</div>
        <div class="text-xs">Kalau ada peserta yang memanggilmu, statusnya akan muncul di sini.</div>
      </div>
    {:else}
      <div class="grid gap-2.5">
        {#each incomingList as inc (inc.id)}
          <div class="bg-[#13151c] border border-white/[0.06] rounded-2xl p-3.5">
            <div class="flex justify-between items-center gap-2.5">
              <div class="text-[13px] font-bold text-[#e4e4ec]">{inc.room_name}</div>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                style="background: {statusColors[inc.status]?.bg}; color: {statusColors[inc.status]?.color}; border-color: {statusColors[inc.status]?.color}40;"
              >
                {statusLabels[inc.status] || inc.status}
              </span>
            </div>

            {#if inc.callers && inc.callers.length > 0}
              <div class="text-[11px] text-[#8db36b] mt-1 font-semibold">
                Pemanggil:
                {#each inc.callers as cl, ci}
                  <span>{cl.nickname || cl.full_name} ({cl.candidate_code || '-'}){ci < inc.callers.length - 1 ? ', ' : ''}</span>
                {/each}
              </div>
            {/if}

            <div class="text-xs text-[#8b8d9a] mt-1.5 space-y-0.5">
              <div>Sesi: {inc.session_name}</div>
              <div>Didampingi: {inc.tim_pnkb}</div>
              <div>Masuk antrean: {inc.created_at}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}

  <!-- Candidate Detail Bottom Sheet Modal -->
  {#if detailCandidate}
    <CandidateDetailModal
      candidate={detailCandidate}
      onclose={() => (detailCandidate = null)}
    />
  {/if}

  <!-- Modal Konfirmasi Hapus Ajakan -->
  {#if deleteTarget}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/65 backdrop-blur-sm" onclick={() => (deleteTarget = null)}></div>
      <div class="relative w-full max-w-[360px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 text-center shadow-2xl z-10">
        <div class="w-12 h-12 rounded-full bg-[#e05555]/10 border border-[#e05555]/20 grid place-items-center mx-auto mb-3 text-[#e05555]">
          <IconX size={20} />
        </div>
        <h3 class="text-[15px] font-bold text-[#e4e4ec] mb-1.5">Batalkan ajakan match?</h3>
        <p class="text-xs text-[#8b8d9a] leading-relaxed mb-4">
          Ajakan ke <strong class="text-white">{deleteTarget.target.nickname || deleteTarget.target.full_name}</strong> akan ditarik dari antrean.
        </p>
        <div class="flex gap-2.5">
          <button
            type="button"
            onclick={() => (deleteTarget = null)}
            class="flex-1 py-2.5 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] text-xs font-bold hover:bg-white/5 cursor-pointer"
          >
            Kembali
          </button>
          <button
            type="button"
            onclick={confirmDelete}
            class="flex-1 py-2.5 rounded-full bg-[#e05555] hover:bg-[#c94444] text-white text-xs font-bold cursor-pointer"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  {/if}
</EventLayout>
