"use client";

import { useEffect, useState } from "react";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients(); 
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/predictions");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Fetched patients:", data);
      
      let patientsArray = data;
      if (data && !Array.isArray(data) && data.users) {
        patientsArray = data.users;
      } else if (data && !Array.isArray(data) && data.data) {
        patientsArray = data.data;
      }
      
      setPatients(Array.isArray(patientsArray) ? patientsArray : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err.message);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter((p) => 
    p.name && p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-accent)] mx-auto mb-3" />
        <p className="text-[var(--color-muted)]">Loading patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center text-red-600">
        Error: {error}. Please check the console for details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={addPatient}
          className="btn-secondary text-sm"
        >
          + Add Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search patients..."
        className="input max-w-full sm:max-w-xs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-shell overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Effected</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-[var(--color-muted)]">
                  No patients found
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p._id || p.id || i}>
                  <td className="font-mono text-xs">{p._id || p.id || "N/A"}</td>
                  <td className="font-medium">{p.name || "N/A"}</td>
                  <td>{p.age || "N/A"}</td>
                  <td>{p.sex == 1 ? "Male" : "Female" || "N/A"}</td>
                  <td>{p.prediction == 0  ? "No" : "Yes" || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  async function addPatient() {
    const newPatient = {
      id: "P-" + Math.floor(Math.random() * 10000),
      name: "New Patient",
      age: 30,
      gender: "Male",
      lastVisit: "2026-05-06",
      status: "Active",
    };

    await fetch("/api/patients", {
      method: "POST",
      body: JSON.stringify(newPatient),
    });

    fetchPatients();
  }
}