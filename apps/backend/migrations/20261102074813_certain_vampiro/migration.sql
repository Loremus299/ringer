CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"owner" text NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"expired_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_owner_users_id_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id");