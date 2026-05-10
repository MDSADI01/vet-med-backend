import { Router } from "express";
import { authorization } from "../../middleware/authorization.middleware";
import { validate } from "../../middleware/validation.middleware";

import {
  createAnimalSchema,
  updateAnimalSchema,
  paginationSchema,
} from "../../utils/validation";
import {
  getAnimalsController,
  getAnimalByIdController,
  createAnimalController,
  updateAnimalController,
  deleteAnimalController,
} from "./animals.controller";

const router = Router();

router.use(authorization());

router.get("/", validate(paginationSchema), getAnimalsController);
router.get("/:id", getAnimalByIdController);
router.post("/", validate(createAnimalSchema), createAnimalController);
router.put("/:id", validate(updateAnimalSchema), updateAnimalController);
router.delete("/:id", deleteAnimalController);

export default router;
