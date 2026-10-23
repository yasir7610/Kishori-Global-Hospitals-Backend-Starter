const Patient = require("../models/Patient");
const audit = require("../utils/audit");

exports.create = async (req, res) => {
  const patient = await Patient.create({ ...req.body, createdBy: req.user._id });
  await audit(req, "patient.create", "Patient", patient._id);
  res.status(201).json({ patient });
};

exports.list = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const filter = { status: req.query.status || "active" };
  if (req.query.q) filter.$text = { $search: String(req.query.q).slice(0, 100) };
  const [items, total] = await Promise.all([
    Patient.find(filter).select("-address -emergencyContactName -emergencyContactPhone").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Patient.countDocuments(filter)
  ]);
  res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
};

exports.getOne = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found." });
  await audit(req, "patient.view", "Patient", patient._id);
  res.json({ patient });
};
