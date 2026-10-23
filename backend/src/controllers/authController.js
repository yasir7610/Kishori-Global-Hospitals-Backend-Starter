const jwt = require("jsonwebtoken");
const User = require("../models/User");
const audit = require("../utils/audit");

exports.login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !user.active || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  user.lastLoginAt = new Date();
  await user.save();
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30m",
    issuer: "kishori-global-hospitals-api",
    audience: "kishori-global-hospitals-web"
  });
  await audit({ ...req, user }, "auth.login", "User", user._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

exports.me = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
