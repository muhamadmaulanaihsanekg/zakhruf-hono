import { Hono } from 'hono';
import { getDb, type Bindings } from '../../db';

const gamesApp = new Hono<{ Bindings: Bindings }>();

// 70 Topik Acak & Categories
gamesApp.get('/topics', (c) => {
  return c.json({
    success: true,
    categories: [
      'keluarga', 'agama', 'masa_depan', 'keuangan', 'karir',
      'kesehatan', 'hobi', 'sosial', 'pernikahan', 'pendidikan', 'wisata', 'keseharian'
    ],
  });
});

export { gamesApp };
