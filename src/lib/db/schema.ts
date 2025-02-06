// we will define our tables here
// pg-core --- postgre core which contains lots of different utilities in postgre database

import { serial ,text, timestamp, varchar, integer, pgEnum} from 'drizzle-orm/pg-core'
import {pgTable, primaryKey} from 'drizzle-orm/pg-core'

export const userSystemEnum = pgEnum('user_system_enum',['system','user'])

export const chats = pgTable('chats',{
    id : serial('id').primaryKey(),
    pdfName : text('pdf_name').notNull(),
    pdfUrl : text('pdf_url').notNull(),
    createdAT : timestamp('created_at').notNull().defaultNow(),
    userId : varchar('user_id', {length:256}).notNull(),
    fileKey : text('file_key').notNull(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    chatId: integer("chat_id")
      .references(() => chats.id)
      .notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    role: userSystemEnum("role").notNull(),
  });

  // to ensure this schema is pushed into neon database .. we need a tool from drizzle called 'drizzle-kit'

  // drizzle-kit----> provides us with utility functions to create migrations and ensures our database is synced up with our schema
  // install drizzle-kit!
