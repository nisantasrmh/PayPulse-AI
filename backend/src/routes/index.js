const express = require('express');
const { healthCheck, getTransactions, aiRecover } = require('../controllers');

const router = express.Router();

router.get('/health', healthCheck);
router.get('/transactions', getTransactions);
router.post('/ai-recover', aiRecover);

module.exports = router;
