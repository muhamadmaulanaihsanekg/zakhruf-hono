<script lang="ts">
  import { link } from 'svelte-spa-router';
  import Select from '../../components/Select.svelte';
  import { daerahs, educations } from '../../lib/mockData';

  let step = $state(1);
  let totalSteps = 4;

  // Form State
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let fullName = $state('');
  let nickname = $state('');
  let gender = $state<'male' | 'female'>('female');
  let dob = $state('2000-01-01');
  let height = $state(160);
  let weight = $state(50);
  let suku = $state('Jawa');
  let bloodType = $state('O');
  let candidateType = $state<'mandiri' | 'pashmina'>('pashmina');

  let daerahId = $state<number | string>(1);
  let desaId = $state<number | string>(11);
  let kelompokId = $state<number | string>(111);

  let education = $state('S1');
  let occupation = $state('Software Engineer');
  let companyName = $state('');
  let bio = $state('Bismillah, mencari pasangan sholeh yang siap membina rumah tangga barokah.');
  let partnerCriteria = $state('Taat beribadah, faham agama, bertanggung jawab.');

  let desaOptions = $derived.by(() => {
    const d = daerahs.find((item) => String(item.id) === String(daerahId));
    return d?.children ?? [];
  });

  let kelompokOptions = $derived.by(() => {
    const des = desaOptions.find((item) => String(item.id) === String(desaId));
    return des?.children ?? [];
  });

  let submitting = $state(false);

  function nextStep() {
    if (step < totalSteps) step++;
  }

  function prevStep() {
    if (step > 1) step--;
  }

  function finishOnboarding() {
    submitting = true;
    setTimeout(() => {
      submitting = false;
      window.location.hash = '#/';
    }, 800);
  }
</script>

<div class="min-h-screen bg-[#07090d] flex justify-center items-start md:items-center md:p-6 font-['Geist',sans-serif]">
  <div class="w-full max-w-[440px] min-h-screen md:min-h-0 bg-[#07090d] md:bg-[#0d0f15] px-4 py-6 md:px-6 md:py-8 md:rounded-3xl md:border md:border-white/[0.06] md:shadow-2xl flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7a9a5e] to-[#6b8c4f] flex items-center justify-center text-[#0a0d06] font-bold text-xs">
          Z
        </div>
        <span class="text-sm font-bold text-[#e4e4ec]">Pendaftaran Calon</span>
      </div>
      <span class="text-xs text-[#8b8d9a] font-semibold">Langkah {step} dari {totalSteps}</span>
    </div>

    <!-- Step Progress Bar -->
    <div class="grid grid-cols-4 gap-1.5 mb-6">
      {#each [1, 2, 3, 4] as s}
        <div class="h-1 rounded-full {s <= step ? 'bg-[#7a9a5e]' : 'bg-white/[0.08]'} transition-colors"></div>
      {/each}
    </div>

    <!-- Step 1: Akun -->
    {#if step === 1}
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-bold text-[#e4e4ec]">Buat Akun Kamu</h2>
          <p class="text-xs text-[#8b8d9a] mt-1">Gunakan email aktif untuk notifikasi taaruf terjaga</p>
        </div>

        <div>
          <label for="onb-email" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Email</label>
          <input
            id="onb-email"
            type="email"
            bind:value={email}
            placeholder="nama@email.com"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>

        <div>
          <label for="onb-pass" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Password</label>
          <input
            id="onb-pass"
            type="password"
            bind:value={password}
            placeholder="Minimal 8 karakter"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>

        <div>
          <label for="onb-conf-pass" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Konfirmasi Password</label>
          <input
            id="onb-conf-pass"
            type="password"
            bind:value={confirmPassword}
            placeholder="Ulangi password"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>
      </div>
    {:else if step === 2}
      <!-- Step 2: Data Diri -->
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-bold text-[#e4e4ec]">Data Diri</h2>
          <p class="text-xs text-[#8b8d9a] mt-1">Identitas dan wilayah domisili kamu</p>
        </div>

        <div>
          <label for="onb-fname" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Nama Lengkap</label>
          <input
            id="onb-fname"
            bind:value={fullName}
            placeholder="Nama sesuai KTP"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>

        <div>
          <label for="onb-nname" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Nama Panggilan</label>
          <input
            id="onb-nname"
            bind:value={nickname}
            placeholder="Nama akrab"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>

        <div>
          <div class="text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Jenis Kelamin</div>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onclick={() => (gender = 'male')}
              class="py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors {gender === 'male'
                ? 'bg-[#7a9a5e]/20 border-[#7a9a5e] text-[#8db36b]'
                : 'bg-white/[0.03] border-white/[0.08] text-[#8b8d9a]'}"
            >
              Laki-laki (Ikhwan)
            </button>
            <button
              type="button"
              onclick={() => (gender = 'female')}
              class="py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors {gender === 'female'
                ? 'bg-[#7a9a5e]/20 border-[#7a9a5e] text-[#8db36b]'
                : 'bg-white/[0.03] border-white/[0.08] text-[#8b8d9a]'}"
            >
              Perempuan (Akhwat)
            </button>
          </div>
        </div>

        <div>
          <label for="onb-dob" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Tanggal Lahir</label>
          <input
            id="onb-dob"
            type="date"
            bind:value={dob}
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="onb-h" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Tinggi (cm)</label>
            <input
              id="onb-h"
              type="number"
              bind:value={height}
              class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
            />
          </div>
          <div>
            <label for="onb-w" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Berat (kg)</label>
            <input
              id="onb-w"
              type="number"
              bind:value={weight}
              class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
            />
          </div>
        </div>

        <div>
          <div class="text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Daerah</div>
          <Select
            bind:value={daerahId}
            options={daerahs.map((d) => ({ value: d.id, label: d.name }))}
          />
        </div>
      </div>
    {:else if step === 3}
      <!-- Step 3: Edukasi & Karir -->
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-bold text-[#e4e4ec]">Pendidikan & Karir</h2>
          <p class="text-xs text-[#8b8d9a] mt-1">Latar belakang pendidikan dan aktivitas profesional</p>
        </div>

        <div>
          <div class="text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Tipe Pendaftaran</div>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onclick={() => (candidateType = 'pashmina')}
              class="p-3 rounded-xl border text-left cursor-pointer transition-colors {candidateType === 'pashmina'
                ? 'bg-[#e8b840]/15 border-[#e8b840] text-[#e8b840]'
                : 'bg-white/[0.03] border-white/[0.08] text-[#8b8d9a]'}"
            >
              <div class="text-xs font-bold">Pashmina</div>
              <div class="text-[10px] opacity-75 mt-0.5">Peserta event/kegiatan</div>
            </button>
            <button
              type="button"
              onclick={() => (candidateType = 'mandiri')}
              class="p-3 rounded-xl border text-left cursor-pointer transition-colors {candidateType === 'mandiri'
                ? 'bg-[#7a9a5e]/15 border-[#7a9a5e] text-[#8db36b]'
                : 'bg-white/[0.03] border-white/[0.08] text-[#8b8d9a]'}"
            >
              <div class="text-xs font-bold">Mandiri</div>
              <div class="text-[10px] opacity-75 mt-0.5">Pencarian mandiri</div>
            </button>
          </div>
        </div>

        <div>
          <div class="text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Pendidikan Terakhir</div>
          <Select
            bind:value={education}
            options={educations.map((e) => ({ value: e, label: e }))}
          />
        </div>

        <div>
          <label for="onb-occ" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Pekerjaan</label>
          <input
            id="onb-occ"
            bind:value={occupation}
            placeholder="cth: Guru / Dokter / Wirausaha"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>

        <div>
          <label for="onb-comp" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Tempat Kerja / Instansi (Opsional)</label>
          <input
            id="onb-comp"
            bind:value={companyName}
            placeholder="Nama perusahaan/sekolah"
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          />
        </div>
      </div>
    {:else}
      <!-- Step 4: Karakter & Kriteria -->
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-bold text-[#e4e4ec]">Tentang Kamu & Pasangan</h2>
          <p class="text-xs text-[#8b8d9a] mt-1">Beri gambaran tentang dirimu dan kriteria yang diharapkan</p>
        </div>

        <div>
          <label for="onb-bio" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Deskripsi Diri (Bio)</label>
          <textarea
            id="onb-bio"
            rows="3"
            bind:value={bio}
            placeholder="Ceritakan sedikit tentang dirimu, prinsip hidup, dan tujuan taaruf..."
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          ></textarea>
        </div>

        <div>
          <label for="onb-crit" class="block text-[11px] font-semibold text-[#8b8d9a] mb-1.5 uppercase">Kriteria Pasangan yang Dicari</label>
          <textarea
            id="onb-crit"
            rows="3"
            bind:value={partnerCriteria}
            placeholder="Kriteria akhlak, ibadah, domisili, atau karakter yang kamu harapkan..."
            class="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[10px] text-[13px] text-[#e4e4ec] outline-none focus:border-[#7a9a5e]/50"
          ></textarea>
        </div>

        <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#8b8d9a] leading-relaxed">
          🔒 <strong class="text-[#e4e4ec]">Privasi Terjaga:</strong> Foto dan biodata hanya dapat dilihat oleh sesama kandidat yang terverifikasi.
        </div>
      </div>
    {/if}

    <!-- Bottom Buttons -->
    <div class="flex gap-2.5 mt-8 pt-4 border-t border-white/[0.06]">
      {#if step > 1}
        <button
          type="button"
          onclick={prevStep}
          class="flex-1 py-3 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] font-bold text-xs hover:bg-white/5 cursor-pointer"
        >
          Kembali
        </button>
      {:else}
        <a
          href="/login"
          use:link
          class="flex-1 py-3 rounded-full border border-white/[0.08] bg-transparent text-[#8b8d9a] font-bold text-xs text-center no-underline hover:bg-white/5"
        >
          Sudah Punya Akun
        </a>
      {/if}

      {#if step < totalSteps}
        <button
          type="button"
          onclick={nextStep}
          class="flex-[2] py-3 rounded-full bg-[#7a9a5e] text-[#0a0d06] font-bold text-xs hover:bg-[#8db36b] cursor-pointer transition-colors"
        >
          Lanjut →
        </button>
      {:else}
        <button
          type="button"
          disabled={submitting}
          onclick={finishOnboarding}
          class="flex-[2] py-3 rounded-full bg-[#7a9a5e] text-[#0a0d06] font-bold text-xs hover:bg-[#8db36b] cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          {#if submitting}
            <span class="w-3.5 h-3.5 border-2 border-[#0a0d06]/30 border-t-[#0a0d06] rounded-full animate-spin"></span>
          {:else}
            <span>Selesaikan Pendaftaran ✓</span>
          {/if}
        </button>
      {/if}
    </div>
  </div>
</div>
