const Appointment = require("../models/Appointment");
const audit = require("../utils/audit");

exports.create = async (req, res) => {
  const { patientName, patientPhone, patientEmail, department, appointmentDate, appointmentTime, doctorName, visitReason } = req.body;
  const date = new Date(appointmentDate);
  if (!appointmentDate || Number.isNaN(date.getTime())) return res.status(400).json({ message: "A valid appointment date is required." });
  if (date < new Date(new Date().setHours(0, 0, 0, 0))) return res.status(400).json({ message: "Appointment date cannot be in the past." });
  const allowedDepartments = ["Cardiology", "Neurology", "Orthopedics", "Gynecology", "Laboratory", "Emergency", "Other"];
  if (!allowedDepartments.includes(department)) return res.status(400).json({ message: "Select a valid department." });

  const appointment = await Appointment.create({
    patientName, patientPhone, patientEmail, department, appointmentDate: date,
    appointmentTime, preferredDoctorName: doctorName, visitReason,
    status: "pending", source: "website"
  });
  res.status(201).json({
    message: "Your appointment request was received. It is pending hospital confirmation.",
    appointment: { id: appointment._id, status: appointment.status, appointmentDate: appointment.appointmentDate }
  });
};

exports.list = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.department) filter.department = req.query.department;
  if (req.query.from || req.query.to) {
    filter.appointmentDate = {};
    if (req.query.from) filter.appointmentDate.$gte = new Date(req.query.from);
    if (req.query.to) filter.appointmentDate.$lte = new Date(req.query.to);
  }
  const [items, total] = await Promise.all([
    Appointment.find(filter).sort({ appointmentDate: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Appointment.countDocuments(filter)
  ]);
  res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
};

exports.updateStatus = async (req, res) => {
  const allowed = ["pending", "confirmed", "completed", "cancelled", "rejected"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid appointment status." });
  const item = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, statusUpdatedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: "Appointment not found." });
  await audit(req, "appointment.status.update", "Appointment", item._id);
  res.json({ message: "Appointment status updated.", appointment: item });
};
