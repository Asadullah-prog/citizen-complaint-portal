import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ThumbsUp, ArrowRight, ExternalLink, ShieldAlert } from 'lucide-react';
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
      <div className="modal-content" style={{ maxWidth: '640px', borderRadius: 'var(--radius-2xl)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Active Reports in this Locality
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              We found {duplicates.length} open complaint(s) in this area & category.
            </p>
          </div>
        </div>

        <div className="alert alert-warning" style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          <strong>Tip:</strong> Upvoting existing reports escalates their priority tier and helps teams respond faster without duplicating effort.
        </div>

        {/* Existing Duplicates List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
          {duplicates.map((item) => (
            <div
              key={item._id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {item.title}
                </h4>
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <StatusBadge status={item.status} />
                  <PriorityBadge priority={item.priority} score={item.priorityScore} />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                {item.description.length > 110 ? `${item.description.slice(0, 110)}...` : item.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  📍 Area: <strong>{item.area}</strong> &bull; 👍 Upvotes: <strong>{item.upvotes || 0}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/complaints/${item._id}`);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.3rem', padding: '0.25rem 0.6rem' }}
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={onContinueAnyway}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit New Report Anyway'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateWarningModal;