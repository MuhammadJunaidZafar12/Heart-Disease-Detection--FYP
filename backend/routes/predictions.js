const express = require("express");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.get("/bar-stats", async (req, res) => {
  try {
    const result = await Prediction.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$createdAt" },
            risk: {
              $cond: [
                { $lte: ["$probability", 20] },
                "low",
                {
                  $cond: [
                    { $lte: ["$probability", 50] },
                    "medium",
                    "high"
                  ]
                }
              ]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize structure
    const data = {
      Low: Array(7).fill(0),
      Medium: Array(7).fill(0),
      High: Array(7).fill(0)
    };

    // Fill data
    result.forEach(item => {
      const dayIndex = item._id.day - 1;

      const risk =
        item._id.risk.charAt(0).toUpperCase() +
        item._id.risk.slice(1);
      console.log("Processing item:", item, "Mapped risk:", risk);
      if (data[risk]) {
        data[risk][dayIndex] = item.count;
      }
    });
    console.log("Final Bar Stats Data:", data);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;