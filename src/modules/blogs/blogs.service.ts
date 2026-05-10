import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export const getBlogs = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.blog.count();

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getBlogById = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  return blog;
};

export const createBlog = async (data: any, authorId: string) => {
  const blog = await prisma.blog.create({
    data: {
      ...data,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return blog;
};

export const updateBlog = async (id: string, data: any, authorId: string) => {
  const blog = await prisma.blog.findFirst({
    where: { id, authorId },
  });

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return updatedBlog;
};

export const deleteBlog = async (id: string, authorId: string) => {
  const blog = await prisma.blog.findFirst({
    where: { id, authorId },
  });

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  await prisma.blog.delete({
    where: { id },
  });

  return { message: "Blog deleted successfully" };
};

export const getPublishedBlogs = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const blogs = await prisma.blog.findMany({
    where: { published: true },
    skip,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.blog.count({ where: { published: true } });

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
