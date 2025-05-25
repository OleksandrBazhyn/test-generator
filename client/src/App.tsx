import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TestGenerationPage from './components/TestGenerationPage';
import ResultsPage from './components/ResultsPage';

/**
 * App - main entry point of the client-side application.
 * Defines main routes.
 */
const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/generate" element={<TestGenerationPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  </Router>
);

export default App;
