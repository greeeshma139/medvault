const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/consentController");

// Specific routes (must come before /:id dynamic routes)
router.post("/request", auth, controller.requestConsent);
router.get("/pending", auth, controller.getPendingRequests);
router.get("/my", auth, controller.getMyConsents);

// General routes
router.get("/", auth, controller.getConsents);

// Dynamic routes (must come last)
router.put("/:id/approve", auth, controller.approveConsent);
router.put("/:id/reject", auth, controller.rejectConsent);
router.delete("/:id", auth, controller.revokeConsent);

module.exports = router;
