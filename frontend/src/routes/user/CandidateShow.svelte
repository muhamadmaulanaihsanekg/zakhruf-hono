<script lang="ts">
  import { link } from 'svelte-spa-router';
  import UserLayout from '../../layouts/UserLayout.svelte';
  import SocialMediaList from '../../components/SocialMediaList.svelte';
  import { mockCandidates, type Candidate } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';

  interface Props {
    params?: { id?: string };
  }

  let { params = { id: '4' } }: Props = $props();

  let me = $derived(auth.user);

  let candidate = $derived.by<Candidate>(() => {
    const found = mockCandidates.find((c) => String(c.id) === String(params.id));
    if (found) return found;
    // Default fallback to first opposite gender candidate
    if (me?.gender === 'female') {
      return mockCandidates.find((c) => c.gender === 'male') || mockCandidates[0];
    }
    return mockCandidates.find((c) => c.gender === 'female') || mockCandidates[0];
  });

  let photoIdx = $state(0);
  let showConfirmModal = $state(false);
  let ajakSuccess = $state(false);

  let isInvalidGender = $derived(me && candidate && me.gender === candidate.gender);

  function calcAge(dob: string) {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  }

  function handleAjak() {
    showConfirmModal = false;
    ajakSuccess = true;
    setTimeout(() => {
      ajakSuccess = false;
    }, 4000);
  }
</script>

<UserLayout>
  <!-- Back Button & Header -->
  <div class="flex items-center justify-between mb-4">
    <a
      href="/"
      use:link
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[#8b8d9a] hover:text-[#e4e4ec] no-underline transition-colors"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      <span>Kembali</span>
    </a>
    <div class="flex gap-1.5">
      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
        {candidate.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
      </span>
      <span
        class="px-2.5 py-1 rounded-full text-[10px] font-bold {candidate.candidate_type === 'pashmina'
          ? 'bg-[#d4a030] text-[#0a0d06]'
          : 'bg-[#7a9a5e] text-[#0a0d06]'}"
      >
        {candidate.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri'}
      </span>
    </div>
  </div>

  {#if isInvalidGender}
    <div class="mb-4 p-3.5 rounded-2xl bg-[#e05555]/15 border border-[#e05555]/30 text-xs text-[#e05555] text-center">
      ⚠️ Sesuai prinsip syariat ta'aruf terjaga, kandidat sesama jenis tidak dapat diajukan.
    </div>
  {/if}

  {#if ajakSuccess}
    <div class="mb-4 p-3.5 rounded-2xl bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-xs text-[#8db36b] flex items-center gap-2.5">
      <span class="text-base">✓</span>
      <span>Berhasil disimpan ke Ajakanku. Silakan cek menu Ajakanku.</span>
    </div>
  {/if}

  <!-- Photo Gallery Card -->
  <div class="bg-[#13151c] rounded-3xl overflow-hidden border border-white/[0.06] shadow-xl mb-4.5">
    <div class="relative h-[340px] bg-black">
      {#if candidate.photos && candidate.photos.length > 0}
        <img
          src={candidate.photos[photoIdx].url}
          alt={candidate.nickname}
          class="w-full h-full object-cover transition-opacity duration-200"
        />
      {:else}
        <div class="w-full h-full bg-gradient-to-br from-[#7a9a5e]/25 to-[#0d0f15] flex items-center justify-center text-[#8db36b] text-6xl font-bold">
          {(candidate.nickname || '?').slice(0, 2).toUpperCase()}
        </div>
      {/if}

      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

      <!-- Dot indicators -->
      {#if candidate.photos && candidate.photos.length > 1}
        <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {#each candidate.photos as _, idx}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
              onclick={() => (photoIdx = idx)}
              class="h-1.5 rounded-full cursor-pointer transition-all {idx === photoIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}"
            ></span>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Candidate Main Name & Code -->
    <div class="p-4.5">
      <div class="flex items-baseline justify-between gap-2">
        <h1 class="text-2xl font-bold text-[#e4e4ec] tracking-tight">
          {candidate.nickname || candidate.full_name}
          {#if calcAge(candidate.date_of_birth)}
            <span class="text-lg font-normal text-[#8b8d9a]">, {calcAge(candidate.date_of_birth)} th</span>
          {/if}
        </h1>
        <span class="text-[11px] font-mono text-[#7a9a5e] bg-[#7a9a5e]/10 px-2 py-0.5 rounded-md border border-[#7a9a5e]/20">
          {candidate.candidate_code}
        </span>
      </div>
      <div class="text-xs text-[#8b8d9a] mt-1 font-medium">
        {candidate.full_name}
      </div>
    </div>
  </div>

  <!-- Bento Details Sections -->
  <div class="space-y-3.5 mb-24">
    <!-- Bio / Tentang Saya -->
    {#if candidate.bio}
      <div class="bg-gradient-to-br from-[#1a1d27]/70 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4.5">
        <div class="text-[10px] font-bold text-[#7a9a5e] uppercase tracking-wider mb-2">Tentang Saya</div>
        <p class="text-[13px] text-[#e4e4ec] leading-relaxed whitespace-pre-line">{candidate.bio}</p>
      </div>
    {/if}

    <!-- Data Pribadi -->
    <div class="bg-gradient-to-br from-[#1a1d27]/70 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4.5">
      <div class="text-[10px] font-bold text-[#7a9a5e] uppercase tracking-wider mb-3">Data Pribadi</div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
          <div class="text-[#5a5c6a] text-[10px] uppercase font-bold">Tinggi / Berat</div>
          <div class="text-[#e4e4ec] font-semibold mt-0.5">{candidate.height || '-'} cm / {candidate.weight || '-'} kg</div>
        </div>
        <div class="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
          <div class="text-[#5a5c6a] text-[10px] uppercase font-bold">Suku</div>
          <div class="text-[#e4e4ec] font-semibold mt-0.5">{candidate.suku || '-'}</div>
        </div>
        <div class="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
          <div class="text-[#5a5c6a] text-[10px] uppercase font-bold">Golongan Darah</div>
          <div class="text-[#e4e4ec] font-semibold mt-0.5">{candidate.blood_type || '-'}</div>
        </div>
        <div class="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
          <div class="text-[#5a5c6a] text-[10px] uppercase font-bold">Anak ke-</div>
          <div class="text-[#e4e4ec] font-semibold mt-0.5">Ke-{candidate.birth_order || 1} dari {candidate.siblings_count || 3} bersaudara</div>
        </div>
      </div>
    </div>

    <!-- Domisili & Asal -->
    <div class="bg-gradient-to-br from-[#1a1d27]/70 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4.5">
      <div class="text-[10px] font-bold text-[#7a9a5e] uppercase tracking-wider mb-3">Domisili & Wilayah</div>
      <div class="space-y-2 text-xs">
        <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
          <span class="text-[#8b8d9a]">Daerah</span>
          <span class="text-[#e4e4ec] font-semibold">{typeof candidate.daerah === 'object' ? candidate.daerah.name : candidate.daerah}</span>
        </div>
        <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
          <span class="text-[#8b8d9a]">Desa</span>
          <span class="text-[#e4e4ec] font-semibold">{typeof candidate.desa === 'object' ? candidate.desa.name : candidate.desa}</span>
        </div>
        <div class="flex justify-between py-1.5">
          <span class="text-[#8b8d9a]">Kelompok</span>
          <span class="text-[#e4e4ec] font-semibold">{typeof candidate.kelompok === 'object' ? candidate.kelompok.name : candidate.kelompok}</span>
        </div>
      </div>
    </div>

    <!-- Pendidikan & Karir -->
    <div class="bg-gradient-to-br from-[#1a1d27]/70 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4.5">
      <div class="text-[10px] font-bold text-[#7a9a5e] uppercase tracking-wider mb-3">Pendidikan & Karir</div>
      <div class="space-y-2 text-xs">
        <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
          <span class="text-[#8b8d9a]">Pendidikan Terakhir</span>
          <span class="text-[#e4e4ec] font-semibold">{candidate.education || '-'}</span>
        </div>
        <div class="flex justify-between py-1.5 border-b border-white/[0.04]">
          <span class="text-[#8b8d9a]">Pekerjaan</span>
          <span class="text-[#e4e4ec] font-semibold">{candidate.occupation || '-'}</span>
        </div>
        {#if candidate.company_name}
          <div class="flex justify-between py-1.5">
            <span class="text-[#8b8d9a]">Instansi / Tempat Kerja</span>
            <span class="text-[#e4e4ec] font-semibold">{candidate.company_name}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Sifat & Hobi -->
    <div class="bg-gradient-to-br from-[#1a1d27]/70 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4.5">
      <div class="text-[10px] font-bold text-[#7a9a5e] uppercase tracking-wider mb-3">Karakter & Hobi</div>
      <div class="mb-3">
        <div class="text-[10px] text-[#5a5c6a] uppercase font-bold mb-1.5">Sifat Pribadi</div>
        <div class="flex flex-wrap gap-1.5">
          {#each candidate.traits || ['Ramah', 'Penyabar', 'Religius'] as trait}
            <span class="px-2.5 py-1 rounded-full text-[11px] bg-[#7a9a5e]/15 text-[#8db36b] font-medium border border-[#7a9a5e]/25">
              {trait}
            </span>
          {/each}
        </div>
      </div>
      <div>
        <div class="text-[10px] text-[#5a5c6a] uppercase font-bold mb-1.5">Hobi</div>
        <div class="flex flex-wrap gap-1.5">
          {#each Array.isArray(candidate.hobbies) ? candidate.hobbies : (candidate.hobbies || '').split(', ') as hobby}
            <span class="px-2.5 py-1 rounded-full text-[11px] bg-white/[0.04] text-[#e4e4ec] border border-white/[0.08]">
              {hobby}
            </span>
          {/each}
        </div>
      </div>
    </div>

    <!-- Kriteria Pasangan yang Dicari -->
    {#if candidate.partner_criteria}
      <div class="bg-gradient-to-br from-[#1a1d27]/70 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4.5">
        <div class="text-[10px] font-bold text-[#e8b840] uppercase tracking-wider mb-2">Kriteria Pasangan yang Dicari</div>
        <p class="text-[13px] text-[#e4e4ec] leading-relaxed whitespace-pre-line">{candidate.partner_criteria}</p>
      </div>
    {/if}

    <!-- Sosial Media -->
    {#if candidate.social_media}
      <div class="bg-gradient-to-br from-[#1a1d27]/70 to-[#13151c]/90 border border-white/[0.06] rounded-2xl p-4.5">
        <div class="text-[10px] font-bold text-[#7a9a5e] uppercase tracking-wider mb-3">Media Sosial</div>
        <SocialMediaList value={candidate.social_media} />
      </div>
    {/if}
  </div>

  <!-- Sticky Bottom CTA -->
  {#if !isInvalidGender}
    <div class="fixed bottom-[72px] left-0 right-0 bg-[#13151c]/95 backdrop-blur-md border-t border-white/[0.06] p-3.5 z-30 flex justify-center">
      <div class="w-full max-w-[480px]">
        <button
          type="button"
          onclick={() => (showConfirmModal = true)}
          class="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#7a9a5e] to-[#6b8c4f] hover:from-[#8db36b] hover:to-[#7a9a5e] text-[#0a0d06] font-bold text-sm cursor-pointer shadow-lg shadow-[#7a9a5e]/25 transition-all flex items-center justify-center gap-2"
        >
          <span>♥ Simpan ke Ajakanku</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- Modal Konfirmasi Ajak -->
  {#if showConfirmModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/65 backdrop-blur-sm">
      <div class="relative w-[340px] max-w-[90vw] bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 text-center shadow-2xl">
        <div class="text-4xl mb-2.5">🤝</div>
        <h3 class="text-[15px] font-bold text-[#e4e4ec] mb-1.5">
          Ajak {candidate.nickname || candidate.full_name} bertaaruf?
        </h3>
        <p class="text-xs text-[#8b8d9a] leading-relaxed mb-4.5">
          Ajakan kamu akan diteruskan kepada tim PNKB (Panitia Nikah Barokah) untuk difasilitasi proses berikutnya.
        </p>
        <div class="flex gap-2.5">
          <button
            type="button"
            onclick={() => (showConfirmModal = false)}
            class="flex-1 py-2.5 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] text-xs font-bold hover:bg-white/5 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onclick={handleAjak}
            class="flex-[2] py-2.5 rounded-full bg-[#7a9a5e] text-[#0a0d06] text-xs font-bold hover:bg-[#8db36b] cursor-pointer"
          >
            Ya, Simpan Ajakan
          </button>
        </div>
      </div>
    </div>
  {/if}
</UserLayout>
