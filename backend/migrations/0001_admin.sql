-- Seed: admin + superadmin users (plaintext passwords; prototype only)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','superadmin')),
  email_verified_at TEXT,
  remember_token TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO users (name, email, password, role, created_at, updated_at) VALUES
  ('Superadmin Zakhruf', 'superadmin@zakhruf.id', 'superadmin123', 'superadmin', datetime('now'), datetime('now')),
  ('Admin Zakhruf', 'admin@zakhruf.id', 'admin123', 'admin', datetime('now'), datetime('now'));