import React, { useState } from 'react';
import { MessageSquareQuote, Check, X, Star } from 'lucide-react';
import StarRating from './StarRating';
import api from '../services/api';

export const FeedbackModal = ({ isOpen, complaint, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await api.submitFeedback(complaint._id, rating, comment);
      if (onSuccess) onSuccess(response.complaint);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                backgroundColor: '#d1fae5',
                color: '#065f46',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
              }}
            >
              <MessageSquareQuote size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Was your issue resolved?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Please rate the municipal resolution service for:
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-main)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
            {complaint.title}
          </div>
          {complaint.officerRemark && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <strong>Officer Remark:</strong> {complaint.officerRemark}
            </div>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              Select Satisfaction Rating
            </label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StarRating rating={rating} onChange={setRating} size={36} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {rating === 5 && '🌟 Excellent resolution'}
              {rating === 4 && '👍 Good and satisfactory'}
              {rating === 3 && '😐 Average'}
              {rating === 2 && '👎 Needs improvement'}
              {rating === 1 && '⚠️ Dissatisfied with resolution'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Feedback Comment (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Tell us about the resolution quality, timeliness, or additional comments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
              <Check size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
