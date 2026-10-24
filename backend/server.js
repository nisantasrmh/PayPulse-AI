const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'PayPulse AI Backend', timestamp: new Date() });
});

// Transactions Endpoint (Mock data embedded for seamless demo)
app.get('/api/transactions', (req, res) => {
  res.json({
    success: true,
    transactions: [
      { id: 'TXN-98412', date: '2026-10-24', amount: '$149.99', payerEmail: 'alex.smith@example.com', status: 'Failed (Risk)' },
      { id: 'TXN-88321', date: '2026-10-23', amount: '$299.00', payerEmail: 'sarah.connor@skynet.io', status: 'Disputed' },
      { id: 'TXN-77615', date: '2026-10-23', amount: '$45.50', payerEmail: 'david.miller@gmail.com', status: 'Completed' },
      { id: 'TXN-66542', date: '2026-10-22', amount: '$1,200.00', payerEmail: 'enterprise@corp.com', status: 'Pending Review' },
      { id: 'TXN-55419', date: '2026-10-21', amount: '$89.99', payerEmail: 'johndoe@yahoo.com', status: 'Failed (Declined)' }
    ]
  });
});

// AI Recovery Endpoint
app.post('/api/ai-recover', (req, res) => {
  const tx = req.body.transaction || { id: 'TXN-000' };
  res.json({
    success: true,
    analysis: `AI Recovery Action for ${tx.id || 'Transaction'}: Recommended sending automated 15% discount email, flagging risk parameters, and triggering secure payment link retry.`
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});