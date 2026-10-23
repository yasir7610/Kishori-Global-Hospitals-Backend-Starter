const ContactEnquiry = require("../models/ContactEnquiry");

exports.create = async (req, res) => {
  const { contactName, contactPhone, contactEmail, enquiryCategory, contactMessage } = req.body;
  const allowed = ["General", "Appointment", "Departments", "Careers", "Feedback", "Other"];
  if (!allowed.includes(enquiryCategory)) return res.status(400).json({ message: "Select a valid enquiry category." });
  const enquiry = await ContactEnquiry.create({
    name: contactName, phone: contactPhone, email: contactEmail,
    category: enquiryCategory, message: contactMessage
  });
  res.status(201).json({ message: "Your enquiry was received.", id: enquiry._id });
};

exports.list = async (req, res) => {
  const items = await ContactEnquiry.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json({ items });
};
