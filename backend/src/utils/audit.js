const AuditLog = require("../models/AuditLog");

async function audit(req, action, resourceType, resourceId, outcome = "success") {
  try {
    await AuditLog.create({
      actor: req.user?._id,
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : undefined,
      outcome,
      requestId: req.headers["x-request-id"],
      ipAddress: req.ip
    });
  } catch (error) {
    console.error("Audit log write failed:", error.message);
  }
}

module.exports = audit;
