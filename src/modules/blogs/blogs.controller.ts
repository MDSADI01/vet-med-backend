import { Request, Response, NextFunction } from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getPublishedBlogs,
} from "./blogs.service";

export const getBlogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(String(req.query.page || "1"));
    const limit = parseInt(String(req.query.limit || "10"));

    const result = await getBlogs(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBlogByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const blog = await getBlogById(String(id));
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

export const createBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await createBlog(req.body, req.user!.id);
    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const blog = await updateBlog(String(id), req.body, String(req.user!.id));
    res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await deleteBlog(String(id), String(req.user!.id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPublishedBlogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(String(req.query.page || "1"));
    const limit = parseInt(String(req.query.limit || "10"));

    const result = await getPublishedBlogs(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
