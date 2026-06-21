const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const Prediction = require("./models/Prediction");
const Report = require("./models/Report");
const path = require("path");
const { verifyToken, verifyAdmin, authenticateOptional } = require("./middleware/authMiddleware");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes"); 
const predictionRoutes = require("./routes/predictions");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.use("/api/reports", require("./routes/reportRoutes"));

app.post("/predict", authenticateOptional, async (req, res) => {
  try {
    // 🔸 1. Send data to FastAPI
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      req.body
    );

    const result = response.data;

    // 🔸 2. Save BOTH input + output in MongoDB
    await Prediction.create({
      ...req.body,                       // user input
      user: req.user?._id,
      prediction: result.prediction, 
      result: result.result,
      probability: result.risk_probability,
      confidence: result.confidence
    });

    // console.log("Data received from FastAPI:", ...req.body);
    console.log("Prediction saved to DB:", result);
    // 🔸 3. Return response to frontend
    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/records", async (req, res) => {
  try {
    const data = await Prediction.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/user/predictions", verifyToken, async (req, res) => {
  try {
    const userPredictions = await Prediction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v");
    res.json(userPredictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/user/reports", verifyToken, async (req, res) => {
  try {
    const userReports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(userReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/stats",verifyToken,  async (req, res) => {
  try {
    const now = new Date();

    // -----------------------------
    // DATE RANGES
    // -----------------------------
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // -----------------------------
    // TOTAL PATIENTS
    // -----------------------------
    const totalPatients = await Prediction.countDocuments();

    const currentMonthPatients = await Prediction.countDocuments({
      createdAt: { $gte: currentMonthStart }
    });

    const lastMonthPatients = await Prediction.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    const totalPatientsChange =
      lastMonthPatients > 0
        ? ((currentMonthPatients - lastMonthPatients) / lastMonthPatients) * 100
        : 0;

    // -----------------------------
    // PREDICTIONS TODAY
    // -----------------------------
    const predictionsToday = await Prediction.countDocuments({
      createdAt: { $gte: todayStart }
    });

    const predictionsYesterday = await Prediction.countDocuments({
      createdAt: { $gte: yesterdayStart, $lt: todayStart }
    });

    const predictionsTodayChange =
      predictionsYesterday > 0
        ? ((predictionsToday - predictionsYesterday) / predictionsYesterday) * 100
        : 0;

    // -----------------------------
    // ACCURACY RATE (MONTH BASED)
    // -----------------------------
    const currentMonthTotal = await Prediction.countDocuments({
      createdAt: { $gte: currentMonthStart }
    });

    const currentMonthCorrect = await Prediction.countDocuments({
      createdAt: { $gte: currentMonthStart },
      prediction: 1
    });

    const currentAccuracy =
      currentMonthTotal > 0
        ? (currentMonthCorrect / currentMonthTotal) * 100
        : 0;

    const lastMonthTotal = await Prediction.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    const lastMonthCorrect = await Prediction.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      prediction: 1
    });
    console.log("Current Month Total:", currentMonthTotal);
    console.log("Current Month Correct:", currentMonthCorrect);
    console.log("Last Month Total:", lastMonthTotal);
    console.log("Last Month Correct:", lastMonthCorrect);
    const lastAccuracy =
      lastMonthTotal > 0
        ? (lastMonthCorrect / lastMonthTotal) * 100
        : 0;
    console.log("Current Accuracy:", currentAccuracy.toFixed(2) + "%");
    console.log("Last Accuracy:", lastAccuracy.toFixed(2) + "%");
    const accuracyChange =
      lastAccuracy > 0
        ? ((currentAccuracy - lastAccuracy) / lastAccuracy) * 100
        : 0;

    // -----------------------------
    // HIGH RISK ALERTS
    // -----------------------------
    const currentMonthHighRisk = await Prediction.countDocuments({
      createdAt: { $gte: currentMonthStart },
      probability: { $gte: 50 }
    });

    const lastMonthHighRisk = await Prediction.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      probability: { $gte: 50 }
    });

    const highRiskChange =
      lastMonthHighRisk > 0
        ? ((currentMonthHighRisk - lastMonthHighRisk) / lastMonthHighRisk) * 100
        : 0;

    // -----------------------------
    // RESPONSE
    // -----------------------------
    res.json({
      totalPatients,
      totalPatientsChange: Number(totalPatientsChange.toFixed(2)),

      predictionsToday,
      predictionsTodayChange: Number(predictionsTodayChange.toFixed(2)),

      accuracyRate: Number(currentAccuracy.toFixed(2)),
      accuracyChange: Number(accuracyChange.toFixed(2)),

      highRiskAlerts: currentMonthHighRisk,
      highRiskChange: Number(highRiskChange.toFixed(2))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/weekly-stats", async (req, res) => {
  try {
    const today = new Date();

    // Last 7 days range
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    // Aggregate data
    const stats = await Prediction.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dayOfWeek: "$createdAt" // 1=Sun, 7=Sat
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Map days
    const daysMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat"
    };

    // Initialize all days (important for missing days)
    const result = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => ({
      day,
      value: 0
    }));

    stats.forEach(item => {
      const dayName = daysMap[item._id];
      const index = result.findIndex(d => d.day === dayName);
      if (index !== -1) {
        result[index].value = item.count;
      }
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/recent-predictions", async (req, res) => {
  try {
    const recent = await Prediction.find()
      .sort({ createdAt: -1 }) // latest first
      .limit(5);

      

    // Format response
    const formatted = recent.map(item => {
      const probability = Number(item.probability ?? 0);
      return {
        name: item.name || `Patient ${item._id.toString().slice(-4)}`,
        age: item.age || "-",
        status:
          probability >= 50
            ? "High"
            : probability >= 30
            ? "Moderate"
            : "Low",
      };
    });

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/predictions", async (req, res) => {
  try {
    //fetch all predictions but exclude sensitive info
    const predictions = await Prediction.find().select("-__v");
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));