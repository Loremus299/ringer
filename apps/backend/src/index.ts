import { apiReference } from "@scalar/express-api-reference";
import express from "express";
import docs from "./docs";
import env from "./env";
import loggerWare from "./log";
import authRouter from "./auth";

const app = express();
docs.servers([
  {
    url: `http://localhost:${env.port}`,
    description: "Local development server",
  },
  {
    url: "${env.backend}",
    description: "Environment variable"
  }
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
app.use("/auth", authRouter)

app.listen(env.port, () => console.log(`Server Up - ${env.port}`));
