import React from "react";
import { Link } from "react-router-dom";

const cardStyle: React.CSSProperties = {
  background: "#f9f9f9",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  padding: 32,
  marginBottom: 24,
  textAlign: "left"
};

const LandingPage: React.FC = () => (
  <div>
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", marginTop: 40 }}>
      <div style={cardStyle}>
        <h3>📝 Generate a Test</h3>
        <p>Create unique tests on any topic and difficulty. Save, pass, and export them as PDF.</p>
        <Link to="/generate">
          <button>Generate & Take Test</button>
        </Link>
      </div>
      <div style={cardStyle}>
        <h3>🔎 Check Results</h3>
        <p>Enter a test ID and your answers to check your score.</p>
        <Link to="/results">
          <button>Check Test by ID</button>
        </Link>
      </div>
      <div style={cardStyle}>
        <h3>📄 Export PDF by Test ID</h3>
        <p>Download any saved test in PDF format using its ID.</p>
        <Link to="/export-pdf">
          <button>Export PDF</button>
        </Link>
      </div>
    </div>
  </div>
);

export default LandingPage;
