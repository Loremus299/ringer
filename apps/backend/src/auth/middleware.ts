import { authMiddlewareCookie } from "@ringer/schemas";
import type { NextFunction, Request, Response } from "express";
import db from "../../db";
import Result, { NoRows } from "@loremus299/pineapple";
import { sessionTable, usersTable } from "../../db/schema";
import { DrizzleError, eq, and, gt, lt } from "drizzle-orm";
import { createHash } from "node:crypto";

export type AuthedRequest = Request & {
	user: { id: string; email: string };
	session: { token: string };
};

export default async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		req.log.info("middleware", "Auth middleware");
		req.log = req.log.nest("Next");

		const cookies = authMiddlewareCookie.parse(req.cookies);
		req.log.debug("session cookie", cookies);
		const tokenHash = createHash("sha256")
			.update(cookies.session)
			.digest("hex");

		const session = (
			await Result.tryCatch(
				() =>
					db
						.select()
						.from(sessionTable)
						.innerJoin(usersTable, eq(sessionTable.owner, usersTable.id))
						.where(
							and(
								eq(sessionTable.token, tokenHash),
								gt(sessionTable.expiredAt, new Date()),
							),
						),
				DrizzleError,
			)
		).one();

		if (!session.outcome.success && session.outcome.error == NoRows) {
			return res.status(401).type("text/plain").send("user session");
		}

		if (!session.outcome.success)
			return res.status(500).type("text/plain").send("Internal Server Error");

		(req as AuthedRequest).session = {
			token: session.outcome.data.sessions.token,
		};
		(req as AuthedRequest).user = {
			id: session.outcome.data.users.id,
			email: session.outcome.data.users.email,
		};
		next();
	} catch (e) {
		//@ts-expect-error
		return res.status(400).json({ errors: e.issues });
	}
}
