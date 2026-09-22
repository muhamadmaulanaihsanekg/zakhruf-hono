<script lang="ts">
  import UserLayout from '../../layouts/UserLayout.svelte';
  import CandidateDetailModal from '../../components/CandidateDetailModal.svelte';
  import Select from '../../components/Select.svelte';
  import BottomSheet from '../../components/BottomSheet.svelte';
  import { mockCandidates, daerahs, educations, type Candidate } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';
  import {
    IconHeart,
    IconX,
    IconEye,
    IconAdjustmentsHorizontal,
    IconHeartHandshake,
    IconSearch,
  } from '@tabler/icons-svelte';

  let me = $derived(auth.user);

  // Pool filtered strictly by opposite gender and not self
  let oppositePool = $derived.by(() => {
    if (!me) return [];
    return mockCandidates.filter(
      (c) => c.id !== me.id && c.gender !== me.gender && c.status === 'active'
    );
  });

  let candidates = $state<Candidate[]>([]);
  let initialized = $state(false);

  $effect(() => {
    if (me && !initialized) {
      candidates = [...oppositePool];
      initialized = true;
    }
  });

  let pos = $state(1);
  let photoIdx = $state(0);
  let filterOpen = $state(false);
  let swipeBusy = $state(false);
  let detailCandidate = $state<Candidate | null>(null);
  let confirmTarget = $state<Candidate | null>(null);
  let ajakCount = $state(1);

  // Filter state
  let fEducation = $state('');
  let fOccupation = $state('');
  let fDaerahId = $state<number | string>('');
  let fDesaId = $state<number | string>('');
  let fKelompokId = $state<number | string>('');
  let fHobbies = $state<string[]>([]);
  let fSifat = $state<string[]>([]);
  let fMinAge = $state(17);
  let fMaxAge = $state(60);

  const hobbyOptions = ['Membaca', 'Olahraga', 'Memasak', 'Traveling', 'Berkebun', 'Fotografi', 'Musik', 'Menulis', 'Otomotif', 'Kuliner', 'Gaming', 'Desain', 'Melukis', 'Berenang', 'Badminton', 'Panahan', 'Berkuda', 'Ngaji', 'Voli'];
  const traitOptions = ['Ramah', 'Penyabar', 'Pekerja Keras', 'Religius', 'Humoris', 'Tanggung Jawab', 'Mandiri', 'Sopan', 'Jujur', 'Amanah', 'Hemat', 'Dermawan'];

  let current = $derived(candidates[0] ?? null);
  let photoCount = $derived(current?.photos?.length ?? 0);
  let currentPhoto = $derived(current?.photos?.[photoIdx] ?? null);

  let desaOptions = $derived.by(() => {
    if (!fDaerahId) return [];
    const d = daerahs.find((item) => String(item.id) === String(fDaerahId));
    return d?.children ?? [];
  });

  let kelompokOptions = $derived.by(() => {
    if (!fDesaId) return [];
    const des = desaOptions.find((item) => String(item.id) === String(fDesaId));
    return des?.children ?? [];
  });

  let activeFilterCount = $derived.by(() => {
    let n = 0;
    if (fEducation) n++;
    if (fOccupation.trim()) n++;
    if (fDaerahId) n++;
    if (fHobbies.length) n++;
    if (fSifat.length) n++;
    if (fMinAge > 17 || fMaxAge < 60) n++;
    return n;
  });

  function togglePill(arr: string[], val: string) {
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(val);
  }

  function resetFilters() {
    fEducation = '';
    fOccupation = '';
    fDaerahId = '';
    fDesaId = '';
    fKelompokId = '';
    fHobbies = [];
    fSifat = [];
    fMinAge = 17;
    fMaxAge = 60;
    candidates = [...oppositePool];
    pos = 1;
    photoIdx = 0;
  }

  function applyFilters() {
    filterOpen = false;
    candidates = oppositePool.filter((c) => {
      if (fEducation && c.education !== fEducation) return false;
      if (fOccupation.trim() && !(c.occupation || '').toLowerCase().includes(fOccupation.toLowerCase())) return false;
      if (fDaerahId && String(c.daerah_id) !== String(fDaerahId)) return false;
      if (fDesaId && String(c.desa_id) !== String(fDesaId)) return false;
      if (fKelompokId && String(c.kelompok_id) !== String(fKelompokId)) return false;
      if (fHobbies.length && !fHobbies.some((h) => c.hobbies?.includes(h))) return false;
      if (fSifat.length && !fSifat.some((s) => c.sifat_dominan?.includes(s))) return false;
      const age = calcAge(c.date_of_birth);
      if (age !== null && (age < fMinAge || age > fMaxAge)) return false;
      return true;
    });
    pos = 1;
    photoIdx = 0;
  }

  function prevPhoto() {
    if (photoIdx > 0) photoIdx--;
  }

  function nextPhoto() {
    if (photoIdx < photoCount - 1) photoIdx++;
  }

  function doSwipe(action: 'ajak' | 'skip') {
    if (swipeBusy || !current) return;
    swipeBusy = true;
    if (action === 'ajak') {
      ajakCount++;
    }
    setTimeout(() => {
      candidates = candidates.slice(1);
      pos++;
      photoIdx = 0;
      swipeBusy = false;
    }, 250);
  }

  function confirmAjak() {
    if (!confirmTarget) return;
    confirmTarget = null;
    doSwipe('ajak');
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
</script>

<UserLayout {ajakCount}>
  <!-- Top Bar Controls -->
  <div class="flex items-center justify-between gap-2 mb-3">
    <div class="flex items-center gap-2">
      <span class="text-xs text-[#8b8d9a]">
        Calon Pasangan: <strong class="text-[#8db36b]">{oppositePool.length}</strong>
      </span>
      {#if activeFilterCount > 0}
        <span class="px-2 py-0.5 rounded-full text-[10px] bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/30">
          {activeFilterCount} filter
        </span>
      {/if}
    </div>

    <button
      type="button"
      onclick={() => (filterOpen = true)}
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#8b8d9a] hover:text-[#e4e4ec] transition-colors cursor-pointer"
    >
      <IconAdjustmentsHorizontal size={14} />
      <span>Filter</span>
    </button>
  </div>

  {#if current}
    <!-- Main Swiper Card Container -->
    <div class="relative w-full aspect-[3/4] max-h-[520px] rounded-[24px] overflow-hidden bg-[#13151c] border border-white/[0.08] shadow-2xl select-none">
      <!-- Background Photo with fallback -->
      {#if currentPhoto}
        <img
          src={currentPhoto.url}
          alt={current.nickname}
          class="w-full h-full object-cover"
        />
      {:else}
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1d27] to-[#10121a] text-[#8b8d9a]">
          <div class="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold text-[#7a9a5e] mb-2">
            {(current.nickname || current.full_name || '?').slice(0, 1).toUpperCase()}
          </div>
          <span class="text-xs">Foto tidak tersedia</span>
        </div>
      {/if}

      <!-- Dark Gradient Vignette for readable text -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 pointer-events-none"></div>

      <!-- Interactive Click Zones for Photo Navigation -->
      {#if photoCount > 1}
        <!-- Left click zone -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10"
          onclick={prevPhoto}
          title="Foto sebelumnya"
        ></div>
        <!-- Right click zone -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10"
          onclick={nextPhoto}
          title="Foto berikutnya"
        ></div>
      {/if}

      <!-- Top Badges -->
      <div class="absolute top-3 left-3 flex gap-1.5 pointer-events-none">
        <span
          class="px-2.5 py-1 rounded-full text-[10px] font-bold {current.candidate_type === 'pashmina'
            ? 'bg-[#d4a030] text-[#0a0d06]'
            : 'bg-[#7a9a5e] text-[#0a0d06]'}"
        >
          {current.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri'}
        </span>
        <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
          {current.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
        </span>
        {#if photoCount > 1}
          <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-black/55 text-white border border-white/20">
            {photoIdx + 1}/{photoCount}
          </span>
        {/if}
      </div>

      <!-- Dot Indicators -->
      {#if photoCount > 1}
        <div class="absolute bottom-[104px] left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
          {#each current.photos as _, pi}
            <span
              class="h-1.5 rounded-full transition-all {pi === photoIdx ? 'w-4.5 bg-white' : 'w-1.5 bg-white/40'}"
            ></span>
          {/each}
        </div>
      {/if}

      <!-- Candidate Info at Bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-4.5 pointer-events-none">
        <div class="text-[26px] font-bold text-white flex items-baseline gap-2 drop-shadow-md">
          <span class="truncate">{current.nickname || current.full_name}</span>
          {#if calcAge(current.date_of_birth)}
            <span class="text-xl font-normal opacity-90">{calcAge(current.date_of_birth)}</span>
          {/if}
        </div>
        <div class="text-[13px] text-white/90 mt-1 drop-shadow-sm">
          {typeof current.daerah === 'object' ? current.daerah.name : current.daerah}
          {#if current.education}
            <span class="opacity-70"> · {current.education}</span>
          {/if}
          {#if current.occupation}
            <span class="opacity-70"> · {current.occupation}</span>
          {/if}
        </div>
        <div class="text-[11px] text-white/65 mt-0.5">
          {current.candidate_code} · {current.full_name}
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center items-center gap-6 mt-4.5">
      <!-- Skip Button -->
      <button
        type="button"
        onclick={() => doSwipe('skip')}
        disabled={swipeBusy}
        title="Lewati"
        class="w-[62px] h-[62px] rounded-full border-2 border-[#e05555]/40 bg-[#e05555]/12 text-[#e05555] hover:scale-108 active:scale-95 flex items-center justify-center text-2xl font-bold cursor-pointer transition-transform shadow-lg"
      >
        <IconX size={26} />
      </button>

      <!-- View Detail Button -->
      <button
        type="button"
        onclick={() => (detailCandidate = current)}
        title="Lihat detail lengkap"
        class="w-[56px] h-[56px] rounded-full border border-[#7a9a5e]/40 bg-[#7a9a5e]/12 text-[#8db36b] hover:scale-108 active:scale-95 flex items-center justify-center cursor-pointer transition-transform shadow-md"
      >
        <IconEye size={24} />
      </button>

      <!-- Ajak Button -->
      <button
        type="button"
        onclick={() => (confirmTarget = current)}
        disabled={swipeBusy}
        title="Simpan ke Ajakanku"
        class="w-[62px] h-[62px] rounded-full border-none bg-gradient-to-br from-[#7a9a5e] to-[#5a7a3e] text-[#0a0d06] hover:scale-108 active:scale-95 flex items-center justify-center text-2xl font-bold cursor-pointer transition-transform shadow-xl shadow-[#7a9a5e]/30"
      >
        <IconHeart size={28} />
      </button>
    </div>

    <div class="text-center text-[11px] text-[#5a5c6a] mt-3">
      Disimpan ke Ajakanku ({ajakCount}/5) — kelola di menu Ajakanku.
    </div>
  {:else}
    <div class="p-10 text-center text-[#5a5c6a] border border-dashed border-white/[0.08] rounded-2xl mt-2 flex flex-col items-center">
      <div class="w-12 h-12 rounded-2xl bg-white/[0.04] grid place-items-center mb-2.5 text-[#8b8d9a]">
        <IconSearch size={26} />
      </div>
      <div class="text-[#e4e4ec] font-bold text-sm mb-1.5">Tidak ada kandidat lawan jenis sesuai filter</div>
      <p class="text-xs mb-4">Coba longgarkan filter atau reset untuk melihat semua calon pasangan.</p>
      <button
        type="button"
        onclick={resetFilters}
        class="px-5 py-2.5 rounded-full bg-[#7a9a5e] text-[#0a0d06] font-bold text-xs cursor-pointer hover:bg-[#8db36b]"
      >
        Reset Filter
      </button>
    </div>
  {/if}

  <!-- Candidate Detail Bottom Sheet Modal -->
  {#if detailCandidate}
    <CandidateDetailModal
      candidate={detailCandidate}
      onclose={() => (detailCandidate = null)}
    />
  {/if}

  <!-- Confirmation Modal: Ajak -->
  {#if confirmTarget}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/65 backdrop-blur-sm">
      <div class="relative w-[340px] max-w-[90vw] bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 text-center shadow-2xl">
        <div class="w-14 h-14 rounded-full bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 grid place-items-center mx-auto mb-3 text-[#8db36b]">
          <IconHeartHandshake size={28} />
        </div>
        <h3 class="text-[15px] font-bold text-[#e4e4ec] mb-1.5">
          Ajak {confirmTarget.nickname || confirmTarget.full_name} bertaaruf?
        </h3>
        <p class="text-xs text-[#8b8d9a] leading-relaxed mb-5">
          Profil ini akan disimpan ke daftar <strong class="text-[#7a9a5e]">Ajakanku</strong> dan kamu bisa memproses langkah ta'aruf selanjutnya.
        </p>

        <div class="flex gap-2.5">
          <button
            type="button"
            onclick={() => (confirmTarget = null)}
            class="flex-1 py-2.5 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] text-xs font-semibold hover:bg-white/5 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onclick={confirmAjak}
            class="flex-1 py-2.5 rounded-full bg-[#7a9a5e] hover:bg-[#8db36b] text-[#0a0d06] text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-[#7a9a5e]/20"
          >
            Ya, Simpan
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Bottom Sheet Filter -->
  <BottomSheet
    show={filterOpen}
    title="Filter Pencarian"
    subtitle="Saring kandidat sesuai preferensimu"
    maxWidth="480px"
    onclose={() => (filterOpen = false)}
  >
    <div class="space-y-4 text-xs">
      <!-- Usia -->
      <div>
        <div class="font-semibold text-[#8b8d9a] mb-2 flex justify-between">
          <span>Rentang Usia</span>
          <span class="text-[#7a9a5e] font-bold">{fMinAge} — {fMaxAge} tahun</span>
        </div>
        <div class="flex gap-2">
          <input type="range" min="17" max="60" bind:value={fMinAge} class="w-1/2 accent-[#7a9a5e]" />
          <input type="range" min="17" max="60" bind:value={fMaxAge} class="w-1/2 accent-[#7a9a5e]" />
        </div>
        <div class="flex justify-between text-[10px] text-[#5a5c6a] mt-1">
          <span>17 tahun</span>
          <span>60 tahun</span>
        </div>
      </div>

      <!-- Pendidikan -->
      <div>
        <label for="f-edu" class="block font-semibold text-[#8b8d9a] mb-1.5">Pendidikan Terakhir</label>
        <Select
          id="f-edu"
          options={educations}
          bind:value={fEducation}
          placeholder="Semua Pendidikan"
        />
      </div>

      <!-- Pekerjaan -->
      <div>
        <label for="f-occ" class="block font-semibold text-[#8b8d9a] mb-1.5">Pekerjaan</label>
        <input
          id="f-occ"
          bind:value={fOccupation}
          placeholder="cth: PNS, IT, Wiraswasta"
          class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#e4e4ec] text-xs outline-none focus:border-[#7a9a5e]/50"
        />
      </div>

      <!-- Wilayah LDII -->
      <div>
        <label for="f-daerah" class="block font-semibold text-[#8b8d9a] mb-1.5">Wilayah LDII (DPD / Desa / Kelompok)</label>
        <div class="grid gap-2">
          <Select
            id="f-daerah"
            options={daerahs}
            bind:value={fDaerahId}
            placeholder="— Pilih Daerah —"
          />
          <Select
            options={desaOptions}
            bind:value={fDesaId}
            disabled={!fDaerahId}
            placeholder="— Pilih Desa —"
          />
          <Select
            options={kelompokOptions}
            bind:value={fKelompokId}
            disabled={!fDesaId}
            placeholder="— Pilih Kelompok —"
          />
        </div>
      </div>

      <!-- Hobi & Minat -->
      <div>
        <div class="font-semibold text-[#8b8d9a] mb-1.5">Hobi & Minat</div>
        <div class="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto p-1">
          {#each hobbyOptions as h}
            <button
              type="button"
              onclick={() => togglePill(fHobbies, h)}
              class="px-2.5 py-1 rounded-full text-[11px] cursor-pointer transition-colors {fHobbies.includes(h)
                ? 'bg-[#7a9a5e]/20 text-[#8db36b] border border-[#7a9a5e]/40 font-bold'
                : 'bg-white/[0.03] border border-white/[0.06] text-[#8b8d9a]'}"
            >
              {h}
            </button>
          {/each}
        </div>
      </div>

      <!-- Sifat Dominan -->
      <div>
        <div class="font-semibold text-[#8b8d9a] mb-1.5">Karakter / Sifat Dominan</div>
        <div class="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto p-1">
          {#each traitOptions as s}
            <button
              type="button"
              onclick={() => togglePill(fSifat, s)}
              class="px-2.5 py-1 rounded-full text-[11px] cursor-pointer transition-colors {fSifat.includes(s)
                ? 'bg-[#64a0dc]/20 text-[#64a0dc] border border-[#64a0dc]/40 font-bold'
                : 'bg-white/[0.03] border border-white/[0.06] text-[#8b8d9a]'}"
            >
              {s}
            </button>
          {/each}
        </div>
      </div>
    </div>

    {#snippet footer()}
      <div class="flex gap-2.5">
        <button
          type="button"
          onclick={resetFilters}
          class="px-5 py-3 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] text-xs font-bold hover:bg-white/5 cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onclick={applyFilters}
          class="flex-1 py-3 rounded-full bg-[#7a9a5e] hover:bg-[#8db36b] text-[#0a0d06] text-xs font-bold cursor-pointer shadow-lg shadow-[#7a9a5e]/20"
        >
          Terapkan Filter {#if activeFilterCount > 0}<span class="opacity-80">({activeFilterCount})</span>{/if}
        </button>
      </div>
    {/snippet}
  </BottomSheet>
</UserLayout>
