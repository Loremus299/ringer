import { e400, e500 } from "@ringer/schemas/errors";
import { authProtectedDocs } from "./docs";
import { authSessionGetResponse } from "@ringer/schemas";
import type Logger from "@loremus299/strawberry";
import Result from "@loremus299/pineapple";
import db from "../../db";
import { sessionTable } from "../../db/schema";
import { DrizzleError, eq } from "drizzle-orm";

const route = authProtectedDocs.path("/session", "get", {
	summary: "Get Sessions",
	description: "Get user sessions for the current user",
	operationId: "auth-get-sessions",
	tags: ["Auth"],
});

const action = route.documentFunction({
	responses: {
		200: {
			description: "User session JSON Array",
			type: "application/json",
			zod: authSessionGetResponse,
		},
		500: e500(),
	},
});
route.response(400, "Failed to parse request body", "application/json", e400);

const sessionGet = action(
	async ({}, userId: string, currentToken: string, log: Logger) => {
		log.debug("action", userId);

		log.trace("op", "session query");
		const query = (
			await Result.tryCatch(
				() =>
					db.select().from(sessionTable).where(eq(sessionTable.owner, userId)),
				DrizzleError,
			)
		).onError((e) => log.error("server error", { error: e, type: typeof e }));
		if (!query.outcome.success) return { "500": "Internal Server Error" };
		log.debug("sessions", query.outcome.data);

		return {
			"200": query.outcome.data.map((item) => ({
				current: item.token == currentToken,
				id: item.id,
				userAgent: item.userAgent,
				createdAt: item.createdAt.toISOString(),
				expiration: item.expiredAt.toISOString(),
			})),
		};
	},
);
export default sessionGet;
