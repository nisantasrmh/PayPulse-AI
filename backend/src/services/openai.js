// src/services/openai.js
require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze unpaid transactions and generate recovery actions.
 * Expects transactions array in PayPal format.
 * Returns an array of actions describing how to contact payer, offer discounts, etc.
 */
async function analyzeTransactions(transactions) {
  // Extract relevant info for prompt
  const txnSummaries = transactions.map(t => {
    const info = t.transaction_info || {};
    return `ID: ${info.transaction_id}, Date: ${info.transaction_initiation_date}, Amount: ${info.transaction_amount?.value} ${info.transaction_amount?.currency_code}, Payer: ${info.payer_email}, Status: ${info.transaction_status}`;
  }).join('\n');

  const prompt = `You are an AI financial controller for a B2B SaaS platform. Analyze the following PayPal transactions that are unpaid or overdue and propose JSON-formatted recovery actions for each transaction. Include steps like sending reminder email, offering early payment discount, or escalating to collection. Use the following format:
[
  { "transactionId": "...", "action": "send_email", "details": { "subject": "...", "body": "..." } },
  ...
]
Transactions:\n${txnSummaries}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  try {
    const json = JSON.parse(response.choices[0].message.content);
    return json;
  } catch (e) {
    console.warn('Failed to parse OpenAI response as JSON:', e);
    return [];
  }
}

module.exports = { analyzeTransactions };
