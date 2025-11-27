const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getMonthlyInsights } = require("../controllers/insightsController");

// GET /api/v1/insights/monthly
router.get("/monthly", protect, getMonthlyInsights);

module.exports = router;
