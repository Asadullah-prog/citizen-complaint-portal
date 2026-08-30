const express = require('express');
const router = express.Router();
const { getOfficerSummary } = require('../controllers/aiController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post('/officer-summary', authenticateToken, requireRole('officer'), getOfficerSummary);
router.get('/officer-summary', authenticateToken, requireRole('officer'), getOfficerSummary);

module.exports = router;
