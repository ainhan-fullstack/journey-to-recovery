import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_SECRET as string, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET as string, { expiresIn: '7d' });
};