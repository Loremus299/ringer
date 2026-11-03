import { type ZodType, z } from "zod";

export const e400 = z.array(z.any());

interface LycheeError {
	description: string;
	type: string;
	zod: ZodType;
}

export function e404(resource: string): LycheeError {
	return {
		description: "Resource not found",
		type: "text/plain",
		zod: z.literal(resource),
	};
}

export function e409(resource: string): LycheeError {
	return {
		description: "Resource Conflict",
		type: "text/plain",
		zod: z.literal(resource),
	};
}

export function e500(): LycheeError {
	return {
		description: "Internal Server Error",
		type: "text/plain",
		zod: z.literal("Internal Server Error"),
	};
}

export function e401(resource: string): LycheeError {
	return {
		description: "Unauthenticated Resource access",
		type: "text/plain",
		zod: z.literal(resource),
	};
}
