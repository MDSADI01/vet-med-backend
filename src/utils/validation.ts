import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
  role: z.enum(["USER", "DOCTOR", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "DOCTOR", "ADMIN"]),
});

export const createAnimalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
});

export const updateAnimalSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  species: z.string().min(1, "Species is required").optional(),
  breed: z.string().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
});

export const createDoctorProfileSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  yearsOfExperience: z.number().optional(),
});

export const updateDoctorProfileSchema = z.object({
  specialty: z.string().min(1, "Specialty is required").optional(),
  licenseNumber: z.string().min(1, "License number is required").optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  yearsOfExperience: z.number().optional(),
});

export const createAvailabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6, "Day must be between 0 and 6"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  isAvailable: z.boolean().optional(),
});

export const updateAvailabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6, "Day must be between 0 and 6").optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)").optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)").optional(),
  isAvailable: z.boolean().optional(),
});

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  animalId: z.string().min(1, "Animal ID is required"),
  scheduledAt: z.string().or(z.date()),
  duration: z.number().positive("Duration must be a positive number").optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  scheduledAt: z.string().or(z.date()).optional(),
  duration: z.number().positive("Duration must be a positive number").optional(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const createMedicalRecordSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment: z.string().min(1, "Treatment is required"),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().or(z.date()).optional(),
});

export const updateMedicalRecordSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required").optional(),
  treatment: z.string().min(1, "Treatment is required").optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().or(z.date()).optional(),
});

export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default("1"),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default("10"),
});

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Invalid image URL").optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  image: z.string().url("Invalid image URL").optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAnimalInput = z.infer<typeof createAnimalSchema>;
export type UpdateAnimalInput = z.infer<typeof updateAnimalSchema>;
export type CreateDoctorProfileInput = z.infer<typeof createDoctorProfileSchema>;
export type UpdateDoctorProfileInput = z.infer<typeof updateDoctorProfileSchema>;
export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
