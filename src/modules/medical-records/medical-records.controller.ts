import { Request, Response, NextFunction } from "express";
import {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
} from "./medical-records.service";
import { parseIdParam, parsePaginationParams } from "../../utils/helpers";

export const getMedicalRecordsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page, req.query.limit);

    const result = await getMedicalRecords(
      req.user!.id,
      req.user!.role,
      page,
      limit
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMedicalRecordByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const record = await getMedicalRecordById(id, req.user!.id, req.user!.role);
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const createMedicalRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await createMedicalRecord(req.body, req.user!.id);
    res.status(201).json({
      message: "Medical record created successfully",
      record,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedicalRecordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const record = await updateMedicalRecord(id, req.body, req.user!.id, req.user!.role);
    res.json({
      message: "Medical record updated successfully",
      record,
    });
  } catch (error) {
    next(error);
  }
};
