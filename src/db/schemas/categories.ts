// db/schema.js
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { exams } from './exams.ts';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  exam_id: integer('exam_id').references(() => exams.id),
  category_name: text('category_name').notNull(),
  description: text('description'), // Nouvelle colonne pour la description
  avatar_url: text('avatar_url'), // Colonne pour l'avatar
});
