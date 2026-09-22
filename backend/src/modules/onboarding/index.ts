import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb, type Bindings } from '../../db';
import { candidates, candidateFieldSettings } from '../../db/schema';

const onboardingApp = new Hono<{ Bindings: Bindings }>();

// Get candidate onboarding status and field settings
onboardingApp.get('/:candidateId', async (c) => {
  const candidateId = Number(c.req.param('candidateId'));
  const db = getDb(c.env.DB);

  const candidate = await db.select().from(candidates).where(eq(candidates.id, candidateId)).get();
  if (!candidate) return c.json({ success: false, message: 'Kandidat tidak ditemukan' }, 404);

  const settings = await db.select().from(candidateFieldSettings).all();

  return c.json({
    success: true,
    alreadyOnboarding: candidate.alreadyOnboarding,
    candidate,
    settings,
  });
});

// Save Onboarding step / complete onboarding
onboardingApp.post(
  '/:candidateId',
  zValidator(
    'json',
    z.object({
      nickname: z.string().optional(),
      fullName: z.string().optional(),
      gender: z.enum(['male', 'female', 'L', 'P']).optional(),
      dateOfBirth: z.string().optional(),
      placeOfBirth: z.string().optional(),
      city: z.string().optional(),
      daerahId: z.number().optional(),
      desaId: z.number().optional(),
      kelompokId: z.number().optional(),
      height: z.number().optional(),
      weight: z.number().optional(),
      education: z.string().optional(),
      occupation: z.string().optional(),
      fullAddress: z.string().optional(),
      whatsappNumber: z.string().optional(),
      maritalStatus: z.enum(['single', 'divorced', 'widowed']).optional(),
      selfDescription: z.string().optional(),
      hobbies: z.string().optional(),
      partnerCriteria: z.string().optional(),
      fatherName: z.string().optional(),
      motherName: z.string().optional(),
      alreadyOnboarding: z.boolean().optional(),
    })
  ),
  async (c) => {
    const candidateId = Number(c.req.param('candidateId'));
    const data = c.req.valid('json');
    const db = getDb(c.env.DB);

    await db
      .update(candidates)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(candidates.id, candidateId))
      .run();

    return c.json({
      success: true,
      message: 'Data onboarding berhasil disimpan.',
    });
  }
);

export { onboardingApp };
