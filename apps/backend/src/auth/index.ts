import { authUserPostBody, authUserPostHeaders } from "@ringer/schemas";
import { Router } from "express";
import userPost from "./user.post";

const authRouter = Router();
authRouter.post("/user", async (req, res) => {
	try {
		const body = authUserPostBody.parse(req.body);
		const header = authUserPostHeaders.parse(req.headers);

		const data = await userPost(
			{ body, header },
			req.log.nest("Create user service"),
		);
		if (201 in data) return res.status(201).type("text/plain").send(data[201]);
		if (409 in data) return res.status(409).type("text/plain").send(data[409]);
		if (500 in data) return res.status(500).type("text/plain").send(data[500]);
	} catch (e) {
		//@ts-expect-error
		return res.status(400).json({ errors: e.issues });
	}
});
export default authRouter;
