import { Router } from "express";
import { authorization } from "../../middleware/authorization.middleware";
import { validate } from "../../middleware/validation.middleware";

import {
  createDoctorProfileSchema,
  updateDoctorProfileSchema,
  createAvailabilitySchema,
  updateAvailabilitySchema,
  paginationSchema,
} from "../../utils/validation";
import {
  getDoctorProfilesController,
  getDoctorProfileByIdController,
  getMyDoctorProfileController,
  createDoctorProfileController,
  updateDoctorProfileController,
  createAvailabilityController,
  updateAvailabilityController,
  deleteAvailabilityController,
} from "./doctors.controller";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.get("/", validate(paginationSchema), getDoctorProfilesController);
router.get("/:id", getDoctorProfileByIdController);

router.get("/my/profile", authorization(Role.DOCTOR), getMyDoctorProfileController);
router.post(
  "/my/profile",
  authorization(Role.DOCTOR),
  validate(createDoctorProfileSchema),
  createDoctorProfileController
);
router.put(
  "/my/profile/:id",
  authorization(Role.DOCTOR),
  validate(updateDoctorProfileSchema),
  updateDoctorProfileController
);

router.post(
  "/:doctorId/availability",
  authorization(Role.DOCTOR, Role.ADMIN),
  validate(createAvailabilitySchema),
  createAvailabilityController
);
router.put(
  "/:doctorId/availability/:id",
  authorization(Role.DOCTOR, Role.ADMIN),
  validate(updateAvailabilitySchema),
  updateAvailabilityController
);

router.delete(
  "/:doctorId/availability/:id",
  authorization(Role.DOCTOR, Role.ADMIN),
  deleteAvailabilityController
);

export default router;
