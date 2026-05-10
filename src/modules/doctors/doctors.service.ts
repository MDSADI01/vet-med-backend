import { prisma } from "../../lib/prisma";
import { NotFoundError, ConflictError } from "../../utils/errors";

export const getDoctorProfiles = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const profiles = await prisma.doctorProfile.findMany({
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      availability: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.doctorProfile.count();

  return {
    profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDoctorProfileById = async (id: string) => {
  const profile = await prisma.doctorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      availability: true,
    },
  });

  if (!profile) {
    throw new NotFoundError("Doctor profile not found");
  }

  return profile;
};

export const getMyDoctorProfile = async (userId: string) => {
  const profile = await prisma.doctorProfile.findUnique({
    where: { userId },
    include: {
      availability: true,
    },
  });

  if (!profile) {
    throw new NotFoundError("Doctor profile not found");
  }

  return profile;
};

export const createDoctorProfile = async (data: any, userId: string) => {
  const existingProfile = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new ConflictError("Doctor profile already exists for this user");
  }

  const existingLicense = await prisma.doctorProfile.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });

  if (existingLicense) {
    throw new ConflictError("License number already in use");
  }

  const profile = await prisma.doctorProfile.create({
    data: {
      ...data,
      userId,
    },
  });

  return profile;
};

export const updateDoctorProfile = async (id: string, data: any, userId: string) => {
  const profile = await prisma.doctorProfile.findFirst({
    where: { id, userId },
  });

  if (!profile) {
    throw new NotFoundError("Doctor profile not found");
  }

  if (data.licenseNumber && data.licenseNumber !== profile.licenseNumber) {
    const existingLicense = await prisma.doctorProfile.findUnique({
      where: { licenseNumber: data.licenseNumber },
    });

    if (existingLicense) {
      throw new ConflictError("License number already in use");
    }
  }

  const updatedProfile = await prisma.doctorProfile.update({
    where: { id },
    data,
  });

  return updatedProfile;
};

export const createAvailability = async (data: any, doctorId: string) => {
  const existingAvailability = await prisma.doctorAvailability.findFirst({
    where: {
      doctorId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
    },
  });

  if (existingAvailability) {
    throw new ConflictError("Availability for this day and time already exists");
  }

  const availability = await prisma.doctorAvailability.create({
    data: {
      ...data,
      doctorId,
    },
  });

  return availability;
};

export const updateAvailability = async (id: string, data: any, doctorId: string) => {
  const availability = await prisma.doctorAvailability.findFirst({
    where: { id, doctorId },
  });

  if (!availability) {
    throw new NotFoundError("Availability not found");
  }

  if (data.dayOfWeek !== undefined || data.startTime !== undefined) {
    const dayOfWeek = data.dayOfWeek ?? availability.dayOfWeek;
    const startTime = data.startTime ?? availability.startTime;

    const existingAvailability = await prisma.doctorAvailability.findFirst({
      where: {
        doctorId,
        dayOfWeek,
        startTime,
        id: { not: id },
      },
    });

    if (existingAvailability) {
      throw new ConflictError("Availability for this day and time already exists");
    }
  }

  const updatedAvailability = await prisma.doctorAvailability.update({
    where: { id },
    data,
  });

  return updatedAvailability;
};

export const deleteAvailability = async (id: string, doctorId: string) => {
  const availability = await prisma.doctorAvailability.findFirst({
    where: { id, doctorId },
  });

  if (!availability) {
    throw new NotFoundError("Availability not found");
  }

  await prisma.doctorAvailability.delete({
    where: { id },
  });

  return { message: "Availability deleted successfully" };
};
