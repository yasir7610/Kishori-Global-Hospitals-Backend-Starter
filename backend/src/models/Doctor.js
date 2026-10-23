const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true, maxlength: 20 },
  department: { type: String, required: true, trim: true, maxlength: 100 },
  specialization: { type: String, trim: true, maxlength: 120 },
  qualifications: [{ type: String, trim: true, maxlength: 120 }],
  availability: [{
    dayOfWeek: { type: Number, min: 0, max: 6 },
    startTime: String,
    endTime: String
  }],
  active: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
