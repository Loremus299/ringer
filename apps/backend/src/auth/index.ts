import { Router } from "express";

const authRouter = Router()
authRouter.post("/user", (_req, res) => res.status(200))
export default authRouter
