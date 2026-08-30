import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StarRating from '../components/StarRating';
import FeedbackModal from '../components/FeedbackModal';
import {
  FolderOpen, PlusCircle, MessageSquareQuote, ThumbsUp, MapPin, Calendar, AlertCircle, Star,
} from 'lucide-react';

const statusBorderColor = (s) => ({ Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' }[s] || '#e2e8f0');

export const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFeedbackComplaint, setActiveFeedbackComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.getMyComplaints();
      if (res && res.complaints) setComplaints(res.complaints);
    } catch (err) {
      setError(err.message || 'Failed to load your complaints.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
        borderRadius: 'var(--radius-xl)', padding: '2rem 2.25rem', marginBottom: '1.75rem',
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 70% at 100% -10%, rgba(96,165,250,0.2), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
            <FolderOpen size={24} />
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>My Complaints</h1>
          </div>
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
            Track and manage all civic issues you have reported — {complaints.length} total
          </p>
        </div>
        <Link to="/complaints/new" className="btn btn-xl" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, position: 'relative', flexShrink: 0 }}>
          <PlusCircle size={18} /> Report New Complaint
        </Link>
      </div>

      {error && <div className="alert alert-danger"><AlertCircle size={18} />{error}</div>}

      {loading ? (
        <div className="spinner" />
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--primary-400)' }}>
            <FolderOpen size={36} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No complaints filed yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            If you see a problem in your locality — a pothole, broken light, or garbage overflow — report it now for swift municipal resolution.
          </p>
          <Link to="/complaints/new" className="btn btn-primary">
            <PlusCircle size={18} /> File Your First Complaint
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {complaints.map((c) => (
            <div key={c._id} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${statusBorderColor(c.status)}` }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-category">{c.category}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} score={c.priorityScore} />
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{c.title}</h2>
                </div>
                <Link to={`/complaints/${c._id}`} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                  View Details &rarr;
                </Link>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {c.description}
              </p>

              {/* Meta row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.875rem', marginBottom: (c.officerRemark || c.status === 'Resolved') ? '1rem' : 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                  <MapPin size={14} color="var(--primary)" /> {c.area}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ThumbsUp size={14} color="var(--primary)" /> {c.upvotes} upvotes
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Officer Remark */}
              {c.officerRemark && (
                <div style={{
                  background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem', marginBottom: '1rem', fontSize: '0.875rem',
                  borderLeft: '4px solid #10b981',
                }}>
                  <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Officer Resolution Note</div>
                  <div style={{ color: '#14532d' }}>{c.officerRemark}</div>
                </div>
              )}

              {/* Feedback Section */}
              {c.status === 'Resolved' && (
                <div style={{
                  background: c.feedbackGiven ? '#f8fafc' : 'var(--primary-50)',
                  border: `1px solid ${c.feedbackGiven ? 'var(--border)' : 'var(--primary-200)'}`,
                  borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
                }}>
                  {c.feedbackGiven ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Star size={15} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Your Rating:</span>
                        <StarRating rating={c.feedbackRating} readOnly size={16} />
                      </div>
                      {c.feedbackComment && (
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{c.feedbackComment}"</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-800)', fontSize: '0.9rem' }}>Was your issue resolved satisfactorily?</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)' }}>Your feedback maintains municipal accountability.</div>
                      </div>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setActiveFeedbackComplaint(c)}>
                        <MessageSquareQuote size={14} /> Submit Feedback
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <FeedbackModal
        isOpen={!!activeFeedbackComplaint}
        complaint={activeFeedbackComplaint}
        onClose={() => setActiveFeedbackComplaint(null)}
        onSuccess={() => { fetchComplaints(); setActiveFeedbackComplaint(null); }}
      />
    </div>
  );
};

export default MyComplaintsPage;