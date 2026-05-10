import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { notFoundHandler, errorHandler } from "../middleware/error.middleware";
import { setupSwagger } from "../swagger/swagger";

import userRoutes from "../modules/users/users.routes";
import animalRoutes from "../modules/animals/animals.routes";
import doctorRoutes from "../modules/doctors/doctors.routes";
import appointmentRoutes from "../modules/appointments/appointments.routes";
import medicalRecordRoutes from "../modules/medical-records/medical-records.routes";
import blogRoutes from "../modules/blogs/blogs.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Vet Clinic API - Production Ready");
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/users", userRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/blogs", blogRoutes);

setupSwagger(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
