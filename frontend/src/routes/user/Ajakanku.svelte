<script lang="ts">
  import { link } from 'svelte-spa-router';
  import UserLayout from '../../layouts/UserLayout.svelte';
  import Modal from '../../components/Modal.svelte';
  import CandidateDetailModal from '../../components/CandidateDetailModal.svelte';
  import { mockCandidates, type Candidate } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';

  interface AjakanItem {
    id: number;
    candidate: Candidate;
    status: 'pending' | 'process' | 'rejected';
    created_at: string;
  }

  let me = $derived(auth.user);

  let defaultOpponents = $derived.by(() => {
    if (!me) return [];
    return mockCandidates.filter((c) => c.gender !== me.gender && c.id !== me.id);
  });

  let ajakList = $state<AjakanItem[]>([]);
  let initialized = $state(false);
  let detailCandidate = $state<Candidate | null>(null);

  $effect(() => {
    if (me && !initialized && defaultOpponents.length > 0) {
      ajakList = [
        {
          id: 101,
          candidate: defaultOpponents[0],
          status: 'pending',
          created_at: '2025-05-10',
        },
        ...(defaultOpponents.length > 1
          ? [
              {
                id: 102,
                candidate: defaultOpponents[1],
                status: 'process' as const,
                created_at: '2025-05-08',
              },
            ]
          : []),
      ];
      initialized = true;
    }
  });

  let cancelTarget = $state<AjakanItem | null>(null);

  function confirmCancel() {
    if (!cancelTarget) return;
    ajakList = ajakList.filter((a) => a.id !== cancelTarget!.id);
    cancelTarget = null;
  }

  function calcAge(dob: string) {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  }
</script>

<UserLayout ajakCount={ajakList.length}>
  <div class="mb-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-[#e4e4ec]">Ajakanku</h1>
      <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/25">
        {ajakList.length}/5 Slot
      </span>
    </div>
    <p class="text-xs text-[#8b8d9a] mt-1 leading-relaxed">
      Daftar kandidat lawan jenis yang kamu ajukan untuk taaruf terjaga melalui Tim PNKB LDII.
    </p>
  </div>

  {#if ajakList.length > 0}
    <div class="space-y-3">
      {#each ajakList as item (item.id)}
        <div class="bg-gradient-to-br from-[#1a1d27] to-[#13151c] border border-white/[0.06] rounded-2xl p-4 flex gap-3.5 items-start">
          <div class="w-16 h-20 rounded-xl overflow-hidden bg-black shrink-0 relative">
            {#if item.candidate.photos?.[0]}
              <img src={item.candidate.photos[0].url} alt="" class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full flex items-center justify-center bg-[#7a9a5e]/20 text-[#8db36b] font-bold text-sm">
                {(item.candidate.nickname || '?').slice(0, 2)}
              </div>
            {/if}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-1">
              <div>
                <div class="flex items-center gap-1.5">
                  <h3 class="text-sm font-bold text-[#e4e4ec] truncate">
                    {item.candidate.nickname || item.candidate.full_name}
                    {#if calcAge(item.candidate.date_of_birth)}
                      <span class="text-xs font-normal text-[#8b8d9a]">, {calcAge(item.candidate.date_of_birth)} th</span>
                    {/if}
                  </h3>
                  <span class="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white font-medium">
                    {item.candidate.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
                  </span>
                </div>
                <div class="text-[11px] text-[#8b8d9a] mt-0.5 truncate">
                  {typeof item.candidate.daerah === 'object' ? item.candidate.daerah.name : item.candidate.daerah} · {item.candidate.occupation || '-'}
                </div>
              </div>

              {#if item.status === 'pending'}
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e8b840]/15 text-[#e8b840] border border-[#e8b840]/25 whitespace-nowrap">
                  Menunggu PNKB
                </span>
              {:else if item.status === 'process'}
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/25 whitespace-nowrap">
                  Proses Taaruf
                </span>
              {:else}
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-[#8b8d9a] border border-white/15 whitespace-nowrap">
                  Belum Berjodoh
                </span>
              {/if}
            </div>

            <div class="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/[0.04]">
              <button
                type="button"
                onclick={() => (detailCandidate = item.candidate)}
                class="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-[#e4e4ec] hover:bg-white/10 transition-colors cursor-pointer"
              >
                Lihat Detail
              </button>
              <button
                type="button"
                onclick={() => (cancelTarget = item)}
                class="px-3 py-1 rounded-full bg-[#e05555]/10 border border-[#e05555]/20 text-[11px] font-semibold text-[#e05555] hover:bg-[#e05555]/20 cursor-pointer transition-colors"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="py-14 px-4 text-center border border-dashed border-white/[0.08] rounded-2xl">
      <div class="text-4xl mb-3">💌</div>
      <h3 class="text-sm font-bold text-[#e4e4ec] mb-1">Belum Ada Ajakan</h3>
      <p class="text-xs text-[#8b8d9a] max-w-xs mx-auto mb-5">
        Kamu belum mengajukan kandidat manapun. Buka halaman Cari untuk menemukan calon pasangan terjaga.
      </p>
      <a
        href="/"
        use:link
        class="inline-block px-5 py-2.5 rounded-full bg-[#7a9a5e] text-[#0a0d06] font-bold text-xs no-underline hover:bg-[#8db36b] transition-colors"
      >
        Mulai Cari Kandidat
      </a>
    </div>
  {/if}

  <!-- Candidate Detail Bottom Sheet Modal -->
  {#if detailCandidate}
    <CandidateDetailModal
      candidate={detailCandidate}
      onclose={() => (detailCandidate = null)}
    />
  {/if}

  <!-- Modal Konfirmasi Batal -->
  <Modal show={cancelTarget !== null} onclose={() => (cancelTarget = null)} maxWidth="sm">
    <div class="p-6 text-center">
      <div class="w-12 h-12 rounded-full flex items-center justify-center bg-[#e05555]/10 border border-[#e05555]/20 text-[#e05555] mx-auto mb-3">
        ✕
      </div>
      <h3 class="text-base font-bold text-[#e4e4ec]">Batalkan Ajakan?</h3>
      <p class="text-xs text-[#8b8d9a] mt-1.5 leading-relaxed">
        Apakah kamu yakin ingin membatalkan ajakan taaruf untuk <strong class="text-white">{cancelTarget?.candidate.nickname}</strong>?
      </p>
      <div class="flex gap-2.5 mt-5">
        <button
          type="button"
          onclick={() => (cancelTarget = null)}
          class="flex-1 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[#e4e4ec] text-xs font-semibold cursor-pointer"
        >
          Kembali
        </button>
        <button
          type="button"
          onclick={confirmCancel}
          class="flex-1 py-2.5 rounded-full bg-[#e05555] text-white text-xs font-bold cursor-pointer hover:bg-[#c94444]"
        >
          Ya, Batalkan
        </button>
      </div>
    </div>
  </Modal>
</UserLayout>
