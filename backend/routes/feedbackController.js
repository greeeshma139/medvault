const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/feedbackController");

router.post("/:id", auth, controller.addFeedback);
router.get("/doctor/:doctorId", controller.getDoctorFeedback);

module.exports = router;
