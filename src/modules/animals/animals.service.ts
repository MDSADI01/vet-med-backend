import { prisma } from "../../lib/prisma";
import { NotFoundError, ConflictError } from "../../utils/errors";

export const getAnimals = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const animals = await prisma.animal.findMany({
    where: { ownerId: userId },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.animal.count({ where: { ownerId: userId } });

  return {
    animals,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAnimalById = async (id: string, userId: string | undefined) => {
  if (!userId) {
    throw new NotFoundError("User not authenticated");
  }

  const animal = await prisma.animal.findFirst({
    where: { id, ownerId: userId },
  });

  if (!animal) {
    throw new NotFoundError("Animal not found");
  }

  return animal;
};

export const createAnimal = async (data: any, userId: string) => {
  const animal = await prisma.animal.create({
    data: {
      ...data,
      ownerId: userId,
    },
  });

  return animal;
};

export const updateAnimal = async (id: string, data: any, userId: string) => {
  const animal = await prisma.animal.findFirst({
    where: { id, ownerId: userId },
  });

  if (!animal) {
    throw new NotFoundError("Animal not found");
  }

  const updatedAnimal = await prisma.animal.update({
    where: { id },
    data,
  });

  return updatedAnimal;
};

export const deleteAnimal = async (id: string, userId: string) => {
  const animal = await prisma.animal.findFirst({
    where: { id, ownerId: userId },
  });

  if (!animal) {
    throw new NotFoundError("Animal not found");
  }

  await prisma.animal.delete({
    where: { id },
  });

  return { message: "Animal deleted successfully" };
};
