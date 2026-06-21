// app/admin/reports/page.js

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import axios from "axios";

import {
  Download,
  FileText,
} from "lucide-react";

export default function ReportsPage() {
  const { token } = useAuth();
  const [reports, setReports] =
    useState([]);

  useEffect(() => {
    if (!token) return;
    fetchReports();
  }, [token]);

  /*
  ========================================
  GET REPORTS
  ========================================
  */


  const fetchReports = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/reports",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReports(res.data);
  };

  /*
  ========================================
  GENERATE REPORT
  ========================================
  */
  
  const generateReport =
    async () => {
      await axios.post(
        "http://localhost:5000/api/reports/generate",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReports();
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={generateReport}
          className="btn-secondary"
        >
          Generate Report
        </button>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="card p-8 text-center text-[var(--color-muted)]">
            No reports available yet. Click &quot;Generate Report&quot; to create a file for each patient.
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report._id}
              className="card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center shrink-0 text-[var(--color-primary)]">
                  <FileText />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-[var(--color-foreground)] truncate">
                    {report.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted)] mt-1">
                    <span>{report.patientName || report.title}</span>
                    <span>•</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{report.fileSize}</span>
                  </div>
                </div>
              </div>
              <a
                href={`http://localhost:5000${report.fileUrl}`}
                download={`${report.title}.pdf`}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition shrink-0 w-full sm:w-auto"
              >
                <Download size={18} />
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

