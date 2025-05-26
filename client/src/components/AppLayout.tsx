import React from "react";
import { Link } from "react-router-dom";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    maxWidth: 900,
    margin: "40px auto",
    padding: 24,
    background: "rgba(255,255,255,0.96)",
    borderRadius: 16,
    boxShadow: "0 6px 32px rgba(0,0,0,0.08)"
  }}>
    <header style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontSize: 28, fontWeight: 700 }}>
        <span role="img" aria-label="Logo">🧠</span> Test Generator
      </div>
      <nav style={{ display: "flex", gap: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/generate">Generate</Link>
        <Link to="/results">Results</Link>
        <Link to="/export-pdf">Export PDF</Link>
      </nav>
    </header>
    {children}
    <footer style={{ marginTop: 32, fontSize: 14, color: "#aaa" }}>
      © 2025 Test Generator. Powered by OpenAI & PDFKit.
    </footer>
  </div>
);
export default AppLayout;
