const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true, trim: true, maxlength: 120 },
  patientPhone: { type: String, required: true, trim: true, maxlength: 20 },
  patientEmail: { type: String, lowercase: true, trim: true, maxlength: 254 },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  department: { type: String, required: true, trim: true, maxlength: 100 },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, trim: true, maxlength: 40 },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  preferredDoctorName: { type: String, trim: true, maxlength: 120 },
  visitReason: { type: String, trim: true, maxlength: 300 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
    default: "pending"
  },
  source: { type: String, enum: ["website", "staff"], default: "website" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  statusUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

appointmentSchema.index({ appointmentDate: 1, status: 1 });
appointmentSchema.index({ patientPhone: 1, createdAt: -1 });
module.exports = mongoose.model("Appointment", appointmentSchema);
