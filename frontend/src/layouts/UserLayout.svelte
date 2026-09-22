<script lang="ts">
  import { link, location } from 'svelte-spa-router';
  import type { Snippet } from 'svelte';
  import FloatingEventBadge from '../components/FloatingEventBadge.svelte';
  import Modal from '../components/Modal.svelte';
  import { mockEvents } from '../lib/mockData';
  import { auth } from '../lib/auth.svelte';
  import {
    IconFlame,
    IconBookmark,
    IconMailHeart,
    IconUser,
    IconCalendarEvent,
    IconLogout,
  } from '@tabler/icons-svelte';

  interface Props {
    ajakCount?: number;
    children?: Snippet;
  }

  let { ajakCount = 2, children }: Props = $props();

  let showLogoutModal = $state(false);
  let currentPath = $derived($location);

  function isActive(path: string): boolean {
    if (path === '/' && (currentPath === '/' || currentPath === '/swap')) return true;
    return currentPath === path;
  }

  // Auth Guard
  $effect(() => {
    if (!auth.requireAuth()) return;
  });

  function handleLogout() {
    auth.logout();
    showLogoutModal = false;
    window.location.hash = '#/login';
  }
</script>

<div class="min-h-screen bg-[#07090d] flex flex-col pb-[72px] text-[#e4e4ec] font-['Geist',sans-serif]">
  <!-- Top Bar -->
  <header class="sticky top-0 z-20 bg-[#0d0f15]/95 backdrop-blur-md border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <a href="/" use:link class="flex items-center gap-2 text-decoration-none">
        <span class="font-['Cormorant_Garamond',serif] font-bold text-xl text-[#7a9a5e] tracking-tight">
          Zakhruf ID
        </span>
      </a>
      {#if auth.user}
        <span class="text-[10px] px-2 py-0.5 rounded-full font-bold {auth.user.gender === 'female' ? 'bg-[#c878b4]/15 text-[#c878b4] border border-[#c878b4]/30' : 'bg-[#64a0dc]/15 text-[#64a0dc] border border-[#64a0dc]/30'}">
          {auth.user.gender === 'female' ? 'Akhwat' : 'Ikhwan'}
        </span>
      {/if}
    </div>

    <div class="flex items-center gap-2">
      <a
        href="/events"
        use:link
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#8b8d9a] hover:text-[#e4e4ec] transition-colors no-underline"
      >
        <IconCalendarEvent size={14} class="text-[#e8b840]" />
        <span>Event</span>
      </a>

      {#if auth.user}
        <button
          type="button"
          onclick={() => (showLogoutModal = true)}
          class="p-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#8b8d9a] hover:text-[#e05555] transition-colors cursor-pointer"
          title="Keluar"
        >
          <IconLogout size={14} />
        </button>
      {/if}
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-[480px] w-full mx-auto p-4">
    {@render children?.()}
  </main>

  <!-- Bottom Navigation -->
  <nav class="zk-bottom-nav">
    <a
      href="/"
      use:link
      class="flex flex-col items-center gap-0.5 text-[10px] px-3 py-1 rounded-full transition-all {isActive('/')
        ? 'text-[#7a9a5e] bg-[#7a9a5e]/15 font-bold'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      <IconFlame size={22} />
      <span>Cari</span>
    </a>

    <a
      href="/ajakanku"
      use:link
      class="relative flex flex-col items-center gap-0.5 text-[10px] px-3 py-1 rounded-full transition-all {isActive('/ajakanku')
        ? 'text-[#7a9a5e] bg-[#7a9a5e]/15 font-bold'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      <IconMailHeart size={22} />
      <span>Ajakanku</span>
      {#if ajakCount > 0}
        <span class="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#7a9a5e] text-[#0a0d06] text-[9px] font-bold flex items-center justify-center">
          {ajakCount}
        </span>
      {/if}
    </a>

    <a
      href="/profile"
      use:link
      class="flex flex-col items-center gap-0.5 text-[10px] px-3 py-1 rounded-full transition-all {isActive('/profile')
        ? 'text-[#7a9a5e] bg-[#7a9a5e]/15 font-bold'
        : 'text-[#8b8d9a] hover:text-[#e4e4ec]'}"
    >
      <IconUser size={22} />
      <span>Profil</span>
    </a>
  </nav>

  <!-- Floating Event Badge -->
  <FloatingEventBadge events={mockEvents} />

  <!-- Logout Confirmation Modal -->
  <Modal show={showLogoutModal} onclose={() => (showLogoutModal = false)} maxWidth="sm">
    <div class="p-6 text-center">
      <div class="w-12 h-12 rounded-full flex items-center justify-center bg-[#e05555]/10 border border-[#e05555]/20 text-[#e05555] mx-auto mb-3">
        <IconLogout size={24} />
      </div>
      <h3 class="text-base font-bold text-[#e4e4ec]">Keluar dari Akun?</h3>
      <p class="text-xs text-[#8b8d9a] mt-1.5 leading-relaxed">
        Kamu harus login kembali untuk mengakses data taaruf dan jadwal kegiatan.
      </p>
      <div class="flex gap-2.5 mt-5">
        <button
          type="button"
          onclick={() => (showLogoutModal = false)}
          class="flex-1 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[#e4e4ec] text-xs font-semibold cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={handleLogout}
          class="flex-1 py-2.5 rounded-full bg-[#e05555] text-white text-xs font-bold cursor-pointer hover:bg-[#c94444]"
        >
          Ya, Keluar
        </button>
      </div>
    </div>
  </Modal>
</div>
