import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      org?: {
        orgId: string;
        orgAlias: string;
      };
    }
  }
}
