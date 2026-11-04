import { e400, e404, e500 } from "@ringer/schemas/errors";
import { authDocs } from "./docs";
import {
	authSessionPostBody,
	authSessionPostHeaders,
	authSessionPostResponse,
} from "@ringer/schemas";
import type Logger from "@loremus299/strawberry";
import db from "../../db";
import { sessionTable, usersTable } from "../../db/schema";
import Result from "@loremus299/pineapple";
import { DrizzleError, eq } from "drizzle-orm";
import { createHash } from "node:crypto";
import argon2 from "argon2";

const route = authDocs.path("/session", "post", {
	summary: "New Session",
	description:
		"Create new session for an existing user. Session token returned in cookie and body.",
	operationId: "auth-post-session",
	tags: ["Auth"],
});

const action = route.documentFunction({
	body: {
		type: "application/json",
		description: "Email and password",
		required: true,
		zod: authSessionPostBody,
	},
	header: authSessionPostHeaders,
	responses: {
		201: {
			description: "Session Token",
			type: "text/plain",
			zod: authSessionPostResponse,
		},
		404: e404("user"),
		500: e500(),
	},
});
route.response(400, "Failed to parse request body", "application/json", e400);

const sessionPost = action(async ({ body, header }, log: Logger) => {
	log.debug("action", { body, header });

	log.trace("op", "verify user");
	const user = (
		await Result.tryCatch(
			() =>
				db.select().from(usersTable).where(eq(usersTable.email, body.email)),
			DrizzleError,
		)
	).onError((e) => log.error("server error", { error: e, type: typeof e }));
	if (!user.outcome.success) return { "500": "Internal Server Error" };
	if (user.outcome.data.length == 0) return { "404": "user" };
	const ud = user.outcome.data[0]!;
	log.debug("user details", ud);

	log.trace("op", "verify password");
	const verification = (
		await Result.tryCatch(
			() => argon2.verify(ud.password, body.password),
			Error,
		)
	).onError((e) => log.error("server error", { error: e, type: typeof e }));
	if (!verification.outcome.success) return { "500": "Internal Server Error" };
	if (!verification.outcome.data) return { "404": "user" };

	log.trace("op", "create session");
	const token = `ringer-session-${globalThis.crypto.randomUUID()}`;
	const tokenHash = createHash("sha256").update(token).digest("hex");
	const session = (
		await Result.tryCatch(
			() =>
				db
					.insert(sessionTable)
					.values({
						owner: ud.id,
						token: tokenHash,
						userAgent: header["user-agent"],
					})
					.returning(),
			DrizzleError,
		)
	)
		.one()
		.onError((e) => log.error("server error", { error: e, type: typeof e }));

	if (!session.outcome.success) return { "500": "Internal Server Error" };
	log.debug("session details", session.outcome.data);

	return { "201": token };
});
export default sessionPost;
