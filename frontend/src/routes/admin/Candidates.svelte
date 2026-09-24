<script lang="ts">
  import { onMount } from 'svelte';
  import { querystring } from 'svelte-spa-router';
  import AdminLayout from '../../layouts/AdminLayout.svelte';
  import { mockCandidates, type Candidate } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';

  onMount(() => {
    auth.requireAdmin();
  });

  let candidateList = $state<Candidate[]>([...mockCandidates]);

  // Read URL query string for initial category/type filter
  let categoryFilter = $state<string>('');
  let search = $state('');
  let genderFilter = $state<string>('');
  let statusFilter = $state<string>('');
  let viewMode = $state<'table' | 'card'>('table');

  $effect(() => {
    if ($querystring) {
      const params = new URLSearchParams($querystring);
      const type = params.get('type') || params.get('participant_category');
      if (type) {
        categoryFilter = type;
      } else {
        categoryFilter = '';
      }
    }
  });

  let selectedCandidate = $state<Candidate | null>(null);
  let showCreateModal = $state(false);
  let showLookupModal = $state(false);

  // Cari Akun state
  let lookupEmail = $state('');
  let lookupResult = $state<Candidate | null>(null);
  let lookupError = $state('');
  let resetPassword = $state('');
  let resetSuccess = $state('');

  // Tambah Kandidat form state
  let newFullName = $state('');
  let newNickname = $state('');
  let newEmail = $state('');
  let newGender = $state<'male' | 'female'>('male');
  let newCategory = $state<'mandiri' | 'pashmina'>('mandiri');
  let newDob = $state('1998-01-01');
  let newOccupation = $state('');
  let newEducation = $state('S1');
  let newDaerah = $state('DKI Jakarta');
  let newDesa = $state('Jakarta Selatan');
  let newKelompok = $state('Tebet');
  let newPhone = $state('');

  function calcAge(dob?: string): number {
    if (!dob) return 25;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const mandiriCount = $derived(candidateList.filter((c) => c.candidate_type === 'mandiri').length);
  const pashminaCount = $derived(candidateList.filter((c) => c.candidate_type === 'pashmina').length);

  const filteredCandidates = $derived(
    candidateList.filter((c) => {
      if (categoryFilter && c.candidate_type !== categoryFilter) return false;
      if (genderFilter && c.gender !== genderFilter) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          c.full_name.toLowerCase().includes(q) ||
          c.nickname?.toLowerCase().includes(q) ||
          c.candidate_code?.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (typeof c.daerah === 'object' ? c.daerah?.name : c.daerah || '').toLowerCase().includes(q) ||
          (typeof c.desa === 'object' ? c.desa?.name : c.desa || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    })
  );

  function getDaerahName(c: Candidate): string {
    if (typeof c.daerah === 'object') return c.daerah?.name || '—';
    return c.daerah || '—';
  }

  function getDesaName(c: Candidate): string {
    if (typeof c.desa === 'object') return c.desa?.name || '—';
    return c.desa || '—';
  }

  function getMainPhoto(c: Candidate): string | null {
    if (c.photos && c.photos.length > 0) {
      const main = c.photos.find((p) => p.is_main) || c.photos[0];
      return main.url || null;
    }
    return null;
  }

  function exportCSV() {
    const headers = ['Kode', 'Nama Lengkap', 'Panggilan', 'Kategori', 'Gender', 'Umur', 'Pendidikan', 'Pekerjaan', 'Email', 'No HP', 'Daerah', 'Desa', 'Kelompok'];
    const rows = filteredCandidates.map((c) => [
      c.candidate_code || '',
      c.full_name,
      c.nickname || '',
      c.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri',
      c.gender === 'male' ? 'Pria' : 'Wanita',
      calcAge(c.date_of_birth),
      c.education || '',
      c.occupation || '',
      c.email || '',
      c.whatsapp_number || '',
      getDaerahName(c),
      getDesaName(c),
      typeof c.kelompok === 'object' ? c.kelompok?.name : c.kelompok || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', encodedUri);
    linkEl.setAttribute('download', `kandidat-zakhruf-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
  }

  function handleCreateCandidate(e: Event) {
    e.preventDefault();
    if (!newFullName.trim()) return;

    const newCand: Candidate = {
      id: Date.now(),
      candidate_code: `Z-${String(candidateList.length + 1).padStart(3, '0')}`,
      nickname: newNickname || newFullName.split(' ')[0],
      full_name: newFullName,
      gender: newGender,
      candidate_type: newCategory,
      status: 'active',
      marital_status: newCategory === 'pashmina' ? 'divorced' : 'single',
      date_of_birth: newDob,
      place_of_birth: 'Jakarta',
      education: newEducation,
      occupation: newOccupation || 'Profesional',
      height: 165,
      weight: 55,
      email: newEmail,
      whatsapp_number: newPhone,
      full_address: `${newDesa}, ${newDaerah}`,
      daerah: newDaerah,
      desa: newDesa,
      kelompok: newKelompok,
      self_description: 'Peserta taaruf terdaftar.',
      sifat: 'Baik, Ramah, Tanggung Jawab',
      hobbies: 'Membaca, Olahraga',
      favorite_foods: 'Nasi Goreng',
      partner_criteria: 'Sholeh/Sholehah, Seiman, Tanggung jawab',
      photos: [
        { id: Date.now(), url: '/storage/register-hero.jpg', is_main: true },
      ],
    };

    candidateList = [newCand, ...candidateList];
    showCreateModal = false;
    newFullName = '';
    newNickname = '';
    newEmail = '';
    newPhone = '';
  }

  function handleLookupEmail(e: Event) {
    e.preventDefault();
    lookupError = '';
    lookupResult = null;
    resetSuccess = '';
    const found = candidateList.find((c) => c.email?.toLowerCase() === lookupEmail.toLowerCase().trim());
    if (found) {
      lookupResult = found;
    } else {
      lookupError = 'Akun dengan email tersebut tidak ditemukan.';
    }
  }

  function handleResetPass(e: Event) {
    e.preventDefault();
    if (resetPassword.length < 6) {
      alert('Password minimal 6 karakter.');
      return;
    }
    resetSuccess = 'Password berhasil direset.';
    resetPassword = '';
  }
</script>

<AdminLayout>
  <!-- Header matching zakhruf-id Candidates/Index.vue -->
  <div class="cand-header">
    <div>
      <div class="title-row">
        <h1 class="cand-title">Kandidat</h1>
        <span class="total-badge">{candidateList.length} Total Peserta</span>
      </div>
      <p class="cand-sub">Database seluruh peserta taaruf Zakhruf ID</p>
    </div>

    <div class="cand-actions">
      <!-- Ekspor CSV -->
      <button class="btn-head-action" onclick={exportCSV} title="Ekspor CSV">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>Ekspor CSV</span>
      </button>

      <!-- Cari Akun -->
      <button class="btn-head-action" onclick={() => (showLookupModal = true)} title="Cari Akun">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" stroke-width="1.3"/><line x1="9" y1="9" x2="12.5" y2="12.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        <span>Cari Akun</span>
      </button>

      <!-- Tambah Kandidat (Link Mandiri / Pashmina) -->
      <button class="btn-create-cand" onclick={() => (showCreateModal = true)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span>Tambah</span>
      </button>
    </div>
  </div>

  <!-- Category Tabs: Semua, Mandiri, Pashmina -->
  <div class="category-tabs">
    <button
      class="cat-tab"
      class:active={categoryFilter === ''}
      onclick={() => (categoryFilter = '')}
    >
      <span>Semua Kandidat</span>
      <span class="cat-count">{candidateList.length}</span>
    </button>
    <button
      class="cat-tab"
      class:active={categoryFilter === 'mandiri'}
      onclick={() => (categoryFilter = 'mandiri')}
    >
      <span class="dot-mandiri">●</span>
      <span>Mandiri</span>
      <span class="cat-count badge-mandiri">{mandiriCount}</span>
    </button>
    <button
      class="cat-tab"
      class:active={categoryFilter === 'pashmina'}
      onclick={() => (categoryFilter = 'pashmina')}
    >
      <span class="dot-pashmina">●</span>
      <span>Pashmina</span>
      <span class="cat-count badge-pashmina">{pashminaCount}</span>
    </button>
  </div>

  <!-- Filters & View Toggle Bar -->
  <div class="cand-filters">
    <div class="search-box">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" class="search-icon"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.3"/><line x1="10" y1="10" x2="13.5" y2="13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      <input bind:value={search} type="text" placeholder="Cari nama, kode, email, daerah..." />
    </div>

    <div class="select-box">
      <select bind:value={genderFilter}>
        <option value="">Semua Gender</option>
        <option value="male">Ikhwan (Pria)</option>
        <option value="female">Akhwat (Wanita)</option>
      </select>

      <select bind:value={statusFilter}>
        <option value="">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="pending">Menunggu Verifikasi</option>
        <option value="blocked">Diblokir</option>
      </select>
    </div>

    <div class="view-toggle">
      <button
        class="toggle-btn"
        class:active={viewMode === 'table'}
        onclick={() => (viewMode = 'table')}
        title="Tabel"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="5" rx="1" fill="currentColor"/><rect x="1" y="8" width="12" height="5" rx="1" fill="currentColor"/></svg>
      </button>
      <button
        class="toggle-btn"
        class:active={viewMode === 'card'}
        onclick={() => (viewMode = 'card')}
        title="Kartu"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/><rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor"/><rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor"/><rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/></svg>
      </button>
    </div>
  </div>

  <!-- Table View matching zakhruf-id -->
  {#if viewMode === 'table'}
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Kandidat</th>
            <th>Kategori</th>
            <th>Gender</th>
            <th>Umur</th>
            <th>Pendidikan</th>
            <th>Daerah</th>
            <th>Status</th>
            <th class="th-actions">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#if filteredCandidates.length === 0}
            <tr>
              <td colspan="8" class="empty-cell">Tidak ada kandidat yang sesuai filter.</td>
            </tr>
          {:else}
            {#each filteredCandidates as c}
              <tr>
                <td>
                  <div class="cand-cell">
                    <div class="cand-avatar">
                      {#if getMainPhoto(c)}
                        <img src={getMainPhoto(c)} alt={c.full_name} />
                      {:else}
                        <span>{c.full_name.charAt(0)}</span>
                      {/if}
                    </div>
                    <div>
                      <div class="cand-name-row">
                        <span class="cand-name">{c.full_name}</span>
                        {#if c.candidate_code}
                          <span class="cand-code">({c.candidate_code})</span>
                        {/if}
                      </div>
                      <div class="cand-sub-text">{c.occupation}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="cat-pill cat-{c.candidate_type || 'mandiri'}">
                    {c.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri'}
                  </span>
                </td>
                <td>
                  <span class="gender-tag tag-{c.gender}">
                    {c.gender === 'male' ? 'Pria' : 'Wanita'}
                  </span>
                </td>
                <td>
                  <span class="age-text">{calcAge(c.date_of_birth)} th</span>
                </td>
                <td>
                  <span class="edu-text">{c.education}</span>
                </td>
                <td>
                  <div class="loc-text">{getDaerahName(c)}</div>
                  <div class="loc-sub">{getDesaName(c)}</div>
                </td>
                <td>
                  <span class="status-pill pill-{c.status}">
                    {c.status === 'active' ? 'Aktif' : c.status === 'blocked' ? 'Diblokir' : 'Menunggu'}
                  </span>
                </td>
                <td class="td-actions">
                  <button class="btn-detail" onclick={() => (selectedCandidate = c)}>Detail</button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  {:else}
    <!-- Card Grid View -->
    <div class="cards-grid">
      {#each filteredCandidates as c}
        <div class="cand-card">
          <div class="card-photo-wrap">
            {#if getMainPhoto(c)}
              <img src={getMainPhoto(c)} alt={c.full_name} class="card-img" />
            {:else}
              <div class="card-img-placeholder">{c.full_name.charAt(0)}</div>
            {/if}
            <span class="card-cat-badge badge-{c.candidate_type || 'mandiri'}">
              {c.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri'}
            </span>
          </div>

          <div class="card-body">
            <div class="card-name-row">
              <h3 class="card-cand-name">{c.full_name}</h3>
              <span class="gender-tag tag-{c.gender}">{c.gender === 'male' ? 'Pria' : 'Wanita'}</span>
            </div>

            <p class="card-cand-sub">{c.occupation} · {calcAge(c.date_of_birth)} th</p>
            <p class="card-loc">📍 {getDesaName(c)}, {getDaerahName(c)}</p>

            <div class="card-foot">
              <span class="status-pill pill-{c.status}">
                {c.status === 'active' ? 'Aktif' : 'Menunggu'}
              </span>
              <button class="btn-detail" onclick={() => (selectedCandidate = c)}>Detail Biodata</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Detail Modal -->
  {#if selectedCandidate}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={(e) => e.target === e.currentTarget ? selectedCandidate = null : undefined}>
      <div class="modal-card modal-lg">
        <div class="modal-head">
          <h2 class="modal-title">Biodata Peserta Taaruf</h2>
          <button class="btn-close" onclick={() => (selectedCandidate = null)}>✕</button>
        </div>

        <div class="biodata-view">
          <div class="bio-top">
            <div class="bio-avatar">
              {#if getMainPhoto(selectedCandidate)}
                <img src={getMainPhoto(selectedCandidate)} alt={selectedCandidate.full_name} />
              {:else}
                <span>{selectedCandidate.full_name.charAt(0)}</span>
              {/if}
            </div>
            <div>
              <div class="bio-name-row">
                <h3 class="bio-name">{selectedCandidate.full_name}</h3>
                <span class="cat-pill cat-{selectedCandidate.candidate_type || 'mandiri'}">
                  {selectedCandidate.candidate_type === 'pashmina' ? 'Pashmina' : 'Mandiri'}
                </span>
              </div>
              <p class="bio-meta">{selectedCandidate.nickname} · {calcAge(selectedCandidate.date_of_birth)} tahun · {selectedCandidate.occupation}</p>
            </div>
          </div>

          <div class="bio-grid">
            <div class="bio-item">
              <span class="bio-k">Email</span>
              <span class="bio-v">{selectedCandidate.email || '—'}</span>
            </div>
            <div class="bio-item">
              <span class="bio-k">WhatsApp</span>
              <span class="bio-v">{selectedCandidate.whatsapp_number || '—'}</span>
            </div>
            <div class="bio-item">
              <span class="bio-k">Wilayah</span>
              <span class="bio-v">{getDesaName(selectedCandidate)}, {getDaerahName(selectedCandidate)}</span>
            </div>
            <div class="bio-item">
              <span class="bio-k">Pendidikan</span>
              <span class="bio-v">{selectedCandidate.education}</span>
            </div>
            <div class="bio-item">
              <span class="bio-k">Tinggi / Berat</span>
              <span class="bio-v">{selectedCandidate.height} cm / {selectedCandidate.weight} kg</span>
            </div>
            <div class="bio-item">
              <span class="bio-k">Status Pernikahan</span>
              <span class="bio-v">{selectedCandidate.marital_status === 'divorced' ? 'Pernah Menikah (Pashmina)' : 'Belum Pernah (Mandiri)'}</span>
            </div>
          </div>

          {#if selectedCandidate.bio || selectedCandidate.self_description}
            <div class="bio-box">
              <span class="bio-k">Deskripsi Diri:</span>
              <p class="bio-text">{selectedCandidate.bio || selectedCandidate.self_description}</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Tambah Kandidat Modal (Link Mandiri / Pashmina) -->
  {#if showCreateModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={(e) => e.target === e.currentTarget ? showCreateModal = false : undefined}>
      <div class="modal-card">
        <div class="modal-head">
          <h2 class="modal-title">Tambah Kandidat Taaruf</h2>
          <button class="btn-close" onclick={() => (showCreateModal = false)}>✕</button>
        </div>

        <form onsubmit={handleCreateCandidate}>
          <!-- Kategori Selection (Mandiri / Pashmina) -->
          <div class="form-group">
            <span class="form-label">Kategori Peserta</span>
            <div class="type-selector-row">
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="type-option"
                class:selected={newCategory === 'mandiri'}
                onclick={() => (newCategory = 'mandiri')}
              >
                <div class="opt-title">Mandiri</div>
                <div class="opt-sub">Belum pernah menikah (Single)</div>
              </div>

              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="type-option"
                class:selected={newCategory === 'pashmina'}
                onclick={() => (newCategory = 'pashmina')}
              >
                <div class="opt-title">Pashmina</div>
                <div class="opt-sub">Pernah menikah (Duda / Janda)</div>
              </div>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="cand-full-name">Nama Lengkap</label>
              <input class="form-input" id="cand-full-name" type="text" bind:value={newFullName} placeholder="Nama sesuai KTP" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="cand-nick-name">Nama Panggilan</label>
              <input class="form-input" id="cand-nick-name" type="text" bind:value={newNickname} placeholder="Panggilan akrab" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="cand-gender">Gender</label>
              <select class="form-input" id="cand-gender" bind:value={newGender}>
                <option value="male">Ikhwan (Pria)</option>
                <option value="female">Akhwat (Wanita)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="cand-dob">Tanggal Lahir</label>
              <input class="form-input" id="cand-dob" type="date" bind:value={newDob} />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="cand-email">Email</label>
              <input class="form-input" id="cand-email" type="email" bind:value={newEmail} placeholder="kandidat@email.com" />
            </div>

            <div class="form-group">
              <label class="form-label" for="cand-phone">No. WhatsApp</label>
              <input class="form-input" id="cand-phone" type="tel" bind:value={newPhone} placeholder="08123456789" />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="cand-occupation">Pekerjaan</label>
              <input class="form-input" id="cand-occupation" type="text" bind:value={newOccupation} placeholder="mis. Software Engineer" />
            </div>

            <div class="form-group">
              <label class="form-label" for="cand-education">Pendidikan</label>
              <select class="form-input" id="cand-education" bind:value={newEducation}>
                <option value="SMA">SMA / SMK</option>
                <option value="D3">Diploma (D3)</option>
                <option value="S1">Sarjana (S1)</option>
                <option value="S2">Magister (S2)</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" onclick={() => (showCreateModal = false)}>Batal</button>
            <button type="submit" class="btn-submit">Simpan ke {newCategory === 'pashmina' ? 'Pashmina' : 'Mandiri'}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Cari Akun Modal -->
  {#if showLookupModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={(e) => e.target === e.currentTarget ? showLookupModal = false : undefined}>
      <div class="modal-card">
        <div class="modal-head">
          <h2 class="modal-title">Cari Akun & Reset Password</h2>
          <button class="btn-close" onclick={() => (showLookupModal = false)}>✕</button>
        </div>

        <form onsubmit={handleLookupEmail} style="margin-bottom: 16px;">
          <div class="form-group">
            <label class="form-label" for="cand-lookup-email">Cari Email Peserta</label>
            <div style="display: flex; gap: 8px;">
              <input class="form-input" id="cand-lookup-email" type="email" bind:value={lookupEmail} placeholder="fatimah.azzahra@email.com" required />
              <button type="submit" class="btn-submit" style="white-space: nowrap;">Cari</button>
            </div>
          </div>
        </form>

        {#if lookupError}
          <div class="lookup-err">{lookupError}</div>
        {/if}

        {#if lookupResult}
          <div class="lookup-result-box">
            <div class="cand-cell">
              <div class="cand-avatar">
                <span>{lookupResult.full_name.charAt(0)}</span>
              </div>
              <div>
                <div class="cand-name">{lookupResult.full_name}</div>
                <div class="cand-sub-text">{lookupResult.email} · {lookupResult.candidate_type}</div>
              </div>
            </div>

            <form onsubmit={handleResetPass} style="margin-top: 14px;">
              <div class="form-group">
                <label class="form-label" for="cand-reset-password">Set Password Baru</label>
                <input class="form-input" id="cand-reset-password" type="password" bind:value={resetPassword} placeholder="Password baru" required />
              </div>
              <button type="submit" class="btn-save-pass">Reset Password</button>
              {#if resetSuccess}
                <span class="save-msg">✓ {resetSuccess}</span>
              {/if}
            </form>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</AdminLayout>

<style>
  .cand-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .title-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cand-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 600;
    color: #e4e4ec;
    letter-spacing: -0.4px;
    margin: 0;
  }
  .total-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(122,154,94,0.12);
    color: #8db36b;
  }
  .cand-sub {
    font-size: 13px;
    color: #8b8d9a;
    margin-top: 4px;
    margin-bottom: 0;
  }

  .cand-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .btn-head-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.08);
    color: #8b8d9a;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.25s;
  }
  .btn-head-action:hover {
    color: #e4e4ec;
    border-color: rgba(255,255,255,0.18);
  }
  .btn-create-cand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #7a9a5e;
    color: #0a0d06;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.25s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  .btn-create-cand:hover {
    background: #8db36b;
    transform: scale(1.02);
  }

  /* Category Tabs */
  .category-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding-bottom: 8px;
    overflow-x: auto;
  }
  .cat-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    color: #8b8d9a;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }
  .cat-tab:hover {
    color: #e4e4ec;
    border-color: rgba(255,255,255,0.12);
  }
  .cat-tab.active {
    background: #1a1d27;
    color: #e4e4ec;
    border-color: rgba(122,154,94,0.3);
  }
  .cat-count {
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 5px;
    background: rgba(255,255,255,0.06);
    color: #8b8d9a;
  }
  .badge-mandiri { background: rgba(122,154,94,0.15); color: #8db36b; }
  .badge-pashmina { background: rgba(212,160,48,0.15); color: #e8b840; }
  .dot-mandiri { color: #8db36b; font-size: 10px; }
  .dot-pashmina { color: #e8b840; font-size: 10px; }

  /* Filters */
  .cand-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
  }
  .search-box {
    flex: 1;
    min-width: 220px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
  }
  .search-icon { color: #5a5c6a; flex-shrink: 0; }
  .search-box input {
    border: none;
    background: none;
    outline: none;
    font-size: 12px;
    color: #e4e4ec;
    width: 100%;
    font-family: inherit;
  }
  .select-box {
    display: flex;
    gap: 8px;
  }
  .select-box select {
    padding: 9px 14px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
    color: #8b8d9a;
    font-size: 12px;
    font-family: inherit;
    outline: none;
    cursor: pointer;
  }
  .view-toggle {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }
  .toggle-btn {
    padding: 8px 10px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
    color: #5a5c6a;
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .toggle-btn.active {
    background: rgba(122,154,94,0.12);
    border-color: rgba(122,154,94,0.25);
    color: #8db36b;
  }

  /* Table */
  .table-container {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow-x: auto;
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }
  .data-table th {
    padding: 14px 18px;
    font-size: 10px;
    font-weight: 700;
    color: #5a5c6a;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .data-table td {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: #8b8d9a;
  }
  .cand-cell { display: flex; align-items: center; gap: 12px; }
  .cand-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #1a1d27;
    display: grid;
    place-items: center;
    color: #8db36b;
    font-weight: 700;
    overflow: hidden;
    flex-shrink: 0;
  }
  .cand-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .cand-name-row { display: flex; align-items: center; gap: 6px; }
  .cand-name { font-weight: 600; color: #e4e4ec; }
  .cand-code { font-family: monospace; font-size: 10px; color: #8db36b; }
  .cand-sub-text { font-size: 11px; color: #5a5c6a; }

  .cat-pill {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    display: inline-block;
  }
  .cat-mandiri { background: rgba(122,154,94,0.12); color: #8db36b; }
  .cat-pashmina { background: rgba(212,160,48,0.12); color: #e8b840; }

  .gender-tag { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
  .tag-male { background: rgba(100,160,220,0.12); color: #64a0dc; }
  .tag-female { background: rgba(232,184,64,0.12); color: #e8b840; }

  .status-pill { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
  .pill-active { background: rgba(122,154,94,0.12); color: #8db36b; }
  .pill-blocked { background: rgba(220,100,100,0.10); color: #dc6464; }
  .pill-pending { background: rgba(212,160,48,0.10); color: #e8b840; }

  .btn-detail {
    padding: 6px 12px;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #e4e4ec;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-detail:hover { background: rgba(255,255,255,0.08); }
  .empty-cell { text-align: center; padding: 48px; color: #5a5c6a; }

  /* Card Grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .cand-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.25s;
  }
  .cand-card:hover {
    border-color: rgba(122,154,94,0.3);
    transform: translateY(-2px);
  }
  .card-photo-wrap {
    height: 160px;
    background: #1a1d27;
    position: relative;
    overflow: hidden;
  }
  .card-img { width: 100%; height: 100%; object-fit: cover; }
  .card-img-placeholder {
    width: 100%; height: 100%;
    display: grid; place-items: center;
    font-size: 36px; color: #8db36b; font-weight: 700;
  }
  .card-cat-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
  }
  .badge-mandiri { background: rgba(10,13,6,0.85); color: #8db36b; border: 1px solid rgba(122,154,94,0.3); }
  .badge-pashmina { background: rgba(10,13,6,0.85); color: #e8b840; border: 1px solid rgba(212,160,48,0.3); }

  .card-body { padding: 16px; }
  .card-name-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .card-cand-name { font-size: 14px; font-weight: 600; color: #e4e4ec; margin: 0; }
  .card-cand-sub { font-size: 11px; color: #8b8d9a; margin: 0 0 6px; }
  .card-loc { font-size: 11px; color: #5a5c6a; margin: 0 0 14px; }
  .card-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 10px; }

  /* Modals */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(4,5,8,0.75);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 80;
  }
  .modal-card {
    width: 100%;
    max-width: 520px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 24px;
    max-height: 90vh;
    overflow-y: auto;
  }
  .modal-lg { max-width: 640px; }
  .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #e4e4ec; margin: 0; }
  .btn-close { background: none; border: none; color: #8b8d9a; font-size: 16px; cursor: pointer; }

  .type-selector-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .type-option {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .type-option.selected {
    border-color: #7a9a5e;
    background: rgba(122,154,94,0.1);
  }
  .opt-title { font-size: 13px; font-weight: 700; color: #e4e4ec; }
  .opt-sub { font-size: 10px; color: #8b8d9a; margin-top: 2px; }

  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 12px; font-weight: 500; color: #8b8d9a; margin-bottom: 6px; }
  .form-input {
    width: 100%;
    padding: 10px 14px;
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #e4e4ec;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
  }
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
  .btn-cancel { padding: 10px 18px; border-radius: 999px; background: transparent; border: 1px solid rgba(255,255,255,0.08); color: #8b8d9a; font-size: 13px; cursor: pointer; }
  .btn-submit { padding: 10px 20px; border-radius: 999px; background: #7a9a5e; color: #0a0d06; font-size: 13px; font-weight: 600; border: none; cursor: pointer; }

  /* Biodata View in Modal */
  .bio-top { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .bio-avatar { width: 56px; height: 56px; border-radius: 12px; background: #1a1d27; overflow: hidden; display: grid; place-items: center; color: #8db36b; font-size: 20px; font-weight: 700; flex-shrink: 0; }
  .bio-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .bio-name-row { display: flex; align-items: center; gap: 8px; }
  .bio-name { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #e4e4ec; margin: 0; }
  .bio-meta { font-size: 12px; color: #8b8d9a; margin: 2px 0 0; }
  .bio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .bio-item { background: #0d0f15; padding: 10px 14px; border-radius: 8px; }
  .bio-k { font-size: 10px; color: #5a5c6a; text-transform: uppercase; display: block; }
  .bio-v { font-size: 12px; color: #e4e4ec; font-weight: 600; margin-top: 2px; }
  .bio-box { background: #0d0f15; padding: 12px 14px; border-radius: 8px; }
  .bio-text { font-size: 12px; color: #8b8d9a; line-height: 1.5; margin: 4px 0 0; }

  .lookup-err { color: #e05555; font-size: 12px; margin-bottom: 12px; }
  .lookup-result-box { background: #0d0f15; border-radius: 10px; padding: 14px; }
  .btn-save-pass { padding: 8px 16px; border-radius: 6px; background: #7a9a5e; color: #0a0d06; font-size: 12px; font-weight: 600; border: none; cursor: pointer; }
  .save-msg { font-size: 12px; color: #8db36b; margin-left: 10px; }
</style>