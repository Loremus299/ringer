import {
	authSessionPostBody,
	authSessionPostHeaders,
	authUserPostBody,
	authUserPostHeaders,
} from "@ringer/schemas";
import { Router } from "express";
import userPost from "./user.post";
import sessionPost from "./session.post";
import sessionGet from "./get.session";
import authMiddleware, { type AuthedRequest } from "./middleware";

const authRouter = Router();
authRouter.post("/user", async (req, res) => {
	try {
		const body = authUserPostBody.parse(req.body);
		const header = authUserPostHeaders.parse(req.headers);

		const data = await userPost(
			{ body, header },
			req.log.nest("Create user service"),
		);
		if (201 in data)
			return res
				.status(201)
				.cookie("session", data[201], {
					httpOnly: true,
					secure: true,
					sameSite: "lax",
					maxAge: 24 * 60 * 60 * 1000,
				})
				.cookie("loggedIn", "true", {
					httpOnly: false,
					secure: true,
					sameSite: "lax",
					maxAge: 24 * 60 * 60 * 1000,
				})
				.type("text/plain")
				.send(data[201]);
		if (409 in data) return res.status(409).type("text/plain").send(data[409]);
		if (500 in data) return res.status(500).type("text/plain").send(data[500]);
	} catch (e) {
		//@ts-expect-error
		return res.status(400).json({ errors: e.issues });
	}
});
authRouter.post("/session", async (req, res) => {
	try {
		const body = authSessionPostBody.parse(req.body);
		const header = authSessionPostHeaders.parse(req.headers);

		const data = await sessionPost(
			{ body, header },
			req.log.nest("Create session service"),
		);
		if (201 in data)
			return res
				.status(201)
				.cookie("session", data[201], {
					httpOnly: true,
					secure: true,
					sameSite: "lax",
					maxAge: 24 * 60 * 60 * 1000,
				})
				.cookie("loggedIn", "true", {
					httpOnly: false,
					secure: true,
					sameSite: "lax",
					maxAge: 24 * 60 * 60 * 1000,
				})
				.type("text/plain")
				.send(data[201]);
		if (404 in data) return res.status(404).type("text/plain").send(data[404]);
		if (500 in data) return res.status(500).type("text/plain").send(data[500]);
	} catch (e) {
		//@ts-expect-error
		return res.status(400).json({ errors: e.issues });
	}
});
authRouter.get("/session", authMiddleware, async (req, res) => {
	try {
		const { user, session } = req as AuthedRequest;

		const data = await sessionGet(
			{},
			user.id,
			session.token,
			req.log.nest("Service"),
		);
		if (500 in data) return res.status(500).type("text/plain").send(data[500]);
		if (200 in data) return res.status(200).json(data[200]);
	} catch (e) {
		//@ts-expect-error
		return res.status(400).json({ errors: e.issues });
	}
});
export default authRouter;
