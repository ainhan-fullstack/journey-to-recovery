import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import jwt from 'jsonwebtoken';

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

interface UserPayLoad {
  id: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user: UserPayLoad;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' })
  } 

  try {
    const decoded = (jwt.verify(token, process.env.JWT_SECRET as string)) as UserPayLoad;
    req.user = decoded;
    next();
  }
  catch(error) {
    return res.status(403).json({ message: 'Invalid token.' })
  }
}

export { validateBody, authenticateToken };
