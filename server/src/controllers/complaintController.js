const Complaint = require('../models/Complaint');
const { attachPriority } = require('../utils/priority');
const { Parser } = require('json2csv');

/**
 * Helper to escape regex special characters
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Create a new complaint (Citizen)
 */
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, area } = req.body;

    if (!title || !description || !category || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, and area.',
      });
    }

    const validCategories = ['Road', 'Garbage', 'Water', 'Electricity', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
      });
    }

    // Always use req.user._id from JWT, NEVER frontend userId
    const newComplaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category,
      area: area.trim(),
      status: 'Pending',
      upvotes: 0,
      createdBy: req.user._id,
      officerRemark: '',
      feedbackGiven: false,
      feedbackPending: false,
    });

    const populated = await Complaint.findById(newComplaint._id).populate('createdBy', 'name email role');
    const enriched = attachPriority(populated);

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint: enriched,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create complaint.',
      error: error.message,
    });
  }
};

/**
 * Check for duplicate complaints in same category and area with active status
 */
exports.checkDuplicate = async (req, res) => {
  try {
    const { category, area } = req.query;

    if (!category || !area) {
      return res.status(200).json({
        success: true,
        hasDuplicates: false,
        duplicates: [],
      });
    }

    const query = {
      category: category.trim(),
      area: { $regex: new RegExp(`^${escapeRegex(area.trim())}$`, 'i') },
      status: { $in: ['Pending', 'In Progress'] },
    };

    const duplicates = await Complaint.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const enriched = duplicates.map(attachPriority);

    return res.status(200).json({
      success: true,
      hasDuplicates: enriched.length > 0,
      count: enriched.length,
      duplicates: enriched,
    });
  } catch (error) {
    console.error('Duplicate check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking duplicate complaints.',
      error: error.message,
    });
  }
};

/**
 * Get all complaints with filtering, search, and sorting
 */
exports.getComplaints = async (req, res) => {
  try {
    const { search, category, area, status, priority, sort } = req.query;

    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (area && area !== 'All') {
      filter.area = { $regex: escapeRegex(area), $options: 'i' };
    }

    if (search) {
      const searchRegex = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [{ title: searchRegex }, { description: searchRegex }, { area: searchRegex }];
    }

    let query = Complaint.find(filter).populate('createdBy', 'name email role');

    // Default sort by newest
    query = query.sort({ createdAt: -1 });

    const rawComplaints = await query.exec();
    let enriched = rawComplaints.map(attachPriority);

    // Apply priority filter in memory since priority is dynamic
    if (priority && priority !== 'All') {
      enriched = enriched.filter((c) => c.priority.toLowerCase() === priority.toLowerCase());
    }

    // Apply custom sort if requested
    if (sort === 'priority') {
      enriched.sort((a, b) => b.priorityScore - a.priorityScore);
    } else if (sort === 'upvotes') {
      enriched.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sort === 'oldest') {
      enriched.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return res.status(200).json({
      success: true,
      total: enriched.length,
      complaints: enriched,
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints.',
      error: error.message,
    });
  }
};

/**
 * Get complaints created by current authenticated user
 */
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    const enriched = complaints.map(attachPriority);

    return res.status(200).json({
      success: true,
      total: enriched.length,
      complaints: enriched,
    });
  } catch (error) {
    console.error('Get my complaints error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user complaints.',
      error: error.message,
    });
  }
};

/**
 * Get single complaint details
 */
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id).populate('createdBy', 'name email role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    const enriched = attachPriority(complaint);

    return res.status(200).json({
      success: true,
      complaint: enriched,
    });
  } catch (error) {
    console.error('Get complaint by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint.',
      error: error.message,
    });
  }
};

/**
 * Upvote a complaint (Logged-in citizen/user)
 */
exports.upvoteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Complaint.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    ).populate('createdBy', 'name email role');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    const enriched = attachPriority(updated);

    return res.status(200).json({
      success: true,
      message: 'Upvote recorded.',
      complaint: enriched,
    });
  } catch (error) {
    console.error('Upvote error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upvote complaint.',
      error: error.message,
    });
  }
};

/**
 * Update complaint status and officer remarks (Officer only)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, officerRemark } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const existing = await Complaint.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (status) {
      existing.status = status;
      if (status === 'Resolved' && !existing.feedbackGiven) {
        existing.feedbackPending = true;
      }
    }

    if (typeof officerRemark === 'string') {
      existing.officerRemark = officerRemark.trim();
    }

    await existing.save();

    const populated = await Complaint.findById(id).populate('createdBy', 'name email role');
    const enriched = attachPriority(populated);

    return res.status(200).json({
      success: true,
      message: `Complaint status updated to ${existing.status}.`,
      complaint: enriched,
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint status.',
      error: error.message,
    });
  }
};

/**
 * Submit citizen feedback on resolved complaint
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedbackComment } = req.body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5 stars.',
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Only creator can give feedback
    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit feedback for complaints you created.',
      });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted on resolved complaints.',
      });
    }

    if (complaint.feedbackGiven) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this complaint.',
      });
    }

    complaint.feedbackRating = numRating;
    complaint.feedbackComment = (feedbackComment || '').trim();
    complaint.feedbackGiven = true;
    complaint.feedbackPending = false;

    await complaint.save();

    const populated = await Complaint.findById(id).populate('createdBy', 'name email role');
    const enriched = attachPriority(populated);

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your feedback has been recorded.',
      complaint: enriched,
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback.',
      error: error.message,
    });
  }
};

/**
 * Export complaints to CSV with applied filters (Officer only)
 */
exports.exportCSV = async (req, res) => {
  try {
    const { search, category, area, status, priority } = req.query;

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (area && area !== 'All') filter.area = { $regex: escapeRegex(area), $options: 'i' };
    if (search) {
      const searchRegex = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [{ title: searchRegex }, { description: searchRegex }, { area: searchRegex }];
    }

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    let enriched = complaints.map(attachPriority);

    if (priority && priority !== 'All') {
      enriched = enriched.filter((c) => c.priority.toLowerCase() === priority.toLowerCase());
    }

    const fields = [
      { label: 'ID', value: '_id' },
      { label: 'Title', value: 'title' },
      { label: 'Category', value: 'category' },
      { label: 'Area', value: 'area' },
      { label: 'Status', value: 'status' },
      { label: 'Priority', value: 'priority' },
      { label: 'Priority Score', value: 'priorityScore' },
      { label: 'Upvotes', value: 'upvotes' },
      { label: 'Filed By', value: (row) => (row.createdBy ? row.createdBy.name : 'Anonymous') },
      { label: 'Filed Email', value: (row) => (row.createdBy ? row.createdBy.email : 'N/A') },
      { label: 'Filed On', value: (row) => new Date(row.createdAt).toISOString().replace('T', ' ').slice(0, 19) },
      { label: 'Last Updated', value: (row) => new Date(row.updatedAt).toISOString().replace('T', ' ').slice(0, 19) },
      { label: 'Officer Remark', value: 'officerRemark' },
      { label: 'Feedback Rating', value: (row) => (row.feedbackRating ? `${row.feedbackRating}/5` : 'N/A') },
      { label: 'Feedback Comment', value: 'feedbackComment' },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(enriched);

    const todayStr = new Date().toISOString().slice(0, 10);
    const filename = `complaints_export_${todayStr}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export CSV.',
      error: error.message,
    });
  }
};
