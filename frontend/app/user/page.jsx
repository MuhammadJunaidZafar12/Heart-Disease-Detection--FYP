"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

export default function UserPage() {
  const router = useRouter();
  const { token, isLoggedIn, isAdmin } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [predictionsRes, reportsRes] = await Promise.all([
          axios.get(
            isAdmin ? "http://localhost:5000/predictions" : "http://localhost:5000/api/user/predictions",
            { headers }
          ),
          axios.get(
            isAdmin ? "http://localhost:5000/api/reports" : "http://localhost:5000/api/user/reports",
            { headers }
          ),
        ]);

        setPredictions(predictionsRes.data);
        setReports(reportsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isLoggedIn, isAdmin]);

  if (!isLoggedIn) {
    return (
      <div className="page-container py-16">
        <PageHeader
          title="My Records"
          subtitle="View only your own predictions and reports. Please log in to continue."
        />
        <div className="card p-8 text-center">
          <p className="text-sm text-muted mb-6">
            You need to be signed in to see your personal prediction history and reports.
          </p>
          <Link href="/login" className="inline-block">
            <Button className="mx-auto">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-12">
      <PageHeader
        title={isAdmin ? "All Records" : "My Records"}
        subtitle={
          isAdmin
            ? "All predictions and reports in the system are shown here."
            : "Your personal predictions and generated reports are shown here."
        }
      />

      {loading ? (
          <div className="card p-6 text-center">Loading your history...</div>
        ) : error ? (
          <div className="card p-6 text-center text-red-600">{error}</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <section className="card p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-(--color-foreground)">Predictions</h2>
                  <p className="text-sm text-muted">Only predictions created by your account.</p>
                </div>
                <span className="text-sm text-muted">{predictions.length} total</span>
              </div>

              {predictions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 p-8 text-center text-sm text-muted">
                  No predictions found for your account yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((item) => {
                    const probability = Number(item.probability ?? 0);
                    const riskLabel =
                      probability >= 50
                        ? "High"
                        : probability >= 30
                        ? "Moderate"
                        : "Low";

                    return (
                      <div key={item._id} className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Patient</p>
                            <h3 className="text-lg font-semibold text-(--color-foreground) truncate">
                              {item.name || `Patient ${item._id.slice(-4)}`}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted">Probability</p>
                            <p className="text-2xl font-semibold text-primary">
                              {item.probability != null ? `${item.probability.toFixed(2)}%` : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm text-muted">
                          <div>
                            <p className="text-(--color-foreground) font-medium">Risk</p>
                            <p>{riskLabel}</p>
                          </div>
                          <div>
                            <p className="text-(--color-foreground) font-medium">Result</p>
                            <p>{item.result || (item.prediction === 1 ? "Positive" : "Negative")}</p>
                          </div>
                          <div>
                            <p className="text-(--color-foreground) font-medium">Date</p>
                            <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="card p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-(--color-foreground)">Reports</h2>
                  <p className="text-sm text-muted">Your generated reports, filtered to your account.</p>
                </div>
                <span className="text-sm text-muted">{reports.length} total</span>
              </div>

              {reports.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 p-8 text-center text-sm text-muted">
                  No reports available yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report._id} className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Report</p>
                        <h3 className="text-lg font-semibold text-(--color-foreground) truncate">{report.title}</h3>
                        <div className="mt-2 text-sm text-muted">
                          <p>{report.patientName || report.title}</p>
                          <p>{new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:5000${report.fileUrl}`}
                        download={`${report.title}.pdf`}
                        className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl border-2 border-primary text-primary hover:bg-primary/10 transition w-full sm:w-auto"
                      >
                        View PDF
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
  );
}
