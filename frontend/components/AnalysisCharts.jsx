"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "@/components/ui/Skeleton";
import AnimatedSection, { AnimatedItem } from "@/components/ui/AnimatedSection";

const PRIMARY = "#0e6481";
const ACCENT = "#e44444";

export default function AnalysisCharts() {
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/records")
      .then((res) => res.json())
      .then((data) => {
        processData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const processData = (data) => {
    const monthly = {};

    data.forEach((item) => {
      const date = new Date(item.createdAt);
      const month = date.toLocaleString("default", { month: "short" });

      if (!monthly[month]) {
        monthly[month] = 0;
      }
      monthly[month] += 1;
    });

    const sortedMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const line = sortedMonths.map((m) => ({
      name: m,
      value: monthly[m] || 0,
    }));

    setLineData(line);

    let low = 0,
      moderate = 0,
      high = 0,
      critical = 0;

    data.forEach((item) => {
      const p = item.probability;

      if (p < 30) low++;
      else if (p < 60) moderate++;
      else if (p < 80) high++;
      else critical++;
    });

    setBarData([
      { name: "Low Risk", value: low },
      { name: "Moderate", value: moderate },
      { name: "High Risk", value: high },
      { name: "Critical", value: critical },
    ]);
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] py-16 sm:py-20">
        <div className="page-container">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 max-w-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[360px]" />
            <Skeleton className="h-[360px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatedSection className="bg-[var(--color-surface)] py-16 sm:py-20 md:py-24">
      <div className="page-container">
        <AnimatedItem className="text-center mb-10 sm:mb-12">
          <h2 className="section-title">
            Platform{" "}
            <span className="text-[var(--color-primary)]">Analytics</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Real-time insights into prediction trends and risk distribution.
          </p>
        </AnimatedItem>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="card p-6">
            <h3 className="font-semibold text-lg text-[var(--color-foreground)]">
              Predictions Over Time
            </h3>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Monthly prediction volume
            </p>
            <ResponsiveContainer width="100%" height={280} minHeight={240}>
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#67777e", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#67777e", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(14,100,129,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Predictions"
                  stroke={PRIMARY}
                  strokeWidth={3}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-lg text-[var(--color-foreground)]">
              Risk Distribution
            </h3>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Patient risk category breakdown
            </p>
            <ResponsiveContainer width="100%" height={280} minHeight={240}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#67777e", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#67777e", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(14,100,129,0.1)",
                  }}
                />
                <Bar dataKey="value" fill={ACCENT} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
