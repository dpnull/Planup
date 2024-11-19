const express = require("express");
const { generateSchedule } = require("../services/gpt3Service");

const router = express.Router();

// endpoint
router.post("/generate-schedule", async (req, res) => {
  try {
    const schedule = await generateSchedule(req.body.prompt);
    res.json({ schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
