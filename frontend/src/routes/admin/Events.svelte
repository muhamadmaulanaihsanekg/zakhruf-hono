<script lang="ts">
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import AdminLayout from '../../layouts/AdminLayout.svelte';
  import { mockEvents, type EventItem } from '../../lib/mockData';
  import { auth } from '../../lib/auth.svelte';

  onMount(() => {
    auth.requireAdmin();
  });

  let eventsList = $state<EventItem[]>([...mockEvents]);
  let copiedId = $state<number | null>(null);
  let showCreateModal = $state(false);

  // New Event Form State
  let newNama = $state('');
  let newDeskripsi = $state('');
  let newStatus = $state<'open' | 'closed' | 'configurable'>('open');
  let newCategories = $state<string[]>(['mandiri', 'pashmina']);
  let newLokasi = $state('Masjid Al-Ikhlas, Jakarta Selatan');
  let newDate = $state('2026-08-14');
  let newStartTime = $state('08:00');
  let newEndTime = $state('16:00');

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string }> = {
      open: { label: 'Buka', bg: 'rgba(122,154,94,0.12)', color: '#8db36b' },
      closed: { label: 'Tutup', bg: 'rgba(224,85,85,0.1)', color: '#e05555' },
      configurable: { label: 'Configurable', bg: 'rgba(212,160,48,0.12)', color: '#e8b840' },
    };
    return map[status] || map.open;
  };

  const catLabel: Record<string, string> = { mandiri: 'Mandiri', pashmina: 'Pashmina' };

  async function copyRegLink(ev: EventItem) {
    const url = `${window.location.origin}/#/events/${ev.slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copiedId = ev.id;
    setTimeout(() => {
      if (copiedId === ev.id) copiedId = null;
    }, 2000);
  }

  function destroy(id: number, name: string) {
    if (confirm(`Hapus event "${name}"?`)) {
      eventsList = eventsList.filter((e) => e.id !== id);
    }
  }

  function handleCreateEvent(e: Event) {
    e.preventDefault();
    if (!newNama.trim()) return;

    const slug = newNama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newEv: EventItem = {
      id: Date.now(),
      slug: slug || `event-${Date.now()}`,
      nama_kegiatan: newNama,
      deskripsi: newDeskripsi,
      registration_status: newStatus,
      candidates_count: 0,
      lokasi: newLokasi,
      dates: [
        {
          id: Date.now(),
          date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
          is_all_day: false,
          location: { id: 1, name: newLokasi },
        },
      ],
    };

    eventsList = [newEv, ...eventsList];
    showCreateModal = false;
    newNama = '';
    newDeskripsi = '';
  }

  function formatTime(t?: string) {
    return t ? t.substring(0, 5) : null;
  }
</script>

<AdminLayout>
  <!-- Page Header matching zakhruf-id -->
  <div class="events-header">
    <h1 class="events-title">Events</h1>
    <p class="events-sub">Daftar kegiatan taaruf</p>
    <div class="header-action-row">
      <button class="events-create" onclick={() => (showCreateModal = true)}>
        <span>Tambah</span>
        <span class="plus-circle">+</span>
      </button>
    </div>
  </div>

  <!-- Event Cards Grid matching zakhruf-id Events/Index.vue -->
  <div class="events-grid">
    {#if eventsList.length === 0}
      <div class="empty-state-box">
        <div class="empty-text">Belum ada event.</div>
      </div>
    {/if}

    {#each eventsList as event (event.id)}
      <div class="event-card-wrap">
        <div class="event-card-inner">
          <!-- Banner -->
          {#if event.banner_url}
            <div class="event-banner">
              <img src={event.banner_url} alt={event.nama_kegiatan} />
            </div>
          {:else}
            <div class="event-banner-placeholder">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11.5" rx="1.5" stroke="rgba(255,255,255,0.2)" stroke-width="1.3"/><line x1="1.5" y1="5.5" x2="14.5" y2="5.5" stroke="rgba(255,255,255,0.2)" stroke-width="1.3"/></svg>
            </div>
          {/if}

          <!-- Body -->
          <div class="event-body">
            <div class="event-head-row">
              <div class="event-title" title={event.nama_kegiatan}>{event.nama_kegiatan}</div>
              <span
                class="badge-pill"
                style="background: {statusBadge(event.registration_status).bg}; color: {statusBadge(event.registration_status).color};"
              >
                {statusBadge(event.registration_status).label}
              </span>
            </div>

            {#if event.deskripsi}
              <div class="event-desc">{event.deskripsi}</div>
            {/if}

            <!-- Dates -->
            {#if event.dates && event.dates.length > 0}
              <div class="event-dates-list">
                {#each event.dates as d}
                  <div class="date-row">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" class="icon-muted"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><line x1="1.5" y1="5.5" x2="12.5" y2="5.5" stroke="currentColor" stroke-width="1.2"/></svg>
                    <span class="date-text">
                      {new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {#if !d.is_all_day && d.start_time}
                      <span class="time-text">{formatTime(d.start_time)} - {formatTime(d.end_time)}</span>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Location -->
            <div class="location-row">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5C11.5 3.5 9.5 1.5 7 1.5z" stroke="currentColor" stroke-width="1.1"/><circle cx="7" cy="6" r="1.5" stroke="currentColor" stroke-width="1.1"/></svg>
              <span>{event.lokasi || event.dates?.[0]?.location?.name || 'Masjid Al-Ikhlas, Jakarta'}</span>
            </div>

            <!-- Meta / Tags -->
            <div class="meta-bottom">
              <div class="meta-counts">
                <span>{event.candidates_count || 0} kandidat</span>
                <span>2 tim</span>
                <span>Usia 20-35</span>
              </div>

              <div class="cat-tags">
                <span class="cat-pill cat-mandiri">Mandiri</span>
                <span class="cat-pill cat-pashmina">Pashmina</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons: Kelola | Edit | Link | Hapus -->
          <div class="card-action-bar">
            <a href="#/admin/events/{event.slug}" use:link class="action-btn btn-manage">Kelola</a>
            <div class="action-divider"></div>
            <a href="#/admin/events/{event.slug}" use:link class="action-btn btn-subtle">Edit</a>
            <div class="action-divider"></div>
            <button class="action-btn btn-subtle btn-copy-wrap" onclick={() => copyRegLink(event)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>{copiedId === event.id ? 'Tersalin' : 'Link'}</span>
            </button>
            <div class="action-divider"></div>
            <button class="action-btn btn-subtle btn-delete" onclick={() => destroy(event.id, event.nama_kegiatan)}>Hapus</button>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Create Event Modal -->
  {#if showCreateModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={(e) => e.target === e.currentTarget ? showCreateModal = false : undefined}>
      <div class="modal-card">
        <div class="modal-head">
          <h2 class="modal-title">Tambah Event Taaruf</h2>
          <button class="btn-close" onclick={() => (showCreateModal = false)}>✕</button>
        </div>

        <form onsubmit={handleCreateEvent}>
          <div class="form-group">
            <label class="form-label" for="ev-nama">Nama Kegiatan</label>
            <input class="form-input" id="ev-nama" type="text" bind:value={newNama} placeholder="mis. Taaruf Akbar DKI Jakarta Batch 4" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="ev-desc">Deskripsi</label>
            <textarea class="form-input" id="ev-desc" rows="2" bind:value={newDeskripsi} placeholder="Deskripsi singkat kegiatan..."></textarea>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="ev-status">Status Pendaftaran</label>
              <select class="form-input" id="ev-status" bind:value={newStatus}>
                <option value="open">Buka (Open)</option>
                <option value="closed">Tutup (Closed)</option>
                <option value="configurable">Configurable</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="ev-lokasi">Lokasi Kegiatan</label>
              <input class="form-input" id="ev-lokasi" type="text" bind:value={newLokasi} placeholder="Nama tempat / masjid" />
            </div>
          </div>

          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label" for="ev-date">Tanggal</label>
              <input class="form-input" id="ev-date" type="date" bind:value={newDate} />
            </div>
            <div class="form-group">
              <label class="form-label" for="ev-start">Waktu Mulai</label>
              <input class="form-input" id="ev-start" type="time" bind:value={newStartTime} />
            </div>
            <div class="form-group">
              <label class="form-label" for="ev-end">Waktu Selesai</label>
              <input class="form-input" id="ev-end" type="time" bind:value={newEndTime} />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" onclick={() => (showCreateModal = false)}>Batal</button>
            <button type="submit" class="btn-submit">Simpan Event</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</AdminLayout>

<style>
  .events-header {
    margin-bottom: 32px;
  }
  .events-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 600;
    color: #e4e4ec;
    letter-spacing: -0.6px;
    line-height: 1.05;
    margin: 0;
  }
  .events-sub {
    font-size: 13px;
    color: #8b8d9a;
    margin-top: 6px;
    margin-bottom: 0;
  }
  .header-action-row {
    margin-top: 16px;
  }
  .events-create {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    background: #7a9a5e;
    color: #0a0d06;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: all 0.35s cubic-bezier(0.32,0.72,0,1);
    text-decoration: none;
    white-space: nowrap;
  }
  .events-create:hover {
    background: #8db36b;
    transform: scale(1.02);
  }
  .plus-circle {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(0,0,0,0.15);
    display: grid;
    place-items: center;
    font-size: 12px;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
    gap: 16px;
  }

  .empty-state-box {
    grid-column: 1 / -1;
    padding: 56px 20px;
    text-align: center;
    background: rgba(255,255,255,0.02);
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .empty-text {
    font-size: 13px;
    color: #5a5c6a;
  }

  .event-card-wrap {
    background: rgba(255,255,255,0.02);
    border-radius: 14px;
    padding: 1px;
    transition: all 0.35s cubic-bezier(0.32,0.72,0,1);
  }
  .event-card-wrap:hover {
    background: rgba(122,154,94,0.06);
  }
  .event-card-inner {
    background: #13151c;
    border-radius: 14px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
    overflow: hidden;
  }

  .event-banner {
    height: 140px;
    background: #1a1d27;
    overflow: hidden;
  }
  .event-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .event-banner-placeholder {
    height: 80px;
    background: linear-gradient(135deg, rgba(122,154,94,0.2), rgba(212,160,48,0.1));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .event-body {
    padding: 18px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .event-head-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .event-title {
    font-size: 15px;
    font-weight: 700;
    color: #e4e4ec;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .badge-pill {
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }
  .event-desc {
    font-size: 12px;
    color: #5a5c6a;
    margin-bottom: 10px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .event-dates-list {
    margin-bottom: 4px;
  }
  .date-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .icon-muted {
    flex-shrink: 0;
    color: #5a5c6a;
  }
  .date-text { color: #8b8d9a; }
  .time-text { color: #5a5c6a; }

  .location-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #5a5c6a;
    margin-top: 4px;
  }
  .location-row svg {
    flex-shrink: 0;
  }

  .meta-bottom {
    margin-top: auto;
    padding-top: 12px;
  }
  .meta-counts {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    color: #5a5c6a;
    margin-bottom: 6px;
  }
  .cat-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .cat-pill {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
  }
  .cat-mandiri { background: rgba(122,154,94,0.12); color: #8db36b; }
  .cat-pashmina { background: rgba(212,160,48,0.12); color: #e8b840; }

  /* 4-Button Action Bar */
  .card-action-bar {
    display: flex;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .action-btn {
    padding: 12px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.25s cubic-bezier(0.32,0.72,0,1);
    background: transparent;
  }
  .btn-manage {
    flex: 1.2;
    color: #8db36b;
    background: rgba(122,154,94,0.08);
  }
  .btn-manage:hover {
    background: rgba(122,154,94,0.16);
  }
  .btn-subtle {
    flex: 1;
    color: #8b8d9a;
  }
  .btn-subtle:hover {
    background: #1a1d27;
    color: #8db36b;
  }
  .btn-copy-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .btn-copy-wrap:hover {
    color: #e8b840;
  }
  .btn-delete:hover {
    color: #e05555;
  }
  .action-divider {
    width: 1px;
    background: rgba(255,255,255,0.06);
  }

  /* Modal */
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
  }
  .modal-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    color: #e4e4ec;
    margin: 0;
  }
  .btn-close {
    background: none;
    border: none;
    color: #8b8d9a;
    font-size: 16px;
    cursor: pointer;
  }
  .form-group {
    margin-bottom: 14px;
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
  .form-grid-3 { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 10px; }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 24px;
  }
  .btn-cancel {
    padding: 10px 18px;
    border-radius: 999px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    color: #8b8d9a;
    font-size: 13px;
    cursor: pointer;
  }
  .btn-submit {
    padding: 10px 20px;
    border-radius: 999px;
    background: #7a9a5e;
    color: #0a0d06;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }
</style>