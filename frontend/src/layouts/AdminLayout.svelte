<script lang="ts">
  import type { Snippet } from 'svelte';
  import { link, location } from 'svelte-spa-router';
  import { auth } from '../lib/auth.svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let sidebarOpen = $state(false);
  let candidateOpen = $state(false);
  let headerSearch = $state('');

  const currentPath = $derived($location);

  const isDashboard = $derived(currentPath === '/admin' || currentPath === '/admin/dashboard');
  const isCandidateRoute = $derived(currentPath.startsWith('/admin/candidates'));
  const isEventRoute = $derived(currentPath.startsWith('/admin/events'));
  const isOrgRoute = $derived(currentPath.startsWith('/admin/organization'));
  const isPnkbRoute = $derived(currentPath.startsWith('/admin/pnkb'));

  const user = $derived(auth.user || { name: 'Admin Zakhruf', role: 'admin' });

  function initials(name: string): string {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function handleLogout() {
    auth.logout();
    window.location.hash = '#/admin/login';
  }
</script>

<div class="admin-shell">
  <!-- Sidebar Desktop & Drawer Mobile -->
  <aside class="admin-sidebar" class:open={sidebarOpen}>
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="brand-logo-icon">
        <span>Z</span>
      </div>
      <div class="brand-text">
        <div class="brand-name">Zakhruf ID</div>
        <div class="brand-sub">LDII DKI Jakarta</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <div class="nav-section-title">Menu Utama</div>

      <a href="#/admin/dashboard" use:link class="nav-link" class:active={isDashboard}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        <span>Dashboard</span>
      </a>

      <!-- Kandidat Parent -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="nav-link nav-parent"
        class:active={isCandidateRoute}
        onclick={() => (candidateOpen = !candidateOpen)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>Kandidat</span>
        <span class="badge-gold">6</span>
        <svg class="chevron" class:rotated={candidateOpen} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <!-- Kandidat Sub-menu -->
      <div class="submenu" class:expanded={candidateOpen || isCandidateRoute}>
        <a href="#/admin/candidates?type=mandiri" use:link class="submenu-link">
          <span>Mandiri</span>
          <span class="badge-gold">4</span>
        </a>
        <a href="#/admin/candidates?type=pashmina" use:link class="submenu-link">
          <span>Pashmina</span>
          <span class="badge-gold">2</span>
        </a>
        <a href="#/admin/candidates" use:link class="submenu-link">
          <span>Semua Kandidat</span>
        </a>
      </div>

      <a href="#/admin/events" use:link class="nav-link" class:active={isEventRoute}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Event Taaruf</span>
        <span class="badge-sage">3</span>
      </a>

      <div class="nav-section-title">Pengelolaan</div>

      <a href="#/admin/organization" use:link class="nav-link" class:active={isOrgRoute}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        <span>Level Organisasi</span>
      </a>

      <a href="#/admin/pnkb" use:link class="nav-link" class:active={isPnkbRoute}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>Tim PNKB</span>
      </a>
    </nav>

    <!-- Sidebar Footer User Profile -->
    <div class="sidebar-footer">
      <div class="user-chip">
        <div class="user-avatar">
          {initials(user.name)}
        </div>
        <div class="user-info">
          <div class="user-name">{user.name}</div>
          <div class="user-role">Administrator</div>
        </div>
        <button onclick={handleLogout} title="Keluar" class="btn-logout-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  {#if sidebarOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="sidebar-overlay" onclick={() => (sidebarOpen = false)}></div>
  {/if}

  <!-- Main Content Wrapper -->
  <div class="admin-main">
    <!-- Header -->
    <header class="admin-header">
      <!-- Mobile toggle -->
      <button class="mobile-toggle" aria-label="Buka Menu Navigasi" onclick={() => (sidebarOpen = !sidebarOpen)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <!-- Search -->
      <div class="header-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a5c6a" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          bind:value={headerSearch}
          placeholder="Cari kandidat, event, atau wilayah..."
        />
      </div>

      <!-- Right Header Actions -->
      <div class="header-actions">
        <button class="header-btn" aria-label="Notifikasi">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="notif-dot"></span>
        </button>
        <a href="#/admin/profile" use:link class="header-btn" aria-label="Profil Admin" title="Profil Admin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </a>
        <a href="#/login" use:link class="header-btn" title="Beralih ke View Peserta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <button onclick={handleLogout} title="Keluar" class="header-btn btn-logout-danger">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </header>

    <!-- Page Content Area -->
    <main class="admin-content">
      {#if children}
        {@render children()}
      {/if}
    </main>
  </div>
</div>

<style>
  .admin-shell {
    display: flex;
    min-height: 100vh;
    background: #07090d;
    font-family: 'Geist', sans-serif;
    color: #e4e4ec;
  }
  .admin-sidebar {
    width: 232px;
    min-height: 100vh;
    background: #0d0f15;
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
    transition: transform 0.35s cubic-bezier(0.32,0.72,0,1);
  }
  @media (max-width: 1023px) {
    .admin-sidebar {
      transform: translateX(-100%);
    }
    .admin-sidebar.open {
      transform: translateX(0);
    }
  }
  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 18px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .brand-logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #7a9a5e 0%, #5a7a3e 100%);
    display: grid;
    place-items: center;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    font-size: 20px;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .brand-text {
    line-height: 1.25;
  }
  .brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 700;
    color: #e4e4ec;
    letter-spacing: -0.3px;
  }
  .brand-sub {
    font-size: 10px;
    font-weight: 600;
    color: #5a5c6a;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .sidebar-nav {
    flex: 1;
    padding: 8px 12px;
    overflow-y: auto;
  }
  .nav-section-title {
    font-size: 10px;
    font-weight: 700;
    color: #3e4050;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    padding: 18px 10px 6px;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    color: #8b8d9a;
    margin-bottom: 2px;
    transition: all 0.25s cubic-bezier(0.32,0.72,0,1);
    cursor: pointer;
  }
  .nav-link:hover {
    background: #1a1d27;
    color: #e4e4ec;
  }
  .nav-link.active {
    background: rgba(122,154,94,0.10);
    color: #8db36b;
    font-weight: 600;
  }
  .nav-parent {
    justify-content: flex-start;
  }
  .badge-gold {
    margin-left: auto;
    padding: 2px 7px;
    background: rgba(212,160,48,0.10);
    color: #e8b840;
    font-size: 10px;
    font-weight: 700;
    border-radius: 5px;
  }
  .badge-sage {
    margin-left: auto;
    padding: 2px 7px;
    background: rgba(122,154,94,0.10);
    color: #8db36b;
    font-size: 10px;
    font-weight: 700;
    border-radius: 5px;
  }
  .chevron {
    transition: transform 0.25s cubic-bezier(0.32,0.72,0,1);
    margin-left: -2px;
  }
  .chevron.rotated {
    transform: rotate(90deg);
  }
  .submenu {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.32,0.72,0,1);
  }
  .submenu.expanded {
    max-height: 140px;
  }
  .submenu-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px 8px 40px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #8b8d9a;
    text-decoration: none;
    margin-bottom: 1px;
    transition: all 0.25s;
  }
  .submenu-link:hover {
    background: #1a1d27;
    color: #e4e4ec;
  }
  .sidebar-footer {
    padding: 14px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #7a9a5e, #4a5c3a);
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .user-info {
    flex: 1;
    min-width: 0;
  }
  .user-name {
    font-size: 12px;
    font-weight: 600;
    color: #e4e4ec;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user-role {
    font-size: 10px;
    color: #5a5c6a;
  }
  .btn-logout-small {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: rgba(224,85,85,0.08);
    border: 1px solid rgba(224,85,85,0.12);
    color: #e05555;
    cursor: pointer;
    transition: all 0.25s;
  }
  .btn-logout-small:hover {
    background: rgba(224,85,85,0.16);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 45;
  }

  .admin-main {
    flex: 1;
    margin-left: 232px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  @media (max-width: 1023px) {
    .admin-main {
      margin-left: 0;
    }
  }
  .admin-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 32px;
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(7,9,13,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  @media (max-width: 768px) {
    .admin-header {
      padding: 12px 16px;
    }
  }
  .mobile-toggle {
    display: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    color: #8b8d9a;
    place-items: center;
  }
  @media (max-width: 1023px) {
    .mobile-toggle {
      display: grid;
    }
  }
  .header-search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
    min-width: 320px;
    transition: all 0.35s cubic-bezier(0.32,0.72,0,1);
  }
  @media (max-width: 768px) {
    .header-search {
      display: none;
    }
  }
  .header-search:focus-within {
    border-color: rgba(122,154,94,0.25);
    box-shadow: 0 0 0 3px rgba(122,154,94,0.1);
  }
  .header-search input {
    border: none;
    background: none;
    outline: none;
    font-size: 13px;
    color: #e4e4ec;
    width: 100%;
    font-family: inherit;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }
  .header-btn {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    cursor: pointer;
    position: relative;
    background: #13151c;
    border: 1px solid rgba(255,255,255,0.06);
    color: #8b8d9a;
    text-decoration: none;
    transition: all 0.25s;
  }
  .header-btn:hover {
    background: #1a1d27;
    color: #e4e4ec;
  }
  .notif-dot {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 6px;
    height: 6px;
    background: #e8b840;
    border-radius: 50%;
    border: 2px solid #0d0f15;
  }
  .btn-logout-danger {
    background: rgba(224,85,85,0.08);
    border-color: rgba(224,85,85,0.15);
    color: #e05555;
  }
  .btn-logout-danger:hover {
    background: rgba(224,85,85,0.18);
  }
  .admin-content {
    flex: 1;
    padding: 24px 32px 48px;
  }
  @media (max-width: 768px) {
    .admin-content {
      padding: 16px;
    }
  }
</style>