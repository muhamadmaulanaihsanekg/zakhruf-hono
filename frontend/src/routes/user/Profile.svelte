<script lang="ts">
  import UserLayout from '../../layouts/UserLayout.svelte';
  import Select from '../../components/Select.svelte';
  import BottomSheet from '../../components/BottomSheet.svelte';
  import { educations, type CandidatePhoto } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';
  import {
    IconPhoto,
    IconTrash,
    IconPlus,
    IconCheck,
    IconLogout,
    IconDeviceFloppy,
    IconSparkles,
    IconX,
  } from '@tabler/icons-svelte';

  let me = $derived(auth.user);

  let form = $state<any>({
    nickname: '',
    full_name: '',
    education: '',
    occupation: '',
    height: 160,
    weight: 50,
    full_address: '',
    whatsapp_number: '',
    self_description: '',
    sifat: '',
    hobbies: '',
    partner_criteria: '',
    favorite_foods: [] as string[],
    social_media: [{ type: 'instagram', handle: '' }],
    parents_marital_status: 'married',
    father_name: '',
    father_membership_status: 'member',
    father_occupation: '',
    father_domicile: '',
    mother_name: '',
    mother_membership_status: 'member',
    mother_occupation: '',
    mother_domicile: '',
    birth_order: 1,
    siblings_count: 2,
    photos: [] as CandidatePhoto[],
  });

  let initialized = $state(false);

  // Pill editing state
  const toPills = (val: string | string[] | undefined): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
    return String(val).split(',').map((s) => s.trim()).filter(Boolean);
  };

  let pillSifat = $state<string[]>([]);
  let pillHobbies = $state<string[]>([]);
  let pillCriteria = $state<string[]>([]);
  let pillFoods = $state<string[]>([]);

  let pillInputSifat = $state('');
  let pillInputHobby = $state('');
  let pillInputCriteria = $state('');
  let pillInputFood = $state('');

  const sifatSuggestions = ['Ramah', 'Penyabar', 'Pekerja Keras', 'Religius', 'Humoris', 'Tanggung Jawab', 'Mandiri', 'Sopan', 'Jujur', 'Amanah'];
  const hobbySuggestions = ['Membaca', 'Olahraga', 'Memasak', 'Traveling', 'Berkebun', 'Fotografi', 'Musik', 'Menulis', 'Otomotif', 'Kuliner', 'Gaming', 'Desain'];
  const criteriaSuggestions = ['Sholeh/Sholehah', 'Penyabar', 'S1', 'Pekerja Tetap', 'Domisili Jakarta', 'Tidak Merokok', 'Hafidz Quran'];
  const foodSuggestions = ['Nasi Goreng', 'Sate', 'Rendang', 'Soto', 'Bakso', 'Gado-gado', 'Ayam Bakar', 'Mie Ayam', 'Pempek', 'Rawon'];
  const socialTypes = ['instagram', 'facebook', 'tiktok', 'twitter', 'youtube'];

  $effect(() => {
    if (me && !initialized) {
      form = {
        ...me,
        photos: me.photos ? [...me.photos] : [],
        social_media: me.social_media && me.social_media.length ? [...me.social_media] : [{ type: 'instagram', handle: '' }],
        favorite_foods: me.favorite_foods ? [...(Array.isArray(me.favorite_foods) ? me.favorite_foods : [me.favorite_foods])] : [],
      };
      pillSifat = toPills(me.sifat);
      pillHobbies = toPills(me.hobbies);
      pillCriteria = toPills(me.partner_criteria);
      pillFoods = Array.isArray(me.favorite_foods) ? [...me.favorite_foods] : toPills(me.favorite_foods);
      initialized = true;
    }
  });

  function togglePill(arr: string[], val: string) {
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(val);
  }

  function addCustomPill(arr: string[], inputVal: string, resetFn: () => void) {
    const v = inputVal.trim();
    if (!v) return;
    v.split(',').forEach((s) => {
      const t = s.trim();
      if (t && !arr.includes(t)) arr.push(t);
    });
    resetFn();
  }

  // Completeness computation
  const completenessFields = [
    'nickname', 'full_name', 'education', 'occupation', 'height', 'weight',
    'whatsapp_number', 'self_description', 'sifat', 'hobbies', 'partner_criteria',
    'full_address', 'father_name', 'mother_name', 'birth_order', 'siblings_count'
  ];

  let completeness = $derived.by(() => {
    let filled = 0;
    completenessFields.forEach((f) => {
      if (String(form[f] ?? '').trim()) filled++;
    });
    if (form.photos?.length) filled++;
    const total = completenessFields.length + 1;
    return {
      filled,
      total,
      pct: Math.round((filled / total) * 100),
    };
  });

  // Photo management
  let mainPhoto = $derived(
    form.photos?.find((p: CandidatePhoto) => p.is_main) ?? form.photos?.[0] ?? null
  );

  function setMainPhoto(photo: CandidatePhoto) {
    form.photos = form.photos.map((p: CandidatePhoto) => ({
      ...p,
      is_main: p.id === photo.id,
    }));
  }

  function deletePhoto(photo: CandidatePhoto) {
    form.photos = form.photos.filter((p: CandidatePhoto) => p.id !== photo.id);
  }

  function handleAddPhoto() {
    const dummyId = Date.now();
    const newP: CandidatePhoto = {
      id: dummyId,
      url: '/storage/register-hero-bg.jpg',
      is_main: form.photos.length === 0,
    };
    form.photos = [...form.photos, newP];
  }

  // Live Card Preview
  const calcAge = (dob?: string) => {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  let preview = $derived({
    photo: mainPhoto,
    nickname: form.nickname.trim() || me?.nickname || '—',
    full_name: form.full_name.trim() || '—',
    age: calcAge(me?.date_of_birth),
    daerah: typeof me?.daerah === 'object' ? me?.daerah?.name : me?.daerah ?? 'DKI Jakarta',
    education: form.education || '',
    description: form.self_description?.trim() || '',
    code: me?.candidate_code ?? 'K-001',
    type: me?.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri',
  });

  let descriptionPreview = $derived(
    preview.description.length > 90
      ? preview.description.slice(0, 90) + '…'
      : preview.description
  );

  // Submit profile
  let saving = $state(false);
  let saveSuccessNotice = $state(false);

  function handleSubmit(e: Event) {
    e.preventDefault();
    saving = true;
    form.sifat = pillSifat.join(', ');
    form.hobbies = pillHobbies.join(', ');
    form.partner_criteria = pillCriteria.join(', ');
    form.favorite_foods = [...pillFoods];

    setTimeout(() => {
      saving = false;
      saveSuccessNotice = true;
      setTimeout(() => (saveSuccessNotice = false), 3500);
    }, 600);
  }

  // Logout modal state
  let showLogoutModal = $state(false);

  function confirmLogout() {
    showLogoutModal = false;
    auth.logout();
    window.location.hash = '#/login';
  }
</script>

<UserLayout>
  <!-- Header + Completeness Progress Bar -->
  <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 mb-4 shadow-xl">
    <div class="flex items-center gap-3.5">
      <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-[#7a9a5e]/50 bg-[#13151c] grid place-items-center shrink-0 shadow-md">
        {#if mainPhoto?.url}
          <img src={mainPhoto.url} alt="Foto Profil" class="w-full h-full object-cover" />
        {:else}
          <span class="text-xl font-bold text-[#8db36b]">
            {(form.nickname || me?.nickname || '?').slice(0, 2).toUpperCase()}
          </span>
        {/if}
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[17px] font-bold text-[#e4e4ec] truncate">
            {form.nickname || me?.nickname || 'Belum diisi'}
          </span>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/30">
            Aktif
          </span>
        </div>
        <div class="text-xs text-[#8b8d9a] mt-0.5">
          {preview.code} · {preview.full_name}
        </div>
        <div class="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold {completeness.pct === 100 ? 'bg-[#7a9a5e]/15 text-[#8db36b] border border-[#7a9a5e]/30' : 'bg-[#e8b840]/15 text-[#e8b840] border border-[#e8b840]/30'}">
          {#if completeness.pct === 100}
            <span>✓ Profil lengkap (100%)</span>
          {:else}
            <span>Profil {completeness.pct}% lengkap</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="h-1.5 rounded-full bg-white/[0.08] overflow-hidden mt-3.5">
      <div
        class="h-full bg-gradient-to-r from-[#7a9a5e] to-[#e8b840] rounded-full transition-all duration-500 ease-out"
        style="width: {completeness.pct}%;"
      ></div>
    </div>
    <div class="text-[11px] text-[#5a5c6a] mt-1.5 text-right">
      {completeness.filled}/{completeness.total} bidang terisi — makin lengkap, makin mudah ditemukan
    </div>
  </div>

  <!-- Foto Profil Gallery -->
  <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 mb-4 shadow-xl">
    <div class="flex items-center justify-between mb-1">
      <div class="text-sm font-bold text-[#e4e4ec] flex items-center gap-1.5">
        <IconPhoto size={16} class="text-[#7a9a5e]" />
        <span>Foto Profil</span>
      </div>
      <span class="text-[10px] text-[#5a5c6a]">Foto pertama = utama</span>
    </div>
    <p class="text-[11px] text-[#8b8d9a] m-0 mb-3">
      Tampil di kartu pencarian — pilih foto yang rapi dan jelas.
    </p>

    <div class="grid grid-cols-3 gap-2.5">
      {#each form.photos as p (p.id)}
        <div class="relative rounded-xl overflow-hidden aspect-[3/4] border-2 bg-white/[0.03] {p.is_main ? 'border-[#7a9a5e] shadow-lg shadow-[#7a9a5e]/20' : 'border-white/[0.08]'}">
          <img src={p.url} alt="Foto" class="w-full h-full object-cover" />
          {#if p.is_main}
            <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-[#7a9a5e] text-[#0a0d06]">
              UTAMA
            </span>
          {/if}

          <div class="absolute bottom-0 inset-x-0 flex gap-1 p-1.5 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
            {#if !p.is_main}
              <button
                type="button"
                onclick={() => setMainPhoto(p)}
                class="flex-1 py-1 rounded-md text-[9px] font-bold bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
              >
                Utama
              </button>
            {/if}
            <button
              type="button"
              onclick={() => deletePhoto(p)}
              class="py-1 px-2 rounded-md text-[9px] font-bold bg-[#e05555]/80 hover:bg-[#e05555] text-white cursor-pointer transition-colors {p.is_main ? 'w-full' : 'flex-none'}"
            >
              <IconTrash size={12} class="inline" />
            </button>
          </div>
        </div>
      {/each}

      <!-- Add photo slot -->
      <button
        type="button"
        onclick={handleAddPhoto}
        class="aspect-[3/4] rounded-xl border-2 border-dashed border-[#7a9a5e]/40 bg-[#7a9a5e]/5 hover:bg-[#7a9a5e]/10 grid place-items-center text-[#7a9a5e] cursor-pointer transition-colors"
      >
        <div class="flex flex-col items-center gap-1">
          <IconPlus size={24} />
          <span class="text-[10px] font-bold">Tambah Foto</span>
        </div>
      </button>
    </div>
  </div>

  <!-- Live Card Preview -->
  <div class="mb-4">
    <div class="flex items-center gap-2 mb-2 px-1">
      <span class="w-2 h-2 rounded-full bg-[#e8b840] animate-pulse"></span>
      <span class="text-xs font-bold text-[#e8b840] flex items-center gap-1">
        <IconSparkles size={14} />
        <span>Preview — bagaimana kamu terlihat di pencarian</span>
      </span>
    </div>

    <div class="bg-[#13151c] rounded-[24px] overflow-hidden border border-white/[0.08] shadow-2xl">
      <div class="relative h-[280px] bg-[#0d0f15] overflow-hidden">
        {#if preview.photo?.url}
          <img src={preview.photo.url} alt={preview.nickname} class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full bg-gradient-to-br from-[#7a9a5e]/25 to-[#0d0f15] grid place-items-center text-[#8db36b] text-4xl font-bold">
            {preview.nickname.slice(0, 2).toUpperCase()}
          </div>
        {/if}

        <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 pointer-events-none"></div>

        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold {preview.type === 'Pashmina' ? 'bg-[#d4a030] text-[#0a0d06]' : 'bg-[#7a9a5e] text-[#0a0d06]'} shadow-md">
          {preview.type}
        </span>

        <div class="absolute bottom-0 inset-x-0 p-4">
          <div class="text-[22px] font-bold text-white flex items-baseline gap-2 drop-shadow-md">
            <span class="truncate max-w-[200px]">{preview.nickname}</span>
            {#if preview.age}
              <span class="text-lg font-normal opacity-90">{preview.age}</span>
            {/if}
          </div>
          <div class="text-xs text-white/90 mt-0.5 drop-shadow-sm">
            {preview.daerah}
            {#if preview.education}
              <span class="opacity-70"> · {preview.education}</span>
            {/if}
          </div>
          {#if descriptionPreview}
            <div class="text-[11px] text-white/75 mt-1 leading-relaxed drop-shadow-sm line-clamp-2">
              {descriptionPreview}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Form Pengisian Profil Lengkap -->
  <form onsubmit={handleSubmit} class="space-y-4">
    <!-- Identitas -->
    <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 shadow-xl space-y-3.5">
      <div class="text-sm font-bold text-[#e4e4ec]">Identitas</div>

      <div>
        <label for="pf-nick" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Nama Panggilan *</label>
        <input
          id="pf-nick"
          bind:value={form.nickname}
          required
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50 transition-colors"
        />
      </div>

      <div>
        <label for="pf-full" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Nama Lengkap *</label>
        <input
          id="pf-full"
          bind:value={form.full_name}
          required
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50 transition-colors"
        />
      </div>

      <div>
        <label for="pf-edu" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Pendidikan Terakhir</label>
        <Select
          id="pf-edu"
          options={educations}
          bind:value={form.education}
          placeholder="Pilih Pendidikan"
        />
      </div>

      <div>
        <label for="pf-occ" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Pekerjaan</label>
        <input
          id="pf-occ"
          bind:value={form.occupation}
          placeholder="cth: Software Engineer, Guru, Wiraswasta"
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50 transition-colors"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="pf-h" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Tinggi (cm)</label>
          <input
            id="pf-h"
            type="number"
            min="100"
            max="230"
            bind:value={form.height}
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>
        <div>
          <label for="pf-w" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Berat (kg)</label>
          <input
            id="pf-w"
            type="number"
            min="30"
            max="200"
            bind:value={form.weight}
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>
      </div>

      <div>
        <label for="pf-addr" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Alamat Lengkap</label>
        <textarea
          id="pf-addr"
          rows="2"
          bind:value={form.full_address}
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
        ></textarea>
      </div>
    </div>

    <!-- Kontak -->
    <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 shadow-xl">
      <div class="text-sm font-bold text-[#e4e4ec] mb-3">Kontak</div>
      <div>
        <label for="pf-wa" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Nomor WhatsApp Aktif</label>
        <input
          id="pf-wa"
          bind:value={form.whatsapp_number}
          placeholder="08xxxxxxxxxx"
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
        />
      </div>
    </div>

    <!-- Tentang Diri -->
    <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 shadow-xl space-y-4">
      <div>
        <div class="text-sm font-bold text-[#e4e4ec]">Tentang Diri</div>
        <p class="text-[11px] text-[#8b8d9a] mt-0.5">Deskripsi, hobi, dan kriteria pasangan — ini yang dilihat calon ta'aruf.</p>
      </div>

      <!-- Sifat -->
      <div>
        <div class="text-[10px] font-bold uppercase text-[#8b8d9a] mb-2">Sifat & Karakter Dominan</div>
        <div class="flex flex-wrap gap-1.5 mb-2.5">
          {#each sifatSuggestions as d}
            <button
              type="button"
              onclick={() => togglePill(pillSifat, d)}
              class="px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors {pillSifat.includes(d)
                ? 'bg-[#7a9a5e]/20 text-[#8db36b] border border-[#7a9a5e]/50 font-bold'
                : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
            >
              {d}
            </button>
          {/each}
        </div>
        <div class="flex gap-2">
          <input
            bind:value={pillInputSifat}
            placeholder="Tambah sifat custom, pisah koma"
            onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPill(pillSifat, pillInputSifat, () => (pillInputSifat = '')))}
            class="flex-1 px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
          <button
            type="button"
            onclick={() => addCustomPill(pillSifat, pillInputSifat, () => (pillInputSifat = ''))}
            class="px-3 py-2 rounded-xl bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b] text-xs font-bold cursor-pointer"
          >
            +
          </button>
        </div>
        {#if pillSifat.length > 0}
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            {#each pillSifat as p}
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7a9a5e] text-[#0a0d06] text-[11px] font-bold">
                <span>{p}</span>
                <button type="button" onclick={() => togglePill(pillSifat, p)} class="text-[#0a0d06] cursor-pointer">×</button>
              </span>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Deskripsi Diri -->
      <div>
        <label for="pf-desc" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Deskripsi Diri</label>
        <textarea
          id="pf-desc"
          rows="3"
          bind:value={form.self_description}
          placeholder="Ceritakan tentang diri kamu secara ringkas dan sopan..."
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
        ></textarea>
      </div>

      <!-- Hobi -->
      <div>
        <div class="text-[10px] font-bold uppercase text-[#8b8d9a] mb-2">Hobi & Kegemaran</div>
        <div class="flex flex-wrap gap-1.5 mb-2.5">
          {#each hobbySuggestions as h}
            <button
              type="button"
              onclick={() => togglePill(pillHobbies, h)}
              class="px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors {pillHobbies.includes(h)
                ? 'bg-[#7a9a5e]/20 text-[#8db36b] border border-[#7a9a5e]/50 font-bold'
                : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
            >
              {h}
            </button>
          {/each}
        </div>
        <div class="flex gap-2">
          <input
            bind:value={pillInputHobby}
            placeholder="Tambah hobi custom, pisah koma"
            onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPill(pillHobbies, pillInputHobby, () => (pillInputHobby = '')))}
            class="flex-1 px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
          <button
            type="button"
            onclick={() => addCustomPill(pillHobbies, pillInputHobby, () => (pillInputHobby = ''))}
            class="px-3 py-2 rounded-xl bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b] text-xs font-bold cursor-pointer"
          >
            +
          </button>
        </div>
        {#if pillHobbies.length > 0}
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            {#each pillHobbies as p}
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7a9a5e] text-[#0a0d06] text-[11px] font-bold">
                <span>{p}</span>
                <button type="button" onclick={() => togglePill(pillHobbies, p)} class="text-[#0a0d06] cursor-pointer">×</button>
              </span>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Kriteria Pasangan -->
      <div>
        <div class="text-[10px] font-bold uppercase text-[#8b8d9a] mb-2">Kriteria Pasangan Idaman</div>
        <div class="flex flex-wrap gap-1.5 mb-2.5">
          {#each criteriaSuggestions as c}
            <button
              type="button"
              onclick={() => togglePill(pillCriteria, c)}
              class="px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors {pillCriteria.includes(c)
                ? 'bg-[#7a9a5e]/20 text-[#8db36b] border border-[#7a9a5e]/50 font-bold'
                : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
            >
              {c}
            </button>
          {/each}
        </div>
        <div class="flex gap-2">
          <input
            bind:value={pillInputCriteria}
            placeholder="Tambah kriteria custom, pisah koma"
            onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPill(pillCriteria, pillInputCriteria, () => (pillInputCriteria = '')))}
            class="flex-1 px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
          <button
            type="button"
            onclick={() => addCustomPill(pillCriteria, pillInputCriteria, () => (pillInputCriteria = ''))}
            class="px-3 py-2 rounded-xl bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b] text-xs font-bold cursor-pointer"
          >
            +
          </button>
        </div>
        {#if pillCriteria.length > 0}
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            {#each pillCriteria as p}
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7a9a5e] text-[#0a0d06] text-[11px] font-bold">
                <span>{p}</span>
                <button type="button" onclick={() => togglePill(pillCriteria, p)} class="text-[#0a0d06] cursor-pointer">×</button>
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Fisik & Media Sosial -->
    <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 shadow-xl space-y-3.5">
      <div class="text-sm font-bold text-[#e4e4ec]">Media Sosial</div>
      <div class="space-y-2">
        {#each form.social_media as sm, idx}
          <div class="flex gap-2">
            <select
              bind:value={sm.type}
              class="w-28 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none"
            >
              {#each socialTypes as t}
                <option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              {/each}
            </select>
            <input
              bind:value={sm.handle}
              placeholder="@username"
              class="flex-1 px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
            />
            {#if form.social_media.length > 1}
              <button
                type="button"
                onclick={() => form.social_media.splice(idx, 1)}
                class="px-3 py-2 rounded-xl bg-[#e05555]/10 border border-[#e05555]/25 text-[#e05555] text-xs cursor-pointer"
              >
                <IconX size={14} />
              </button>
            {/if}
          </div>
        {/each}
        <button
          type="button"
          onclick={() => form.social_media.push({ type: 'instagram', handle: '' })}
          class="py-2 px-3 rounded-xl border border-dashed border-[#7a9a5e]/40 bg-transparent text-[#7a9a5e] text-xs font-semibold hover:bg-[#7a9a5e]/5 cursor-pointer flex items-center gap-1.5"
        >
          <IconPlus size={14} />
          <span>Tambah Media Sosial</span>
        </button>
      </div>
    </div>

    <!-- Makanan Kesukaan -->
    <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 shadow-xl">
      <div class="text-sm font-bold text-[#e4e4ec] mb-1">Makanan Kesukaan</div>
      <p class="text-[11px] text-[#8b8d9a] m-0 mb-3">Pilih atau ketik makanan favoritmu.</p>

      <div class="flex flex-wrap gap-1.5 mb-2.5">
        {#each foodSuggestions as f}
          <button
            type="button"
            onclick={() => togglePill(pillFoods, f)}
            class="px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors {pillFoods.includes(f)
              ? 'bg-[#7a9a5e]/20 text-[#8db36b] border border-[#7a9a5e]/50 font-bold'
              : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
          >
            {f}
          </button>
        {/each}
      </div>
      <div class="flex gap-2">
        <input
          bind:value={pillInputFood}
          placeholder="Tambah makanan custom, pisah koma"
          onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomPill(pillFoods, pillInputFood, () => (pillInputFood = '')))}
          class="flex-1 px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
        />
        <button
          type="button"
          onclick={() => addCustomPill(pillFoods, pillInputFood, () => (pillInputFood = ''))}
          class="px-3 py-2 rounded-xl bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-[#8db36b] text-xs font-bold cursor-pointer"
        >
          +
        </button>
      </div>
      {#if pillFoods.length > 0}
        <div class="flex flex-wrap gap-1.5 mt-2.5">
          {#each pillFoods as p}
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7a9a5e] text-[#0a0d06] text-[11px] font-bold">
              <span>{p}</span>
              <button type="button" onclick={() => togglePill(pillFoods, p)} class="text-[#0a0d06] cursor-pointer">×</button>
            </span>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Data Orang Tua -->
    <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 shadow-xl space-y-4">
      <div class="text-sm font-bold text-[#e4e4ec]">Data Orang Tua</div>

      <div>
        <label for="pf-pms" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Status Pernikahan Orang Tua</label>
        <select
          id="pf-pms"
          bind:value={form.parents_marital_status}
          class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none"
        >
          <option value="married">Menikah (Harmonis)</option>
          <option value="divorced">Bercerai</option>
          <option value="widowed">Meninggal Dunia</option>
        </select>
      </div>

      <!-- Ayah -->
      <div class="pt-2 border-t border-white/[0.04] space-y-3">
        <div class="text-xs font-bold text-[#7a9a5e]">Ayah</div>
        <div>
          <label for="pf-dname" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Nama Ayah</label>
          <input id="pf-dname" bind:value={form.father_name} class="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none" />
        </div>
        <div>
          <div class="text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Status Keanggotaan</div>
          <div class="flex gap-2">
            <button
              type="button"
              onclick={() => (form.father_membership_status = 'member')}
              class="flex-1 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors {form.father_membership_status === 'member' ? 'bg-[#7a9a5e]/20 border border-[#7a9a5e] text-[#8db36b]' : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
            >
              Sudah Jamaah
            </button>
            <button
              type="button"
              onclick={() => (form.father_membership_status = 'non_member')}
              class="flex-1 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors {form.father_membership_status === 'non_member' ? 'bg-[#7a9a5e]/20 border border-[#7a9a5e] text-[#8db36b]' : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
            >
              Belum Jamaah
            </button>
          </div>
        </div>
        <div>
          <label for="pf-docc" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Pekerjaan Ayah</label>
          <input id="pf-docc" bind:value={form.father_occupation} class="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none" />
        </div>
        <div>
          <label for="pf-ddom" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Domisili Ayah</label>
          <textarea id="pf-ddom" rows="2" bind:value={form.father_domicile} class="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none"></textarea>
        </div>
      </div>

      <!-- Ibu -->
      <div class="pt-2 border-t border-white/[0.04] space-y-3">
        <div class="text-xs font-bold text-[#7a9a5e]">Ibu</div>
        <div>
          <label for="pf-mname" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Nama Ibu</label>
          <input id="pf-mname" bind:value={form.mother_name} class="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none" />
        </div>
        <div>
          <div class="text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Status Keanggotaan</div>
          <div class="flex gap-2">
            <button
              type="button"
              onclick={() => (form.mother_membership_status = 'member')}
              class="flex-1 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors {form.mother_membership_status === 'member' ? 'bg-[#7a9a5e]/20 border border-[#7a9a5e] text-[#8db36b]' : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
            >
              Sudah Jamaah
            </button>
            <button
              type="button"
              onclick={() => (form.mother_membership_status = 'non_member')}
              class="flex-1 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors {form.mother_membership_status === 'non_member' ? 'bg-[#7a9a5e]/20 border border-[#7a9a5e] text-[#8db36b]' : 'bg-white/[0.03] border border-white/[0.08] text-[#8b8d9a]'}"
            >
              Belum Jamaah
            </button>
          </div>
        </div>
        <div>
          <label for="pf-mocc" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Pekerjaan Ibu</label>
          <input id="pf-mocc" bind:value={form.mother_occupation} class="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none" />
        </div>
        <div>
          <label for="pf-mdom" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1">Domisili Ibu</label>
          <textarea id="pf-mdom" rows="2" bind:value={form.mother_domicile} class="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none"></textarea>
        </div>
      </div>
    </div>

    <!-- Anak & Saudara -->
    <div class="bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-5 shadow-xl space-y-3.5">
      <div class="text-sm font-bold text-[#e4e4ec]">Anak & Saudara</div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="pf-bo" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Anak ke-</label>
          <input
            id="pf-bo"
            type="number"
            min="1"
            max="20"
            bind:value={form.birth_order}
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50 text-center font-bold text-sm"
          />
        </div>
        <div>
          <label for="pf-sc" class="block text-[10px] font-bold uppercase text-[#8b8d9a] mb-1.5">Jumlah Saudara</label>
          <input
            id="pf-sc"
            type="number"
            min="0"
            max="30"
            bind:value={form.siblings_count}
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50 text-center font-bold text-sm"
          />
        </div>
      </div>
    </div>

    {#if saveSuccessNotice}
      <div class="p-3.5 rounded-2xl bg-[#7a9a5e]/15 border border-[#7a9a5e]/30 text-xs text-[#8db36b] flex items-center gap-2">
        <IconCheck size={16} />
        <span>Profil berhasil diperbarui dan disimpan!</span>
      </div>
    {/if}

    <!-- Submit Button -->
    <button
      type="submit"
      disabled={saving}
      class="w-full py-3.5 px-4 bg-gradient-to-r from-[#7a9a5e] to-[#5a7a3e] hover:from-[#8db36b] hover:to-[#6a8a4e] text-[#0a0d06] font-extrabold rounded-full text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7a9a5e]/25 disabled:opacity-60"
    >
      {#if saving}
        <span class="w-4 h-4 border-2 border-[#0a0d06]/30 border-t-[#0a0d06] rounded-full animate-spin"></span>
        <span>Menyimpan...</span>
      {:else}
        <IconDeviceFloppy size={18} />
        <span>Simpan Profil</span>
      {/if}
    </button>
  </form>

  <!-- Logout Card -->
  <div class="mt-4 bg-gradient-to-br from-[#1a1d27]/90 via-[#13151c] to-[#0d0f15] border border-white/[0.06] rounded-[24px] p-4.5 flex items-center justify-between shadow-lg">
    <div>
      <div class="text-sm font-bold text-[#e4e4ec]">Keluar Akun</div>
      <div class="text-[11px] text-[#8b8d9a] mt-0.5">Sesi akan diakhiri dan kembali ke halaman login.</div>
    </div>
    <button
      type="button"
      onclick={() => (showLogoutModal = true)}
      class="px-4 py-2 rounded-full bg-[#e05555]/12 border border-[#e05555]/30 hover:bg-[#e05555]/20 text-[#e05555] text-xs font-bold cursor-pointer transition-colors"
    >
      Keluar
    </button>
  </div>

  <!-- Logout Confirmation Bottom Sheet -->
  <BottomSheet
    show={showLogoutModal}
    title="Keluar dari Akun?"
    subtitle="Sesi akan diakhiri dan kamu kembali ke halaman login."
    maxWidth="380px"
    onclose={() => (showLogoutModal = false)}
  >
    <div class="text-center py-2">
      <div class="w-14 h-14 rounded-full bg-[#e05555]/12 border border-[#e05555]/25 grid place-items-center mx-auto mb-3 text-[#e05555]">
        <IconLogout size={28} />
      </div>
      <p class="text-xs text-[#8b8d9a] leading-relaxed m-0">
        Data biodata dan preferensi ta'aruf kamu tetap tersimpan secara aman di sistem.
      </p>
    </div>

    {#snippet footer()}
      <div class="flex gap-2.5">
        <button
          type="button"
          onclick={() => (showLogoutModal = false)}
          class="flex-1 py-3 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] text-xs font-bold hover:bg-white/5 cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={confirmLogout}
          class="flex-1 py-3 rounded-full bg-[#e05555] hover:bg-[#eb6666] text-white text-xs font-extrabold cursor-pointer shadow-lg shadow-[#e05555]/25"
        >
          Ya, Keluar
        </button>
      </div>
    {/snippet}
  </BottomSheet>
</UserLayout>
