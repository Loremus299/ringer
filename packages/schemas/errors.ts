import { type ZodType, z } from "zod";

export const e400 = z.array(z.any());

interface LycheeError {
	description: string;
	type: string;
	zod: ZodType;
}

export function e409(): LycheeError {
	return {
		description: "Resource Conflict",
		type: "text/plain",
		zod: z.string(),
	};
}

export function e500(): LycheeError {
	return {
		description: "Internal Server Error",
		type: "text/plain",
		zod: z.literal("Internal Server Error"),
	};
}
