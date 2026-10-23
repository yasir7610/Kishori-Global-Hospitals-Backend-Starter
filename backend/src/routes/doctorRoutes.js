const router = require("express").Router();
const c = require("../controllers/doctorController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { requireFields } = require("../middleware/validate");
router.get("/", auth, c.list);
router.post("/", auth, authorize("admin"), requireFields(["fullName", "department"]), c.create);
router.patch("/:id", auth, authorize("admin"), c.update);
module.exports = router;
