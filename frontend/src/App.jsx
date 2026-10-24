import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Fallback mock data for seamless hackathon demo
const MOCK_TRANSACTIONS = [
  { id: 'TXN-98412', date: '2026-10-24', amount: '$149.99', payerEmail: 'alex.smith@example.com', status: 'Failed (Risk)' },
  { id: 'TXN-88321', date: '2026-10-23', amount: '$299.00', payerEmail: 'sarah.connor@skynet.io', status: 'Disputed' },
  { id: 'TXN-77615', date: '2026-10-23', amount: '$45.50', payerEmail: 'david.miller@gmail.com', status: 'Completed' },
  { id: 'TXN-66542', date: '2026-10-22', amount: '$1,200.00', payerEmail: 'enterprise@corp.com', status: 'Pending Review' },
  { id: 'TXN-55419', date: '2026-10-21', amount: '$89.99', payerEmail: 'johndoe@yahoo.com', status: 'Failed (Declined)' }
];

function App() {
  const [rowData, setRowData] = useState(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    // Try fetching from backend, fallback to mock if backend is offline
    fetch('http://localhost:5000/api/transactions')
      .then(res => res.json())
      .then(data => {
        const txs = Array.isArray(data) ? data : (data.transactions || []);
        if (txs.length > 0) {
          // Map to match display fields if needed
          const formatted = txs.map(t => ({
            id: t.id || t.transaction_id || 'TXN-000',
            date: t.date || '2026-10-24',
            amount: t.amount || '$100.00',
            payerEmail: t.payerEmail || t.payer_email || 'user@test.com',
            status: t.status || 'Completed'
          }));
          setRowData(formatted);
        }
      })
      .catch(err => {
        console.log('Using local hackathon mock data stream:', err);
      });
  }, []);

  const triggerAiRecovery = (tx) => {
    fetch('http://localhost:5000/api/ai-recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction: tx })
    })
      .then(res => res.json())
      .then(data => {
        setAiResult(data.analysis || data.message || 'AI Recovery action dispatched successfully!');
      })
      .catch(() => {
        setAiResult(`Recommended AI Recovery for ${tx.id}: Send automated 15% discount email & retry payment webhook.`);
      });
  };

  const columnDefs = [
    { headerName: 'Transaction ID', field: 'id', flex: 1, filter: true, sortable: true },
    { headerName: 'Date', field: 'date', flex: 1, filter: true, sortable: true },
    { headerName: 'Amount', field: 'amount', flex: 1, filter: true, sortable: true },
    { headerName: 'Payer Email', field: 'payerEmail', flex: 1.2, filter: true, sortable: true },
    { headerName: 'Status', field: 'status', flex: 1, filter: true, sortable: true },
    {
      headerName: 'AI Action',
      field: 'id',
      flex: 1,
      cellRenderer: (params) => (
        <button
          onClick={() => triggerAiRecovery(params.data)}
          style={{
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          🤖 Run AI Recovery
        </button>
      )
    }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '26px', fontWeight: 'bold', color: '#38bdf8' }}>
        PayPulse AI – Merchant Transaction Dashboard
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#94a3b8', fontSize: '14px' }}>
        Autonomous PayPal Transaction Recovery & Risk Mitigation Engine
      </p>

      {aiResult && (
        <div style={{ background: '#1e293b', border: '1px solid #38bdf8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <strong>💡 AI Recovery Insight:</strong> {aiResult}
          <button onClick={() => setAiResult(null)} style={{ float: 'right', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div className="ag-theme-alpine-dark" style={{ height: '65vh', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>
    </div>
  );
}

export default App;