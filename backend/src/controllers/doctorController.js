const Doctor = require("../models/Doctor");
const audit = require("../utils/audit");

exports.list = async (req, res) => {
  const filter = req.user.role === "patient" ? { active: true } : {};
  if (req.query.department) filter.department = req.query.department;
  const items = await Doctor.find(filter).select("-availability").sort({ fullName: 1 }).limit(200).lean();
  res.json({ items });
};

exports.create = async (req, res) => {
  const doctor = await Doctor.create(req.body);
  await audit(req, "doctor.create", "Doctor", doctor._id);
  res.status(201).json({ doctor });
};

exports.update = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });
  await audit(req, "doctor.update", "Doctor", doctor._id);
  res.json({ doctor });
};
