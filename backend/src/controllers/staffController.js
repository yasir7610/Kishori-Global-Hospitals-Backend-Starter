const Staff = require("../models/Staff");
const audit = require("../utils/audit");

exports.list = async (req, res) => {
  const items = await Staff.find().select("-phone -email").sort({ fullName: 1 }).limit(300).lean();
  res.json({ items });
};

exports.create = async (req, res) => {
  const staff = await Staff.create(req.body);
  await audit(req, "staff.create", "Staff", staff._id);
  res.status(201).json({ staff });
};

exports.update = async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!staff) return res.status(404).json({ message: "Staff record not found." });
  await audit(req, "staff.update", "Staff", staff._id);
  res.json({ staff });
};
