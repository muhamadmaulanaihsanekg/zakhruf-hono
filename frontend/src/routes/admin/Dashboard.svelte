<script lang="ts">
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import AdminLayout from '../../layouts/AdminLayout.svelte';
  import { auth } from '../../lib/auth.svelte';

  onMount(() => {
    auth.requireAdmin();
  });

  type Period = 'month' | 'quarter' | 'year';
  let period = $state<Period>('quarter');

  const allStats = {
    month: [
      { label: 'Total Kandidat', value: '68', delta: '↗ 8% dari bulan lalu', type: 'users' },
      { label: 'Proses Taaruf', value: '12', delta: '↗ 2 kandidat baru', type: 'process' },
      { label: 'Event Bulan Ini', value: '3', delta: '1 event mendatang', type: 'event' },
      { label: 'Berhasil Menikah', value: '18', delta: '↗ 5% dari tahun lalu', type: 'ring' },
    ],
    quarter: [
      { label: 'Total Kandidat', value: '524', delta: '↗ 12% dari bulan lalu', type: 'users' },
      { label: 'Proses Taaruf', value: '38', delta: '↗ 5 kandidat baru', type: 'process' },
      { label: 'Event Bulan Ini', value: '8', delta: '3 event mendatang', type: 'event' },
      { label: 'Berhasil Menikah', value: '156', delta: '↗ 18% dari tahun lalu', type: 'ring' },
    ],
    year: [
      { label: 'Total Kandidat', value: '524', delta: '↗ 22% dari tahun lalu', type: 'users' },
      { label: 'Proses Taaruf', value: '142', delta: '↗ 15 kandidat baru', type: 'process' },
      { label: 'Event Bulan Ini', value: '38', delta: '38 event tahun ini', type: 'event' },
      { label: 'Berhasil Menikah', value: '156', delta: '↗ 18% dari tahun lalu', type: 'ring' },
    ],
  };

  const currentStats = $derived(allStats[period]);

  const chartData = [
    { month: 'Mar', value: 12, max: 32 },
    { month: 'Apr', value: 18, max: 32 },
    { month: 'Mei', value: 15, max: 32 },
    { month: 'Jun', value: 24, max: 32 },
    { month: 'Jul', value: 20, max: 32 },
    { month: 'Ags', value: 28, max: 32 },
  ];

  const events = [
    { day: '14', month: 'Ags', name: 'Taaruf Akbar Jaksel', meta: 'Masjid Al-Ikhlas · 32 pendaftar', tag: 'sage', tagText: 'Mendatang' },
    { day: '21', month: 'Ags', name: 'Taaruf Khusus Mualaf', meta: 'Masjid Baiturrahman · 18 pendaftar', tag: 'sage', tagText: 'Mendatang' },
    { day: '28', month: 'Ags', name: 'Taaruf Rutin Pusat', meta: 'LDII DKI Pusat · 45 pendaftar', tag: 'gold', tagText: 'Hampir Penuh' },
  ];

  const actions = [
    { href: '#/admin/candidates', label: 'Kelola Kandidat', desc: 'Review berkas & biodata', color: 'sage' },
    { href: '#/admin/events', label: 'Buat Event', desc: 'Jadwalkan kegiatan taaruf', color: 'gold' },
    { href: '#/admin/pnkb', label: 'Tim PNKB', desc: 'Struktur mak comblang', color: 'blue' },
    { href: '#/admin/organization', label: 'Level Wilayah', desc: 'Daerah, Desa & Kelompok', color: 'purple' },
  ];

  const alerts = [
    { dot: 'warn', title: '12 kandidat menunggu verifikasi dokumen', desc: 'KTP dan surat keterangan perlu direview', time: '2 jam lalu' },
    { dot: 'info', title: 'Event Taaruf Akbar — 3 hari lagi', desc: '32 dari 50 kuota terisi. Jakarta Selatan', time: '5 jam lalu' },
    { dot: 'crit', title: '3 dokumen kadaluwarsa bulan ini', desc: 'Harap perbarui sebelum habis masa berlaku', time: '1 hari lalu' },
    { dot: 'info', title: 'Pergantian koordinator PNKB Jakbar', desc: 'Ust. Syafiq menggantikan Ust. Rahman', time: '2 hari lalu' },
  ];
</script>

<AdminLayout>
  <!-- Page Title & Period Filter -->
  <div class="dash-head">
    <div>
      <h1 class="dash-title">Dashboard</h1>
      <p class="dash-sub">Ringkasan data & aktivitas taaruf Zakhruf ID</p>
    </div>

    <!-- Period Filter Pills -->
    <div class="period-pills">
      <button class="pill-btn" class:active={period === 'month'} onclick={() => (period = 'month')}>Bulan Ini</button>
      <button class="pill-btn" class:active={period === 'quarter'} onclick={() => (period = 'quarter')}>Kuartal</button>
      <button class="pill-btn" class:active={period === 'year'} onclick={() => (period = 'year')}>Tahun Ini</button>
    </div>
  </div>

  <!-- 4 Stat Cards -->
  <div class="stats-grid">
    {#each currentStats as s}
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">{s.label}</span>
          <div class="stat-icon-wrap stat-{s.type}">
            {#if s.type === 'users'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {:else if s.type === 'process'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {:else if s.type === 'event'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {/if}
          </div>
        </div>
        <div class="stat-value">{s.value}</div>
        <div class="stat-delta">{s.delta}</div>
      </div>
    {/each}
  </div>

  <!-- Row 2: Chart & Upcoming Events -->
  <div class="dash-row">
    <!-- Chart Box -->
    <div class="dash-card chart-card">
      <div class="card-head">
        <div>
          <h2 class="card-title">Tren Pasangan Taaruf</h2>
          <p class="card-sub">Jumlah pasangan berhasil setiap bulan</p>
        </div>
        <span class="card-badge-sage">+24% vs 2025</span>
      </div>

      <!-- Custom SVG / CSS Bar Chart -->
      <div class="bar-chart-wrap">
        <div class="chart-bars">
          {#each chartData as item}
            <div class="chart-col">
              <div class="bar-track">
                <div class="bar-fill" style="height: {(item.value / item.max) * 100}%;">
                  <span class="bar-tooltip">{item.value} pasangan</span>
                </div>
              </div>
              <span class="bar-label">{item.month}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="dash-card">
      <div class="card-head">
        <div>
          <h2 class="card-title">Event Mendatang</h2>
          <p class="card-sub">Jadwal kegiatan taaruf terdekat</p>
        </div>
        <a href="#/admin/events" use:link class="card-link">Lihat Semua</a>
      </div>

      <div class="events-list">
        {#each events as ev}
          <div class="event-item">
            <div class="event-date-box">
              <span class="ev-day">{ev.day}</span>
              <span class="ev-month">{ev.month}</span>
            </div>
            <div class="event-info">
              <div class="ev-name">{ev.name}</div>
              <div class="ev-meta">{ev.meta}</div>
            </div>
            <span class="ev-tag ev-tag-{ev.tag}">{ev.tagText}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Row 3: Fast Actions & Activity Alerts -->
  <div class="dash-row">
    <!-- Fast Actions -->
    <div class="dash-card">
      <div class="card-head">
        <h2 class="card-title">Aksi Cepat</h2>
      </div>
      <div class="actions-grid">
        {#each actions as act}
          <a href={act.href} use:link class="action-btn act-{act.color}">
            <div class="act-title">{act.label}</div>
            <div class="act-desc">{act.desc}</div>
          </a>
        {/each}
      </div>
    </div>

    <!-- Activity & Notifications -->
    <div class="dash-card">
      <div class="card-head">
        <h2 class="card-title">Notifikasi & Aktivitas</h2>
      </div>
      <div class="alerts-list">
        {#each alerts as alt}
          <div class="alert-item">
            <span class="alert-dot dot-{alt.dot}"></span>
            <div class="alert-body">
              <div class="alert-title">{alt.title}</div>
              <div class="alert-desc">{alt.desc}</div>
            </div>
            <span class="alert-time">{alt.time}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</AdminLayout>

<style>
  .dash-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .dash-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 600;
    color: #e4e4ec;
    letter-spacing: -0.6px;
    margin: 0;
    line-height: 1.1;
  }
  .dash-sub {
    font-size: 13px;
    color: #8b8d9a;
    margin-top: 4px;
    margin-bottom: 0;
  }
  .period-pills {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
    padding: 4px;
  }
  .pill-btn {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    color: #8b8d9a;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    font-family: inherit;
  }
  .pill-btn.active {
    background: rgba(122,154,94,0.15);
    color: #8db36b;
    font-weight: 600;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .stat-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px;
    transition: all 0.25s;
  }
  .stat-card:hover {
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-2px);
  }
  .stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .stat-label {
    font-size: 12px;
    font-weight: 600;
    color: #8b8d9a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .stat-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: grid;
    place-items: center;
  }
  .stat-users { background: rgba(122,154,94,0.1); color: #7a9a5e; }
  .stat-process { background: rgba(212,160,48,0.1); color: #d4a030; }
  .stat-event { background: rgba(100,160,220,0.1); color: #64a0dc; }
  .stat-ring { background: rgba(167,139,250,0.1); color: #a78bfa; }
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #e4e4ec;
    line-height: 1;
    font-family: 'Geist', sans-serif;
  }
  .stat-delta {
    font-size: 11px;
    color: #8db36b;
    margin-top: 8px;
    font-weight: 500;
  }

  .dash-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  @media (max-width: 900px) {
    .dash-row {
      grid-template-columns: 1fr;
    }
  }
  .dash-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 24px;
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #e4e4ec;
    margin: 0;
  }
  .card-sub {
    font-size: 12px;
    color: #5a5c6a;
    margin-top: 2px;
    margin-bottom: 0;
  }
  .card-link {
    font-size: 12px;
    color: #7a9a5e;
    text-decoration: none;
    font-weight: 600;
  }
  .card-link:hover {
    color: #8db36b;
  }
  .card-badge-sage {
    font-size: 11px;
    font-weight: 600;
    color: #8db36b;
    background: rgba(122,154,94,0.1);
    padding: 4px 8px;
    border-radius: 6px;
  }

  .bar-chart-wrap {
    height: 180px;
    display: flex;
    align-items: flex-end;
    padding-top: 20px;
  }
  .chart-bars {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding-bottom: 8px;
  }
  .chart-col {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
  .bar-track {
    width: 100%;
    max-width: 36px;
    height: 100%;
    display: flex;
    align-items: flex-end;
  }
  .bar-fill {
    width: 100%;
    background: linear-gradient(180deg, #8db36b 0%, #5a7a3e 100%);
    border-radius: 6px 6px 0 0;
    position: relative;
    transition: height 0.6s cubic-bezier(0.32,0.72,0,1);
    cursor: pointer;
  }
  .bar-fill:hover {
    background: linear-gradient(180deg, #a3cb80 0%, #7a9a5e 100%);
  }
  .bar-tooltip {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1d27;
    border: 1px solid rgba(255,255,255,0.08);
    color: #e4e4ec;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }
  .bar-fill:hover .bar-tooltip {
    opacity: 1;
  }
  .bar-label {
    font-size: 11px;
    color: #5a5c6a;
    font-weight: 600;
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .event-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 10px;
  }
  .event-date-box {
    width: 44px;
    height: 44px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.1;
  }
  .ev-day { font-size: 15px; font-weight: 700; color: #8db36b; }
  .ev-month { font-size: 9px; font-weight: 600; color: #5a5c6a; text-transform: uppercase; }
  .event-info { flex: 1; min-width: 0; }
  .ev-name { font-size: 13px; font-weight: 600; color: #e4e4ec; }
  .ev-meta { font-size: 11px; color: #5a5c6a; margin-top: 2px; }
  .ev-tag { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
  .ev-tag-sage { background: rgba(122,154,94,0.12); color: #8db36b; }
  .ev-tag-gold { background: rgba(212,160,48,0.12); color: #e8b840; }

  .actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .action-btn {
    padding: 14px;
    border-radius: 10px;
    text-decoration: none;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.25s;
    display: block;
  }
  .action-btn:hover {
    background: #1a1d27;
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-2px);
  }
  .act-title { font-size: 13px; font-weight: 600; color: #e4e4ec; margin-bottom: 2px; }
  .act-desc { font-size: 11px; color: #5a5c6a; }

  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .alert-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .alert-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .alert-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
  }
  .dot-warn { background: #e8b840; }
  .dot-info { background: #64a0dc; }
  .dot-crit { background: #e05555; }
  .alert-body { flex: 1; min-width: 0; }
  .alert-title { font-size: 12px; font-weight: 600; color: #e4e4ec; }
  .alert-desc { font-size: 11px; color: #5a5c6a; margin-top: 1px; }
  .alert-time { font-size: 10px; color: #3e4050; white-space: nowrap; }
</style>