const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Staff = require("../models/Staff");
const Appointment = require("../models/Appointment");
const ContactEnquiry = require("../models/ContactEnquiry");

exports.summary = async (req, res) => {
  const now = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 1);
  const [patients, doctors, staff, todayAppointments, pendingAppointments, openEnquiries, recentAppointments] = await Promise.all([
    Patient.countDocuments({ status: "active" }),
    Doctor.countDocuments({ active: true }),
    Staff.countDocuments({ active: true }),
    Appointment.countDocuments({ appointmentDate: { $gte: start, $lt: end }, status: { $ne: "cancelled" } }),
    Appointment.countDocuments({ status: "pending" }),
    ContactEnquiry.countDocuments({ status: { $ne: "resolved" } }),
    Appointment.find().select("patientName department appointmentDate status").sort({ createdAt: -1 }).limit(10).lean()
  ]);
  res.json({ summary: { patients, doctors, staff, todayAppointments, pendingAppointments, openEnquiries }, recentAppointments });
};
