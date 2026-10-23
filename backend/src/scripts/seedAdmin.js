require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function main() {
  if (!process.env.MONGODB_URI || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  }
  if (process.env.ADMIN_PASSWORD.length < 14) {
    throw new Error("ADMIN_PASSWORD must be at least 14 characters for this seed script.");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const exists = await User.findOne({ email });
  if (exists) throw new Error("A user with ADMIN_EMAIL already exists; no changes made.");
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await User.create({
    name: process.env.ADMIN_NAME || "Hospital Administrator",
    email,
    passwordHash,
    role: "admin",
    active: true
  });
  console.log("Initial administrator created. Store credentials securely and remove them from shared notes.");
  await mongoose.disconnect();
}

main().catch(async error => {
  console.error(error.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
