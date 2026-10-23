const router = require("express").Router();
const c = require("../controllers/appointmentController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { requireFields, validatePhone } = require("../middleware/validate");
router.post("/", requireFields(["patientName", "patientPhone", "department", "appointmentDate"]), validatePhone, c.create);
router.get("/", auth, authorize("admin", "doctor", "nurse", "receptionist"), c.list);
router.patch("/:id/status", auth, authorize("admin", "doctor", "receptionist"), requireFields(["status"]), c.updateStatus);
module.exports = router;
