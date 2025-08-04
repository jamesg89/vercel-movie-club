import { pgTable, serial, integer, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const movie = pgTable('movie', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	year: integer('year').notNull(),
	posterUrl: varchar('poster_url', { length: 255 }),
	summary: text('summary'),
	imdbId: varchar('imdb_id', { length: 255 }),
	genre: varchar('genre', { length: 255 }),
	director: varchar('director', { length: 255 })
});

export const userLike = pgTable('user_like', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	movieId: integer('movie_id')
		.notNull()
		.references(() => movie.id),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const movieRequest = pgTable('movie_request', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	title: varchar('title', { length: 255 }).notNull(),
	year: integer('year'),
	genre: varchar('genre', { length: 255 }),
	reason: text('reason').notNull(),
	status: varchar('status', { length: 50 }).notNull().default('pending'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Movie = typeof movie.$inferSelect;
export type UserLike = typeof userLike.$inferSelect;
export type MovieRequest = typeof movieRequest.$inferSelect;
