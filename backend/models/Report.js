// models/Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: String,
    patientName: String,
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fileUrl: String,
    fileSize: String,
    fileType: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model("Report", reportSchema);
