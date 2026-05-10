import { Router } from "express";
import { authorization } from "../../middleware/authorization.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
  paginationSchema,
} from "../../utils/validation";
import {
  getMedicalRecordsController,
  getMedicalRecordByIdController,
  createMedicalRecordController,
  updateMedicalRecordController,
} from "./medical-records.controller";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.use(authorization());

router.get("/", validate(paginationSchema), getMedicalRecordsController);
router.get("/:id", getMedicalRecordByIdController);
router.post(
  "/",
  authorization(Role.DOCTOR, Role.ADMIN),
  validate(createMedicalRecordSchema),
  createMedicalRecordController
);
router.put(
  "/:id",
  validate(updateMedicalRecordSchema),
  updateMedicalRecordController
);

export default router;
