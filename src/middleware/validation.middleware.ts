import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { ValidationError } from "../utils/errors";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.method === "GET") {
        req.query = schema.parse(req.query);
      } else {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        next(new ValidationError(errors[0].message));
      } else {
        next(error);
      }
    }
  };
};
