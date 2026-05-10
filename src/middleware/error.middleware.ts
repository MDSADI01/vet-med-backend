import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.ts";
import { AppError, ConflictError, NotFoundError, ValidationError } from "../utils/errors";

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case "P2002":
      const target = error.meta?.target as string[];
      const field = target ? target.join(", ") : "field";
      return new ConflictError(`A record with this ${field} already exists`);

    case "P2025":
      return new NotFoundError("Record not found");

    case "P2003":
      return new ValidationError("Foreign key constraint failed");

    case "P2014":
      return new ConflictError("The change would violate a required relation");

    case "P2011":
      return new ValidationError("Null constraint violation");

    case "P2000":
      return new ValidationError("Value too long for the field");

    case "P2006":
      return new ValidationError("Invalid value for field");

    case "P2009":
      return new ValidationError("Failed to validate the query");

    case "P2018":
      return new ValidationError("Required connected records not found");

    case "P2019":
      return new ValidationError("Input error");

    case "P2020":
      return new ValidationError("Value out of range");

    case "P2021":
      return new ValidationError("Table does not exist");

    case "P2022":
      return new ValidationError("Column does not exist");

    case "P2023":
      return new ValidationError("Inconsistent column data");

    case "P2024":
      return new ConflictError("Connection pool timeout");

    case "P2026":
      return new ValidationError("Current provider does not support this feature");

    case "P2027":
      return new ValidationError("Multiple errors occurred");

    case "P2030":
      return new ValidationError("Full text search is not supported");

    case "P2031":
      return new ValidationError("Multiple fields with the same name");

    case "P2033":
      return new ValidationError("Invalid number of arguments");

    case "P2034":
      return new ConflictError("Transaction failed due to write conflict");

    default:
      console.error("Unhandled Prisma error:", error);
      return new AppError(500, "Database error occurred");
  }
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        type: err.constructor.name,
      }),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = handlePrismaError(err);
    return res.status(appError.statusCode).json({
      error: appError.message,
      ...(process.env.NODE_ENV === "development" && {
        prismaCode: err.code,
        meta: err.meta,
      }),
    });
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(500).json({
      error: "Unknown database error",
      ...(process.env.NODE_ENV === "development" && {
        message: err.message,
      }),
    });
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({
      error: "Database connection panic",
      ...(process.env.NODE_ENV === "development" && {
        message: err.message,
      }),
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      error: "Database connection failed",
      ...(process.env.NODE_ENV === "development" && {
        message: err.message,
        errorCode: err.errorCode,
      }),
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: "Invalid database query",
      ...(process.env.NODE_ENV === "development" && {
        message: err.message,
      }),
    });
  }

  return res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      message: err.message,
      stack: err.stack,
    }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
};
