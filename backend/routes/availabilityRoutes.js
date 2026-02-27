const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/availabilityController");

// Public route
router.get("/", (req, res, next) => {
  if (controller.getAllAvailability) {
    return controller.getAllAvailability(req, res, next);
  }
  res.json([]);
});

router.get("/:doctorId", controller.getDoctorAvailability);

// Protected route
// Protected routes
router.post("/", auth, controller.setAvailability);
router.put("/:id", auth, controller.updateAvailability);
router.delete("/:id", auth, controller.deleteAvailability);

module.exports = router;
