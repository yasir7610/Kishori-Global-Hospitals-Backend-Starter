const MedicalRecord = require("../models/MedicalRecord");
const audit = require("../utils/audit");

exports.create = async (req, res) => {
  const record = await MedicalRecord.create({ ...req.body, createdBy: req.user._id });
  await audit(req, "medical-record.create", "MedicalRecord", record._id);
  res.status(201).json({ record: { id: record._id, patient: record.patient, recordType: record.recordType, title: record.title, createdAt: record.createdAt } });
};

exports.list = async (req, res) => {
  const filter = {};
  if (req.query.patientId) filter.patient = req.query.patientId;
  if (req.user.role === "patient") {
    if (!req.user.linkedPatient) return res.status(403).json({ message: "No patient profile is linked to this account." });
    filter.patient = req.user.linkedPatient;
  }
  const items = await MedicalRecord.find(filter)
    .select("patient doctor appointment recordType title createdBy createdAt updatedAt")
    .populate("patient", "fullName patientCode")
    .sort({ createdAt: -1 }).limit(100).lean();
  await audit(req, "medical-record.list", "MedicalRecord");
  res.json({ items });
};

exports.getOne = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id).select("+clinicalContent");
  if (!record) return res.status(404).json({ message: "Medical record not found." });
  if (req.user.role === "patient" && String(record.patient) !== String(req.user.linkedPatient)) {
    return res.status(403).json({ message: "You cannot access this record." });
  }
  await audit(req, "medical-record.view", "MedicalRecord", record._id);
  res.json({ record });
};
