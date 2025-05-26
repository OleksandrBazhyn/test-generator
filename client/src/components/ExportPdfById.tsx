import React, { useState } from "react";
import { exportPdfByTestId } from "../api/api";

const ExportPdfById: React.FC = () => {
  const [testId, setTestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setSuccess(false);
    if (!testId) return;
    setLoading(true);
    try {
      const blob = await exportPdfByTestId(testId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `test_${testId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (e: any) {
      alert(e.message || "Failed to export PDF");
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto", marginTop: 28 }}>
      <h2>Export PDF by Test ID</h2>
      <p>Enter the test ID to download a PDF version of any saved test.</p>
      <input
        type="number"
        placeholder="Test ID"
        value={testId}
        onChange={e => setTestId(e.target.value)}
        style={{ marginRight: 8, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        min={1}
      />
      <button onClick={handleExport} disabled={loading || !testId}>
        {loading ? "Exporting..." : "Download PDF"}
      </button>
      {success && <div style={{ color: "green", marginTop: 12 }}>PDF downloaded!</div>}
    </div>
  );
};
export default ExportPdfById;
