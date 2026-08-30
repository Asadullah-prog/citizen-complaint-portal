import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ThumbsUp, ArrowRight, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export const DuplicateWarningModal = ({
  isOpen,
  duplicates = [],
  onClose,
  onContinueAnyway,
  isSubmitting,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !duplicates || duplicates.length === 0) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              backgroundColor: '#fef3c7',
              color: '#b45309',
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Similar Complaint Already Reported
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              We found {duplicates.length} active complaint(s) in this area and category.
            </p>
          </div>
        </div>

        <div className="alert alert-warning" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Upvoting an existing report increases its urgency score and helps municipal teams resolve it faster, avoiding duplicate work.
        </div>

        {/* Existing Duplicates List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
          {duplicates.map((item) => (
            <div
              key={item._id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.875rem',
                backgroundColor: 'var(--bg-main)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {item.title}
                </h4>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <StatusBadge status={item.status} />
                  <PriorityBadge priority={item.priority} score={item.priorityScore} />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {item.description.length > 110 ? `${item.description.slice(0, 110)}...` : item.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Area: <strong>{item.area}</strong> &bull; Upvotes: <strong>{item.upvotes}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/complaints/${item._id}`);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.25rem', padding: '0.25rem 0.5rem' }}
                >
                  <ThumbsUp size={13} color="var(--primary)" />
                  View & Upvote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.25rem',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Go Back & Edit
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onContinueAnyway}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Continue Anyway & Submit'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateWarningModal;
