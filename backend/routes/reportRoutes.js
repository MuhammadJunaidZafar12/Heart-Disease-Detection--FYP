// routes/reportRoutes.js

const express = require("express");
const router = express.Router();

const PDFDocument = require("pdfkit");

const fs = require("fs");

const path = require("path");

const Prediction = require("../models/Prediction");

const Report = require("../models/Report");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

/*
========================================
GENERATE REPORT
========================================
*/

router.post("/generate", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const predictions = await Prediction.find();

    if (!predictions.length) {
      return res.status(404).json({
        message: "No prediction records available to generate reports."
      });
    }

    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const createdReports = [];

    for (const item of predictions) {
      // Check if report already exists
      const existingReport = await Report.findOne({
        predictionId: item._id,
      });

      if (existingReport) {
        continue; // Skip this prediction
      }

      const patientName =
        item.name || `Patient ${item._id.toString().slice(-4)}`;
      const riskLabel =
        item.probability >= 50
          ? "High"
          : item.probability >= 20 && item.probability < 50
            ? "Moderate"
            : "Low";
      const predictionResult =
        item.result ||
          (item.prediction === 1 || item.prediction === true)
          ? "Positive"
          : "Negative";

      const fileName = `report-${item._id}-${Date.now()}.pdf`;
      const filePath = path.join(uploadDir, fileName);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc
        .fontSize(24)
        .text("Heart Disease Prediction Report", {
          align: "center",
        });

      doc.moveDown();
      doc.fontSize(16).text(`Patient Name: ${patientName}`);
      doc.text(`Age: ${item.age ?? "N/A"}`);
      doc.text(`Created At: ${item.createdAt.toLocaleString()}`);
      doc.moveDown();

      doc.fontSize(18).text("Prediction Summary");
      doc.fontSize(14).text(`Risk Level: ${riskLabel}`);
      doc.text(`Prediction: ${predictionResult}`);
      doc.text(`Probability: ${item.probability ?? "N/A"}%`);
      doc.text(`Confidence: ${item.confidence ?? "N/A"}`);
      doc.moveDown();

      doc.fontSize(18).text("Patient Details");
      doc.fontSize(14).text(`Sex: ${item.sex ?? "N/A"}`);
      doc.text(`Chest Pain Type: ${item.cp ?? "N/A"}`);
      doc.text(`Resting Blood Pressure: ${item.trestbps ?? "N/A"}`);
      doc.text(`Cholesterol: ${item.chol ?? "N/A"}`);
      if (item.thalach != null) doc.text(`Max Heart Rate: ${item.thalach}`);
      if (item.exang != null) doc.text(`Exercise Induced Angina: ${item.exang}`);
      if (item.oldpeak != null) doc.text(`ST Depression: ${item.oldpeak}`);
      if (item.slope != null) doc.text(`Slope: ${item.slope}`);
      if (item.ca != null) doc.text(`Colored Vessels: ${item.ca}`);
      if (item.thal != null) doc.text(`Thalassemia: ${item.thal}`);

      doc.end();

      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / 1024 / 1024).toFixed(2);

      createdReports.push({
        title: `Patient Report - ${patientName}`,
        patientName,
        user: item.user,
        predictionId: item._id,
        fileUrl: `/uploads/${fileName}`,
        fileSize: `${fileSize} MB`,
        fileType: "PDF"
      });
    }

    const reports = await Report.insertMany(createdReports);

    res.status(201).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

/*
========================================
GET ALL REPORTS
========================================
*/

/*router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = req.user.isAdmin ? {} : { user: req.user._id };

    const total = await Report.countDocuments(query);

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
*/
router.get("/", verifyToken, async (req, res) => {
  try {
    const query = req.user.isAdmin ? {} : { user: req.user._id };
    const reports = await Report.find(query).sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;