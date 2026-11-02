import Logger from "@loremus299/strawberry";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      log: Logger;
    }
  }
}

export default function loggerWare(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();
  req.log = new Logger();
  req.log.info("Request", `${req.method} ${req.url}`);
  res.setHeader("X-Request-Id", req.log.id)

  res.on("close", async () => {
    req.log.info("Response", `${res.statusCode}, ${Date.now() - start}ms`)
    await req.log.dump();
  });
  return next();
}
