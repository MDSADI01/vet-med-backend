import { Router } from "express";
import { authorization } from "../../middleware/authorization.middleware";
import { validate } from "../../middleware/validation.middleware";
import { z } from "zod";


import {
  getUsersController,
  getUserByIdController,
  updateUserRoleController,
} from "./users.controller";
import { Role } from "../../generated/prisma/enums";

const updateRoleSchema = z.object({
  role: z.enum(["USER", "DOCTOR", "ADMIN"]),
});

const router = Router();

router.use(authorization());

router.get("/", authorization(Role.ADMIN), getUsersController);
router.get("/:id", getUserByIdController);
router.patch(
  "/:id/role",
  authorization(Role.ADMIN),
  validate(updateRoleSchema),
  updateUserRoleController
);

export default router;
