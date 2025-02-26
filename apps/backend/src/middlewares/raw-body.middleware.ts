import { Injectable, NestMiddleware } from "@nestjs/common";
import { raw, Request, Response } from "express";

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    raw({ type: "*/*" })(req, res, next);
  }
}
