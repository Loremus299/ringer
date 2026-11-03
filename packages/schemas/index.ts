import z from "zod";
import zxcvbn from "zxcvbn";

export const authUserPostBody = z.object({
	name: z.string().min(4).max(50),
	email: z.email(),
	password: z.string().refine((v) => zxcvbn(v).score > 2, "Weak password"),
});

export const authUserPostHeaders = z.object({
	"user-agent": z.string(),
});

export const authUserPostResponse = z.string().startsWith("ringer-session-");

export const authSessionPostBody = z.object({
	email: z.email(),
	password: z.string(),
});

export const authSessionPostHeaders = z.object({
	"user-agent": z.string(),
});

export const authSessionPostResponse = z.string().startsWith("ringer-session-");
