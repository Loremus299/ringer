import { apiReference } from "@scalar/express-api-reference";
import express from "express";
import authRouter from "./auth";
import docs from "./docs";
import env from "./env";
import loggerWare from "./log";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
docs.servers([
	{
		url: `http://localhost:${env.port}`,
		description: "Local development server",
	},
	{
		url: "${env.backend}",
		description: "Environment variable",
	},
]);
app.get("/openapi", (_req, res) => res.json(docs.docs));
app.get(
	"/",
	apiReference({
		url: "/openapi",
		theme: "elysiajs",
		showDeveloperTools: "never",
		showOperationId: true,
	}),
);
app.use(loggerWare);
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		exposedHeaders: ["X-Request-Id"],
	}),
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);

app.listen(env.port, () => console.log(`Server Up - ${env.port}`));
