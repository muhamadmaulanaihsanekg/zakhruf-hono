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

  const routes = {
    '/': CandidateSwap,
    '/swap': CandidateSwap,
    '/candidates/:id': CandidateShow,
    '/ajakanku': Ajakanku,
    '/profile': Profile,
    '/login': Login,
    '/onboarding': Onboarding,
    '/cek-akun': AccountLookup,
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
