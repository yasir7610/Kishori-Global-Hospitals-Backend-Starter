const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  employeeCode: { type: String, unique: true, sparse: true, trim: true },
  department: { type: String, trim: true, maxlength: 100 },
  jobTitle: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, trim: true, maxlength: 20 },
  email: { type: String, lowercase: true, trim: true },
  shift: { type: String, enum: ["morning", "afternoon", "night", "rotational"], default: "rotational" },
  active: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
