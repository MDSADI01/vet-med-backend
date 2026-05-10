import { prisma } from "../../lib/prisma";
import { NotFoundError, ConflictError } from "../../utils/errors";

export const getMedicalRecords = async (
  userId: string,
  role: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const where = role === "DOCTOR"
    ? { appointment: { doctorId: userId } }
    : role === "ADMIN"
    ? {}
    : { animal: { ownerId: userId } };

  const records = await prisma.medicalRecord.findMany({
    where,
    skip,
    take: limit,
    include: {
      appointment: {
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          doctor: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          animal: true,
        },
      },
      animal: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.medicalRecord.count({ where });

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMedicalRecordById = async (id: string, userId: string, role: string) => {
  const where = role === "DOCTOR"
    ? {
        id,
        appointment: { doctorId: userId },
      }
    : role === "ADMIN"
    ? { id }
    : {
        id,
        animal: { ownerId: userId },
      };

  const record = await prisma.medicalRecord.findFirst({
    where,
    include: {
      appointment: {
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          doctor: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          animal: true,
        },
      },
      animal: true,
    },
  });

  if (!record) {
    throw new NotFoundError("Medical record not found");
  }

  return record;
};

export const createMedicalRecord = async (data: any, doctorId: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
    include: { animal: true },
  });

  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }

  if (appointment.doctorId !== doctorId) {
    throw new ConflictError("You can only create medical records for your own appointments");
  }

  if (appointment.status !== "COMPLETED") {
    throw new ConflictError("Medical records can only be created for completed appointments");
  }

  const existingRecord = await prisma.medicalRecord.findUnique({
    where: { appointmentId: data.appointmentId },
  });

  if (existingRecord) {
    throw new ConflictError("Medical record already exists for this appointment");
  }

  const record = await prisma.medicalRecord.create({
    data: {
      ...data,
      animalId: appointment.animalId,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
    },
    include: {
      appointment: {
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          doctor: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          animal: true,
        },
      },
      animal: true,
    },
  });

  return record;
};

export const updateMedicalRecord = async (
  id: string,
  data: any,
  userId: string,
  role: string
) => {
  const where = role === "DOCTOR"
    ? {
        id,
        appointment: { doctorId: userId },
      }
    : role === "ADMIN"
    ? { id }
    : {
        id,
        animal: { ownerId: userId },
      };

  const record = await prisma.medicalRecord.findFirst({
    where,
  });

  if (!record) {
    throw new NotFoundError("Medical record not found");
  }

  const updatedRecord = await prisma.medicalRecord.update({
    where: { id },
    data: {
      ...data,
      ...(data.followUpDate && { followUpDate: new Date(data.followUpDate) }),
    },
    include: {
      appointment: {
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          doctor: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          animal: true,
        },
      },
      animal: true,
    },
  });

  return updatedRecord;
};
