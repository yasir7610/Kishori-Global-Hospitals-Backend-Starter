const mongoose = require("mongoose");

const contactEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  email: { type: String, lowercase: true, trim: true, maxlength: 254 },
  category: { type: String, required: true, enum: ["General", "Appointment", "Departments", "Careers", "Feedback", "Other"] },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  status: { type: String, enum: ["new", "in-progress", "resolved"], default: "new" }
}, { timestamps: true });

module.exports = mongoose.model("ContactEnquiry", contactEnquirySchema);
