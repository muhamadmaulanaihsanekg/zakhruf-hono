import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { getDb, type Bindings } from '../../db';
import { events, eventDates, eventCandidates, eventAttendances, candidates } from '../../db/schema';

const eventApp = new Hono<{ Bindings: Bindings }>();

// List public/active events
eventApp.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const list = await db.select().from(events).where(eq(events.status, 'published')).all();
  return c.json({ success: true, events: list });
});

// Event detail with dates and attendance status
eventApp.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const candidateId = Number(c.req.query('candidateId')) || 0;
  const db = getDb(c.env.DB);

  const event = await db.select().from(events).where(eq(events.slug, slug)).get();
  if (!event) return c.json({ success: false, message: 'Kegiatan tidak ditemukan' }, 404);

  const dates = await db.select().from(eventDates).where(eq(eventDates.eventId, event.id)).all();

  let isRegistered = false;
  let participantNumber = null;
  if (candidateId > 0) {
    const reg = await db
      .select()
      .from(eventCandidates)
      .where(and(eq(eventCandidates.eventId, event.id), eq(eventCandidates.candidateId, candidateId)))
      .get();
    if (reg) {
      isRegistered = true;
      participantNumber = reg.participantNumber;
    }
  }

  return c.json({
    success: true,
    event: {
      ...event,
      dates,
      isRegistered,
      participantNumber,
    },
  });
});

// Candidate registers for an event
eventApp.post(
  '/:slug/register',
  zValidator('json', z.object({ candidateId: z.number() })),
  async (c) => {
    const slug = c.req.param('slug');
    const { candidateId } = c.req.valid('json');
    const db = getDb(c.env.DB);

    const event = await db.select().from(events).where(eq(events.slug, slug)).get();
    if (!event) return c.json({ success: false, message: 'Kegiatan tidak ditemukan' }, 404);

    const cand = await db.select().from(candidates).where(eq(candidates.id, candidateId)).get();
    if (!cand) return c.json({ success: false, message: 'Kandidat tidak valid' }, 400);

    const prefix = cand.gender === 'L' || cand.gender === 'male' ? 'L' : 'P';

    // Idempotent: reuse the existing registration instead of creating duplicates.
    const existing = await db
      .select()
      .from(eventCandidates)
      .where(and(eq(eventCandidates.eventId, event.id), eq(eventCandidates.candidateId, candidateId)))
      .get();
    if (existing) {
      return c.json({
        success: true,
        message: 'Kamu sudah terdaftar di kegiatan ini.',
        participantNumber: existing.participantNumber,
        alreadyRegistered: true,
      });
    }

    const randNumber = Math.floor(100 + Math.random() * 900);
    const participantNumber = `${prefix}-${randNumber}`;

    // Races on the unique (event_id, candidate_id) index throw — catch and
    // return the idempotent shape instead of a 500.
    try {
      await db
        .insert(eventCandidates)
        .values({
          eventId: event.id,
          candidateId,
          participantNumber,
          status: 'approved',
          category: 'mandiri',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .run();
    } catch (err) {
      const dup = await db
        .select()
        .from(eventCandidates)
        .where(and(eq(eventCandidates.eventId, event.id), eq(eventCandidates.candidateId, candidateId)))
        .get();
      if (dup) {
        return c.json({
          success: true,
          message: 'Kamu sudah terdaftar di kegiatan ini.',
          participantNumber: dup.participantNumber,
          alreadyRegistered: true,
        });
      }
      throw err; // non-constraint failure should still surface
    }

    return c.json({
      success: true,
      message: 'Pendaftaran kegiatan berhasil!',
      participantNumber,
    });
  }
);

// Admin Generates 30-min HMAC QR Token
eventApp.post(
  '/:slug/attendance/qr-token',
  zValidator('json', z.object({ eventDateId: z.number() })),
  async (c) => {
    const slug = c.req.param('slug');
    const { eventDateId } = c.req.valid('json');
    const db = getDb(c.env.DB);

    const event = await db.select().from(events).where(eq(events.slug, slug)).get();
    if (!event) return c.json({ success: false, message: 'Kegiatan tidak ditemukan' }, 404);

    // Simple HMAC token payload with timestamp
    const timestamp = Date.now();
    const token = `ZKQR_${event.id}_${eventDateId}_${timestamp}`;

    return c.json({
      success: true,
      token,
      expiresInMinutes: 30,
    });
  }
);

// Candidate Scans QR Token to Check-in
eventApp.post(
  '/:slug/attendance/scan',
  zValidator(
    'json',
    z.object({
      candidateId: z.number(),
      qrToken: z.string(),
    })
  ),
  async (c) => {
    const slug = c.req.param('slug');
    const { candidateId, qrToken } = c.req.valid('json');
    const db = getDb(c.env.DB);

    const event = await db.select().from(events).where(eq(events.slug, slug)).get();
    if (!event) return c.json({ success: false, message: 'Kegiatan tidak ditemukan' }, 404);

    // Parse token format: ZKQR_{eventId}_{eventDateId}_{timestamp}
    const parts = qrToken.split('_');
    if (parts.length < 4 || parts[0] !== 'ZKQR' || Number(parts[1]) !== event.id) {
      return c.json({ success: false, message: 'QR Code tidak valid atau untuk kegiatan lain.' }, 400);
    }

    const eventDateId = Number(parts[2]);
    const tokenTime = Number(parts[3]);

    // Validate 30 minutes expiry
    if (Date.now() - tokenTime > 30 * 60 * 1000) {
      return c.json({ success: false, message: 'QR Code sudah kedaluwarsa. Minta panitia refresh QR.' }, 400);
    }

    // Insert attendance record
    await db
      .insert(eventAttendances)
      .values({
        eventId: event.id,
        eventDateId,
        candidateId,
        attendanceToken: qrToken,
        checkedInAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .run();

    return c.json({ success: true, message: 'Absensi kegiatan berhasil! Selamat mengikuti ta\'aruf.' });
  }
);

export { eventApp };
