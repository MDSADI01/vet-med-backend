import { NextFunction, Request, Response } from "express";

import { Role } from "../generated/prisma/enums";
import { auth } from "../lib/auth";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export const authorization = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };

    if (roles.length && !roles.includes(req.user.role as Role)) {
      return res.status(401).json({
        success: false,
        message: "Forbidden!You are not authorized to access this page",
      });
    }
    next();
  };
};
