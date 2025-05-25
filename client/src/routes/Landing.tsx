import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Landing route - entry point with navigation to main app features.
 */
const Landing: React.FC = () => (
  <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
    <h1>Test Generator Online</h1>
    <p>
      Create unique tests for yourself, students, or friends — choose subject, topic, difficulty and take the test online or export to PDF.<br />
      You can also check test answers by test ID.
    </p>
    <nav style={{ marginTop: 32 }}>
      <Link to="/generate">
        <button style={{ marginRight: 16 }}>Generate & Take Test</button>
      </Link>
      <Link to="/results">
        <button>Check Test by ID</button>
      </Link>
    </nav>
  </main>
);

export default Landing;
