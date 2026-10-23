const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ["admin", "doctor", "nurse", "receptionist", "patient"],
    required: true
  },
  active: { type: Boolean, default: true },
  linkedPatient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  linkedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  lastLoginAt: Date
}, { timestamps: true });

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
