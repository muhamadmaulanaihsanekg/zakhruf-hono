import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Bindings } from './db';
import { authApp } from './modules/auth';
import { candidateApp } from './modules/candidates';
import { eventApp } from './modules/events';
import { realtimeApp } from './modules/realtime';
import { gamesApp } from './modules/games';
import { onboardingApp } from './modules/onboarding';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://zakhruf.id'],
    credentials: true,
  })
);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route mount
app.route('/api/auth', authApp);
app.route('/api/candidates', candidateApp);
app.route('/api/events', eventApp);
app.route('/api/realtime', realtimeApp);
app.route('/api/games', gamesApp);
app.route('/api/onboarding', onboardingApp);

app.get('/', (c) => {
  return c.text('Zakhruf Hono API Gateway');
});

export default app;

