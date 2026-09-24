import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { getDb, type Bindings } from '../../db';
import { candidates, users, organizationLevels } from '../../db/schema';

const authApp = new Hono<{ Bindings: Bindings }>();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Candidate Login
authApp.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const db = getDb(c.env.DB);

  const found = await db.select().from(candidates).where(eq(candidates.email, email)).get();
  if (!found || found.password !== password) {
    return c.json({ success: false, message: 'Email atau password salah.' }, 401);
  }

  // Update last login
  await db
    .update(candidates)
    .set({ lastLoginAt: new Date().toISOString() })
    .where(eq(candidates.id, found.id))
    .run();

  const { password: _, ...candidateData } = found;

  return c.json({
    success: true,
    token: `cand_${found.id}_${Date.now()}`,
    user: {
      ...candidateData,
      role: 'candidate',
    },
  });
});

// Admin Login
authApp.post('/admin/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const db = getDb(c.env.DB);

  const found = await db.select().from(users).where(eq(users.email, email)).get();
  if (!found || found.password !== password) {
    return c.json({ success: false, message: 'Kredensial admin tidak valid.' }, 401);
  }

  return c.json({
    success: true,
    token: `adm_${found.id}_${Date.now()}`,
    user: {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    },
  });
});

// Cek Akun (Lookup)
authApp.post(
  '/cek-akun',
  zValidator(
    'json',
    z.object({
      name: z.string().min(2),
      daerahId: z.number().optional(),
      desaId: z.number().optional(),
    })
  ),
  async (c) => {
    const { name, daerahId, desaId } = c.req.valid('json');
    const db = getDb(c.env.DB);

    const conditions = [sql`lower(${candidates.fullName}) LIKE ${'%' + name.toLowerCase() + '%'}`];
    if (daerahId) conditions.push(eq(candidates.daerahId, daerahId));
    if (desaId) conditions.push(eq(candidates.desaId, desaId));

    const matches = await db
      .select({
        id: candidates.id,
        fullName: candidates.fullName,
        email: candidates.email,
        city: candidates.city,
      })
      .from(candidates)
      .where(and(...conditions))
      .limit(10)
      .all();

    // Mask email for privacy (e.g. j***@domain.com)
    const masked = matches.map((m) => {
      const [user, domain] = m.email.split('@');
      const maskedUser = user.length > 2 ? user[0] + '***' + user[user.length - 1] : user[0] + '***';
      return {
        id: m.id,
        fullName: m.fullName,
        maskedEmail: `${maskedUser}@${domain || 'mail.com'}`,
        city: m.city,
      };
    });

    return c.json({ success: true, candidates: masked });
  }
);

// Verify Email for Reset Password
authApp.post(
  '/cek-akun/verify',
  zValidator(
    'json',
    z.object({
      candidateId: z.number(),
      fullEmail: z.string().email(),
    })
  ),
  async (c) => {
    const { candidateId, fullEmail } = c.req.valid('json');
    const db = getDb(c.env.DB);

    const found = await db.select().from(candidates).where(eq(candidates.id, candidateId)).get();
    if (!found || found.email.toLowerCase() !== fullEmail.toLowerCase()) {
      return c.json({ success: false, message: 'Email verifikasi tidak cocok.' }, 400);
    }

    return c.json({ success: true, resetToken: `reset_${found.id}_${Date.now()}` });
  }
);

// Reset Password
authApp.post(
  '/cek-akun/reset-password',
  zValidator(
    'json',
    z.object({
      candidateId: z.number(),
      newPassword: z.string().min(6),
    })
  ),
  async (c) => {
    const { candidateId, newPassword } = c.req.valid('json');
    const db = getDb(c.env.DB);

    await db
      .update(candidates)
      .set({ password: newPassword, updatedAt: new Date().toISOString() })
      .where(eq(candidates.id, candidateId))
      .run();

    return c.json({ success: true, message: 'Password berhasil diperbarui. Silakan login kembali.' });
  }
);

export { authApp };
