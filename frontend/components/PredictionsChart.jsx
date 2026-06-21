"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "@/components/ui/Skeleton";

export default function PredictionsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/weekly-stats");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Chart error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-64 min-h-[240px] sm:min-h-[256px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="adminChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0e6481" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0e6481" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fill: "#67777e", fontSize: 12 }} />
          <YAxis tick={{ fill: "#67777e", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0e6481"
            strokeWidth={2}
            fill="url(#adminChartGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
