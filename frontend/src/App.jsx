import React, { useState } from 'react';

export default function App() {
  const [transactions, setTransactions] = useState([
    { id: 'TXN-98412', date: '2026-10-24', amount: '$149.99', payerEmail: 'alex.smith@example.com', status: 'Failed (Risk)' },
    { id: 'TXN-88321', date: '2026-10-23', amount: '$299.00', payerEmail: 'sarah.connor@skynet.io', status: 'Disputed' },
    { id: 'TXN-77615', date: '2026-10-23', amount: '$45.50', payerEmail: 'david.miller@gmail.com', status: 'Completed' },
    { id: 'TXN-66542', date: '2026-10-22', amount: '$1,200.00', payerEmail: 'enterprise@corp.com', status: 'Pending Review' },
    { id: 'TXN-55419', date: '2026-10-21', amount: '$89.99', payerEmail: 'johndoe@yahoo.com', status: 'Failed (Declined)' }
  ]);

  const [aiInsight, setAiInsight] = useState(null);
  const [loadingTxId, setLoadingTxId] = useState(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null);

  const specificInsights = {
    'TXN-98412': 'AI Risk Mitigation for TXN-98412 ($149.99): Detected unusual proxy IP routing. Automatically dispatched secure PayPal 1-Click biometric verification link to alex.smith@example.com.',
    'TXN-88321': 'Dispute Defense Dossier for TXN-88321 ($299.00): Automatically compiled tracking logs, API delivery timestamp, and buyer interaction history, submitting a complete chargeback defense package to PayPal Resolution Center.',
    'TXN-77615': 'Transaction Audit for TXN-77615 ($45.50): Status is Verified & Completed. AI Agent confirmed token clearance and scheduled automated merchant settlement.',
    'TXN-66542': 'Enterprise Compliance Review for TXN-66542 ($1,200.00): High-value B2B transaction under compliance check. Verified corporate registry for enterprise@corp.com and authorized instant fund release.',
    'TXN-55419': 'Decline Recovery for TXN-55419 ($89.99): Insufficient funds flagged by issuing bank. AI Agent triggered automated PayPal Pay in 4 installment offer sent directly to johndoe@yahoo.com.'
  };

  const handleRunAiRecovery = async (transaction) => {
    setLoadingTxId(transaction.id);
    setTimeout(() => {
      const customMessage = specificInsights[transaction.id] || `AI Agent analyzed transaction ${transaction.id} and initiated automated PayPal recovery workflow.`;
      setAiInsight({
        txId: transaction.id,
        message: customMessage
      });
      setLoadingTxId(null);
    }, 400);
  };

  // Simulate Incoming PayPal Webhook Event
  const handleSimulateWebhook = (eventType) => {
    const randomId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    let newTx = {};

    if (eventType === 'DENIED') {
      newTx = { id: randomId, date: '2026-10-24', amount: '$189.50', payerEmail: 'new.buyer@sandbox.com', status: 'Failed (Risk)' };
    } else if (eventType === 'DISPUTED') {
      newTx = { id: randomId, date: '2026-10-24', amount: '$450.00', payerEmail: 'dispute.client@corp.io', status: 'Disputed' };
    } else {
      newTx = { id: randomId, date: '2026-10-24', amount: '$75.00', payerEmail: 'recovered.user@gmail.com', status: 'Completed' };
    }

    // Add to top of list
    setTransactions([newTx, ...transactions]);
    setShowWebhookModal(false);
    setWebhookStatus(`⚡ Live Webhook Received: PAYPAL.${eventType} for ${randomId}. AI Agent automatically processed risk score & updated grid.`);
  };

  const getStatusBadge = (status) => {
    let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
    if (status.includes('Failed')) badgeStyle = 'bg-red-500/10 text-red-400 border-red-500/20';
    else if (status.includes('Disputed')) badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    else if (status.includes('Completed')) badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    else if (status.includes('Pending')) badgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

    return (
      <span className={`px-2.5 py-1 rounded text-[11px] font-medium border ${badgeStyle}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Minimal Clean Header with Webhook Simulator Button */}
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWebhookModal(!showWebhookModal)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-1.5 rounded transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>⚡</span> Simulate Webhook
            </button>
            <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-1.5 rounded border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400">Sandbox Connected</span>
            </div>
          </div>
        </header>

        {/* Webhook Simulation Dropdown Menu */}
        {showWebhookModal && (
          <div className="p-4 bg-[#161b22] border border-blue-500/40 rounded-lg shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
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

        {/* Webhook Alert Notification Banner */}
        {webhookStatus && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg flex items-center justify-between gap-4">
            <p className="text-xs text-emerald-300 font-medium">{webhookStatus}</p>
            <button onClick={() => setWebhookStatus(null)} className="text-emerald-400 hover:text-white text-xs cursor-pointer">✕</button>
          </div>
        )}

        {/* Clean Metrics Grid */}
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
            <p className="text-xl font-semibold text-slate-200 mt-1">84.2%</p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800/80">
            <p className="text-xs text-slate-400">Recovered Revenue</p>
            <p className="text-xl font-semibold text-emerald-400 mt-1">$448.99</p>
          </div>
        </div>

        {/* Dynamic Contextual AI Banner */}
        {aiInsight && (
          <div className="p-4 bg-[#0d1117] border border-blue-500/30 rounded-lg flex items-start justify-between gap-4 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                AI Agent Insight — {aiInsight.txId}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{aiInsight.message}</p>
            </div>
            <button
              onClick={() => setAiInsight(null)}
              className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Clean Standard Fintech Table */}
        <div className="bg-[#0d1117] rounded-lg p-5 border border-slate-800/80 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-slate-200">Recent Transactions (Live Feed)</h2>
            <span className="text-[11px] font-mono text-slate-500">Total: {transactions.length} items</span>
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
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#161b22]/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-200 font-medium">{tx.id}</td>
                    <td className="px-4 py-3.5 text-slate-400">{tx.date}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-100">{tx.amount}</td>
                    <td className="px-4 py-3.5 text-slate-400">{tx.payerEmail}</td>
                    <td className="px-4 py-3.5">{getStatusBadge(tx.status)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleRunAiRecovery(tx)}
                        disabled={loadingTxId === tx.id}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium px-3 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {loadingTxId === tx.id ? 'Processing...' : 'Run Recovery'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}