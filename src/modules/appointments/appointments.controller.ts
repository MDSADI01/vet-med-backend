import { Request, Response, NextFunction } from "express";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} from "./appointments.service";
import { parseIdParam, parsePaginationParams } from "../../utils/helpers";

export const getAppointmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page, req.query.limit);

    const result = await getAppointments(
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

export const getAppointmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const appointment = await getAppointmentById(id, req.user!.id, req.user!.role);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const createAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await createAppointment(req.body, req.user!.id);
    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const appointment = await updateAppointment(id, req.body, req.user!.id, req.user!.role);
    res.json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseIdParam(req.params.id);
    const appointment = await cancelAppointment(id, req.user!.id, req.user!.role);
    res.json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
