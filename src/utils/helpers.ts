import { ValidationError } from "./errors";

export const parseIdParam = (param: string | string[] | undefined): string => {
  if (typeof param !== "string") {
    throw new ValidationError("Invalid ID parameter");
  }

  if (!param || param.trim().length === 0) {
    throw new ValidationError("Invalid ID: cannot be empty");
  }

  return param;
};

export const parsePaginationParams = (
  page?: string | string[] | any,
  limit?: string | string[] | any
): { page: number; limit: number } => {
  const pageNum = typeof page === "string" ? parseInt(page, 10) : 1;
  const limitNum = typeof limit === "string" ? parseInt(limit, 10) : 10;

  if (isNaN(pageNum) || pageNum < 1) {
    throw new ValidationError("Invalid page number");
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new ValidationError("Invalid limit: must be between 1 and 100");
  }

  return { page: pageNum, limit: limitNum };
};
