<script lang="ts">
  import { onMount } from 'svelte';
  import AdminLayout from '../../layouts/AdminLayout.svelte';
  import { auth } from '../../lib/auth.svelte';

  onMount(() => {
    auth.requireAdmin();
  });

  interface PnkbMember {
    id: number;
    nama: string;
    no_hp: string;
    daerah: string;
    desa: string;
    kelompok: string;
    jabatan: 'ibu_gambuh' | 'pnkb_daerah' | 'pnkb_desa' | 'pnkb_kelompok';
  }

  const jabatanList = {
    ibu_gambuh: 'Ibu Gambuh',
    pnkb_daerah: 'PNKB Daerah',
    pnkb_desa: 'PNKB Desa',
    pnkb_kelompok: 'PNKB Kelompok',
  };

  const jabatanColors = {
    ibu_gambuh: { bg: 'rgba(212,160,48,0.10)', color: '#e8b840' },
    pnkb_daerah: { bg: 'rgba(122,154,94,0.10)', color: '#8db36b' },
    pnkb_desa: { bg: 'rgba(139,141,154,0.10)', color: '#8b8d9a' },
    pnkb_kelompok: { bg: 'rgba(139,141,154,0.10)', color: '#8b8d9a' },
  };

  const members: PnkbMember[] = [
    { id: 1, nama: 'Hj. Siti Rahmah', no_hp: '081234567890', daerah: 'DKI Jakarta', desa: 'Jakarta Selatan', kelompok: 'Tebet', jabatan: 'ibu_gambuh' },
    { id: 2, nama: 'Ust. Ahmad Fauzi', no_hp: '081298765432', daerah: 'DKI Jakarta', desa: 'Jakarta Selatan', kelompok: 'Kebayoran Baru', jabatan: 'pnkb_daerah' },
    { id: 3, nama: 'Ust. M. Ridwan', no_hp: '081311223344', daerah: 'DKI Jakarta', desa: 'Jakarta Barat', kelompok: 'Kalideres', jabatan: 'pnkb_desa' },
    { id: 4, nama: 'H. Bambang Sugiarto', no_hp: '081399887766', daerah: 'DKI Jakarta', desa: 'Jakarta Timur', kelompok: 'Duren Sawit', jabatan: 'pnkb_kelompok' },
    { id: 5, nama: 'Hj. Nur Aini', no_hp: '081255443322', daerah: 'DKI Jakarta', desa: 'Jakarta Pusat', kelompok: 'Menteng', jabatan: 'ibu_gambuh' },
  ];

  let search = $state('');
  let jabatanFilter = $state<string>('');
  let viewMode = $state<'table' | 'card'>('table');

  const filteredMembers = $derived(
    members.filter((m) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          m.nama.toLowerCase().includes(q) ||
          m.no_hp.toLowerCase().includes(q) ||
          m.daerah.toLowerCase().includes(q) ||
          m.desa.toLowerCase().includes(q) ||
          m.kelompok.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (jabatanFilter && m.jabatan !== jabatanFilter) return false;
      return true;
    })
  );
</script>

<AdminLayout>
  <!-- Page Header -->
  <div class="page-head">
    <div>
      <h1 class="page-title">Tim PNKB</h1>
      <p class="page-sub">Daftar anggota tim perantara taaruf & mak comblang (PNKB)</p>
    </div>

    <div>
      <button class="btn-create" onclick={() => alert('Fitur tambah anggota PNKB dalam pengembangan.')}>
        <span>Tambah</span>
        <span class="plus-icon">+</span>
      </button>
    </div>
  </div>

  <!-- Filters Bar -->
  <div class="filter-bar">
    <div class="search-wrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a5c6a" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" bind:value={search} placeholder="Cari nama, no HP, wilayah..." />
    </div>

    <!-- Dapukan Filter Buttons -->
    <div class="dapukan-pills">
      <button class="pill-btn" class:active={jabatanFilter === ''} onclick={() => (jabatanFilter = '')}>Semua</button>
      {#each Object.entries(jabatanList) as [key, label]}
        <button class="pill-btn" class:active={jabatanFilter === key} onclick={() => (jabatanFilter = key)}>{label}</button>
      {/each}
    </div>

    <!-- View Mode Switcher -->
    <div class="view-switch">
      <button class="switch-btn" class:active={viewMode === 'table'} onclick={() => (viewMode = 'table')} title="Tabel">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </button>
      <button class="switch-btn" class:active={viewMode === 'card'} onclick={() => (viewMode = 'card')} title="Kartu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      </button>
    </div>
  </div>

  <!-- Table View -->
  {#if viewMode === 'table'}
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nama Anggota</th>
            <th>No HP</th>
            <th>Daerah</th>
            <th>Desa</th>
            <th>Kelompok</th>
            <th>Dapukan</th>
            <th class="th-action">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#if filteredMembers.length === 0}
            <tr>
              <td colspan="7" class="empty-cell">Belum ada data anggota tim PNKB yang sesuai.</td>
            </tr>
          {:else}
            {#each filteredMembers as m}
              <tr>
                <td class="cell-name">{m.nama}</td>
                <td class="cell-phone">{m.no_hp}</td>
                <td>{m.daerah}</td>
                <td>{m.desa}</td>
                <td>{m.kelompok}</td>
                <td>
                  <span class="dapukan-badge" style="background: {jabatanColors[m.jabatan].bg}; color: {jabatanColors[m.jabatan].color};">
                    {jabatanList[m.jabatan]}
                  </span>
                </td>
                <td class="td-action">
                  <button class="btn-action-sm" onclick={() => alert(`Edit ${m.nama}`)}>Edit</button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  {:else}
    <!-- Card View -->
    <div class="cards-grid">
      {#each filteredMembers as m}
        <div class="pnkb-card">
          <div class="card-top">
            <div class="card-avatar">{m.nama.charAt(0)}</div>
            <div>
              <div class="card-title">{m.nama}</div>
              <div class="card-phone">{m.no_hp}</div>
            </div>
            <span class="dapukan-badge" style="margin-left: auto; background: {jabatanColors[m.jabatan].bg}; color: {jabatanColors[m.jabatan].color};">
              {jabatanList[m.jabatan]}
            </span>
          </div>

          <div class="card-meta-list">
            <div class="meta-row">
              <span class="meta-k">Daerah:</span>
              <span class="meta-v">{m.daerah}</span>
            </div>
            <div class="meta-row">
              <span class="meta-k">Desa:</span>
              <span class="meta-v">{m.desa}</span>
            </div>
            <div class="meta-row">
              <span class="meta-k">Kelompok:</span>
              <span class="meta-v">{m.kelompok}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</AdminLayout>

<style>
  .page-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 600;
    color: #e4e4ec;
    letter-spacing: -0.6px;
    margin: 0;
    line-height: 1.05;
  }
  .page-sub {
    font-size: 13px;
    color: #8b8d9a;
    margin-top: 4px;
    margin-bottom: 0;
  }
  .btn-create {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    background: #7a9a5e;
    color: #0a0d06;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: all 0.35s;
  }
  .btn-create:hover {
    background: #8db36b;
    transform: scale(1.02);
  }
  .plus-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0,0,0,0.15);
    display: grid;
    place-items: center;
    font-size: 13px;
  }

  .filter-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .search-wrap {
    flex: 1;
    min-width: 240px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
  }
  .search-wrap input {
    border: none;
    background: none;
    outline: none;
    color: #e4e4ec;
    font-size: 13px;
    width: 100%;
    font-family: inherit;
  }
  .dapukan-pills {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 4px;
    overflow-x: auto;
  }
  .pill-btn {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #8b8d9a;
    background: transparent;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    font-family: inherit;
  }
  .pill-btn.active {
    background: #1a1d27;
    color: #8db36b;
  }

  .view-switch {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 3px;
  }
  .switch-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    background: transparent;
    border: none;
    color: #8b8d9a;
    cursor: pointer;
  }
  .switch-btn.active {
    background: #1a1d27;
    color: #e4e4ec;
  }

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
    font-size: 11px;
    font-weight: 600;
    color: #5a5c6a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .data-table td {
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: #8b8d9a;
  }
  .cell-name { font-weight: 600; color: #e4e4ec; }
  .cell-phone { color: #8db36b; }
  .dapukan-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    display: inline-block;
  }
  .empty-cell {
    padding: 48px;
    text-align: center;
    color: #5a5c6a;
  }
  .btn-action-sm {
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #e4e4ec;
    font-size: 11px;
    cursor: pointer;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .pnkb-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 18px;
    transition: all 0.25s;
  }
  .pnkb-card:hover {
    border-color: rgba(122,154,94,0.3);
    transform: translateY(-2px);
  }
  .card-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .card-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #1a1d27;
    color: #8db36b;
    font-weight: 700;
    display: grid;
    place-items: center;
    font-size: 15px;
  }
  .card-title { font-size: 14px; font-weight: 600; color: #e4e4ec; }
  .card-phone { font-size: 11px; color: #8db36b; margin-top: 1px; }
  .card-meta-list {
    background: rgba(255,255,255,0.02);
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
  }
  .meta-k { color: #5a5c6a; }
  .meta-v { color: #e4e4ec; font-weight: 500; }
</style>