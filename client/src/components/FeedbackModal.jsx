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
      <div className="modal-content" style={{ maxWidth: '520px', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MessageSquareQuote size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Rate Municipal Resolution</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Your feedback ensures civic quality and accountability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-main)',
            padding: '0.85rem 1.1rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.25rem',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary-900)' }}>
            {complaint.title}
          </div>
          {complaint.officerRemark && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              <strong>Officer Note:</strong> {complaint.officerRemark}
            </div>
          )}
        </div>

        {error && <div className="alert alert-danger"><X size={16} /><span>{error}</span></div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'center', margin: '1.75rem 0' }}>
            <label className="form-label" style={{ marginBottom: '0.85rem', fontSize: '0.95rem' }}>
              Satisfaction Score
            </label>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StarRating rating={rating} onChange={setRating} size={36} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.65rem', fontWeight: 600 }}>
              {rating === 5 && '🌟 5/5 — Excellent resolution & service'}
              {rating === 4 && '👍 4/5 — Good and fully satisfactory'}
              {rating === 3 && '😐 3/5 — Average resolution'}
              {rating === 2 && '👎 2/5 — Needs work / delayed'}
              {rating === 1 && '⚠️ 1/5 — Unsatisfactory resolution'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Review Comment (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Tell us about the resolution speed, quality of work, or any follow-up needed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Satisfaction Rating'}
              <Check size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;