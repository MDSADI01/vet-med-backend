import { prisma } from "../../lib/prisma";
import { NotFoundError, ConflictError } from "../../utils/errors";


export const getAppointments = async (
  userId: string,
  role: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const where = role === "DOCTOR" 
    ? { doctorId: userId }
    : role === "ADMIN"
    ? {}
    : { patientId: userId };

  const appointments = await prisma.appointment.findMany({
    where,
    skip,
    take: limit,
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
    orderBy: { scheduledAt: "asc" },
  });

  const total = await prisma.appointment.count({ where });

  return {
    appointments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAppointmentById = async (id: string, userId: string, role: string) => {
  const where = role === "DOCTOR"
    ? { id, doctorId: userId }
    : role === "ADMIN"
    ? { id }
    : { id, patientId: userId };

  const appointment = await prisma.appointment.findFirst({
    where,
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
      medicalRecord: true,
    },
  });

  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }

  return appointment;
};

export const checkAvailabilityConflict = async (
  doctorId: string,
  scheduledAt: Date,
  duration: number,
  excludeAppointmentId?: string
) => {
  const startTime = new Date(scheduledAt);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const conflictingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      status: { in: ["PENDING", "CONFIRMED"] },
      ...(excludeAppointmentId && { id: { not: excludeAppointmentId } }),
    },
  });

  for (const appointment of conflictingAppointments) {
    const apptStart = new Date(appointment.scheduledAt);
    const apptEnd = new Date(apptStart.getTime() + appointment.duration * 60000);

    if (startTime < apptEnd && endTime > apptStart) {
      throw new ConflictError("Time slot is already booked");
    }
  }

  return true;
};

export const checkDoctorAvailability = async (
  doctorId: string,
  scheduledAt: Date
) => {
  const dayOfWeek = scheduledAt.getDay();
  const time = scheduledAt.toTimeString().slice(0, 5);

  const availability = await prisma.doctorAvailability.findFirst({
    where: {
      doctorId,
      dayOfWeek,
      isAvailable: true,
    },
  });

  if (!availability) {
    throw new ConflictError("Doctor is not available on this day");
  }

  const [startHour, startMin] = availability.startTime.split(":").map(Number);
  const [endHour, endMin] = availability.endTime.split(":").map(Number);
  const [scheduledHour, scheduledMin] = time.split(":").map(Number);

  const scheduledMinutes = scheduledHour * 60 + scheduledMin;
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (scheduledMinutes < startMinutes || scheduledMinutes >= endMinutes) {
    throw new ConflictError("Doctor is not available at this time");
  }

  return true;
};

export const createAppointment = async (data: any, patientId: string) => {
  const scheduledAt = new Date(data.scheduledAt);

  await checkDoctorAvailability(data.doctorId, scheduledAt);
  await checkAvailabilityConflict(data.doctorId, scheduledAt, data.duration);

  const animal = await prisma.animal.findFirst({
    where: { id: data.animalId, ownerId: patientId },
  });

  if (!animal) {
    throw new NotFoundError("Animal not found or does not belong to you");
  }

  const appointment = await prisma.appointment.create({
    data: {
      ...data,
      scheduledAt,
      patientId,
    },
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
  });

  return appointment;
};

export const updateAppointment = async (
  id: string,
  data: any,
  userId: string,
  role: string
) => {
  const where = role === "DOCTOR"
    ? { id, doctorId: userId }
    : role === "ADMIN"
    ? { id }
    : { id, patientId: userId };

  const appointment = await prisma.appointment.findFirst({
    where,
  });

  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }

  if (appointment.status === "COMPLETED" || appointment.status === "CANCELLED") {
    throw new ConflictError("Cannot update a completed or cancelled appointment");
  }

  if (data.scheduledAt || data.duration) {
    const scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : appointment.scheduledAt;
    const duration = data.duration || appointment.duration;

    await checkDoctorAvailability(appointment.doctorId, scheduledAt);
    await checkAvailabilityConflict(appointment.doctorId, scheduledAt, duration, id);
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: {
      ...data,
      ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt) }),
    },
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
  });

  return updatedAppointment;
};

export const cancelAppointment = async (id: string, userId: string, role: string) => {
  const where = role === "DOCTOR"
    ? { id, doctorId: userId }
    : role === "ADMIN"
    ? { id }
    : { id, patientId: userId };

  const appointment = await prisma.appointment.findFirst({
    where,
  });

  if (!appointment) {
    throw new NotFoundError("Appointment not found");
  }

  if (appointment.status === "CANCELLED") {
    throw new ConflictError("Appointment is already cancelled");
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
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
  });

  return updatedAppointment;
};
