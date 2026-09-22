<script lang="ts">
  import type { Candidate } from '../lib/mockData';
  import type { Snippet } from 'svelte';

  interface Props {
    candidate: Candidate;
    statusLabels?: Record<string, string>;
    statusColors?: Record<string, { bg: string; color: string }>;
    clickable?: boolean;
    onclick?: (candidate: Candidate) => void;
    actions?: Snippet<[{ candidate: Candidate; age: number | null }]>;
  }

  let {
    candidate,
    statusLabels = {
      pending_verification: 'Menunggu Verifikasi',
      active: 'Aktif',
      blocked: 'Diblokir',
    },
    statusColors = {
      pending_verification: { bg: 'rgba(212,160,48,0.10)', color: '#e8b840' },
      active: { bg: 'rgba(122,154,94,0.12)', color: '#8db36b' },
      blocked: { bg: 'rgba(220,100,100,0.10)', color: '#dc6464' },
    },
    clickable = true,
    onclick,
    actions,
  }: Props = $props();

  const getMainPhoto = (c: Candidate) => c?.photos?.find((p) => p.is_main) ?? c?.photos?.[0] ?? null;
  const getAvatarUrl = (c: Candidate) => getMainPhoto(c)?.url ?? null;

  const calcAge = (dob?: string) => {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  let age = $derived(calcAge(candidate.date_of_birth));
  let mainPhoto = $derived(getAvatarUrl(candidate));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={() => clickable && onclick?.(candidate)}
  class="bg-[#13151c] rounded-[20px] overflow-hidden border border-white/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-[#7a9a5e]/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(122,154,94,0.15)] {clickable ? 'cursor-pointer' : 'cursor-default'}"
>
  <!-- Foto besar dating-app -->
  <div class="relative h-[380px] bg-[#0d0f15] overflow-hidden shrink-0">
    {#if mainPhoto}
      <img src={mainPhoto} alt={candidate.nickname} class="w-full h-full object-cover" />
    {:else}
      <div class="w-full h-full bg-gradient-to-br from-[#7a9a5e]/25 to-[#0d0f15] grid place-items-center text-[#8db36b] text-[56px] font-bold tracking-tighter">
        {(candidate.nickname || candidate.full_name || '?').slice(0, 2).toUpperCase()}
      </div>
    {/if}

    <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent via-45% to-black/90 pointer-events-none"></div>

    <!-- Top badges -->
    <div class="absolute top-3 left-3 flex gap-1.5 items-center">
      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md {candidate.candidate_type === 'pashmina' ? 'bg-[#d4a030] text-[#0a0d06]' : 'bg-[#7a9a5e] text-[#0a0d06]'}">
        {candidate.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri'}
      </span>
      {#if candidate.photos && candidate.photos.length > 1}
        <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-black/55 text-white border border-white/20 backdrop-blur-md">
          +{candidate.photos.length} foto
        </span>
      {/if}
    </div>

    <div class="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md {candidate.gender === 'male' ? 'bg-[#64a0dc]' : 'bg-[#c878b4]'}">
        {candidate.gender === 'male' ? '♂ Pria' : '♀ Wanita'}
      </span>
      {#if candidate.status}
        <span
          class="px-2 py-0.5 rounded-full text-[9px] font-bold border"
          style="background: {statusColors[candidate.status]?.bg ?? 'rgba(255,255,255,0.05)'}; color: {statusColors[candidate.status]?.color ?? '#8b8d9a'}; border-color: {statusColors[candidate.status]?.color ?? 'rgba(255,255,255,0.1)'}"
        >
          {statusLabels[candidate.status] ?? candidate.status}
        </span>
      {/if}
    </div>

    <!-- Bottom overlay info -->
    <div class="absolute bottom-0 left-0 right-0 p-4">
      <div class="text-[22px] font-bold text-white leading-tight drop-shadow-md flex items-baseline gap-1.5 flex-wrap">
        <span class="truncate max-w-[180px]">{candidate.nickname || candidate.full_name}</span>
        {#if age}
          <span class="text-lg font-normal opacity-90">{age}</span>
        {/if}
      </div>
      <div class="text-xs text-white/90 mt-1 flex items-center gap-1 drop-shadow-sm">
        <svg class="w-3 h-3 opacity-90 shrink-0" fill="none" viewBox="0 0 12 12">
          <path d="M6 1.2C3.8 1.2 2.2 2.9 2.2 4.7c0 2.8 3.8 6 3.8 6s3.8-3.2 3.8-6C9.8 2.9 8.2 1.2 6 1.2z" stroke="white" stroke-width="1.1" fill="none"/>
          <circle cx="6" cy="4.7" r="1.2" stroke="white" stroke-width="1.1" fill="none"/>
        </svg>
        <span class="truncate">
          {typeof candidate.daerah === 'object' ? candidate.daerah.name : candidate.daerah ?? '—'}
          {#if candidate.education}
            <span class="opacity-70"> · {candidate.education}</span>
          {/if}
        </span>
      </div>
      <div class="text-[10px] text-white/60 mt-0.5 drop-shadow-sm">
        {candidate.candidate_code} · {candidate.full_name}
      </div>
    </div>

    <!-- Thumb strip -->
    {#if candidate.photos && candidate.photos.length > 1}
      <div class="absolute bottom-[78px] left-3 flex gap-1.5">
        {#each candidate.photos.slice(0, 4) as p, i (p.id)}
          <div class="w-9 h-9 rounded-lg overflow-hidden border shadow-md {i === 0 ? 'border-[#7a9a5e] opacity-100' : 'border-white/35 opacity-85'}">
            <img src={p.url} alt="" class="w-full h-full object-cover" />
          </div>
        {/each}
        {#if candidate.photos.length > 4}
          <div class="w-9 h-9 rounded-lg bg-black/60 border border-white/25 grid place-items-center text-[10px] font-bold text-white backdrop-blur-md">
            +{candidate.photos.length - 4}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Slot aksi -->
  {#if actions}
    <div class="p-3 flex gap-1.5 flex-wrap bg-[#13151c] border-t border-white/[0.04]">
      {@render actions({ candidate, age })}
    </div>
  {/if}
</div>
