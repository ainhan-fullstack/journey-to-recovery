import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utilities/jwtBlackList";

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

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  if (await isTokenBlacklisted(token)) {
    return res.status(403).json({ message: "Invalid Token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
}

export { validateBody, authenticateToken };
