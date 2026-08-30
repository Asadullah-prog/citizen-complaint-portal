import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StarRating from '../components/StarRating';
import FeedbackModal from '../components/FeedbackModal';
import {
  ArrowLeft, ThumbsUp, MapPin, Calendar, User, Shield, Clock,
  Sparkles, MessageSquareQuote, AlertCircle, TrendingUp, CheckCircle,
  FileText, Star,
} from 'lucide-react';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isOfficer } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upvoting, setUpvoting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getComplaintById(id);
      if (res && res.complaint) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      setError(err.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please log in or register to upvote this complaint.');
      return;
    }

    try {
      setUpvoting(true);
      const res = await api.upvoteComplaint(id);
      if (res && res.complaint) {
        setComplaint(res.complaint);
      }
    } catch (err) {
      alert(err.message || 'Failed to upvote.');
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="main-content" style={{ maxWidth: '650px' }}>
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error || 'Complaint record not found.'}</span>
        </div>
        <Link to="/complaints" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Complaints
        </Link>
      </div>
    );
  }

  const isOwner = user && complaint.createdBy && (complaint.createdBy._id === user.id || complaint.createdBy._id === user._id || complaint.createdBy === user.id);

  return (
    <div className="main-content" style={{ maxWidth: '920px' }}>
      {/* Navigation header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem' }}
        >
          <ArrowLeft size={16} /> Go Back
        </button>

        {isOfficer && (
          <Link to={`/officer/complaints/${complaint._id}`} className="btn btn-primary btn-sm">
            <Shield size={15} /> Officer Review & Action Screen &rarr;
          </Link>
        )}
      </div>

      <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem', borderRadius: 'var(--radius-2xl)' }}>
        {/* Category, Status & Priority Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-category" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
              {complaint.category}
            </span>
            <StatusBadge status={complaint.status} />
          </div>

          <PriorityBadge priority={complaint.priority} score={complaint.priorityScore} />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
          {complaint.title}
        </h1>

        {/* Priority Formula Breakdown Box */}
        <div
          style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-900)' }}>
            <TrendingUp size={18} color="var(--primary)" />
            <span>
              <strong>Algorithmic Priority Score:</strong> {complaint.priorityScore} (Tier: <strong>{complaint.priority}</strong>)
            </span>
          </div>
          <div style={{ color: 'var(--primary-700)', fontSize: '0.8rem', fontWeight: 500 }}>
            Formula: ({complaint.upvotes || 0} upvotes &times; 2) + ({complaint.daysSinceCreated ?? 0} days active)
          </div>
        </div>

        {/* Metadata info row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            padding: '1rem 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1.75rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={16} color="var(--primary)" />
            Locality: <strong style={{ color: 'var(--text-main)' }}>{complaint.area}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={16} />
            Filed on: <strong style={{ color: 'var(--text-main)' }}>{new Date(complaint.createdAt).toLocaleDateString()}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={16} />
            Reported by: <strong style={{ color: 'var(--text-main)' }}>{complaint.createdBy?.name || 'Verified Citizen'}</strong>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
            Issue Description
          </h3>
          <p style={{ fontSize: '1.02rem', color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {complaint.description}
          </p>
        </div>

        {/* Upvote Banner */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.97rem', color: 'var(--text-main)' }}>
              Community Endorsements ({complaint.upvotes || 0} Upvotes)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Upvotes raise municipal visibility and escalate the automated priority score.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpvote}
            disabled={upvoting}
          >
            <ThumbsUp size={16} />
            {upvoting ? 'Recording Upvote...' : `Upvote Issue (+1)`}
          </button>
        </div>

        {/* Officer Remark Section */}
        {complaint.officerRemark && (
          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderLeft: '4px solid var(--primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Shield size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>
                Official Municipal Officer Remark
              </h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#1e3a8a', lineHeight: 1.6 }}>
              {complaint.officerRemark}
            </p>
          </div>
        )}

        {/* Feedback Section */}
        {complaint.status === 'Resolved' && (
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#166534', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  Citizen Resolution Satisfaction
                </div>
                {complaint.feedbackGiven ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <StarRating rating={complaint.feedbackRating} readOnly size={18} />
                      <span style={{ fontSize: '0.85rem', color: '#14532d', fontWeight: 700 }}>
                        {complaint.feedbackRating}/5 Stars
                      </span>
                    </div>
                    {complaint.feedbackComment && (
                      <p style={{ fontSize: '0.875rem', color: '#166534', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        "{complaint.feedbackComment}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#14532d' }}>
                    This complaint has been marked Resolved. Feedback has not been submitted yet.
                  </p>
                )}
              </div>

              {isOwner && !complaint.feedbackGiven && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setShowFeedbackModal(true)}
                >
                  <MessageSquareQuote size={15} />
                  Submit Rating & Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        complaint={complaint}
        onClose={() => setShowFeedbackModal(false)}
        onSuccess={(updated) => {
          setComplaint(updated);
          setShowFeedbackModal(false);
        }}
      />
    </div>
  );
};

export default ComplaintDetailPage;