import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { exams } from './exams';

export const users = pgTable('users', {
    id: serial('id').primaryKey().unique(),
    google_id: text('google_id').unique(),
    email: text('email').unique(),
    name: text('name'),
    avatar_url: text('avatar_url'),
    exam_id: integer('exam_id').references(() => exams.id) // Clé étrangère nullable
  });

  export type User = typeof users.$inferSelect;