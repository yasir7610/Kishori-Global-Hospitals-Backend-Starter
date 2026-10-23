const router = require("express").Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const c = require("../controllers/dashboardController");
router.get("/summary", auth, authorize("admin", "doctor", "nurse", "receptionist"), c.summary);
module.exports = router;
