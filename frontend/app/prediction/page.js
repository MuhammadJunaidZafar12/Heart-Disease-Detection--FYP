"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function FormSection({ title, children }) {
  return (
    <div className="col-span-full">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-4 pb-2 border-b border-gray-100">
        {title}
      </h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-[var(--color-foreground)]">
        {label}
      </label>
      {children}
    </div>
  );
}

const Prediction = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => {
          if (key === "name") return [key, value];
          return [key, Number(value)];
        })
      );

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API Response:", data);
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const probability = result
    ? Number(result.risk_probability ?? result.probability)
    : NaN;
  const hasProbability = !Number.isNaN(probability);
  const probabilityLabel = hasProbability ? `${Math.round(probability)}%` : "N/A";
  const isDisease = result?.prediction === 1 || result?.prediction === "1" || result?.prediction === "Yes" || result?.prediction === "Positive";

  const riskMessage = () => {
    if (!result) return "";
    if (!hasProbability) {
      return "The model returned a prediction without a probability score.";
    }

    if (isDisease) {
      if (probability >= 60) {
        return "High-risk indicators detected. Please seek medical advice promptly and discuss these results with a doctor.";
      }
      if (probability >= 30) {
        return "Moderate risk detected. Consider following up with a healthcare professional and reviewing lifestyle or treatment options.";
      }
      return "Some risk factors are present, but the overall probability is lower. Keep monitoring your health and stay proactive.";
    }

    if (probability >= 50) {
      return "Although current prediction does not indicate heart disease, the probability is significant enough to keep watching key risk factors.";
    }
    if (probability >= 20 && probability < 50) {
      return "The risk appears low, but maintaining healthy habits and regular checkups is still a smart approach.";
    }
    return "Low probability of heart disease. Continue the healthy lifestyle and review your numbers periodically.";
  };

  return (
    <div className="bg-[var(--color-surface)] py-12 sm:py-16 md:py-20">
      <div className="page-container">
        <PageHeader
          icon={Activity}
          title="Heart Disease Prediction"
          subtitle="Enter your health parameters to assess your heart disease risk."
        />

        <form onSubmit={handleSubmit} className="card p-6 md:p-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            <FormSection title="Patient Information">
              <Field label="Name">
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="input"
                />
              </Field>
              <Field label="Age">
                <input
                  type="number"
                  placeholder="e.g. 45"
                  value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  required
                  className="input"
                />
              </Field>
              <Field label="Sex">
                <select
                  value={form.sex}
                  onChange={(e) => handleChange("sex", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </Field>
            </FormSection>

            <FormSection title="Clinical Metrics">
              <Field label="Chest Pain Type">
                <select
                  value={form.cp}
                  onChange={(e) => handleChange("cp", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="0">Typical Angina</option>
                  <option value="1">Atypical Angina</option>
                  <option value="2">Non-anginal Pain</option>
                  <option value="3">Asymptomatic</option>
                </select>
              </Field>
              <Field label="Resting Blood Pressure">
                <input
                  type="number"
                  value={form.trestbps}
                  onChange={(e) => handleChange("trestbps", e.target.value)}
                  required
                  className="input"
                />
              </Field>
              <Field label="Cholesterol">
                <input
                  type="number"
                  value={form.chol}
                  onChange={(e) => handleChange("chol", e.target.value)}
                  required
                  className="input"
                />
              </Field>
              <Field label="Fasting Blood Sugar > 120">
                <select
                  value={form.fbs}
                  onChange={(e) => handleChange("fbs", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </Field>
              <Field label="Rest ECG">
                <select
                  value={form.restecg}
                  onChange={(e) => handleChange("restecg", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="0">Normal</option>
                  <option value="1">ST-T Abnormality</option>
                  <option value="2">LV Hypertrophy</option>
                </select>
              </Field>
            </FormSection>

            <FormSection title="Exercise & Vessels">
              <Field label="Max Heart Rate">
                <input
                  type="number"
                  value={form.thalach}
                  onChange={(e) => handleChange("thalach", e.target.value)}
                  required
                  className="input"
                />
              </Field>
              <Field label="Exercise Angina">
                <select
                  value={form.exang}
                  onChange={(e) => handleChange("exang", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </Field>
              <Field label="Oldpeak">
                <input
                  type="number"
                  step="0.1"
                  value={form.oldpeak}
                  onChange={(e) => handleChange("oldpeak", e.target.value)}
                  required
                  className="input"
                />
              </Field>
              <Field label="Slope">
                <select
                  value={form.slope}
                  onChange={(e) => handleChange("slope", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="0">Upsloping</option>
                  <option value="1">Flat</option>
                  <option value="2">Downsloping</option>
                </select>
              </Field>
              <Field label="Vessels (0-3)">
                <select
                  value={form.ca}
                  onChange={(e) => handleChange("ca", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Thalassemia">
                <select
                  value={form.thal}
                  onChange={(e) => handleChange("thal", e.target.value)}
                  required
                  className="input"
                >
                  <option value="">Select</option>
                  <option value="1">Normal</option>
                  <option value="2">Fixed Defect</option>
                  <option value="3">Reversible Defect</option>
                </select>
              </Field>
            </FormSection>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="mt-8 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Predict Heart Disease Risk"
            )}
          </Button>

          {result?.error && (
            <p className="mt-6 text-center font-semibold text-red-600">
              {result.error}
            </p>
          )}
        </form>

        <AnimatePresence>
          {result && !result.error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`card max-w-5xl mx-auto mt-6 p-6 md:p-8 border-l-4 ${
                isDisease ? "border-l-red-500 bg-red-50/50" : "border-l-green-500 bg-green-50/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {isDisease ? (
                  <AlertTriangle className="h-10 w-10 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle className="h-10 w-10 text-green-600 shrink-0" />
                )}
                <div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDisease ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isDisease ? "Heart Disease Detected" : "No Heart Disease"}
                  </h3>
                  <p className="text-sm font-medium text-[var(--color-foreground)] mb-1">
                    Estimated risk probability
                  </p>
                  <p className={`text-3xl font-bold tracking-tight ${
                    isDisease ? "text-red-600" : "text-green-600"
                  }`}>
                    {probabilityLabel}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
                    Prediction
                  </p>
                  <p className="font-semibold text-[var(--color-foreground)]">
                    {result?.prediction}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
                    Insight
                  </p>
                  <p className="text-[var(--color-muted)] leading-relaxed">
                    {riskMessage()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Prediction;
