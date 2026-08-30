const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Road', 'Garbage', 'Water', 'Electricity', 'Other'],
      default: 'Other',
    },
    area: {
      type: String,
      required: [true, 'Area / Locality is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    officerRemark: {
      type: String,
      default: '',
      trim: true,
    },
    feedbackRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedbackComment: {
      type: String,
      default: '',
      trim: true,
    },
    feedbackGiven: {
      type: Boolean,
      default: false,
    },
    feedbackPending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
