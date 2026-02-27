const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/appointmentController");

// Public route
router.get("/", (req, res, next) => {
  if (controller.getAllAppointments) {
    return controller.getAllAppointments(req, res, next);
  }
  res.json([]);
});

// Protected routes
router.post("/", auth, controller.bookAppointment);
router.put("/:id/status", auth, controller.updateStatus);
router.get("/my", auth, controller.getMyAppointments);

module.exports = router;
