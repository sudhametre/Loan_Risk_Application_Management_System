
"use client";

import { useEffect, useState } from "react";

type Application = {
  application_id: number;
  applicant_name: string;
  loan_amount: string;
  loan_type: string;
  annual_income: string;
  status: string;
  risk_level: string;
};

type LoanDocument = {
  _id: string;
  application_id: number;
  applicant_name: string;
  document_type: string;
  description: string;
  uploaded_at: string;
};

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [riskMessage, setRiskMessage] = useState("");
  const [documents, setDocuments] = useState<LoanDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("0.12,0.18,0.28");
const [searchResults, setSearchResults] = useState<any[]>([]);
const [searchLoading, setSearchLoading] = useState(false);
const [searchMessage, setSearchMessage] = useState("");
  const [showDocumentForm, setShowDocumentForm] = useState(false);
const [documentMessage, setDocumentMessage] = useState("");

const [documentForm, setDocumentForm] = useState({
  application_id: "4",
  applicant_name: "",
  document_type: "Income Proof",
  description: "",
});

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    applicant_name: "",
    loan_amount: "",
    loan_type: "Personal",
    annual_income: "",
  });

  const [message, setMessage] = useState("");

  // Fetch loan applications
  useEffect(() => {
    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then((data) => setApplications(data))
      .catch(() => setError("Unable to load loan applications"))
      .finally(() => setLoading(false));
  }, []);

  // Submit a new loan application
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setMessage("Loan application submitted successfully!");

      setForm({
        applicant_name: "",
        loan_amount: "",
        loan_type: "Personal",
        annual_income: "",
      });

      setShowForm(false);

      const updated = await fetch("/api/applications");
      if (!updated.ok) throw new Error("Unable to refresh applications");

      setApplications(await updated.json());
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  // Assess loan risk
  async function assessRisk(id: number) {
    try {
      const response = await fetch("/api/assess-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Risk assessment failed");
      }

      setRiskMessage(
        `Risk assessment completed: ${data.application.risk_level}`
      );

      const updated = await fetch("/api/applications");
      if (!updated.ok) throw new Error("Unable to refresh applications");

      setApplications(await updated.json());
    } catch (err) {
      setRiskMessage(
        err instanceof Error ? err.message : "Risk assessment failed"
      );
    }
  }

  // Fetch loan documents from MongoDB
  async function fetchDocuments() {
    setDocumentsLoading(true);

    try {
      const response = await fetch("/api/loan-documents");

      if (!response.ok) {
        throw new Error("Unable to fetch documents");
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  }

  async function handleDocumentSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();
  setDocumentMessage("");

  try {
    const response = await fetch("/api/loan-documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(documentForm),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Document submission failed");
    }

    setDocumentMessage("Document saved successfully!");

    setDocumentForm({
      application_id: "4",
      applicant_name: "",
      document_type: "Income Proof",
      description: "",
    });

    setShowDocumentForm(false);
    await fetchDocuments();
  } catch (err) {
    setDocumentMessage(
      err instanceof Error ? err.message : "Something went wrong"
    );
  }
}

async function handleVectorSearch() {
  setSearchLoading(true);
  setSearchMessage("");
  setSearchResults([]);

  try {
    const embedding = searchQuery
      .split(",")
      .map((value) => Number(value.trim()));

    if (
      embedding.length !== 3 ||
      !embedding.every((value) => Number.isFinite(value))
    ) {
      throw new Error("Enter exactly 3 comma-separated numbers.");
    }

    const response = await fetch("/api/vector-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embedding }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Vector search failed");
    }

    setSearchResults(data);
    setSearchMessage("Similarity search completed successfully!");
  } catch (err) {
    setSearchMessage(
      err instanceof Error ? err.message : "Search failed"
    );
  } finally {
    setSearchLoading(false);
  }
}
  // Dashboard statistics
  const approved = applications.filter(
    (a) => a.status === "Approved"
  ).length;

  const pending = applications.filter(
    (a) => a.status === "Pending"
  ).length;

  const highRisk = applications.filter(
    (a) => a.risk_level === "High"
  ).length;

  const stats = [
    ["Total Applications", applications.length],
    ["Approved Loans", approved],
    ["Pending Reviews", pending],
    ["High Risk", highRisk],
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-5 text-slate-800 md:p-10">

      {/* Dashboard Header */}
      <header className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            LoanRisk Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Loan Risk & Application Management System
          </p>
        </div>

        <span className="rounded-lg bg-white p-3 shadow">
          Admin Panel
        </span>
      </header>

      {/* Statistics */}
      <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([title, value]) => (
          <div
            key={title}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <p className="text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      {/* Loan Applications */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold">
          Loan Applications
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-5 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + New Loan Application
        </button>

        {/* New Application Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid gap-4 rounded-xl border p-5"
          >
            <input
              required
              placeholder="Applicant Name"
              value={form.applicant_name}
              onChange={(e) =>
                setForm({ ...form, applicant_name: e.target.value })
              }
              className="rounded-lg border p-3"
            />

            <input
              required
              type="number"
              min="1"
              placeholder="Loan Amount"
              value={form.loan_amount}
              onChange={(e) =>
                setForm({ ...form, loan_amount: e.target.value })
              }
              className="rounded-lg border p-3"
            />

            <select
              value={form.loan_type}
              onChange={(e) =>
                setForm({ ...form, loan_type: e.target.value })
              }
              className="rounded-lg border p-3"
            >
              <option>Personal</option>
              <option>Home</option>
              <option>Education</option>
              <option>Vehicle</option>
              <option>Business</option>
            </select>

            <input
              required
              type="number"
              min="1"
              placeholder="Annual Income"
              value={form.annual_income}
              onChange={(e) =>
                setForm({ ...form, annual_income: e.target.value })
              }
              className="rounded-lg border p-3"
            />

            <button
              type="submit"
              className="rounded-lg bg-green-600 p-3 text-white"
            >
              Submit Application
            </button>
          </form>
        )}

        {message && (
          <p className="mb-4 text-sm">{message}</p>
        )}

        {riskMessage && (
          <p className="mb-4 text-sm font-medium text-blue-700">
            {riskMessage}
          </p>
        )}

        {loading && <p>Loading applications...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">Loan ID</th>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Loan Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Risk</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.application_id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {app.application_id}
                    </td>

                    <td className="p-3">
                      {app.applicant_name}
                    </td>

                    <td className="p-3">
                      ₹{Number(app.loan_amount).toLocaleString("en-IN")}
                    </td>

                    <td className="p-3">
                      {app.loan_type}
                    </td>

                    <td className="p-3">
                      {app.status}
                    </td>

                    <td className="p-3">
                      {app.risk_level}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => assessRisk(app.application_id)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                      >
                        Assess Risk
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      
      {/* Vector Similarity Search */}
      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Loan Vector Similarity Search
        </h2>

        <p className="mb-4 text-sm text-slate-500">
          Find loan records with similar vector representations.
        </p>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter 3 values, e.g. 0.12,0.18,0.28"
            className="min-w-0 flex-1 rounded-lg border p-3"
          />

          <button
            onClick={handleVectorSearch}
            disabled={searchLoading}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            {searchLoading ? "Searching..." : "Search Similar Loans"}
          </button>
        </div>

        {searchMessage && (
          <p className="mt-4 text-sm text-blue-700">
            {searchMessage}
          </p>
        )}

        {searchResults.length > 0 && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">Application ID</th>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Loan Amount</th>
                  <th className="p-3">Annual Income</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Cosine Distance</th>
                </tr>
              </thead>

              <tbody>
                {searchResults.map((item) => (
                  <tr key={item.application_id} className="border-b">
                    <td className="p-3">{item.application_id}</td>
                    <td className="p-3">{item.applicant_name}</td>
                    <td className="p-3">
                      ₹{Number(item.loan_amount).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">
                      ₹{Number(item.annual_income).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3">{item.status}</td>
                    <td className="p-3">{item.risk_level}</td>
                    <td className="p-3">
                      {Number(item.distance).toFixed(6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MongoDB Loan Documents */}
      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Loan Documents
        </h2>
        
<button
  onClick={() => setShowDocumentForm(!showDocumentForm)}
  className="mb-5 rounded-lg bg-green-600 px-5 py-3 text-white"
>
  + Add Loan Document
</button>

{showDocumentForm && (
  <form
    onSubmit={handleDocumentSubmit}
    className="mb-6 grid gap-4 rounded-xl border p-5"
  >
    <input
      required
      type="number"
      min="1"
      placeholder="Application ID"
      value={documentForm.application_id}
      onChange={(e) =>
        setDocumentForm({
          ...documentForm,
          application_id: e.target.value,
        })
      }
      className="rounded-lg border p-3"
    />

    <input
      required
      placeholder="Applicant Name"
      value={documentForm.applicant_name}
      onChange={(e) =>
        setDocumentForm({
          ...documentForm,
          applicant_name: e.target.value,
        })
      }
      className="rounded-lg border p-3"
    />

    <select
      value={documentForm.document_type}
      onChange={(e) =>
        setDocumentForm({
          ...documentForm,
          document_type: e.target.value,
        })
      }
      className="rounded-lg border p-3"
    >
      <option>Income Proof</option>
      <option>Identity Proof</option>
      <option>Address Proof</option>
      <option>Bank Statement</option>
      <option>Employment Proof</option>
    </select>

    <textarea
      placeholder="Document Description"
      value={documentForm.description}
      onChange={(e) =>
        setDocumentForm({
          ...documentForm,
          description: e.target.value,
        })
      }
      className="rounded-lg border p-3"
    />

    <button
      type="submit"
      className="rounded-lg bg-blue-600 p-3 text-white"
    >
      Save Document
    </button>
  </form>
)}

{documentMessage && (
  <p className="mb-4 text-sm text-blue-700">
    {documentMessage}
  </p>
)}



        <button
          onClick={fetchDocuments}
          className="mb-5 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          View Loan Documents
        </button>

        {documentsLoading && (
          <p>Loading documents...</p>
        )}

        {!documentsLoading && documents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Application ID</th>
                  <th className="p-3">Document Type</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id} className="border-b">
                    <td className="p-3">
                      {doc.applicant_name}
                    </td>

                    <td className="p-3">
                      {doc.application_id}
                    </td>

                    <td className="p-3">
                      {doc.document_type}
                    </td>

                    <td className="p-3">
                      {doc.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!documentsLoading && documents.length === 0 && (
          <p className="text-slate-500">
            Click the button to load documents.
          </p>
        )}
      </section>

    </main>
  );
}
