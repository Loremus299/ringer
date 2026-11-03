import { e409, e500 } from "@ringer/schemas/errors";
import { authDocs } from "./docs";
import {
	authUserPostBody,
	authUserPostHeaders,
	authUserPostResponse,
} from "@ringer/schemas";
import type Logger from "@loremus299/strawberry";
import argon2 from "argon2";
import Result, { NoRows } from "@loremus299/pineapple";
import db from "../../db";
import { sessionTable, usersTable } from "../../db/schema";
import { DrizzleError } from "drizzle-orm";
import { createHash } from "node:crypto";

const route = authDocs.path("/user", "post", {
	summary: "New User",
	description: "Create new user account and a session",
	operationId: "auth-post-user",
	tags: ["Auth"],
});

const action = route.documentFunction({
	body: {
		type: "application/json",
		description: "Name, email and password",
		required: true,
		zod: authUserPostBody,
	},
	header: authUserPostHeaders,
	responses: {
		201: {
			description: "Session Token",
			type: "text/plain",
			zod: authUserPostResponse,
		},
		409: e409(),
		500: e500(),
	},
});

const userPost = action(async ({ body, header }, log: Logger) => {
	log.debug("action", { body, header });

	log.trace("op", "hash password");
	const hp = await Result.tryCatch(
		async () => argon2.hash(body.password),
		Error,
	);
	if (!hp.outcome.success) return { "500": "Internal Server Error" };
	const hashedPassword = hp.outcome.data;
	log.debug("hashed password", hashedPassword);

	log.trace("op", "create user");
	const user = (
		await Result.tryCatch(
			async () =>
				db
					.insert(usersTable)
					.values({ ...body, password: hashedPassword })
					.onConflictDoNothing()
					.returning(),
			DrizzleError,
		)
	)
		.one()
		.onError((e) => log.error("server error", { error: e, type: typeof e }));

	if (!user.outcome.success) {
		if (user.outcome.error == NoRows) return { "409": "email" };
		return { "500": "Internal Server Error" };
	}
	const ud = user.outcome.data;
	log.debug("user details", ud);

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
export default userPost;
