const mongoose = require("mongoose");
const PredictionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: Number, required: true },
    cp: { type: Number, required: true },
    trestbps: { type: Number, required: true },
    chol: { type: Number, required: true },
    fbs: { type: Number },
    restecg: { type: Number },
    thalach: { type: Number },
    exang: { type: Number },
    oldpeak: { type: Number },
    slope: { type: Number },
    ca: { type: Number },
    thal: { type: Number },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },

    prediction: { type: Number },
    result: { type: String },
    probability: { type: Number },
    confidence: { type: Number },

    createdAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model("Prediction", PredictionSchema);
module.exports = Prediction;