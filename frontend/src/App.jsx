import React, { useState } from 'react';

export default function App() {
  const [transactions, setTransactions] = useState([
    { id: 'TXN-98412', date: '2026-10-24', amount: '$149.99', payerEmail: 'alex.smith@example.com', status: 'Failed (Risk)' },
    { id: 'TXN-88321', date: '2026-10-23', amount: '$299.00', payerEmail: 'sarah.connor@skynet.io', status: 'Disputed' },
    { id: 'TXN-77615', date: '2026-10-23', amount: '$45.50', payerEmail: 'david.miller@gmail.com', status: 'Completed' },
    { id: 'TXN-66542', date: '2026-10-22', amount: '$1,200.00', payerEmail: 'enterprise@corp.com', status: 'Pending Review' },
    { id: 'TXN-55419', date: '2026-10-21', amount: '$89.99', payerEmail: 'johndoe@yahoo.com', status: 'Failed (Declined)' }
  ]);

  const [auditModalData, setAuditModalData] = useState(null);
  const [loadingTxId, setLoadingTxId] = useState(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [rawPayload, setRawPayload] = useState(null);
  const [autoPilot, setAutoPilot] = useState(true); // Agent Auto-Pilot State

  // Unique Confidence Score aur Step-by-Step Timeline
  const agentAuditDataMap = {
    'TXN-98412': {
      confidence: '91.4%',
      steps: [
        { time: '0.1s', step: 'Webhook Captured', detail: 'Received PAYMENT.CAPTURE.DENIED event from PayPal Sandbox API.' },
        { time: '0.3s', step: 'Risk Telemetry Analysis', detail: 'Detected proxy IP routing & mismatch in billing/shipping zip codes.' },
        { time: '0.6s', step: 'Autonomous Decision', detail: 'Generated single-use secure 1-Click biometric checkout verification link.' },
        { time: '0.9s', step: 'Action Dispatched', detail: 'Dispatched SMS & Email payload to alex.smith@example.com.' }
      ]
    },
    'TXN-88321': {
      confidence: '94.8%',
      steps: [
        { time: '0.1s', step: 'Dispute Webhook Alert', detail: 'Received CUSTOMER.DISPUTE.CREATED from PayPal Resolution Center.' },
        { time: '0.4s', step: 'Evidence Gathering', detail: 'Queried logistics API for carrier delivery timestamp and digital signature.' },
        { time: '0.7s', step: 'Dossier Synthesis', detail: 'Compiled merchant defense package including chat logs and delivery receipt.' },
        { time: '1.0s', step: 'Submission Complete', detail: 'Auto-submitted chargeback defense dossier to PayPal API. Status: Protected.' }
      ]
    },
    'TXN-77615': {
      confidence: '99.2%',
      steps: [
        { time: '0.1s', step: 'Transaction Audit', detail: 'Status verified as Completed ($45.50). Zero fraud flags detected.' },
        { time: '0.4s', step: 'Token Clearance', detail: 'PayPal vault token validated and settled to merchant primary account.' },
        { time: '0.8s', step: 'Loyalty Enrollment', detail: 'Automatically enrolled payer in merchant retention cashback program.' }
      ]
    },
    'TXN-66542': {
      confidence: '95.6%',
      steps: [
        { time: '0.1s', step: 'High-Value Intercept', detail: 'Intercepted $1,200.00 B2B enterprise transaction pending manual review.' },
        { time: '0.3s', step: 'Corporate Verification', detail: 'Cross-referenced enterprise@corp.com with global business registry database.' },
        { time: '0.7s', step: 'Compliance Clearance', detail: 'Tax clearance verified. AI Agent authorized instant fund release.' }
      ]
    },
    'TXN-55419': {
      confidence: '93.1%',
      steps: [
        { time: '0.1s', step: 'Decline Analysis', detail: 'Issuing bank returned insufficient funds error code (10486).' },
        { time: '0.4s', step: 'Fallback Strategy', detail: 'Calculated credit risk profile and approved PayPal Pay in 4 installment option.' },
        { time: '0.8s', step: 'Recovery Dispatched', detail: 'Sent customized checkout recovery link with 10% discount to johndoe@yahoo.com.' }
      ]
    }
  };

  const handleRunAiRecovery = (transaction) => {
    setLoadingTxId(transaction.id);
    setTimeout(() => {
      const auditInfo = agentAuditDataMap[transaction.id] || {
        confidence: '92.0%',
        steps: [
          { time: '0.1s', step: 'Standard Analysis', detail: `Analyzed transaction ${transaction.id} via PayPal API.` },
          { time: '0.5s', step: 'Recovery Protocol', detail: 'Generated automated payment retry link.' }
        ]
      };

      setAuditModalData({
        txId: transaction.id,
        amount: transaction.amount,
        email: transaction.payerEmail,
        status: transaction.status,
        confidence: auditInfo.confidence,
        steps: auditInfo.steps
      });
      setLoadingTxId(null);
    }, 500);
  };

  // Simulate Incoming PayPal Webhook Event with Auto-Pilot Healer
  const handleSimulateWebhook = (eventType) => {
    const randomId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    let initialStatus = 'Failed (Risk)';
    let amountVal = '$189.50';
    let payerVal = 'new.buyer@sandbox.com';

    if (eventType === 'DISPUTED') {
      initialStatus = 'Disputed';
      amountVal = '$450.00';
      payerVal = 'dispute.client@corp.io';
    } else if (eventType === 'COMPLETED') {
      initialStatus = 'Completed';
      amountVal = '$75.00';
      payerVal = 'recovered.user@gmail.com';
    }

    const newTx = { id: randomId, date: '2026-10-24', amount: amountVal, payerEmail: payerVal, status: initialStatus };

    const randomConfidence = (92 + Math.random() * 7).toFixed(1) + '%';
    agentAuditDataMap[randomId] = {
      confidence: randomConfidence,
      steps: [
        { time: '0.1s', step: 'Live Webhook Ingest', detail: `Captured PAYPAL.${eventType} payload from sandbox stream.` },
        { time: '0.4s', step: 'AI Risk Evaluation', detail: 'Computed real-time fraud score and anomaly metrics.' },
        { time: '0.8s', step: 'Autonomous Resolution', detail: autoPilot ? 'Auto-pilot active: Executed instant biometric token recovery.' : 'Dispatched intelligent recovery workflow to buyer endpoint.' }
      ]
    };

    setTransactions((prev) => [newTx, ...prev]);
    setShowWebhookModal(false);
    setWebhookStatus(`⚡ Live Webhook Received: PAYPAL.${eventType} for ${randomId}`);

    // If Auto-Pilot is ON, automatically heal the transaction after 1.2 seconds!
    if (autoPilot && eventType !== 'COMPLETED') {
      setTimeout(() => {
        setTransactions((prev) =>
          prev.map((t) => (t.id === randomId ? { ...t, status: 'Completed (AI Healed)' } : t))
        );
        setWebhookStatus(`🤖 Agent Auto-Pilot: Successfully auto-healed transaction ${randomId} in 0.9s!`);
      }, 1200);
    }

    const mockJsonPayload = {
      id: `WH-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      create_time: new Date().toISOString(),
      resource_type: eventType === 'DISPUTED' ? 'dispute' : 'checkout-order',
      event_type: `PAYMENT.CAPTURE.${eventType}`,
      summary: `PayPal Sandbox Webhook event triggered for transaction ${randomId}`,
      resource: {
        id: randomId,
        amount: { currency_code: 'USD', value: amountVal.replace('$', '') },
        status: eventType === 'COMPLETED' ? 'COMPLETED' : 'DENIED',
        payer: { email_address: payerVal },
        seller_protection: { status: 'ELIGIBLE' }
      }
    };
    setRawPayload(mockJsonPayload);
  };

  // Export Table Data to CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID,Date,Amount,Payer Email,Status\n'];
    const rows = transactions.map(t => `${t.id},${t.date},${t.amount},"${t.payerEmail}",${t.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paypulse-transactions-${Date.now()}.csv`;
    a.click();
  };

  // Filter Transactions based on Grouping
  const filteredTransactions = transactions.filter(tx => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Failed') return tx.status.includes('Failed');
    if (selectedFilter === 'Disputed') return tx.status.includes('Disputed');
    if (selectedFilter === 'Completed') return tx.status.includes('Completed') || tx.status.includes('AI Healed');
    if (selectedFilter === 'Pending') return tx.status.includes('Pending');
    return true;
  });

  // Dynamic Success Rate Calculation
  const completedCount = transactions.filter(t => t.status.includes('Completed') || t.status.includes('AI Healed')).length;
  const failedOrRiskCount = transactions.filter(t => t.status.includes('Failed') || t.status.includes('Disputed')).length;
  const calculatedRate = 85 - (failedOrRiskCount * 4) + (completedCount * 3);
  const dynamicSuccessRate = Math.max(30, Math.min(99.9, calculatedRate)).toFixed(1);

  // Render Status Badge with Risk Telemetry Micro-Tags
  const getStatusWithRiskTags = (status, id) => {
    let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
    let riskTag = null;

    if (status.includes('Failed (Risk)')) {
      badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
      riskTag = 'Proxy IP / Zip Mismatch';
    } else if (status.includes('Disputed')) {
      badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      riskTag = 'Chargeback Claim';
    } else if (status.includes('Completed')) {
      badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      riskTag = 'Vault Verified';
    } else if (status.includes('AI Healed')) {
      badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse';
      riskTag = '🤖 Auto-Pilot Healed';
    } else if (status.includes('Pending')) {
      badgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      riskTag = 'B2B Compliance';
    } else if (status.includes('Declined')) {
      badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
      riskTag = 'Insufficient Funds';
    }

    return (
      <div className="space-y-1">
        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium border ${badgeStyle}`}>
          {status}
        </span>
        {riskTag && (
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <span className={status.includes('AI Healed') ? 'text-emerald-400' : 'text-red-400'}>⚡</span> {riskTag}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans p-8 relative">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Minimal Clean Header with Action Buttons & Auto-Pilot Toggle */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight text-white">
                PayPulse AI
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800/60 border border-slate-700">
                Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous Merchant Transaction Recovery Engine
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Auto-Pilot Toggle Switch */}
            <button
              onClick={() => setAutoPilot(!autoPilot)}
              className={`text-xs font-medium px-3 py-1.5 rounded transition-colors cursor-pointer border flex items-center gap-1.5 ${autoPilot
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoPilot ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              Auto-Pilot: {autoPilot ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-3.5 py-1.5 rounded transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>📥</span> Export CSV
            </button>
            <button
              onClick={() => setShowWebhookModal(!showWebhookModal)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-1.5 rounded transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>⚡</span> Simulate Webhook
            </button>
          </div>
        </header>

        {/* Webhook Simulation Modal */}
        {showWebhookModal && (
          <div className="p-4 bg-[#161b22] border border-blue-500/40 rounded-lg shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">PayPal Webhook Event Trigger</h3>
              <p className="text-xs text-slate-400 mt-0.5">Select a sandbox event to push into the live transaction engine:</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => handleSimulateWebhook('DENIED')} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1.5 rounded font-medium cursor-pointer">
                🚨 PAYMENT.CAPTURE.DENIED
              </button>
              <button onClick={() => handleSimulateWebhook('DISPUTED')} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-3 py-1.5 rounded font-medium cursor-pointer">
                ⚠️ CUSTOMER.DISPUTE.CREATED
              </button>
              <button onClick={() => handleSimulateWebhook('COMPLETED')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded font-medium cursor-pointer">
                ✅ PAYMENT.CAPTURE.COMPLETED
              </button>
            </div>
          </div>
        )}

        {/* Webhook Alert Notification Banner with JSON Payload Inspect Button */}
        {webhookStatus && (
          <div className="p-3 bg-[#0d1117] border border-emerald-500/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-emerald-300 font-medium">{webhookStatus}</p>
            {rawPayload && (
              <button
                onClick={() => setRawPayload(rawPayload)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] px-2.5 py-1 rounded font-mono cursor-pointer"
              >
                &lt;/&gt; View Webhook Payload
              </button>
            )}
          </div>
        )}

        {/* Raw PayPal Webhook JSON Payload Modal Viewer */}
        {rawPayload && typeof rawPayload === 'object' && (
          <div className="p-4 bg-[#161b22] border border-slate-700 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                PayPal REST API — Raw Webhook Transmission JSON
              </span>
              <button onClick={() => setRawPayload(null)} className="text-slate-400 hover:text-white text-xs cursor-pointer font-bold">✕ Close</button>
            </div>
            <pre className="bg-[#090d16] p-3 rounded border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
              {JSON.stringify(rawPayload, null, 2)}
            </pre>
          </div>
        )}

        {/* Clean Dynamic Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800/80">
            <p className="text-xs text-slate-400">Gross Volume</p>
            <p className="text-xl font-semibold text-white mt-1">$1,784.48</p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800/80">
            <p className="text-xs text-slate-400">Failed Transactions</p>
            <p className="text-xl font-semibold text-red-400 mt-1">{transactions.filter(t => t.status.includes('Failed') || t.status.includes('Disputed')).length}</p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800/80">
            <p className="text-xs text-slate-400">Recovery Success Rate</p>
            <p className="text-xl font-semibold text-emerald-400 mt-1">{dynamicSuccessRate}%</p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800/80">
            <p className="text-xs text-slate-400">Recovered Revenue</p>
            <p className="text-xl font-semibold text-emerald-400 mt-1">$448.99</p>
          </div>
        </div>

        {/* Clean Fintech Table with Grouping / Filtering Tabs */}
        <div className="bg-[#0d1117] rounded-lg p-5 border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-medium text-slate-200">Recent Transactions (Live Feed)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Showing {filteredTransactions.length} of {transactions.length} entries</p>
            </div>

            {/* Grouping / Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#161b22] p-1 rounded-lg border border-slate-800">
              {['All', 'Failed', 'Disputed', 'Completed', 'Pending'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${selectedFilter === filter
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161b22] text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payer Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#0d1117]">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-slate-200 font-medium">{tx.id}</td>
                      <td className="px-4 py-3.5 text-slate-400">{tx.date}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-100">{tx.amount}</td>
                      <td className="px-4 py-3.5 text-slate-400">{tx.payerEmail}</td>
                      <td className="px-4 py-3.5">{getStatusWithRiskTags(tx.status, tx.id)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleRunAiRecovery(tx)}
                          disabled={loadingTxId === tx.id}
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium px-3 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {loadingTxId === tx.id ? 'Analyzing...' : 'Run Recovery'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      No transactions found for filter: {selectedFilter}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* AI Agent Step-by-Step Audit Timeline Modal */}
      {auditModalData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d1117] border border-blue-500/40 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">

            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Autonomous Agent Audit Timeline
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Target: {auditModalData.txId} | Amount: {auditModalData.amount} | Payer: {auditModalData.email}
                </p>
              </div>
              <button
                onClick={() => setAuditModalData(null)}
                className="text-slate-400 hover:text-white text-base font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step-by-Step Timeline Feed */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {auditModalData.steps.map((item, index) => (
                <div key={index} className="flex items-start gap-3 relative pl-4 border-l-2 border-blue-500/50">
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-400"></span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                        {item.time}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{item.step}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer with Unique Dynamic Confidence Score */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span>✓</span> AI Confidence Score: <strong className="font-mono">{auditModalData.confidence}</strong>
              </span>
              <button
                onClick={() => setAuditModalData(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-1.5 rounded transition-colors cursor-pointer"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}