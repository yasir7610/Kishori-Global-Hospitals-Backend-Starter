const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientCode: { type: String, unique: true, sparse: true, trim: true },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  dateOfBirth: Date,
  sex: { type: String, enum: ["female", "male", "other", "undisclosed"], default: "undisclosed" },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  email: { type: String, lowercase: true, trim: true, maxlength: 254 },
  address: { type: String, trim: true, maxlength: 500 },
  emergencyContactName: { type: String, trim: true, maxlength: 120 },
  emergencyContactPhone: { type: String, trim: true, maxlength: 20 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

patientSchema.index({ fullName: "text", phone: 1, patientCode: 1 });
module.exports = mongoose.model("Patient", patientSchema);
