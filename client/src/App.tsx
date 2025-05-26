import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LandingPage from "./components/LandingPage";
import TestGenerationPage from "./components/TestGenerationPage";
import ResultsPage from "./components/ResultsPage";
import ExportPdfById from "./components/ExportPdfById";

/**
 * App - main entry point of the client-side application.
 * Defines main routes.
 */
const App: React.FC = () => (
  <Router>
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<TestGenerationPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/export-pdf" element={<ExportPdfById />} />
      </Routes>
    </AppLayout>
  </Router>
);

export default App;
