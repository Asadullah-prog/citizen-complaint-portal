const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  checkDuplicate,
  upvoteComplaint,
  updateStatus,
  submitFeedback,
  exportCSV,
} = require('../controllers/complaintController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public & Static query routes FIRST
router.get('/', getComplaints);
router.get('/check-duplicate', checkDuplicate);

// Authenticated citizen / officer specific static routes
router.get('/mine', authenticateToken, getMyComplaints);
router.get('/export', authenticateToken, requireRole('officer'), exportCSV);

// Create complaint
router.post('/', authenticateToken, createComplaint);

// Single complaint operations (id param)
router.get('/:id', getComplaintById);
router.patch('/:id/upvote', authenticateToken, upvoteComplaint);
router.patch('/:id/status', authenticateToken, requireRole('officer'), updateStatus);
router.patch('/:id/feedback', authenticateToken, submitFeedback);

module.exports = router;
