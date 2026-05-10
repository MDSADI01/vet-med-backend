import { Router } from "express";
import { authorization } from "../../middleware/authorization.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
  createBlogSchema,
  updateBlogSchema,
  paginationSchema,
} from "../../utils/validation";
import {
  getBlogsController,
  getBlogByIdController,
  createBlogController,
  updateBlogController,
  deleteBlogController,
  getPublishedBlogsController,
} from "./blogs.controller";

const router = Router();

router.use(authorization());

router.get("/", validate(paginationSchema), getBlogsController);
router.get("/published", getPublishedBlogsController);
router.get("/:id", getBlogByIdController);
router.post("/", validate(createBlogSchema), createBlogController);
router.put("/:id", validate(updateBlogSchema), updateBlogController);
router.delete("/:id", deleteBlogController);

export default router;
