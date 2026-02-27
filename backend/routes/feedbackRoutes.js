const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/feedbackController");

// Public routes with fallbacks
router.get("/", (req, res, next) => {
  if (controller.getAllFeedback) {
    return controller.getAllFeedback(req, res, next);
  }
  res.json([]);
});

router.get("/doctor/:doctorId", controller.getDoctorFeedback);
router.get("/:appointmentId", controller.getFeedbackByAppointment);

// Protected route
router.post("/:appointmentId", auth, controller.addFeedback);

module.exports = router;
