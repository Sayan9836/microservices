import type { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/config/db';



export const auth = (..._requiredRights: string[]) => async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        data: null
      });
      return;
    }

    // Verify the token
    const decoded = verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
      email: string;
    };

    // Optionally fetch user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true
      }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
        data: null
      });
      return;
    }

    // Attach user to request object
    req.user = user

    // if (requiredRights.length > 0) {
    //   const userRights = 
    // }

    next();
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: 'Invalid token',
          data: null
        });
        return;
      }

      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Token expired',
          data: null
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
      data: null
    });
  }
};