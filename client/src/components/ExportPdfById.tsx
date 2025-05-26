import React, { useState } from 'react';
import { exportPdfByTestId } from '../api/api';

const ExportPdfById: React.FC = () => {
  const [testId, setTestId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!testId) {
      alert('Please enter the test ID!');
      return;
    }
    setLoading(true);
    try {
      const blob = await exportPdfByTestId(testId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test_${testId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message || 'Failed to export PDF');
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <input
        type="number"
        placeholder="Test ID"
        value={testId}
        onChange={e => setTestId(e.target.value)}
        style={{ marginRight: 8 }}
        min={1}
      />
      <button onClick={handleExport} disabled={loading}>
        {loading ? 'Exporting...' : 'Export PDF by Test ID'}
      </button>
    </div>
  );
};

export default ExportPdfById;
