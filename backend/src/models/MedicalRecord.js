const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  recordType: {
    type: String,
    enum: ["consultation", "diagnosis", "prescription", "lab-summary", "treatment", "discharge-summary"],
    required: true
  },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  clinicalContent: { type: String, required: true, maxlength: 10000, select: false },
  attachmentMetadata: [{
    storageKey: { type: String, maxlength: 500 },
    fileName: { type: String, maxlength: 255 },
    contentType: { type: String, maxlength: 120 }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amendedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" }
}, { timestamps: true });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
