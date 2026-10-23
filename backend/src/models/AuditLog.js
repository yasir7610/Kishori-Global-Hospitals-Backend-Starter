const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true, maxlength: 120 },
  resourceType: { type: String, required: true, maxlength: 100 },
  resourceId: { type: String, maxlength: 120 },
  outcome: { type: String, enum: ["success", "failure"], default: "success" },
  requestId: { type: String, maxlength: 120 },
  ipAddress: { type: String, maxlength: 80 }
}, { timestamps: true });

auditLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
module.exports = mongoose.model("AuditLog", auditLogSchema);
