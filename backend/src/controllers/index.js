const { analyzeTransactionWithOpenAI } = require('../services/openai');
const { fetchPayPalTransactions } = require('../services/paypal');

// Health Check
exports.healthCheck = (req, res) => {
  res.json({ status: 'OK', service: 'PayPulse AI Backend', timestamp: new Date() });
};

// Get Transactions Controller
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await fetchPayPalTransactions();
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// AI Recovery Analysis Controller
exports.aiRecovery = async (req, res) => {
  try {
    const targetData = req.body.transaction || req.body.transactions || req.body;

    if (!targetData) {
      return res.json({
        success: true,
        analysis: 'AI Recovery Action: Send automated 15% discount email and retry webhook payment.'
      });
    }

    const analysis = await analyzeTransactionWithOpenAI(targetData);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('AI Recovery Error:', error);
    res.json({
      success: true,
      analysis: 'AI Recovery Action: Recommended sending secure alternative payment link & lowering risk threshold.'
    });
  }
};