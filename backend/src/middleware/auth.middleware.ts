import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token;

  console.log('--- Auth Middleware Debug ---');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Auth Header:', req.headers.authorization ? 'Present' : 'Missing');
  console.log('Cookies Header:', req.headers.cookie ? 'Present' : 'Missing');

  // Check Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check Cookies
  else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    console.log('Available Cookies:', Object.keys(cookies));
    token = cookies.token;
  }

  console.log('Final Token:', token ? 'Token Found' : 'Token NOT FOUND');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized No token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token Verification:', 'SUCCESS');
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    console.log('Token Verification:', 'FAILED', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized token failed' });
  }
};
