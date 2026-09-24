<script lang="ts">
  import { onMount } from 'svelte';
  import AdminLayout from '../../layouts/AdminLayout.svelte';
  import { daerahs } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';

  onMount(() => {
    auth.requireAdmin();
  });

  interface OrgItem {
    id: number;
    name: string;
    type: 'daerah' | 'desa' | 'kelompok';
    parent_name?: string;
    children?: OrgItem[];
  }

  // Flattened & structured tree
  let search = $state('');
  let expanded = $state<Set<number>>(new Set([1, 101, 102, 103, 104]));

  const typeLabels = { daerah: 'Daerah', desa: 'Desa', kelompok: 'Kelompok' };
  const typeColors = {
    daerah: { bg: 'rgba(122,154,94,0.10)', color: '#8db36b' },
    desa: { bg: 'rgba(212,160,48,0.10)', color: '#e8b840' },
    kelompok: { bg: 'rgba(139,141,154,0.10)', color: '#8b8d9a' },
  };

  // Convert raw mock data to standard OrgItems
  const rawOrgData: OrgItem[] = [
    {
      id: 1,
      name: 'DKI Jakarta',
      type: 'daerah',
      children: [
        {
          id: 101,
          name: 'Jakarta Selatan',
          type: 'desa',
          parent_name: 'DKI Jakarta',
          children: [
            { id: 1001, name: 'Tebet', type: 'kelompok', parent_name: 'Jakarta Selatan' },
            { id: 1002, name: 'Kebayoran Baru', type: 'kelompok', parent_name: 'Jakarta Selatan' },
            { id: 1003, name: 'Pasar Minggu', type: 'kelompok', parent_name: 'Jakarta Selatan' },
          ],
        },
        {
          id: 102,
          name: 'Jakarta Barat',
          type: 'desa',
          parent_name: 'DKI Jakarta',
          children: [
            { id: 1004, name: 'Kalideres', type: 'kelompok', parent_name: 'Jakarta Barat' },
            { id: 1005, name: 'Kebon Jeruk', type: 'kelompok', parent_name: 'Jakarta Barat' },
          ],
        },
        {
          id: 103,
          name: 'Jakarta Timur',
          type: 'desa',
          parent_name: 'DKI Jakarta',
          children: [
            { id: 1006, name: 'Duren Sawit', type: 'kelompok', parent_name: 'Jakarta Timur' },
            { id: 1007, name: 'Jatinegara', type: 'kelompok', parent_name: 'Jakarta Timur' },
          ],
        },
        {
          id: 104,
          name: 'Jakarta Pusat',
          type: 'desa',
          parent_name: 'DKI Jakarta',
          children: [
            { id: 1008, name: 'Cempaka Putih', type: 'kelompok', parent_name: 'Jakarta Pusat' },
            { id: 1009, name: 'Menteng', type: 'kelompok', parent_name: 'Jakarta Pusat' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Jawa Barat',
      type: 'daerah',
      children: [
        {
          id: 201,
          name: 'Kota Bandung',
          type: 'desa',
          parent_name: 'Jawa Barat',
          children: [
            { id: 2001, name: 'Coblong', type: 'kelompok', parent_name: 'Kota Bandung' },
            { id: 2002, name: 'Cicendo', type: 'kelompok', parent_name: 'Kota Bandung' },
          ],
        },
      ],
    },
  ];

  // Flattened for search
  function flatten(items: OrgItem[]): OrgItem[] {
    const res: OrgItem[] = [];
    for (const item of items) {
      res.push(item);
      if (item.children) res.push(...flatten(item.children));
    }
    return res;
  }

  const flatList = $derived(flatten(rawOrgData));

  const isSearching = $derived(search.trim().length > 0);

  const searchResults = $derived(
    flatList.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  );

  function toggle(id: number) {
    if (expanded.has(id)) {
      expanded.delete(id);
    } else {
      expanded.add(id);
    }
    expanded = new Set(expanded);
  }

  function expandAll() {
    expanded = new Set([1, 2, 101, 102, 103, 104, 201]);
  }

  function collapseAll() {
    expanded = new Set();
  }
</script>

<AdminLayout>
  <!-- Page Header -->
  <div class="page-head">
    <div>
      <h1 class="page-title">Level Organisasi</h1>
      <p class="page-sub">Struktur hierarki wilayah: Daerah, Desa, dan Kelompok</p>
    </div>

    <div class="actions-row">
      <button class="pill-btn" onclick={expandAll}>Buka Semua</button>
      <button class="pill-btn" onclick={collapseAll}>Tutup Semua</button>
      <button class="btn-create" onclick={() => alert('Fitur tambah level dalam pengembangan.')}>
        <span>Tambah</span>
        <span class="plus-icon">+</span>
      </button>
    </div>
  </div>

  <!-- Search Filter -->
  <div class="search-bar">
    <div class="search-wrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a5c6a" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" bind:value={search} placeholder="Cari nama daerah, desa, atau kelompok..." />
    </div>
  </div>

  <!-- Content Tree / Flat List -->
  <div class="tree-card">
    {#if isSearching}
      <!-- Search Results Flat View -->
      <div class="flat-list">
        {#if searchResults.length === 0}
          <div class="empty-state">Tidak ada hasil ditemukan untuk "{search}".</div>
        {:else}
          {#each searchResults as item}
            <div class="tree-row">
              <div class="type-icon type-{item.type}">
                {#if item.type === 'daerah'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {:else if item.type === 'desa'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                {:else}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {/if}
              </div>
              <div class="item-info">
                <div class="item-name">{item.name}</div>
                <div class="item-parent">{item.parent_name ? `${item.parent_name} / ` : ''}{typeLabels[item.type]}</div>
              </div>
              <span class="type-badge badge-{item.type}">{typeLabels[item.type]}</span>
            </div>
          {/each}
        {/if}
      </div>
    {:else}
      <!-- Hierarchical Tree View -->
      <div class="tree-view">
        {#each rawOrgData as daerah}
          <div class="tree-node">
            <!-- Daerah Row -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="node-row level-daerah" onclick={() => toggle(daerah.id)}>
              <span class="chevron" class:rotated={expanded.has(daerah.id)}>▶</span>
              <div class="type-icon type-daerah">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <span class="node-name">{daerah.name}</span>
              <span class="node-count">{daerah.children?.length || 0} Desa</span>
              <span class="type-badge badge-daerah">Daerah</span>
            </div>

            <!-- Desa Children -->
            {#if expanded.has(daerah.id) && daerah.children}
              <div class="child-group">
                {#each daerah.children as desa}
                  <div class="tree-node">
                    <!-- Desa Row -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="node-row level-desa" onclick={() => toggle(desa.id)}>
                      <span class="chevron" class:rotated={expanded.has(desa.id)}>▶</span>
                      <div class="type-icon type-desa">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      </div>
                      <span class="node-name">{desa.name}</span>
                      <span class="node-count">{desa.children?.length || 0} Kelompok</span>
                      <span class="type-badge badge-desa">Desa</span>
                    </div>

                    <!-- Kelompok Children -->
                    {#if expanded.has(desa.id) && desa.children}
                      <div class="child-group">
                        {#each desa.children as kelompok}
                          <div class="node-row level-kelompok">
                            <span class="bullet">•</span>
                            <div class="type-icon type-kelompok">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            </div>
                            <span class="node-name">{kelompok.name}</span>
                            <span class="type-badge badge-kelompok">Kelompok</span>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
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
  .actions-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pill-btn {
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: #8b8d9a;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    transition: all 0.25s;
    font-family: inherit;
  }
  .pill-btn:hover {
    color: #e4e4ec;
    border-color: rgba(255,255,255,0.12);
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

  .search-bar {
    margin-bottom: 20px;
  }
  .search-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    max-width: 400px;
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

  .tree-card {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
  }
  .empty-state {
    padding: 48px;
    text-align: center;
    color: #5a5c6a;
    font-size: 13px;
  }

  .tree-row, .node-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: all 0.2s;
    cursor: pointer;
  }
  .tree-row:hover, .node-row:hover {
    background: rgba(255,255,255,0.02);
  }
  .chevron {
    font-size: 9px;
    color: #5a5c6a;
    transition: transform 0.2s;
    display: inline-block;
  }
  .chevron.rotated {
    transform: rotate(90deg);
  }
  .bullet {
    color: #5a5c6a;
    font-size: 14px;
    padding-left: 2px;
  }

  .type-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .type-daerah { background: rgba(122,154,94,0.12); color: #8db36b; }
  .type-desa { background: rgba(212,160,48,0.12); color: #e8b840; }
  .type-kelompok { background: rgba(139,141,154,0.12); color: #8b8d9a; }

  .node-name, .item-name {
    font-size: 13px;
    font-weight: 600;
    color: #e4e4ec;
  }
  .node-count, .item-parent {
    font-size: 11px;
    color: #5a5c6a;
    margin-left: auto;
  }
  .child-group {
    padding-left: 28px;
    background: rgba(0,0,0,0.15);
    border-left: 1px dashed rgba(255,255,255,0.06);
  }

  .type-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    margin-left: 8px;
  }
  .badge-daerah { background: rgba(122,154,94,0.12); color: #8db36b; }
  .badge-desa { background: rgba(212,160,48,0.12); color: #e8b840; }
  .badge-kelompok { background: rgba(139,141,154,0.12); color: #8b8d9a; }
</style>