import { Router } from "express";
import { authorization } from "../../middleware/authorization.middleware";
import { validate } from "../../middleware/validation.middleware";

import {
  createAppointmentSchema,
  updateAppointmentSchema,
  paginationSchema,
} from "../../utils/validation";
import {
  getAppointmentsController,
  getAppointmentByIdController,
  createAppointmentController,
  updateAppointmentController,
  cancelAppointmentController,
} from "./appointments.controller";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.use(authorization());

router.get("/", validate(paginationSchema), getAppointmentsController);
router.get("/:id", getAppointmentByIdController);
router.post(
  "/",
  authorization(Role.USER, Role.ADMIN),
  validate(createAppointmentSchema),
  createAppointmentController
);
router.put(
  "/:id",
  validate(updateAppointmentSchema),
  updateAppointmentController
);
router.patch("/:id/cancel", cancelAppointmentController);

export default router;
