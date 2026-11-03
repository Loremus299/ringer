import { authMiddlewareCookie } from "@ringer/schemas";
import docs from "../docs";
import { e401, e500 } from "@ringer/schemas/errors";

export const authDocs = docs.middleware("/auth", {});
export const authProtectedDocs = authDocs.middleware("", {
	cookie: authMiddlewareCookie,
	responses: {
		401: e401("user session"),
		500: e500(),
	},
});
