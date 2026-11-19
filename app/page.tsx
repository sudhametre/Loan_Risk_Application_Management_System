
"use client";

import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

  const applicants = [
    { id: "LN001", name: "Rahul Sharma", amount: "₹5,00,000", score: 780, risk: "Low", status: "Approved" },
    { id: "LN002", name: "Priya Patel", amount: "₹8,00,000", score: 620, risk: "Medium", status: "Pending" },
    { id: "LN003", name: "Amit Kumar", amount: "₹3,00,000", score: 490, risk: "High", status: "Rejected" },
    { id: "LN004", name: "Sneha Verma", amount: "₹6,50,000", score: 750, risk: "Low", status: "Approved" },
    { id: "LN005", name: "Arjun Singh", amount: "₹4,00,000", score: 560, risk: "High", status: "Pending" },
  ];

  const filtered = applicants.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ minHeight: "100vh", background: "#f3f5f9", padding: "30px", color: "#172033", fontFamily: "Arial" }}>
      <header style={{ marginBottom: 30 }}>
        <p style={{ color: "#64748b", fontSize: 13 }}>LOAN MANAGEMENT / OVERVIEW</p>
        <h1 style={{ fontSize: 30, fontWeight: 800 }}>Loan Risk Dashboard</h1>
        <p style={{ color: "#64748b" }}>Monitor applications, approvals and credit risk.</p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 18 }}>
        {[
          ["Total Applications", "1,250", "+12.5%", "#2563eb"],
          ["Approved Loans", "845", "67.6%", "#16a34a"],
          ["Pending Review", "280", "22.4%", "#d97706"],
          ["High Risk", "125", "10%", "#dc2626"],
        ].map(([label, value, detail, color]) => (
          <div key={label} style={{ background: "white", padding: 22, borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>{label}</p>
            <h2 style={{ fontSize: 30, margin: "12px 0", color }}>{value}</h2>
            <span style={{ fontSize: 12, color: "#64748b" }}>{detail}</span>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 25 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 14 }}>
          <h2>Application Overview</h2>
          <p style={{ color: "#64748b" }}>Loan application distribution</p>
          <div style={{ display: "flex", height: 22, borderRadius: 20, overflow: "hidden", marginTop: 25 }}>
            <div style={{ width: "67.6%", background: "#16a34a" }} />
            <div style={{ width: "22.4%", background: "#f59e0b" }} />
            <div style={{ width: "10%", background: "#dc2626" }} />
          </div>
          <p style={{ marginTop: 20, color: "#64748b", fontSize: 14 }}>
            🟢 Approved 67.6%　 🟠 Pending 22.4%　 🔴 High Risk 10%
          </p>
        </div>

        <div style={{ background: "white", padding: 24, borderRadius: 14 }}>
          <h2>Risk Summary</h2>
          <h1 style={{ fontSize: 38, color: "#dc2626", marginBottom: 5 }}>125</h1>
          <p style={{ color: "#64748b" }}>High-risk applications</p>
          <p style={{ color: "#16a34a", marginTop: 25 }}>Low Risk: 65%</p>
          <p style={{ color: "#d97706" }}>Medium Risk: 25%</p>
          <p style={{ color: "#dc2626" }}>High Risk: 10%</p>
        </div>
      </section>

      <section style={{ background: "white", padding: 24, borderRadius: 14, marginTop: 25, overflowX: "auto" }}>
        <h2>Recent Loan Applications</h2>
        <input
          placeholder="Search applicant by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 12, width: "100%", maxWidth: 350, margin: "18px 0", border: "1px solid #cbd5e1", borderRadius: 8 }}
        />
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {["Loan ID", "Applicant", "Amount", "Credit Score", "Risk", "Status"].map((h) => (
                <th key={h} style={{ padding: 14 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: 14 }}>{a.id}</td>
                <td style={{ padding: 14 }}>{a.name}</td>
                <td style={{ padding: 14 }}>{a.amount}</td>
                <td style={{ padding: 14 }}>{a.score}</td>
                <td style={{ padding: 14, color: a.risk === "Low" ? "#16a34a" : a.risk === "Medium" ? "#d97706" : "#dc2626" }}>{a.risk}</td>
                <td style={{ padding: 14 }}>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p>No applicants found.</p>}
      </section>

      <footer style={{ textAlign: "center", color: "#94a3b8", marginTop: 30, fontSize: 12 }}>
        Loan Risk Application Management System · Demo Dashboard
      
<section style={{ background: "white", padding: 24, borderRadius: 14, marginTop: 25 }}>
  <h2>New Loan Application</h2>
  <form onSubmit={(e) => { e.preventDefault(); alert("Application submitted!"); }}>
    <p>Applicant Name</p>
    <input required placeholder="Enter applicant name" />
    <p>Monthly Income (₹)</p>
    <input required type="number" placeholder="Enter monthly income" />
    <p>Loan Amount (₹)</p>
    <input required type="number" placeholder="Enter loan amount" />
    <p>Credit Score</p>
    <input required type="number" min="300" max="900" placeholder="Enter credit score" />
    <br /><br />
    <button type="submit">Submit Application</button>
  </form>
</section>

      </footer>
    </main>

  );
}
