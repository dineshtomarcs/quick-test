import { json, Request, Response } from "express";
import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    json()(req, res, next);
  }
}
