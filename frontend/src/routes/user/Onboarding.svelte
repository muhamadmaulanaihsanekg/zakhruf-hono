<script lang="ts">
  import { push } from 'svelte-spa-router';

  let step = $state(0);
  const total = 15;

  const titles = [
    'Masuk sebagai', 'Tanggal & Tempat Lahir', 'Wilayah LDII', 'Alamat Lengkap',
    'Kontak & Sosial Media', 'Tinggi & Berat', 'Deskripsi Diri & Sifat', 'Hobi',
    'Makanan Kesukaan', 'Kriteria Pasangan', 'Status Orang Tua', 'Data Ayah',
    'Data Ibu', 'Anak Ke & Saudara', 'Selesai & Konfirmasi'
  ];

  const descs = [
    'Status pernikahan saat ini', 'TTL sesuai identitas', 'Daerah, Desa, dan Kelompok binaan',
    'Domisili tempat tinggal sekarang', 'Nomor WhatsApp aktif & medsos', 'Karakteristik fisik',
    'Pilih sifat dan ceritakan dirimu', 'Kegiatan di waktu luang', 'Kuliner favorit',
    'Kriteria calon pasangan idaman', 'Status keharmonisan keluarga', 'Identitas & kejamaahan ayah',
    'Identitas & kejamaahan ibu', 'Urutan lahir dalam keluarga', 'Tinjau dan simpan data profil'
  ];

  // Form State
  let maritalStatus = $state('single');
  let dateOfBirth = $state('');
  let placeOfBirth = $state('');
  let daerah = $state('Jakarta Selatan');
  let desa = $state('Tebet');
  let kelompok = $state('Bukit Duri');
  let fullAddress = $state('');
  let whatsappNumber = $state('');
  let instagram = $state('');
  let height = $state(170);
  let weight = $state(65);
  let sifatSelected = $state<string[]>(['Penyabar', 'Ramah', 'Pekerja Keras']);
  let hobbiesSelected = $state<string[]>(['Membaca', 'Olahraga', 'Traveling']);
  let foodsSelected = $state<string[]>(['Nasi Goreng', 'Rendang', 'Soto']);
  let criteriaSelected = $state<string[]>(['Sholeh/Sholehah', 'S1', 'Penyabar']);
  let parentsMaritalStatus = $state('married');
  let fatherName = $state('');
  let fatherStatus = $state('member');
  let motherName = $state('');
  let motherStatus = $state('member');
  let birthOrder = $state(1);
  let siblingsCount = $state(3);

  const sifatDefaults = ['Ramah', 'Penyabar', 'Pekerja Keras', 'Religius', 'Humoris', 'Tanggung Jawab', 'Mandiri', 'Sopan', 'Jujur', 'Amanah'];
  const hobbyDefaults = ['Membaca', 'Olahraga', 'Memasak', 'Traveling', 'Berkebun', 'Fotografi', 'Musik', 'Menulis', 'Kuliner'];
  const foodDefaults = ['Nasi Goreng', 'Sate', 'Rendang', 'Soto', 'Bakso', 'Gado-gado', 'Ayam Bakar', 'Mie Ayam'];
  const criteriaDefaults = ['Sholeh/Sholehah', 'Penyabar', 'S1', 'Pekerja Tetap', 'Domisili Jakarta', 'Tidak Merokok', 'Hafidz Quran'];

  function toggleItem(list: string[], item: string) {
    if (list.includes(item)) {
      return list.filter((x) => x !== item);
    } else {
      return [...list, item];
    }
  }

  function nextStep() {
    if (step < total - 1) {
      step++;
    } else {
      completeOnboarding();
    }
  }

  function prevStep() {
    if (step > 0) step--;
  }

  async function completeOnboarding() {
    localStorage.setItem('zk_onboarded', 'true');
    push('/');
  }
</script>

<div class="min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto bg-[#0B0B14] text-white">
  <!-- Top Progress Indicator -->
  <div>
    <div class="flex items-center justify-between pt-2 mb-3">
      <button onclick={prevStep} class="text-xs text-gray-400 hover:text-white" disabled={step === 0}>
        {step > 0 ? '← Kembali' : ''}
      </button>
      <span class="text-xs font-semibold text-[#A78BFA]">Langkah {step + 1} dari {total}</span>
      <span class="text-xs text-gray-400">{Math.round(((step + 1) / total) * 100)}%</span>
    </div>

    <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-6">
      <div
        class="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] h-full transition-all duration-300"
        style="width: {((step + 1) / total) * 100}%"
      ></div>
    </div>

    <!-- Title & Desc -->
    <h1 class="text-2xl font-bold tracking-tight mb-1">{titles[step]}</h1>
    <p class="text-xs text-gray-400 mb-6">{descs[step]}</p>
  </div>

  <!-- Dynamic Step Content -->
  <div class="my-auto py-2">
    {#if step === 0}
      <div class="space-y-3">
        {#each [{ id: 'single', label: 'Belum Pernah Menikah (Lajang)' }, { id: 'divorced', label: 'Pernah Menikah (Cerai Hidup)' }, { id: 'widowed', label: 'Cerai Mati' }] as opt}
          <button
            onclick={() => (maritalStatus = opt.id)}
            class="w-full text-left p-4 rounded-[16px] border transition {maritalStatus === opt.id ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white' : 'bg-[#13131F] border-white/10 text-gray-300'}"
          >
            {opt.label}
          </button>
        {/each}
      </div>

    {:else if step === 1}
      <div class="space-y-4">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Tempat Lahir</div>
          <input bind:value={placeOfBirth} placeholder="Contoh: Jakarta" class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Tanggal Lahir</div>
          <input type="date" bind:value={dateOfBirth} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
      </div>

    {:else if step === 2}
      <div class="space-y-4">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Daerah LDII</div>
          <input bind:value={daerah} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Desa</div>
          <input bind:value={desa} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Kelompok</div>
          <input bind:value={kelompok} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
      </div>

    {:else if step === 3}
      <div>
        <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Alamat Domisili</div>
        <textarea bind:value={fullAddress} rows="4" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..." class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] p-4 text-sm text-white"></textarea>
      </div>

    {:else if step === 4}
      <div class="space-y-4">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Nomor WhatsApp Aktif</div>
          <input type="tel" bind:value={whatsappNumber} placeholder="08123456789" class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Username Instagram (Opsional)</div>
          <input bind:value={instagram} placeholder="@username" class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
      </div>

    {:else if step === 5}
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Tinggi (cm)</div>
          <input type="number" bind:value={height} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white text-center text-lg font-bold" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Berat (kg)</div>
          <input type="number" bind:value={weight} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white text-center text-lg font-bold" />
        </div>
      </div>

    {:else if step === 6}
      <div>
        <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-3">Pilih Sifat Utama</div>
        <div class="flex flex-wrap gap-2">
          {#each sifatDefaults as s}
            <button
              onclick={() => (sifatSelected = toggleItem(sifatSelected, s))}
              class="px-3.5 py-2 rounded-full text-xs font-semibold border transition {sifatSelected.includes(s) ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-300 border-white/10'}"
            >
              {s}
            </button>
          {/each}
        </div>
      </div>

    {:else if step === 7}
      <div>
        <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-3">Pilih Hobi</div>
        <div class="flex flex-wrap gap-2">
          {#each hobbyDefaults as h}
            <button
              onclick={() => (hobbiesSelected = toggleItem(hobbiesSelected, h))}
              class="px-3.5 py-2 rounded-full text-xs font-semibold border transition {hobbiesSelected.includes(h) ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-300 border-white/10'}"
            >
              {h}
            </button>
          {/each}
        </div>
      </div>

    {:else if step === 8}
      <div>
        <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-3">Makanan Kesukaan</div>
        <div class="flex flex-wrap gap-2">
          {#each foodDefaults as f}
            <button
              onclick={() => (foodsSelected = toggleItem(foodsSelected, f))}
              class="px-3.5 py-2 rounded-full text-xs font-semibold border transition {foodsSelected.includes(f) ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-300 border-white/10'}"
            >
              {f}
            </button>
          {/each}
        </div>
      </div>

    {:else if step === 9}
      <div>
        <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-3">Kriteria Pasangan Idaman</div>
        <div class="flex flex-wrap gap-2">
          {#each criteriaDefaults as c}
            <button
              onclick={() => (criteriaSelected = toggleItem(criteriaSelected, c))}
              class="px-3.5 py-2 rounded-full text-xs font-semibold border transition {criteriaSelected.includes(c) ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-300 border-white/10'}"
            >
              {c}
            </button>
          {/each}
        </div>
      </div>

    {:else if step === 10}
      <div class="space-y-3">
        {#each [{ id: 'married', label: 'Orang Tua Bersama (Harmonis)' }, { id: 'divorced', label: 'Orang Tua Berpisah (Cerai)' }, { id: 'widowed', label: 'Salah Satu / Keduanya Meninggal' }] as opt}
          <button
            onclick={() => (parentsMaritalStatus = opt.id)}
            class="w-full text-left p-4 rounded-[16px] border transition {parentsMaritalStatus === opt.id ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white' : 'bg-[#13131F] border-white/10 text-gray-300'}"
          >
            {opt.label}
          </button>
        {/each}
      </div>

    {:else if step === 11}
      <div class="space-y-4">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Nama Ayah</div>
          <input bind:value={fatherName} placeholder="Nama lengkap ayah" class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Status Kejamaahan Ayah</div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick={() => (fatherStatus = 'member')} class="py-2.5 rounded-xl text-xs font-semibold border {fatherStatus === 'member' ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-400 border-white/10'}">
              Warga LDII
            </button>
            <button onclick={() => (fatherStatus = 'non_member')} class="py-2.5 rounded-xl text-xs font-semibold border {fatherStatus === 'non_member' ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-400 border-white/10'}">
              Simpatisan / Umum
            </button>
          </div>
        </div>
      </div>

    {:else if step === 12}
      <div class="space-y-4">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Nama Ibu</div>
          <input bind:value={motherName} placeholder="Nama lengkap ibu" class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Status Kejamaahan Ibu</div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick={() => (motherStatus = 'member')} class="py-2.5 rounded-xl text-xs font-semibold border {motherStatus === 'member' ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-400 border-white/10'}">
              Warga LDII
            </button>
            <button onclick={() => (motherStatus = 'non_member')} class="py-2.5 rounded-xl text-xs font-semibold border {motherStatus === 'non_member' ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]' : 'bg-[#1C1A2E] text-gray-400 border-white/10'}">
              Simpatisan / Umum
            </button>
          </div>
        </div>
      </div>

    {:else if step === 13}
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Anak Ke-</div>
          <input type="number" bind:value={birthOrder} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white text-center text-lg font-bold" />
        </div>
        <div>
          <div class="block text-[11px] font-semibold uppercase text-gray-400 mb-2">Dari Bersaudara</div>
          <input type="number" bind:value={siblingsCount} class="w-full bg-[#1C1A2E] border border-white/10 rounded-[14px] px-4 py-3 text-sm text-white text-center text-lg font-bold" />
        </div>
      </div>

    {:else if step === 14}
      <div class="bg-[#13131F] border border-white/10 rounded-[20px] p-5 space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center border border-[#8B5CF6]/40 text-[#A78BFA]">
            ✓
          </div>
          <div>
            <h3 class="font-bold text-sm">Semua Tahap Terisi</h3>
            <p class="text-xs text-gray-400">Data siap disimpan ke server Zakhruf.</p>
          </div>
        </div>
        <p class="text-xs text-gray-300 leading-relaxed bg-[#1C1A2E] p-3 rounded-xl">
          Dengan menekan tombol selesai, kamu menyetujui adab ta'aruf yang terjaga dan informasi ini akan ditinjau oleh Tim PNKB.
        </p>
      </div>
    {/if}
  </div>

  <!-- Bottom Navigation Button -->
  <div class="pt-4">
    <button
      onclick={nextStep}
      class="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3.5 px-6 rounded-full transition shadow-lg shadow-[#8B5CF6]/30 text-sm"
    >
      {step === total - 1 ? 'Selesai & Mulai Ta\'aruf' : 'Lanjutkan →'}
    </button>
  </div>
</div>
