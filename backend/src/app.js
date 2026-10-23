require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { notFound, errorHandler } = require("./middleware/errors");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: (process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5500").split(",").map(s => s.trim()),
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"]
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false, message: { message: "Too many login attempts. Try again later." } });
app.use("/api", generalLimiter);
app.use("/api/v1/auth/login", authLimiter);

app.get("/api/v1/health", (req, res) => res.json({ status: "ok", service: "kishori-global-hospitals-api" }));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/appointments", require("./routes/appointmentRoutes"));
app.use("/api/v1/contacts", require("./routes/contactRoutes"));
app.use("/api/v1/patients", require("./routes/patientRoutes"));
app.use("/api/v1/doctors", require("./routes/doctorRoutes"));
app.use("/api/v1/staff", require("./routes/staffRoutes"));
app.use("/api/v1/medical-records", require("./routes/medicalRecordRoutes"));
app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"));

app.use(notFound);
app.use(errorHandler);
module.exports = app;
