<script lang="ts">
  import Router from 'svelte-spa-router';
  import CandidateSwap from './routes/user/CandidateSwap.svelte';
  import CandidateShow from './routes/user/CandidateShow.svelte';
  import Ajakanku from './routes/user/Ajakanku.svelte';
  import Profile from './routes/user/Profile.svelte';
  import Login from './routes/auth/Login.svelte';
  import Onboarding from './routes/auth/Onboarding.svelte';
  import AccountLookup from './routes/auth/AccountLookup.svelte';
  import EventList from './routes/events/EventList.svelte';
  import EventDetail from './routes/events/EventDetail.svelte';
  import EventSwap from './routes/events/EventSwap.svelte';
  import EventTaaruf from './routes/events/EventTaaruf.svelte';
  import EventAjakanku from './routes/events/EventAjakanku.svelte';
  import EventAbsensi from './routes/events/EventAbsensi.svelte';
  import Pertanyaan from './routes/events/games/Pertanyaan.svelte';
  import TopikAcak from './routes/events/games/TopikAcak.svelte';
  import Kebenaran from './routes/events/games/Kebenaran.svelte';
  import IniItu from './routes/events/games/IniItu.svelte';
  import AdminLogin from './routes/admin/Login.svelte';
  import AdminDashboard from './routes/admin/Dashboard.svelte';
  import AdminCandidates from './routes/admin/Candidates.svelte';
  import AdminEvents from './routes/admin/Events.svelte';
  import AdminEventShow from './routes/admin/EventShow.svelte';
  import AdminOrgLevels from './routes/admin/OrganizationLevels.svelte';
  import AdminTimPnkb from './routes/admin/TimPnkb.svelte';
  import AdminProfile from './routes/admin/Profile.svelte';

  const routes = {
    '/': CandidateSwap,
    '/swap': CandidateSwap,
    '/candidates/:id': CandidateShow,
    '/ajakanku': Ajakanku,
    '/profile': Profile,
    '/login': Login,
    '/onboarding': Onboarding,
    '/cek-akun': AccountLookup,
    '/admin/login': AdminLogin,
    '/admin': AdminDashboard,
    '/admin/dashboard': AdminDashboard,
    '/admin/candidates': AdminCandidates,
    '/admin/events': AdminEvents,
    '/admin/events/:slug': AdminEventShow,
    '/admin/organization': AdminOrgLevels,
    '/admin/pnkb': AdminTimPnkb,
    '/admin/profile': AdminProfile,
    '/events': EventList,
    '/events/:slug': EventDetail,
    '/events/:slug/swap': EventSwap,
    '/events/:slug/taaruf': EventTaaruf,
    '/events/:slug/ajakanku': EventAjakanku,
    '/events/:slug/absensi': EventAbsensi,
    '/events/:slug/games/pertanyaan': Pertanyaan,
    '/events/:slug/games/topik': TopikAcak,
    '/events/:slug/games/kebenaran': Kebenaran,
    '/events/:slug/games/iniitu': IniItu,
    '*': CandidateSwap,
  };
</script>

<Router {routes} />
