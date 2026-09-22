import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { getDb, type Bindings } from '../../db';
import {
  events,
  romanticRooms,
  romanticQueues,
  romanticSessions,
  romanticResults,
  candidates,
} from '../../db/schema';

const realtimeApp = new Hono<{ Bindings: Bindings }>();

// List Rooms & Queues for an Event
realtimeApp.get('/events/:slug/rooms', async (c) => {
  const slug = c.req.param('slug');
  const db = getDb(c.env.DB);

  const event = await db.select().from(events).where(eq(events.slug, slug)).get();
  if (!event) return c.json({ success: false, message: 'Kegiatan tidak ditemukan' }, 404);

  const rooms = await db.select().from(romanticRooms).where(eq(romanticRooms.eventId, event.id)).all();
  const queues = await db.select().from(romanticQueues).where(eq(romanticQueues.eventId, event.id)).all();
  const activeSessions = await db
    .select()
    .from(romanticSessions)
    .where(and(eq(romanticSessions.eventId, event.id), eq(romanticSessions.status, 'active')))
    .all();

  return c.json({
    success: true,
    rooms,
    queues,
    activeSessions,
  });
});

// Candidate checks their active status / called modal
realtimeApp.get('/events/:slug/my-status', async (c) => {
  const slug = c.req.param('slug');
  const candidateId = Number(c.req.query('candidateId'));
  if (!candidateId) return c.json({ success: false, message: 'ID diperlukan' }, 400);

  const db = getDb(c.env.DB);

  const event = await db.select().from(events).where(eq(events.slug, slug)).get();
  if (!event) return c.json({ success: false, message: 'Kegiatan tidak ditemukan' }, 404);

  // Check if candidate is called in any queue
  const calledQueue = await db
    .select({
      queueId: romanticQueues.id,
      roomId: romanticQueues.roomId,
      roomName: romanticRooms.name,
      status: romanticQueues.status,
      sessionId: romanticQueues.sessionId,
    })
    .from(romanticQueues)
    .leftJoin(romanticRooms, eq(romanticQueues.roomId, romanticRooms.id))
    .where(
      and(
        eq(romanticQueues.eventId, event.id),
        eq(romanticQueues.candidateId, candidateId),
        eq(romanticQueues.status, 'called')
      )
    )
    .get();

  // Check if session is active
  let currentSession = null;
  if (calledQueue && calledQueue.sessionId) {
    currentSession = await db
      .select()
      .from(romanticSessions)
      .where(eq(romanticSessions.id, calledQueue.sessionId))
      .get();
  }

  return c.json({
    success: true,
    isCalled: !!calledQueue,
    calledInfo: calledQueue || null,
    session: currentSession || null,
  });
});

// Candidate presses "Siap Ta'aruf" (Dual-Ready Handshake)
realtimeApp.post(
  '/events/:slug/taaruf/ready',
  zValidator(
    'json',
    z.object({
      candidateId: z.number(),
      sessionId: z.number(),
    })
  ),
  async (c) => {
    const { candidateId, sessionId } = c.req.valid('json');
    const db = getDb(c.env.DB);

    const session = await db.select().from(romanticSessions).where(eq(romanticSessions.id, sessionId)).get();
    if (!session) return c.json({ success: false, message: 'Sesi tidak ditemukan' }, 404);

    let isA = session.candidateAId === candidateId;
    let isB = session.candidateBId === candidateId;

    if (!isA && !isB) {
      return c.json({ success: false, message: 'Kandidat bukan peserta sesi ini.' }, 403);
    }

    const updateData: any = {};
    if (isA) updateData.candidateAReady = true;
    if (isB) updateData.candidateBReady = true;

    // If both ready, activate session
    const bothReady = (isA && session.candidateBReady) || (isB && session.candidateAReady);
    if (bothReady) {
      updateData.status = 'active';
      updateData.startedAt = new Date().toISOString();
    }

    await db.update(romanticSessions).set(updateData).where(eq(romanticSessions.id, sessionId)).run();

    return c.json({
      success: true,
      bothReady,
      message: bothReady ? 'Kedua kandidat siap! Sesi ta\'aruf dimulai.' : 'Konfirmasi siap dicatat. Menunggu pasangan...',
    });
  }
);

// Admin or Candidate stores Taaruf Result
realtimeApp.post(
  '/events/:slug/results',
  zValidator(
    'json',
    z.object({
      candidateAId: z.number(),
      candidateBId: z.number(),
      roomId: z.number().optional(),
      sessionId: z.number().optional(),
      result: z.enum(['lanjut', 'ragu_ragu', 'tidak_lanjut']),
      notes: z.string().optional(),
    })
  ),
  async (c) => {
    const slug = c.req.param('slug');
    const data = c.req.valid('json');
    const db = getDb(c.env.DB);

    const event = await db.select().from(events).where(eq(events.slug, slug)).get();
    if (!event) return c.json({ success: false, message: 'Kegiatan tidak ditemukan' }, 404);

    await db
      .insert(romanticResults)
      .values({
        eventId: event.id,
        candidateAId: data.candidateAId,
        candidateBId: data.candidateBId,
        roomId: data.roomId,
        sessionId: data.sessionId,
        result: data.result,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .run();

    return c.json({ success: true, message: 'Hasil ta\'aruf berhasil disimpan.' });
  }
);

export { realtimeApp };
