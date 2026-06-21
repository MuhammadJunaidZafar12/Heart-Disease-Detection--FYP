"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  Doughnut
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function PredictionsPage() {
  const [data, setData] = useState([]);
  const [barStats, setBarStats] = useState([]);
  
  useEffect(() => {
    fetchPredictions();
    fetchBarStats();
  }, []);

  const fetchPredictions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/predictions");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBarStats = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/predictions/bar-stats");
    setBarStats(res.data);
    console.log("Bar Stats:", res.data);
  } catch (err) {
    console.log(err);
  }
};

  // 🔹 Risk Counts
  const low = data.filter(d => d.probability <= 20).length;
  const medium = data.filter(d => d.probability > 20 && d.probability <= 50).length;
  const high = data.filter(d => d.probability > 50).length;

  // 🔹 Bar Chart Data (Dummy grouping by day)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const barData = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      label: "Low",
      data: barStats.Low || Array(7).fill(0),
      backgroundColor: "#22c55e"
    },
    {
      label: "Medium",
      data: barStats.Medium || Array(7).fill(0),
      backgroundColor: "#eab308"
    },
    {
      label: "High",
      data: barStats.High || Array(7).fill(0),
      backgroundColor: "#ef4444"
    }
  ]
};
  // 🔹 Doughnut Data
  const doughnutData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [low, medium, high],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5 sm:p-6">
          <h2 className="mb-4 font-semibold text-[var(--color-foreground)]">Daily Breakdown</h2>
          <div className="min-h-[280px]">
            <Bar data={barData} />
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="mb-4 font-semibold text-[var(--color-foreground)]">Risk Distribution</h2>
          <div className="max-w-[240px] mx-auto">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>

      <div className="table-shell overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Risk Level</th>
              <th>Confidence</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td className="font-mono text-xs">{item._id}</td>
                <td className="font-medium">{item.name || item._id.slice(0, 4)}</td>
                <td>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${item.probability <= 20 && "bg-green-100 text-green-600"}
                    ${item.probability > 20 && item.probability <= 50 && "bg-yellow-100 text-yellow-600"}
                    ${item.probability > 50 && "bg-red-100 text-red-600"}
                  `}>
                    {item.probability<=20 ? "Low" : item.probability>20 && item.probability <= 50 ? "Medium" : "High"}
                  </span>
                </td>
                <td>{item.confidence}%</td>
                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}