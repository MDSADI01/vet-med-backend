import { Request, Response, NextFunction } from "express";
import { getUsers, getUserById, updateUserRole } from "./users.service";
import { parseIdParam, parsePaginationParams } from "../../utils/helpers";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page, req.query.limit);

    const result = await getUsers(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const user = await getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const user = await updateUserRole(id, req.body.role);
    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
