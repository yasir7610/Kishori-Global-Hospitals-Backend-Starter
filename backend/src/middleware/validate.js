function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === "";
    });
    if (missing.length) return res.status(400).json({ message: "Required fields are missing.", fields: missing });
    next();
  };
}

function validatePhone(req, res, next) {
  const value = String(req.body.patientPhone || req.body.phone || "");
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return res.status(400).json({ message: "Enter a valid contact number containing 10 to 15 digits." });
  }
  next();
}

module.exports = { requireFields, validatePhone };
