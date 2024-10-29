// db/exams.ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core';


export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  avatar_url: text('avatar_url'),
});

