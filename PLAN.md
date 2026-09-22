# Architecture & Implementation Plan: Zakhruf (Hono + Svelte SPA)

Dokumen ini merinci roadmap migrasi arsitektur dari Laravel + Inertia (Vue 3) ke **Hono (API Backend)** + **Svelte 5 (Single Page Application)**.

---

## 1. Ringkasan Arsitektur

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT (Svelte 5 SPA)                │
│  - Vite + Svelte 5 (Runes)                             │
│  - Tailwind CSS (Hume Theme: #0B0B14, #8B5CF6)         │
│  - Routing: svelte-spa-router / @tanstack/svelte-router│
│  - State: Svelte Runes + Persistent LocalStorage       │
│  - Scanner: html5-qrcode | Audio: Web Audio API        │
└──────────────────────────▲─────────────────────────────┘
                           │ HTTPS (REST API) + WSS (Realtime)
┌──────────────────────────▼─────────────────────────────┐
│                   BACKEND (Hono TypeScript)            │
│  - Framework: Hono v4                                  │
│  - Validation: @hono/zod-validator                     │
│  - Auth: Dual JWT (Candidate & Admin) in httpOnly cookie│
│  - Realtime: WebSocket / Cloudflare Durable Objects    │
│  - ORM / Query: Drizzle ORM                            │
│  - Database: Cloudflare D1 / PostgreSQL / SQLite       │
│  - Storage: Cloudflare R2 / S3 presigned URL           │
└────────────────────────────────────────────────────────┘
```

---

## 2. Fitur & Dekonstruksi Modul

### Modul A: Autentikasi & Otorisasi
- **Dual Guard**: Role `admin` & `candidate`.
- **JWT Handling**: Access Token (short-lived) + Refresh Token (httpOnly, Secure, SameSite).
- **Candidate Onboarding**: Guard `already_on_boarding` (14 langkah form terstruktur sebelum boleh akses discovery/event).
- **Fitur Cek Akun**: Verifikasi email, pencarian kandidat via masked data, reset password token.

### Modul B: Manajemen Data Kandidat & Organisasi
- **Hierarki Organisasi**: Daerah -> Desa -> Kelompok -> Tim PNKB.
- **Profil Kandidat**: Data pribadi, kriteria pasangan, sifat, foto utama & galeri (upload ke R2).
- **Dynamic Field Setting**: Konfigurasi visibilitas dan mandatory field per daerah/event.
- **Ekspor & Laporan**: Export CSV data kandidat & resume view.

### Modul C: Discovery & Swap (Mode Biasa)
- **Katalog Kandidat**: Filter sopan (usia, domisili daerah/desa, pendidikan, status).
- **Ajakan Ta'aruf**: Mengirim ajakan -> notifikasi ke Tim PNKB -> konfirmasi.
- **WA Redirect**: Kontak via penghubung/PNKB (bukan chat langsung antarkandidat).

### Modul D: Event Management (Mode Kegiatan)
- **Event Config**: Tanggal kegiatan, lokasi, aturan usia, kategori peserta mandiri/delegasi.
- **Pendaftaran Publik**: Link unik `/e/:slug/daftar`.
- **Absensi QR Code**:
  - Admin membuat QR code per tanggal dengan token HMAC (rotasi tiap 30 menit).
  - Peserta scan QR admin via kamera browser (`html5-qrcode`).
  - Flag `single_attendance` untuk kegiatan multi-hari.

### Modul E: Bilik & Antrean Realtime (Matchmaking Sesi)
- **Manajemen Bilik (Rooms)**: Status bilik (kosong, aktif, selesai).
- **Antrean (Queue)**: Antrean per bilik atau global pool.
- **Sesi Berjalan (Sessions)**:
  - Timer / Stopwatch live countdown.
  - Sinyal panggilan bilik (Global Called Modal di HP peserta).
  - Dual-ready confirmation (kedua kandidat menekan "Siap" sebelum sesi jalan).
- **Input Hasil Ta'aruf**: Lanjut, Ragu-ragu, Tidak Lanjut + catatan PNKB.

### Modul F: 4 Mini-Game Ice Breaking
1. **Pertanyaan Terarah**: 5 tahap pertanyaan mendalam, progress tracking.
2. **Topik Acak**: 70 topik dalam 12 kategori, dadu putar interaktif.
3. **2 Kebenaran 1 Bohong (2K1B)**: Timer tulis 30 detik, ronde tebak, kalkulasi skor.
4. **Ini atau Itu**: 20 kartu dikotomi cepat, kalkulasi keselarasan jawaban (%).

---

## 3. Rencana Tahapan Pengerjaan (Milestones)

### Fase 1: Inisialisasi Monorepo / Proyek (Hari 1–3)
- [ ] Scaffold folder: `backend/` (Hono) dan `frontend/` (Svelte 5 SPA via Vite).
- [ ] Setup TypeScript, ESLint, Prettier, Tailwind CSS v4 dengan Hume Design System (`#0B0B14`, `#8B5CF6`).
- [ ] Setup Drizzle ORM + D1/SQLite schema & migrations.

### Fase 2: Backend Auth & Kandidat API (Hari 4–8)
- [ ] Implementasi endpoint Auth (Login, Refresh, Logout, Cek Akun, Reset Password).
- [ ] Endpoint Onboarding (14 langkah validasi via Zod).
- [ ] Endpoint Profil, CRUD Foto kandidat, integrasi R2 Storage.
- [ ] Endpoint Master Data (Daerah, Desa, Kelompok, Tim PNKB).

### Fase 3: Frontend Svelte SPA Core (Hari 9–14)
- [ ] Layout Shell: Mobile frame view, navigation bar, Hume UI primitives (Pill button, rounded input, card glassmorphism).
- [ ] Halaman Auth: Login kandidat & admin, Cek Akun.
- [ ] Wizard Onboarding 14 langkah (autosave step state).
- [ ] Halaman Swap / Discovery kandidat & detail modal.

### Fase 4: Event & Absensi QR (Hari 15–18)
- [ ] Backend API Event, Pendaftaran, dan Participant approval.
- [ ] Modul QR HMAC Generator (Admin view) + Scanner WebRTC kamera (Peserta view).
- [ ] Mode Event Switcher di frontend.

### Fase 5: Bilik, Antrean & Realtime (Hari 19–24)
- [ ] WebSocket / SSE endpoint untuk status antrean, room, dan panggil kandidat.
- [ ] Frontend Sesi Ta'aruf: Timer countdown, modal panggil global, tombol Dual-Ready.
- [ ] Form Catat Hasil Ta'aruf dinamis.

### Fase 6: Porting 4 Mini-Game (Hari 25–28)
- [ ] Game Pertanyaan (Stateful card swipe + progress).
- [ ] Game Topik Acak (Animasi dadu 3D CSS + deck shuffle).
- [ ] Game 2K1B (Timer 30s + turn reveal).
- [ ] Game Ini atau Itu (A vs B selector + matching score engine).

### Fase 7: Testing, Admin Dashboard & QA (Hari 29–32)
- [ ] Admin Portal: Monitor antrean, manajemen bilik, ekspor CSV.
- [ ] Testing E2E flow taaruf & stress-test websocket.
- [ ] Build & Deployment pipeline (Cloudflare Pages + Cloudflare Workers).

---

## 4. Struktur Direktori Rekomendasi

```
zakhruf-hono-svelte/
├── backend/                  # Hono REST & Realtime API
│   ├── src/
│   │   ├── db/              # Drizzle schema & migrations
│   │   ├── middlewares/     # Auth JWT, Role Guard, Onboarding Guard
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── candidates/
│   │   │   ├── events/
│   │   │   ├── realtime/    # WebSocket handlers / Durable Objects
│   │   │   └── games/
│   │   └── index.ts
│   ├── wrangler.jsonc       # Cloudflare Workers config
│   └── package.json
│
├── frontend/                 # Svelte 5 SPA
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # Hume UI Kit (Button, Input, Modal, Badge)
│   │   ├── lib/             # API client (ky/fetch), auth store, websocket client
│   │   ├── routes/          # Svelte SPA router views
│   │   │   ├── auth/
│   │   │   ├── user/        # Swap, Profile, Event, Games
│   │   │   └── admin/       # Dashboard, Event Manager, Queue Manager
│   │   └── app.css          # Hume Design Tokens
│   ├── vite.config.ts
│   └── package.json
│
└── PLAN.md                   # Dokumen roadmap utama
```
