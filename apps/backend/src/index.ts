import express from "express";
import env from "./env";
import loggerWare from "./log";

const app = express();
app.use(loggerWare)

app.listen(env.port, () => console.log(`Server Up - ${process.env.PORT}`));
