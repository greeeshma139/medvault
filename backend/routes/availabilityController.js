const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/availabilityController");

router.post("/", auth, controller.setAvailability);
router.get("/:doctorId", controller.getDoctorAvailability);

module.exports = router;
