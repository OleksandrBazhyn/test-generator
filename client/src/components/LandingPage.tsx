import React from 'react';
import { Link } from 'react-router-dom';

/**
 * LandingPage - main entry page for the Test Generator application.
 */
const LandingPage: React.FC = () => (
  <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
    <h1>Test Generator Online</h1>
    <p>
      Create unique tests on any topic and difficulty, take them online or export to PDF.<br />
      You can also check answers to a test by its ID.
    </p>
    <nav style={{ marginTop: 32 }}>
      <Link to="/generate">
        <button style={{ marginRight: 16 }}>Generate & Take Test</button>
      </Link>
      <Link to="/results">
        <button style={{ marginRight: 16 }}>Check Test by ID</button>
      </Link>
      <Link to="/export-pdf">
        <button>Export PDF by Test ID</button>
      </Link>
    </nav>
  </main>
);

export default LandingPage;
