const router = require("express").Router();
const c = require("../controllers/contactController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { requireFields, validatePhone } = require("../middleware/validate");
router.post("/", requireFields(["contactName", "contactPhone", "enquiryCategory", "contactMessage"]), validatePhone, c.create);
router.get("/", auth, authorize("admin", "receptionist"), c.list);
module.exports = router;
