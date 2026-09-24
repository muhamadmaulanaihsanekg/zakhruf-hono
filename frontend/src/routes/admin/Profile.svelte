<script lang="ts">
  import { onMount } from 'svelte';
  import AdminLayout from '../../layouts/AdminLayout.svelte';
  import { auth } from '../../lib/auth.svelte';

  onMount(() => {
    auth.requireAdmin();
  });

  const currentUser = $derived(auth.currentUser);

  let name = $state('Admin Zakhruf');
  let email = $state('admin@zakhruf.id');

  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');

  let saveSuccess = $state(false);
  let passSuccess = $state(false);

  $effect(() => {
    if (currentUser) {
      if (currentUser.name) name = currentUser.name;
      if (currentUser.email) email = currentUser.email;
    }
  });

  function handleSaveProfile(e: Event) {
    e.preventDefault();
    saveSuccess = true;
    setTimeout(() => (saveSuccess = false), 3000);
  }

  function handleUpdatePassword(e: Event) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }
    passSuccess = true;
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    setTimeout(() => (passSuccess = false), 3000);
  }
</script>

<AdminLayout>
  <div class="page-head">
    <h1 class="page-title">Profil Admin</h1>
    <p class="page-sub">Kelola informasi akun dan kata sandi admin</p>
  </div>

  <div class="profile-container">
    <!-- 1. Profile Information -->
    <div class="card-box">
      <h2 class="card-title">Informasi Akun</h2>
      <p class="card-sub">Perbarui nama tampilan dan alamat email akun admin Anda.</p>

      <form onsubmit={handleSaveProfile}>
        <div class="form-group">
          <label class="form-label" for="profile-name">Nama</label>
          <input class="form-input" id="profile-name" type="text" bind:value={name} required />
        </div>

        <div class="form-group">
          <label class="form-label" for="profile-email">Email</label>
          <input class="form-input" id="profile-email" type="email" bind:value={email} required />
        </div>

        <div class="form-foot">
          <button type="submit" class="btn-save">Simpan Perubahan</button>
          {#if saveSuccess}
            <span class="save-msg">✓ Profil berhasil diperbarui.</span>
          {/if}
        </div>
      </form>
    </div>

    <!-- 2. Update Password -->
    <div class="card-box">
      <h2 class="card-title">Perbarui Password</h2>
      <p class="card-sub">Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.</p>

      <form onsubmit={handleUpdatePassword}>
        <div class="form-group">
          <label class="form-label" for="profile-current-password">Password Saat Ini</label>
          <input class="form-input" id="profile-current-password" type="password" bind:value={currentPassword} required />
        </div>

        <div class="form-group">
          <label class="form-label" for="profile-new-password">Password Baru</label>
          <input class="form-input" id="profile-new-password" type="password" bind:value={newPassword} required />
        </div>

        <div class="form-group">
          <label class="form-label" for="profile-confirm-password">Konfirmasi Password Baru</label>
          <input class="form-input" id="profile-confirm-password" type="password" bind:value={confirmPassword} required />
        </div>

        <div class="form-foot">
          <button type="submit" class="btn-save">Ubah Password</button>
          {#if passSuccess}
            <span class="save-msg">✓ Password berhasil diubah.</span>
          {/if}
        </div>
      </form>
    </div>
  </div>
</AdminLayout>

<style>
  .page-head {
    margin-bottom: 28px;
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

  .profile-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 600px;
  }

  .card-box {
    background: #0d0f15;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 24px;
  }
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #e4e4ec;
    margin: 0 0 4px;
  }
  .card-sub {
    font-size: 12px;
    color: #5a5c6a;
    margin: 0 0 20px;
  }

  .form-group {
    margin-bottom: 16px;
  }
  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #8b8d9a;
    margin-bottom: 6px;
  }
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
    transition: border-color 0.2s;
  }
  .form-input:focus {
    border-color: rgba(122,154,94,0.4);
  }

  .form-foot {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
  }
  .btn-save {
    padding: 10px 20px;
    border-radius: 8px;
    background: #7a9a5e;
    color: #0a0d06;
    font-weight: 600;
    font-size: 13px;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
  }
  .btn-save:hover {
    background: #8db36b;
  }
  .save-msg {
    font-size: 12px;
    color: #8db36b;
    font-weight: 500;
  }
</style>