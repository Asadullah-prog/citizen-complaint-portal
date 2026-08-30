import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StarRating from '../components/StarRating';
import FeedbackModal from '../components/FeedbackModal';
import {
  FolderOpen,
  PlusCircle,
  MessageSquareQuote,
  Clock,
  ThumbsUp,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFeedbackComplaint, setActiveFeedbackComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.getMyComplaints();
      if (res && res.complaints) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your complaints.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="main-content">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Complaints</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage and track all civic issues you have reported
          </p>
        </div>

        <Link to="/complaints/new" className="btn btn-primary">
          <PlusCircle size={18} />
          Report New Complaint
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--text-muted)',
            }}
          >
            <FolderOpen size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No complaints filed yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            You haven't submitted any civic complaints yet. If you see a problem in your locality, report it for swift resolution.
          </p>
          <Link to="/complaints/new" className="btn btn-primary">
            <PlusCircle size={18} />
            File Your First Complaint
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {complaints.map((c) => (
            <div key={c._id} className="card" style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-category">{c.category}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} score={c.priorityScore} />
                  </div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {c.title}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to={`/complaints/${c._id}`} className="btn btn-secondary btn-sm">
                    View Full Details &rarr;
                  </Link>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                {c.description}
              </p>

              {/* Meta details */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.875rem',
                  marginBottom: c.officerRemark || c.status === 'Resolved' ? '1rem' : '0',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} color="var(--primary)" />
                  Locality: <strong>{c.area}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ThumbsUp size={15} color="var(--primary)" />
                  Community Upvotes: <strong>{c.upvotes}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={15} />
                  Filed: {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Officer Remark if present */}
              {c.officerRemark && (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem 1rem',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.2rem' }}>
                    Officer Resolution Remark:
                  </div>
                  <div style={{ color: '#14532d' }}>{c.officerRemark}</div>
                </div>
              )}

              {/* Citizen Feedback Section */}
              {c.status === 'Resolved' && (
                <div
                  style={{
                    backgroundColor: c.feedbackGiven ? '#fafafa' : '#eff6ff',
                    border: `1px solid ${c.feedbackGiven ? 'var(--border)' : '#bfdbfe'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  {c.feedbackGiven ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          Your Verified Rating:
                        </span>
                        <StarRating rating={c.feedbackRating} readOnly size={16} />
                      </div>
                      {c.feedbackComment && (
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          "{c.feedbackComment}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.9rem' }}>
                          Was your issue resolved satisfactorily?
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
                          Your feedback helps maintain municipal quality standards and accountability.
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveFeedbackComplaint(c)}
                      >
                        <MessageSquareQuote size={14} />
                        Submit Feedback
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={!!activeFeedbackComplaint}
        complaint={activeFeedbackComplaint}
        onClose={() => setActiveFeedbackComplaint(null)}
        onSuccess={() => {
          fetchComplaints();
          setActiveFeedbackComplaint(null);
        }}
      />
    </div>
  );
};

export default MyComplaintsPage;
