<script lang="ts">
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import AdminLayout from '../../layouts/AdminLayout.svelte';
  import { mockEvents, mockCandidates, type EventItem, type Candidate } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';

  let { params = {} }: { params?: { slug?: string } } = $props();

  onMount(() => {
    auth.requireAdmin();
  });

  const eventSlug = $derived(params.slug || mockEvents[0]?.slug || '');
  const event = $derived<EventItem>(
    mockEvents.find((e) => e.slug === eventSlug) || mockEvents[0]
  );

  type TabKey = 'overview' | 'participants' | 'registrants' | 'settings' | 'attendance' | 'match' | 'results';

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'overview', label: 'Dashboard' },
    { key: 'participants', label: 'Peserta' },
    { key: 'registrants', label: 'Pendaftar' },
    { key: 'settings', label: 'Setting Event' },
    { key: 'attendance', label: 'Absensi' },
    { key: 'match', label: 'Match' },
    { key: 'results', label: 'Hasil' },
  ];

  let activeTab = $state<TabKey>('overview');
  let copied = $state(false);

  async function copyRegLink() {
    const url = `${window.location.origin}/#/events/${event.slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
    }
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  function calcAge(dob?: string): number {
    if (!dob) return 25;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  // Attendance filter state
  let selectedCandidate = $state<Candidate | null>(null);
  let attendanceList = $state<Array<{ candidate: Candidate; status: 'hadir' | 'izin' | 'tidak'; time?: string }>>([
    { candidate: mockCandidates[0], status: 'hadir', time: '08:15' },
    { candidate: mockCandidates[1], status: 'hadir', time: '08:22' },
    { candidate: mockCandidates[2], status: 'izin' },
    { candidate: mockCandidates[3], status: 'hadir', time: '08:30' },
    { candidate: mockCandidates[4], status: 'tidak' },
    { candidate: mockCandidates[5], status: 'hadir', time: '08:45' },
  ]);

  // Match / Rooms state
  const rooms = [
    { id: 1, name: 'Ruang Utsman', status: 'active', ikhwan: 'Ahmad Fauzi', akhwat: 'Fatimah Az-Zahra', pnkb: 'Hj. Siti Rahmah', started_at: '15 mnt lalu' },
    { id: 2, name: 'Ruang Ali', status: 'waiting', ikhwan: 'Zaid Pratama', akhwat: 'Aisyah Nurul', pnkb: 'Ust. M. Ridwan', started_at: 'Baru masuk' },
    { id: 3, name: 'Ruang Umar', status: 'idle', ikhwan: '—', akhwat: '—', pnkb: 'H. Bambang', started_at: 'Kosong' },
    { id: 4, name: 'Ruang Abu Bakar', status: 'idle', ikhwan: '—', akhwat: '—', pnkb: 'Ust. Ahmad', started_at: 'Kosong' },
  ];

  // Taaruf Results state
  const results = [
    { id: 1, ikhwan: 'Ahmad Fauzi', akhwat: 'Fatimah Az-Zahra', status: 'lanjut', notes: 'Sepakat tukar CV & pertemuan lanjutan didampingi wali.' },
    { id: 2, ikhwan: 'Zaid Pratama', akhwat: 'Aisyah Nurul', status: 'pending', notes: 'Masih istikharah dan bermusyawarah dengan keluarga.' },
    { id: 3, ikhwan: 'Farhan Al-Ghifari', akhwat: 'Maryam Salimah', status: 'selesai', notes: 'Belum ada kecocokan kriteria, proses diakhiri dengan baik.' },
  ];
</script>

<AdminLayout>
  <!-- Back Button & Header -->
  <div class="header-section">
    <a href="#/admin/events" use:link class="back-link">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Kembali ke Events</span>
    </a>

    <div class="event-main-head">
      <div class="event-logo-box">
        <span class="logo-text">{event.nama_kegiatan?.charAt(0) || 'E'}</span>
      </div>

      <div class="event-info-box">
        <div class="event-title-row">
          <h1 class="event-name">{event.nama_kegiatan}</h1>
          <span class="status-badge badge-{event.registration_status}">
            {event.registration_status === 'open' ? 'Pendaftaran Buka' : event.registration_status === 'closed' ? 'Tutup' : 'Configurable'}
          </span>
        </div>
        <p class="event-desc">{event.deskripsi || 'Kegiatan taaruf berkala LDII DKI Jakarta'}</p>
      </div>

      <button class="btn-copy-reg" onclick={copyRegLink}>
        {#if copied}
          <span style="color: #8db36b;">✓ Link Tersalin</span>
        {:else}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span>Salin Link Registrasi</span>
        {/if}
      </button>
    </div>
  </div>

  <!-- Tabs Navigation Bar -->
  <div class="tabs-bar">
    {#each tabs as t}
      <button class="tab-btn" class:active={activeTab === t.key} onclick={() => (activeTab = t.key)}>
        <span>{t.label}</span>
        {#if t.key === 'participants'}
          <span class="tab-count">{mockCandidates.length}</span>
        {:else if t.key === 'match'}
          <span class="tab-count">4 Room</span>
        {:else if t.key === 'results'}
          <span class="tab-count">{results.length}</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- TAB CONTENTS -->

  <!-- 1. OVERVIEW TAB -->
  {#if activeTab === 'overview'}
    <div class="tab-content">
      <!-- Stats Grid -->
      <div class="overview-grid">
        <div class="stat-mini-card">
          <span class="s-label">Total Pendaftar</span>
          <div class="s-val">{event.candidates_count || 32}</div>
          <div class="s-sub">18 Ikhwan · 14 Akhwat</div>
        </div>
        <div class="stat-mini-card">
          <span class="s-label">Kehadiran (Absensi)</span>
          <div class="s-val text-sage">85%</div>
          <div class="s-sub">27 Hadir dari 32</div>
        </div>
        <div class="stat-mini-card">
          <span class="s-label">Sesi Taaruf Aktif</span>
          <div class="s-val text-gold">2 Ruang</div>
          <div class="s-sub">4 Pasangan terjadwal</div>
        </div>
        <div class="stat-mini-card">
          <span class="s-label">Hasil Kesepakatan</span>
          <div class="s-val text-purple">1 Lanjut</div>
          <div class="s-sub">1 Pending · 1 Selesai</div>
        </div>
      </div>

      <!-- Schedule & Rooms Preview -->
      <div class="overview-row">
        <div class="card-box">
          <h3 class="box-title">Jadwal & Lokasi</h3>
          <div class="info-list">
            <div class="info-row">
              <span class="info-k">Tanggal Pelaksanaan:</span>
              <span class="info-v">Ahad, 14 Agustus 2026</span>
            </div>
            <div class="info-row">
              <span class="info-k">Waktu:</span>
              <span class="info-v">08:00 – 16:00 WIB</span>
            </div>
            <div class="info-row">
              <span class="info-k">Tempat:</span>
              <span class="info-v">Masjid Al-Ikhlas, Jakarta Selatan</span>
            </div>
            <div class="info-row">
              <span class="info-k">Mode Pertemuan:</span>
              <span class="info-v">Tatap Muka & Terjadwal (Dipandu PNKB)</span>
            </div>
          </div>
        </div>

        <div class="card-box">
          <h3 class="box-title">Ruang Taaruf Saat Ini</h3>
          <div class="rooms-mini-list">
            {#each rooms.slice(0, 3) as r}
              <div class="room-item">
                <div class="room-status-dot dot-{r.status}"></div>
                <div class="room-info">
                  <div class="room-name">{r.name}</div>
                  <div class="room-meta">{r.status === 'active' ? `${r.ikhwan} & ${r.akhwat}` : 'Tersedia'}</div>
                </div>
                <span class="room-badge badge-{r.status}">{r.status === 'active' ? 'Sedang Berlangsung' : 'Kosong'}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

  <!-- 2. PARTICIPANTS TAB -->
  {:else if activeTab === 'participants'}
    <div class="tab-content">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Peserta</th>
              <th>Gender</th>
              <th>No. Peserta</th>
              <th>Wilayah</th>
              <th>Pekerjaan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each mockCandidates as c, i}
              <tr>
                <td>
                  <div class="cand-row">
                    <div class="avatar-sm">
                      {#if c.photos && c.photos.length > 0}
                        <img src={c.photos[0].url} alt={c.full_name} />
                      {:else}
                        <span>{c.full_name.charAt(0)}</span>
                      {/if}
                    </div>
                    <div>
                      <div class="name-bold">{c.full_name}</div>
                      <div class="meta-sub">{calcAge(c.date_of_birth)} th · {c.email || '—'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="gender-tag tag-{c.gender}">
                    {c.gender === 'male' ? 'Ikhwan' : 'Akhwat'}
                  </span>
                </td>
                <td>
                  <span class="num-badge">#{String(i + 1).padStart(3, '0')}</span>
                </td>
                <td>
                  <div class="text-sm">{typeof c.daerah === 'object' ? c.daerah?.name : c.daerah || '—'}</div>
                  <div class="text-xs text-muted">{typeof c.desa === 'object' ? c.desa?.name : c.desa || '—'}</div>
                </td>
                <td>{c.occupation || '—'}</td>
                <td>
                  <button class="btn-action-sm" onclick={() => (selectedCandidate = c)}>Detail</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

  <!-- 3. REGISTRANTS TAB -->
  {:else if activeTab === 'registrants'}
    <div class="tab-content">
      <div class="card-box empty-state-box">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5a5c6a" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <p class="empty-text">Semua pendaftar telah disetujui (0 pendaftar pending).</p>
      </div>
    </div>

  <!-- 4. ATTENDANCE TAB -->
  {:else if activeTab === 'attendance'}
    <div class="tab-content">
      <div class="attendance-top">
        <div>
          <h3 class="box-title">Presensi Kehadiran Peserta</h3>
          <p class="box-sub">Catatan kedatangan peserta taaruf di lokasi kegiatan</p>
        </div>
        <button class="btn-scan-qr" onclick={() => alert('Fitur pemindai QR kamera dalam pengembangan.')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Scan QR Presensi</span>
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Peserta</th>
              <th>Gender</th>
              <th>Status Kehadiran</th>
              <th>Waktu Presensi</th>
              <th>Ubah Status</th>
            </tr>
          </thead>
          <tbody>
            {#each attendanceList as item}
              <tr>
                <td class="name-bold">{item.candidate.full_name}</td>
                <td>
                  <span class="gender-tag tag-{item.candidate.gender}">
                    {item.candidate.gender === 'male' ? 'Ikhwan' : 'Akhwat'}
                  </span>
                </td>
                <td>
                  <span class="att-status-badge att-{item.status}">
                    {item.status === 'hadir' ? '✓ Hadir' : item.status === 'izin' ? 'Izin' : 'Belum Hadir'}
                  </span>
                </td>
                <td class="text-sm">{item.time || '—'}</td>
                <td>
                  <div class="att-btns">
                    <button class="att-btn-act" class:active={item.status === 'hadir'} onclick={() => (item.status = 'hadir', item.time = '09:00')}>Hadir</button>
                    <button class="att-btn-act" class:active={item.status === 'izin'} onclick={() => (item.status = 'izin')}>Izin</button>
                    <button class="att-btn-act" class:active={item.status === 'tidak'} onclick={() => (item.status = 'tidak')}>Tidak</button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

  <!-- 5. MATCH TAB -->
  {:else if activeTab === 'match'}
    <div class="tab-content">
      <div class="match-grid">
        {#each rooms as room}
          <div class="room-card room-{room.status}">
            <div class="room-head">
              <h4 class="r-title">{room.name}</h4>
              <span class="room-tag tag-{room.status}">
                {room.status === 'active' ? '● Sedang Taaruf' : room.status === 'waiting' ? '⏳ Persiapan' : 'Kosong'}
              </span>
            </div>

            <div class="room-body">
              <div class="pair-box">
                <div class="pair-cand">
                  <span class="p-label">Ikhwan</span>
                  <span class="p-name">{room.ikhwan}</span>
                </div>
                <div class="pair-divider">⇄</div>
                <div class="pair-cand">
                  <span class="p-label">Akhwat</span>
                  <span class="p-name">{room.akhwat}</span>
                </div>
              </div>

              <div class="room-pnkb">
                <span class="pnkb-label">Pendamping:</span>
                <span class="pnkb-name">{room.pnkb}</span>
              </div>
            </div>

            <div class="room-foot">
              <span class="room-dur">{room.started_at}</span>
              <button class="btn-room-act" onclick={() => alert(`Kelola ${room.name}`)}>Atur Sesi</button>
            </div>
          </div>
        {/each}
      </div>
    </div>

  <!-- 6. RESULTS TAB -->
  {:else if activeTab === 'results'}
    <div class="tab-content">
      <div class="results-list">
        {#each results as res}
          <div class="result-card">
            <div class="res-top">
              <div class="res-pair">
                <span class="name-bold">{res.ikhwan}</span>
                <span class="text-muted">dengan</span>
                <span class="name-bold">{res.akhwat}</span>
              </div>
              <span class="res-badge res-{res.status}">
                {res.status === 'lanjut' ? '✨ Lanjut Pertemuan' : res.status === 'pending' ? 'Istikharah' : 'Selesai'}
              </span>
            </div>
            <p class="res-notes">{res.notes}</p>
          </div>
        {/each}
      </div>
    </div>

  <!-- 7. SETTINGS TAB -->
  {:else if activeTab === 'settings'}
    <div class="tab-content">
      <div class="card-box settings-form">
        <h3 class="box-title">Pengaturan Event</h3>
        
        <div class="form-group">
          <label class="form-label" for="setting-nama-kegiatan">Nama Kegiatan</label>
          <input class="form-input" id="setting-nama-kegiatan" type="text" value={event.nama_kegiatan} />
        </div>

        <div class="form-group">
          <label class="form-label" for="setting-deskripsi">Deskripsi</label>
          <textarea class="form-input" id="setting-deskripsi" rows="3">{event.deskripsi || ''}</textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="setting-status-pendaftaran">Status Pendaftaran</label>
            <select class="form-input" id="setting-status-pendaftaran" value={event.registration_status}>
              <option value="open">Buka Pendaftaran</option>
              <option value="closed">Tutup Pendaftaran</option>
              <option value="configurable">Configurable</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="setting-tipe-kegiatan">Tipe Kegiatan</label>
            <input class="form-input" id="setting-tipe-kegiatan" type="text" value={event.type || 'Internal LDII'} />
          </div>
        </div>

        <div class="form-foot">
          <button class="btn-save" onclick={() => alert('Pengaturan event disimpan.')}>Simpan Perubahan</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Candidate Detail Modal -->
  {#if selectedCandidate}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={(e) => e.target === e.currentTarget ? selectedCandidate = null : undefined}>
      <div class="modal-box">
        <div class="modal-head">
          <h2 class="modal-title">Biodata Peserta</h2>
          <button class="modal-close" onclick={() => (selectedCandidate = null)}>✕</button>
        </div>
        <div class="modal-body">
          <h3 class="name-bold" style="font-size: 16px;">{selectedCandidate.full_name}</h3>
          <p class="text-muted" style="font-size: 12px; margin-top: 4px;">{calcAge(selectedCandidate.date_of_birth)} tahun · {selectedCandidate.occupation}</p>
        </div>
      </div>
    </div>
  {/if}
</AdminLayout>

<style>
  .header-section {
    margin-bottom: 24px;
  }
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #8b8d9a;
    text-decoration: none;
    margin-bottom: 12px;
    transition: color 0.2s;
  }
  .back-link:hover {
    color: #8db36b;
  }
  .event-main-head {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .event-logo-box {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(122,154,94,0.25), rgba(212,160,48,0.12));
    border: 1px solid rgba(255,255,255,0.06);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 700;
    color: #8db36b;
  }
  .event-info-box {
    flex: 1;
    min-width: 240px;
  }
  .event-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .event-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 600;
    color: #e4e4ec;
    letter-spacing: -0.6px;
    margin: 0;
    line-height: 1.05;
  }
  .event-desc {
    font-size: 13px;
    color: #8b8d9a;
    margin: 4px 0 0;
  }
  .btn-copy-reg {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid rgba(232,184,64,0.3);
    background: rgba(232,184,64,0.07);
    color: #e8b840;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
    font-family: inherit;
  }
  .btn-copy-reg:hover {
    background: rgba(232,184,64,0.14);
  }

  .tabs-bar {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 24px;
    overflow-x: auto;
  }
  .tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    border: none;
    background: transparent;
    color: #8b8d9a;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }
  .tab-btn:hover {
    color: #e4e4ec;
  }
  .tab-btn.active {
    color: #8db36b;
    border-bottom-color: #7a9a5e;
  }
  .tab-count {
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    font-size: 10px;
    font-weight: 700;
  }

  .tab-content {
    animation: fadeIn 0.2s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }
  .stat-mini-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 18px;
  }
  .s-label { font-size: 11px; font-weight: 600; color: #5a5c6a; text-transform: uppercase; letter-spacing: 0.5px; }
  .s-val { font-size: 28px; font-weight: 700; color: #e4e4ec; margin: 4px 0; }
  .s-sub { font-size: 11px; color: #8b8d9a; }
  .text-sage { color: #8db36b; }
  .text-gold { color: #e8b840; }
  .text-purple { color: #a78bfa; }

  .overview-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 800px) {
    .overview-row { grid-template-columns: 1fr; }
  }

  .card-box {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px;
  }
  .box-title { font-size: 15px; font-weight: 600; color: #e4e4ec; margin: 0 0 14px; }
  .box-sub { font-size: 12px; color: #5a5c6a; margin-top: 2px; }

  .info-list { display: flex; flex-direction: column; gap: 8px; font-size: 12px; }
  .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px; }
  .info-k { color: #5a5c6a; }
  .info-v { color: #e4e4ec; font-weight: 500; }

  .rooms-mini-list { display: flex; flex-direction: column; gap: 10px; }
  .room-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.02);
    border-radius: 8px;
  }
  .room-status-dot { width: 8px; height: 8px; border-radius: 50%; }
  .room-status-dot.dot-active { background: #8db36b; }
  .room-status-dot.dot-waiting { background: #e8b840; }
  .room-status-dot.dot-idle { background: #5a5c6a; }
  .room-info { flex: 1; }
  .room-name { font-size: 13px; font-weight: 600; color: #e4e4ec; }
  .room-meta { font-size: 11px; color: #5a5c6a; }
  .room-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
  .room-badge.badge-active { background: rgba(122,154,94,0.12); color: #8db36b; }
  .room-badge.badge-idle { background: rgba(255,255,255,0.06); color: #8b8d9a; }

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
    padding: 12px 18px;
    font-size: 11px;
    font-weight: 600;
    color: #5a5c6a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .data-table td {
    padding: 12px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: #8b8d9a;
  }
  .cand-row { display: flex; align-items: center; gap: 10px; }
  .avatar-sm {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #1a1d27;
    display: grid;
    place-items: center;
    color: #8db36b;
    font-weight: 700;
    overflow: hidden;
  }
  .avatar-sm img { width: 100%; height: 100%; object-fit: cover; }
  .name-bold { font-weight: 600; color: #e4e4ec; }
  .meta-sub { font-size: 11px; color: #5a5c6a; }
  .num-badge { font-family: monospace; font-size: 11px; color: #8db36b; background: rgba(122,154,94,0.1); padding: 2px 6px; border-radius: 4px; }
  .btn-action-sm {
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #e4e4ec;
    font-size: 11px;
    cursor: pointer;
  }

  .gender-tag { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
  .tag-male { background: rgba(100,160,220,0.12); color: #64a0dc; }
  .tag-female { background: rgba(232,184,64,0.12); color: #e8b840; }

  .attendance-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .btn-scan-qr {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    background: #7a9a5e;
    color: #0a0d06;
    font-size: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }
  .att-status-badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; }
  .att-hadir { background: rgba(122,154,94,0.15); color: #8db36b; }
  .att-izin { background: rgba(212,160,48,0.15); color: #e8b840; }
  .att-tidak { background: rgba(255,255,255,0.06); color: #8b8d9a; }
  .att-btns { display: flex; gap: 4px; }
  .att-btn-act {
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 600;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.06);
    background: transparent;
    color: #8b8d9a;
    cursor: pointer;
  }
  .att-btn-act.active {
    background: #1a1d27;
    color: #e4e4ec;
    border-color: rgba(255,255,255,0.15);
  }

  .match-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }
  .room-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 18px;
  }
  .room-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .r-title { font-size: 15px; font-weight: 600; color: #e4e4ec; margin: 0; }
  .room-tag { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
  .tag-active { background: rgba(122,154,94,0.12); color: #8db36b; }
  .tag-waiting { background: rgba(212,160,48,0.12); color: #e8b840; }
  .tag-idle { background: rgba(255,255,255,0.06); color: #8b8d9a; }

  .pair-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
  }
  .pair-cand { display: flex; flex-direction: column; }
  .p-label { font-size: 9px; color: #5a5c6a; text-transform: uppercase; }
  .p-name { font-size: 12px; font-weight: 600; color: #e4e4ec; }
  .pair-divider { color: #5a5c6a; font-size: 14px; }
  .room-pnkb { font-size: 11px; display: flex; gap: 4px; color: #8b8d9a; margin-bottom: 12px; }
  .pnkb-label { color: #5a5c6a; }
  .pnkb-name { color: #8db36b; font-weight: 500; }
  .room-foot { display: flex; justify-content: space-between; align-items: center; }
  .room-dur { font-size: 10px; color: #5a5c6a; }
  .btn-room-act {
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(122,154,94,0.12);
    border: 1px solid rgba(122,154,94,0.25);
    color: #8db36b;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }

  .results-list { display: flex; flex-direction: column; gap: 12px; }
  .result-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 16px;
  }
  .res-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .res-pair { display: flex; align-items: center; gap: 6px; font-size: 13px; }
  .res-badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; }
  .res-lanjut { background: rgba(122,154,94,0.15); color: #8db36b; }
  .res-pending { background: rgba(212,160,48,0.15); color: #e8b840; }
  .res-selesai { background: rgba(255,255,255,0.06); color: #8b8d9a; }
  .res-notes { font-size: 12px; color: #8b8d9a; margin: 0; line-height: 1.4; }

  .settings-form { max-width: 600px; }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 12px; font-weight: 500; color: #8b8d9a; margin-bottom: 6px; }
  .form-input {
    width: 100%;
    padding: 10px 14px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #e4e4ec;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
  }
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-foot { margin-top: 18px; }
  .btn-save {
    padding: 10px 20px;
    border-radius: 8px;
    background: #7a9a5e;
    color: #0a0d06;
    font-weight: 600;
    font-size: 13px;
    border: none;
    cursor: pointer;
  }

  .empty-state-box {
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .empty-text { font-size: 13px; color: #5a5c6a; margin: 0; }

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
  .modal-box {
    width: 100%;
    max-width: 440px;
    background: #171a24;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px;
  }
  .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #e4e4ec; margin: 0; }
  .modal-close { background: none; border: none; color: #8b8d9a; cursor: pointer; font-size: 16px; }
</style>