import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, ne, desc, sql } from 'drizzle-orm';
import { getDb, type Bindings } from '../../db';
import { candidates, candidatePhotos, candidateSwipes, timPnkb } from '../../db/schema';

const candidateApp = new Hono<{ Bindings: Bindings }>();

// List candidates for Discovery / Swiping
candidateApp.get('/', async (c) => {
  const db = getDb(c.env.DB);
  const currentCandidateId = Number(c.req.query('myId')) || 0;
  const genderFilter = c.req.query('gender'); // 'male' or 'female'

  const conditions = [ne(candidates.id, currentCandidateId), eq(candidates.status, 'aktif')];
  if (genderFilter) {
    conditions.push(eq(candidates.gender, genderFilter as any));
  }

  const list = await db
    .select({
      id: candidates.id,
      candidateCode: candidates.candidateCode,
      nickname: candidates.nickname,
      fullName: candidates.fullName,
      gender: candidates.gender,
      city: candidates.city,
      education: candidates.education,
      occupation: candidates.occupation,
      profilePhoto: candidates.profilePhoto,
      selfDescription: candidates.selfDescription,
      hobbies: candidates.hobbies,
      partnerCriteria: candidates.partnerCriteria,
      height: candidates.height,
      weight: candidates.weight,
      dateOfBirth: candidates.dateOfBirth,
    })
    .from(candidates)
    .where(and(...conditions))
    .limit(20)
    .all();

  return c.json({ success: true, candidates: list });
});

// Candidate Detail Modal
candidateApp.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const db = getDb(c.env.DB);

  const candidate = await db.select().from(candidates).where(eq(candidates.id, id)).get();
  if (!candidate) {
    return c.json({ success: false, message: 'Kandidat tidak ditemukan' }, 404);
  }

  const photos = await db.select().from(candidatePhotos).where(eq(candidatePhotos.candidateId, id)).all();

  return c.json({
    success: true,
    candidate: {
      ...candidate,
      photos,
    },
  });
});

// Swipe / Ajak Action
candidateApp.post(
  '/:id/swipe',
  zValidator(
    'json',
    z.object({
      senderId: z.number(),
      direction: z.enum(['like', 'pass', 'ajak']),
      eventId: z.number().optional(),
    })
  ),
  async (c) => {
    const targetId = Number(c.req.param('id'));
    const { senderId, direction, eventId } = c.req.valid('json');
    const db = getDb(c.env.DB);

    await db
      .insert(candidateSwipes)
      .values({
        candidateId: senderId,
        targetCandidateId: targetId,
        direction,
        eventId,
        status: direction === 'ajak' ? 'pending' : 'accepted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .run();

    return c.json({ success: true, message: `Aksi ${direction} berhasil dicatat.` });
  }
);

// Get My Ajakanku
candidateApp.get('/my/ajakanku', async (c) => {
  const candidateId = Number(c.req.query('candidateId'));
  if (!candidateId) return c.json({ success: false, message: 'ID diperlukan' }, 400);

  const db = getDb(c.env.DB);

  const ajakanSent = await db
    .select({
      id: candidateSwipes.id,
      targetId: candidates.id,
      name: candidates.fullName,
      status: candidateSwipes.status,
      createdAt: candidateSwipes.createdAt,
    })
    .from(candidateSwipes)
    .innerJoin(candidates, eq(candidateSwipes.targetCandidateId, candidates.id))
    .where(and(eq(candidateSwipes.candidateId, candidateId), eq(candidateSwipes.direction, 'ajak')))
    .all();

  return c.json({ success: true, ajakanku: ajakanSent });
});

// WhatsApp Redirect Link via Tim PNKB
candidateApp.get('/:id/wa', async (c) => {
  const id = Number(c.req.param('id'));
  const db = getDb(c.env.DB);

  const candidate = await db.select().from(candidates).where(eq(candidates.id, id)).get();
  if (!candidate) return c.json({ success: false, message: 'Kandidat tidak ditemukan' }, 404);

  let pnkbPhone = '6281234567890';
  if (candidate.daerahId) {
    const pnkb = await db.select().from(timPnkb).where(eq(timPnkb.daerahId, candidate.daerahId)).get();
    if (pnkb) pnkbPhone = pnkb.phoneNumber;
  }

  const text = encodeURIComponent(
    `Assalamu'alaikum Warahmatullahi Wabarakatuh Tim PNKB, saya tertarik untuk ta'aruf dengan kandidat ${candidate.fullName} (Kode: ${candidate.candidateCode || '-'}). Mohon arahannya.`
  );

  return c.json({ success: true, waUrl: `https://wa.me/${pnkbPhone}?text=${text}` });
});

// Update Profile
candidateApp.patch(
  '/profile/:id',
  zValidator(
    'json',
    z.object({
      selfDescription: z.string().optional(),
      hobbies: z.string().optional(),
      partnerCriteria: z.string().optional(),
      height: z.number().optional(),
      weight: z.number().optional(),
      education: z.string().optional(),
      occupation: z.string().optional(),
    })
  ),
  async (c) => {
    const id = Number(c.req.param('id'));
    const data = c.req.valid('json');
    const db = getDb(c.env.DB);

    await db
      .update(candidates)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(candidates.id, id))
      .run();

    return c.json({ success: true, message: 'Profil berhasil diperbarui' });
  }
);

export { candidateApp };
