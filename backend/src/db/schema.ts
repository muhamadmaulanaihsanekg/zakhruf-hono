import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'superadmin'] }).default('admin').notNull(),
  emailVerifiedAt: text('email_verified_at'),
  rememberToken: text('remember_token'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const organizationLevels = sqliteTable('organization_levels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['daerah', 'desa', 'kelompok'] }).notNull(),
  name: text('name').notNull(),
  parentId: integer('parent_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const timPnkb = sqliteTable('tim_pnkb', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  daerahId: integer('daerah_id').references(() => organizationLevels.id),
  desaId: integer('desa_id').references(() => organizationLevels.id),
  kelompokId: integer('kelompok_id').references(() => organizationLevels.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const candidates = sqliteTable('candidates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  emailVerifiedAt: text('email_verified_at'),
  rememberToken: text('remember_token'),
  lastLoginAt: text('last_login_at'),

  candidateCode: text('candidate_code').unique(),
  nickname: text('nickname').notNull(),
  fullName: text('full_name').notNull(),
  gender: text('gender', { enum: ['male', 'female', 'L', 'P'] }).notNull(),
  dateOfBirth: text('date_of_birth'),
  placeOfBirth: text('place_of_birth'),
  city: text('city'),
  daerahId: integer('daerah_id').references(() => organizationLevels.id),
  desaId: integer('desa_id').references(() => organizationLevels.id),
  kelompokId: integer('kelompok_id').references(() => organizationLevels.id),

  height: integer('height'),
  weight: integer('weight'),
  education: text('education'),
  occupation: text('occupation'),
  profilePhoto: text('profile_photo'),

  fullAddress: text('full_address'),
  whatsappNumber: text('whatsapp_number'),
  socialMedia: text('social_media'), // JSON string
  maritalStatus: text('marital_status', { enum: ['single', 'divorced', 'widowed'] }),
  selfDescription: text('self_description'),
  hobbies: text('hobbies'),
  favoriteFoods: text('favorite_foods'), // JSON string
  sifat: text('sifat'), // JSON string

  partnerCriteria: text('partner_criteria'),

  fatherName: text('father_name'),
  fatherMembershipStatus: text('father_membership_status', { enum: ['member', 'non_member'] }),
  fatherOccupation: text('father_occupation'),
  fatherDomicile: text('father_domicile'),
  motherName: text('mother_name'),
  motherMembershipStatus: text('mother_membership_status', { enum: ['member', 'non_member'] }),
  motherOccupation: text('mother_occupation'),
  motherDomicile: text('mother_domicile'),
  parentsMaritalStatus: text('parents_marital_status', { enum: ['married', 'divorced', 'widowed'] }),
  birthOrder: integer('birth_order'),
  siblingsCount: integer('siblings_count'),

  status: text('status', { enum: ['pending_verification', 'active', 'blocked', 'aktif', 'taaruf', 'menikah'] }).default('active').notNull(),
  alreadyOnboarding: integer('already_on_boarding', { mode: 'boolean' }).default(false).notNull(),
  verifiedAt: text('verified_at'),
  verifiedBy: integer('verified_by').references(() => users.id),
  adminNotes: text('admin_notes'),
  additionalData: text('additional_data'), // JSON string

  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const candidatePhotos = sqliteTable('candidate_photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  candidateId: integer('candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
  photoUrl: text('photo_url').notNull(),
  isMain: integer('is_main', { mode: 'boolean' }).default(false).notNull(),
  caption: text('caption'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const candidateSwipes = sqliteTable('candidate_swipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  candidateId: integer('candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
  targetCandidateId: integer('target_candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
  direction: text('direction', { enum: ['like', 'pass', 'ajak'] }).notNull(),
  eventId: integer('event_id'),
  status: text('status', { enum: ['pending', 'accepted', 'rejected', 'cancelled'] }).default('pending').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const candidateFieldSettings = sqliteTable('candidate_field_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fieldName: text('field_name').notNull().unique(),
  label: text('label').notNull(),
  isVisible: integer('is_visible', { mode: 'boolean' }).default(true).notNull(),
  isRequired: integer('is_required', { mode: 'boolean' }).default(false).notNull(),
  stepNumber: integer('step_number').default(1).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  namaKegiatan: text('nama_kegiatan').notNull(),
  slug: text('slug').notNull().unique(),
  deskripsi: text('deskripsi'),
  banner: text('banner'),
  logo: text('logo'),
  singleAttendance: integer('single_attendance', { mode: 'boolean' }).default(false).notNull(),
  status: text('status', { enum: ['draft', 'published', 'ongoing', 'completed'] }).default('published').notNull(),
  registrationStatus: text('registration_status', { enum: ['open', 'closed', 'invite_only'] }).default('open').notNull(),
  ageMin: integer('age_min').default(18),
  ageMax: integer('age_max').default(45),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const eventDates = sqliteTable('event_dates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  date: text('date').notNull(),
  startTime: text('start_time'),
  endTime: text('end_time'),
  locationName: text('location_name'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const eventCandidates = sqliteTable('event_candidates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  candidateId: integer('candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
  participantNumber: text('participant_number'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('approved').notNull(),
  category: text('category', { enum: ['mandiri', 'delegasi'] }).default('mandiri').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const eventAttendances = sqliteTable('event_attendances', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  eventDateId: integer('event_date_id').references(() => eventDates.id, { onDelete: 'cascade' }),
  candidateId: integer('candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
  attendanceToken: text('attendance_token'),
  checkedInAt: text('checked_in_at').notNull(),
  createdAt: text('created_at').notNull(),
});

export const romanticRooms = sqliteTable('romantic_rooms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  timPnkbId: integer('tim_pnkb_id').references(() => timPnkb.id),
  name: text('name').notNull(),
  status: text('status', { enum: ['active', 'inactive', 'occupied'] }).default('active').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const romanticQueues = sqliteTable('romantic_queues', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  roomId: integer('room_id').references(() => romanticRooms.id, { onDelete: 'cascade' }),
  candidateId: integer('candidate_id').references(() => candidates.id, { onDelete: 'cascade' }).notNull(),
  targetCandidateId: integer('target_candidate_id').references(() => candidates.id, { onDelete: 'cascade' }),
  sessionId: integer('session_id'),
  position: integer('position').default(0).notNull(),
  status: text('status', { enum: ['waiting', 'called', 'in_session', 'completed', 'cancelled'] }).default('waiting').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const romanticSessions = sqliteTable('romantic_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }),
  roomId: integer('room_id').references(() => romanticRooms.id),
  timPnkbId: integer('tim_pnkb_id').references(() => timPnkb.id),
  candidateAId: integer('candidate_a_id').references(() => candidates.id),
  candidateBId: integer('candidate_b_id').references(() => candidates.id),
  candidateAReady: integer('candidate_a_ready', { mode: 'boolean' }).default(false).notNull(),
  candidateBReady: integer('candidate_b_ready', { mode: 'boolean' }).default(false).notNull(),
  durationMinutes: integer('duration_minutes').default(15).notNull(),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  status: text('status', { enum: ['waiting_ready', 'active', 'completed', 'cancelled'] }).default('waiting_ready').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const romanticResults = sqliteTable('romantic_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  roomId: integer('room_id').references(() => romanticRooms.id),
  sessionId: integer('session_id').references(() => romanticSessions.id),
  candidateAId: integer('candidate_a_id').references(() => candidates.id),
  candidateBId: integer('candidate_b_id').references(() => candidates.id),
  result: text('result', { enum: ['lanjut', 'ragu_ragu', 'tidak_lanjut'] }).notNull(),
  notes: text('notes'),
  customData: text('custom_data'), // JSON string
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

