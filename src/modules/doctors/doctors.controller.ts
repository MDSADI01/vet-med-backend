import { Request, Response, NextFunction } from "express";
import {
  getDoctorProfiles,
  getDoctorProfileById,
  getMyDoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "./doctors.service";
import { parseIdParam, parsePaginationParams } from "../../utils/helpers";

export const getDoctorProfilesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page, req.query.limit);

    const result = await getDoctorProfiles(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDoctorProfileByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const profile = await getDoctorProfileById(id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const getMyDoctorProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await getMyDoctorProfile(req.user!.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const createDoctorProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await createDoctorProfile(req.body, req.user!.id);
    res.status(201).json({
      message: "Doctor profile created successfully",
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const profile = await updateDoctorProfile(id, req.body, req.user!.id);
    res.json({
      message: "Doctor profile updated successfully",
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const createAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = parseIdParam(req.params.doctorId);
    const availability = await createAvailability(req.body, doctorId);
    res.status(201).json({
      message: "Availability created successfully",
      availability,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const doctorId = parseIdParam(req.params.doctorId);
    const availability = await updateAvailability(id, req.body, doctorId);
    res.json({
      message: "Availability updated successfully",
      availability,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const doctorId = parseIdParam(req.params.doctorId);
    const result = await deleteAvailability(id, doctorId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
