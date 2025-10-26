import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";

function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ details: error.issues });
      }
      next(error);
    }
  };
}

export { validateBody };
