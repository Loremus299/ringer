import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => globalThis.crypto.randomUUID()),

	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
});

export const sessionTable = pgTable("sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => globalThis.crypto.randomUUID()),

	owner: text("owner")
		.references(() => usersTable.id)
		.notNull(),
	token: text("token").notNull().unique(),
	userAgent: text("user_agent").notNull(),

	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	expiredAt: timestamp("expired_at")
		.$defaultFn(() => new Date(Date.now() + 24 * 60 * 60 * 1000))
		.notNull(),
});
