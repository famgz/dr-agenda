import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { boolean } from 'drizzle-orm/pg-core';

const idUUID = uuid('id').defaultRandom().primaryKey();
const idText = text('id').primaryKey();
const createdAt = timestamp('created_at').defaultNow().notNull();
const updatedAt = timestamp('updated_at')
  .defaultNow()
  .$onUpdate(() => new Date());
const userId = text('user_id')
  .notNull()
  .references(() => userTable.id, { onDelete: 'cascade' });
const clinicId = uuid('clinic_id')
  .notNull()
  .references(() => clinicTable.id, { onDelete: 'cascade' });
const patientId = uuid('patient_id')
  .notNull()
  .references(() => patientTable.id, { onDelete: 'cascade' });
const doctorId = uuid('doctor_id')
  .notNull()
  .references(() => doctorTable.id, { onDelete: 'cascade' });

export const sexEnum = pgEnum('patient_sex', ['male', 'female']);

// Tables

export const sessionTable = pgTable('session', {
  id: idText,
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId,
});

export const accountTable = pgTable('account', {
  id: idText,
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId,
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verificationTable = pgTable('verification', {
  id: idText,
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const userTable = pgTable('user', {
  id: idText,
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt,
  updatedAt,
});

export const userTableRelations = relations(userTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));

export const clinicTable = pgTable('clinic', {
  id: idUUID,
  name: text('name').notNull(),
  createdAt,
  updatedAt,
});

export const clinicTableRelations = relations(clinicTable, ({ many }) => ({
  doctors: many(doctorTable),
  patients: many(patientTable),
  appointments: many(appointmentTable),
  usersToClinics: many(usersToClinicsTable),
}));

export const usersToClinicsTable = pgTable('users_to_clinics', {
  userId,
  clinicId,
  createdAt,
  updatedAt,
});

export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [usersToClinicsTable.userId],
      references: [userTable.id],
    }),
    clinic: one(clinicTable, {
      fields: [usersToClinicsTable.clinicId],
      references: [clinicTable.id],
    }),
  }),
);

export const doctorTable = pgTable('doctor', {
  id: idUUID,
  name: text('name').notNull(),
  avatarImageUrl: text('avatar_image_url'),
  availableFromTime: time('available_from_time').notNull(),
  availableToTime: time('available_to_time').notNull(),
  availableFromWeekDay: integer('available_from_week_day').notNull(),
  availableToWeekDay: integer('available_to_week_day').notNull(),
  specialty: text('specialty').notNull(),
  appointmentPriceInCents: integer('appointment_price_in_cents').notNull(),
  clinicId,
  createdAt,
  updatedAt,
});

export const doctorTableRelations = relations(doctorTable, ({ many, one }) => ({
  clinic: one(clinicTable, {
    fields: [doctorTable.clinicId],
    references: [clinicTable.id],
  }),
  appointments: many(appointmentTable),
}));

export const patientTable = pgTable('patient', {
  id: idUUID,
  name: text('name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').notNull(),
  sex: sexEnum('sex').notNull(),
  clinicId,
  createdAt,
  updatedAt,
});

export const patientTableRelations = relations(patientTable, ({ one }) => ({
  clinic: one(clinicTable, {
    fields: [patientTable.clinicId],
    references: [clinicTable.id],
  }),
}));

export const appointmentTable = pgTable('appointment', {
  id: idUUID,
  date: timestamp('date').notNull(),
  clinicId,
  patientId,
  doctorId,
  createdAt,
  updatedAt,
});

export const appointmenTableRelations = relations(
  appointmentTable,
  ({ one }) => ({
    clinic: one(clinicTable, {
      fields: [appointmentTable.clinicId],
      references: [clinicTable.id],
    }),
    patient: one(patientTable, {
      fields: [appointmentTable.patientId],
      references: [patientTable.id],
    }),
    doctor: one(doctorTable, {
      fields: [appointmentTable.doctorId],
      references: [doctorTable.id],
    }),
  }),
);
