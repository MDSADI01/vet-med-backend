import { Request, Response, NextFunction } from "express";
import {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from "./animals.service";
import { parseIdParam, parsePaginationParams } from "../../utils/helpers";

export const getAnimalsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page, req.query.limit);

    const result = await getAnimals(req.user!.id, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAnimalByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const animal = await getAnimalById(id, req.user?.id);
    res.json(animal);
  } catch (error) {
    next(error);
  }
};

export const createAnimalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const animal = await createAnimal(req.body, req.user!.id);
    res.status(201).json({
      message: "Animal created successfully",
      animal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnimalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const animal = await updateAnimal(id, req.body, req.user!.id);
    res.json({
      message: "Animal updated successfully",
      animal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnimalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const result = await deleteAnimal(id, req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
