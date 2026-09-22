<script lang="ts">
  import type { Candidate } from '../lib/mockData';
  import SocialMediaList from './SocialMediaList.svelte';
  import type { Snippet } from 'svelte';
  import { IconX, IconPrinter } from '@tabler/icons-svelte';

  interface Props {
    candidate: Candidate | null;
    onclose: () => void;
    actions?: Snippet<[{ candidate: Candidate }]>;
    badges?: Snippet;
  }

  let { candidate, onclose, actions, badges }: Props = $props();

  let activePhoto = $state<string | null>(null);

  $effect(() => {
    if (candidate) {
      activePhoto = candidate.photos?.find((p) => p.is_main)?.url ?? candidate.photos?.[0]?.url ?? null;
    }
  });

  const calcAge = (dob?: string) => {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  let age = $derived(candidate ? calcAge(candidate.date_of_birth) : null);
  const toPills = (val?: string | string[]): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
    return String(val).split(',').map((s) => s.trim()).filter(Boolean);
  };

  let sifatPills = $derived(toPills(candidate?.sifat));
  let hobbies = $derived(toPills(candidate?.hobbies));
  let criteria = $derived(toPills(candidate?.partner_criteria));
  let favoriteFoods = $derived(toPills(candidate?.favorite_foods));

  const dadStatus: Record<string, string> = { member: 'Jamaah', non_member: 'Belum Jamaah' };
  const momStatus: Record<string, string> = { member: 'Jamaah', non_member: 'Belum Jamaah' };
  const parentStatus: Record<string, string> = { married: 'Menikah', divorced: 'Cerai Hidup', widowed: 'Cerai Mati' };
  const statusLabel: Record<string, string> = { active: 'Aktif', pending_verification: 'Menunggu Verifikasi', blocked: 'Diblokir', inactive: 'Nonaktif', finished: 'Selesai' };
  const maritalLabel: Record<string, string> = { single: 'Belum Menikah', divorced: 'Cerai Hidup', widowed: 'Cerai Mati' };
</script>

{#if candidate}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5">
    <!-- Backdrop Blur -->
    <div
      class="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      onclick={onclose}
    ></div>

    <!-- Sheet Modal Container -->
    <div class="relative w-full max-w-[520px] max-h-[92vh] sm:max-h-[94vh] overflow-y-auto bg-[#0d0f15] border-t sm:border border-white/[0.08] rounded-t-[28px] sm:rounded-3xl shadow-2xl z-10 [scrollbar-width:none] transition-transform animate-[modal-slide-up_0.25s_cubic-bezier(0.32,0.72,0,1)]">
      <!-- Mobile Pull Bar -->
      <div class="w-full pt-2.5 pb-1 flex justify-center sm:hidden absolute top-0 inset-x-0 z-20 pointer-events-none">
        <div class="w-12 h-1.5 rounded-full bg-white/40 shadow-sm"></div>
      </div>

      <!-- Galeri Foto -->
      <div class="relative h-[360px] sm:h-[420px] bg-[#0d0f15] rounded-t-[28px] sm:rounded-t-3xl overflow-hidden">
        {#if activePhoto}
          <img src={activePhoto} alt={candidate.nickname} class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full bg-gradient-to-br from-[#7a9a5e]/25 to-[#0d0f15] grid place-items-center text-[#8db36b] text-7xl font-bold">
            {(candidate.nickname || '?').slice(0, 2).toUpperCase()}
          </div>
        {/if}

        <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent via-45% to-black/95 pointer-events-none"></div>

        <!-- Badges -->
        <div class="absolute top-4 sm:top-3 left-4 sm:left-3 flex gap-1.5 flex-wrap max-w-[calc(100%-60px)]">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md {candidate.candidate_type === 'pashmina' ? 'bg-[#d4a030] text-[#0a0d06]' : 'bg-[#7a9a5e] text-[#0a0d06]'}">
            {candidate.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri'}
          </span>
          {#if badges}
            {@render badges()}
          {:else if candidate.status}
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#7a9a5e]/20 text-[#8db36b] border border-[#7a9a5e]/40">
              {statusLabel[candidate.status] ?? candidate.status}
            </span>
          {/if}
        </div>

        <!-- Close button -->
        <button
          type="button"
          onclick={onclose}
          class="absolute top-4 sm:top-3 right-4 sm:right-3 w-8 h-8 rounded-full bg-black/60 border border-white/20 grid place-items-center text-white text-sm hover:bg-[#e05555] transition-colors cursor-pointer backdrop-blur-md z-30"
          title="Tutup"
        >
          <IconX size={16} />
        </button>

        <!-- Candidate overlay title -->
        <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <div class="text-2xl sm:text-[26px] font-bold text-white drop-shadow-lg flex items-baseline gap-2">
            <span>{candidate.nickname || candidate.full_name}</span>
            {#if age}
              <span class="text-lg font-normal opacity-90">{age} tahun</span>
            {/if}
          </div>
          <div class="text-[13px] text-white/90 mt-1 drop-shadow-md">
            {typeof candidate.daerah === 'object' ? candidate.daerah.name : candidate.daerah ?? '—'}
            {#if candidate.education}
              <span class="opacity-70"> · {candidate.education}</span>
            {/if}
          </div>
          <div class="text-[11px] text-white/65 mt-0.5">
            {candidate.candidate_code} · {candidate.full_name}
          </div>
        </div>
      </div>

      <!-- Thumbnail bar -->
      {#if candidate.photos && candidate.photos.length > 1}
        <div class="flex gap-2 p-3 overflow-x-auto bg-[#13151c]/60 border-b border-white/[0.04]">
          {#each candidate.photos as p (p.id)}
            <button
              type="button"
              onclick={() => (activePhoto = p.url ?? null)}
              class="w-14 h-18 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all {activePhoto === p.url ? 'border-[#7a9a5e] scale-105' : 'border-white/10 opacity-70'}"
            >
              <img src={p.url} alt="Foto thumbnail" class="w-full h-full object-cover" />
            </button>
          {/each}
        </div>
      {/if}

      <!-- Profile Content Sections -->
      <div class="p-4 sm:p-5 space-y-4">
        <!-- Tentang -->
        <div class="bg-gradient-to-br from-[#1a1d27]/80 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4 sm:p-5">
          <div class="text-xs font-bold text-[#e4e4ec] mb-3">Tentang {candidate.nickname || 'Kandidat'}</div>

          {#if sifatPills.length > 0}
            <div class="flex flex-wrap gap-1.5 mb-3.5">
              {#each sifatPills as s}
                <span class="px-2.5 py-1 rounded-full bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b] text-[11px]">
                  {s}
                </span>
              {/each}
            </div>
          {/if}

          {#if candidate.self_description}
            <p class="text-[13px] text-[#c9cad6] leading-relaxed mb-4 whitespace-pre-line">
              {candidate.self_description}
            </p>
          {/if}

          <!-- Grid Atribut Personal -->
          <div class="grid grid-cols-2 gap-2.5 text-xs">
            {#if candidate.education}
              <div class="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Pendidikan</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">{candidate.education}</div>
              </div>
            {/if}

            {#if candidate.occupation}
              <div class="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Pekerjaan</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">{candidate.occupation}</div>
              </div>
            {/if}

            {#if candidate.height}
              <div class="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Tinggi</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">{candidate.height} cm</div>
              </div>
            {/if}

            {#if candidate.weight}
              <div class="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Berat</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">{candidate.weight} kg</div>
              </div>
            {/if}

            {#if candidate.date_of_birth}
              <div class="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Tanggal Lahir</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">
                  {new Date(candidate.date_of_birth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            {/if}

            {#if candidate.marital_status}
              <div class="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Status Pernikahan</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">{maritalLabel[candidate.marital_status] ?? candidate.marital_status}</div>
              </div>
            {/if}

            {#if candidate.social_media && candidate.social_media.length > 0}
              <div class="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.04] col-span-2">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold mb-1 block">Media Sosial</span>
                <SocialMediaList value={candidate.social_media} />
              </div>
            {/if}
          </div>

          <!-- Hobi -->
          {#if hobbies.length > 0}
            <div class="mt-3.5 pt-3 border-t border-white/[0.04]">
              <div class="text-[10px] font-bold text-[#8b8d9a] uppercase tracking-wider mb-2">Hobi</div>
              <div class="flex flex-wrap gap-1.5">
                {#each hobbies as h}
                  <span class="px-2.5 py-1 rounded-full bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b] text-[11px]">
                    {h}
                  </span>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Kriteria Pasangan -->
          {#if criteria.length > 0}
            <div class="mt-3.5 pt-3 border-t border-white/[0.04]">
              <div class="text-[10px] font-bold text-[#e8b840] uppercase tracking-wider mb-2">Kriteria Pasangan</div>
              <div class="flex flex-wrap gap-1.5">
                {#each criteria as c}
                  <span class="px-2.5 py-1 rounded-full bg-[#e8b840]/10 border border-[#e8b840]/25 text-[#e8b840] text-[11px]">
                    {c}
                  </span>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Makanan Favorit -->
          {#if favoriteFoods.length > 0}
            <div class="mt-3.5 pt-3 border-t border-white/[0.04]">
              <div class="text-[10px] font-bold text-[#8b8d9a] uppercase tracking-wider mb-2">Makanan Favorit</div>
              <div class="flex flex-wrap gap-1.5">
                {#each favoriteFoods as f}
                  <span class="px-2.5 py-1 rounded-full bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b] text-[11px]">
                    {f}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Informasi Keluarga -->
        <div class="bg-gradient-to-br from-[#1a1d27]/80 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4 sm:p-5">
          <div class="text-xs font-bold text-[#e4e4ec] mb-3">Informasi Keluarga</div>
          <div class="space-y-2 text-xs">
            {#if candidate.parents_marital_status}
              <div class="p-2.5 bg-white/[0.03] rounded-xl">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Status Pernikahan Orang Tua</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">{parentStatus[candidate.parents_marital_status] ?? candidate.parents_marital_status}</div>
              </div>
            {/if}
            {#if candidate.father_name}
              <div class="p-2.5 bg-white/[0.03] rounded-xl">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Ayah</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">
                  {candidate.father_name}
                  {#if candidate.father_membership_status}
                    <span class="text-[#8b8d9a] font-normal"> · {dadStatus[candidate.father_membership_status]}</span>
                  {/if}
                  {#if candidate.father_occupation}
                    <span class="text-[#8b8d9a] font-normal"> · {candidate.father_occupation}</span>
                  {/if}
                </div>
              </div>
            {/if}
            {#if candidate.mother_name}
              <div class="p-2.5 bg-white/[0.03] rounded-xl">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Ibu</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">
                  {candidate.mother_name}
                  {#if candidate.mother_membership_status}
                    <span class="text-[#8b8d9a] font-normal"> · {momStatus[candidate.mother_membership_status]}</span>
                  {/if}
                  {#if candidate.mother_occupation}
                    <span class="text-[#8b8d9a] font-normal"> · {candidate.mother_occupation}</span>
                  {/if}
                </div>
              </div>
            {/if}
            {#if candidate.birth_order || candidate.siblings_count}
              <div class="p-2.5 bg-white/[0.03] rounded-xl">
                <span class="text-[#5a5c6a] text-[10px] uppercase font-bold">Urutan Keluarga</span>
                <div class="text-[#e4e4ec] font-semibold mt-0.5">
                  Anak ke-{candidate.birth_order || '—'} dari {(candidate.siblings_count ?? 0) + 1} bersaudara
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- Aksi Tambahan & Cetak PDF -->
        <div class="flex justify-between items-center gap-2 p-3.5 border border-white/[0.06] rounded-2xl bg-[#13151c]/70">
          <button
            type="button"
            onclick={() => alert('Fitur cetak resume PDF')}
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/35 text-[#a78bfa] text-xs font-semibold hover:bg-[#8b5cf6]/25 transition-colors cursor-pointer"
          >
            <IconPrinter size={15} />
            <span>Cetak PDF Resume</span>
          </button>

          {#if actions}
            <div class="flex gap-2">
              {@render actions({ candidate })}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes modal-slide-up {
    from {
      transform: translateY(100%);
      opacity: 0.5;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
