"use client";

import StatCard from "@/components/StatCard";
import PredictionsChart from "@/components/PredictionsChart";
import RecentList from "@/components/RecentList";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Users, Activity, Target, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const defaultStats = {
  totalPatients: 0,
  predictionsToday: 0,
  accuracyRate: 0,
  highRiskAlerts: 0,
  totalPatientsChange: 0,
  predictionsTodayChange: 0,
  accuracyChange: 0,
  highRiskChange: 0,
};

export default function Dashboard() {
  const { token } = useAuth();
  const [states, setStates] = useState(defaultStats);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setStates({ ...defaultStats, ...data });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={states.totalPatients}
          change={states.totalPatientsChange}
          icon={Users}
        />
        <StatCard
          title="Predictions Today"
          value={states.predictionsToday}
          change={states.predictionsTodayChange}
          icon={Activity}
        />
        <StatCard
          title="Accuracy Rate"
          value={`${states.accuracyRate}%`}
          change={states.accuracyChange}
          icon={Target}
        />
        <StatCard
          title="High Risk Alerts"
          value={states.highRiskAlerts}
          change={states.highRiskChange}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5 sm:p-6">
          <h3 className="font-semibold text-[var(--color-foreground)] mb-4">
            Predictions This Week
          </h3>
          <PredictionsChart />
        </div>
        <RecentList />
      </div>
    </motion.div>
  );
}
