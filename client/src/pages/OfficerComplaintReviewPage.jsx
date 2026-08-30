import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StarRating from '../components/StarRating';
import {
  ArrowLeft, ShieldCheck, Save, CheckCircle, AlertCircle,
  MapPin, Calendar, User, ThumbsUp, TrendingUp, MessageSquareQuote,
  Clock, Shield, Tag, FileText,
} from 'lucide-react';

export const OfficerComplaintReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Form states for update
  const [status, setStatus] = useState('Pending');
  const [officerRemark, setOfficerRemark] = useState('');

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getComplaintById(id);
      if (res && res.complaint) {
        setComplaint(res.complaint);
        setStatus(res.complaint.status || 'Pending');
        setOfficerRemark(res.complaint.officerRemark || '');
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

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      const res = await api.updateStatus(id, status, officerRemark);
      if (res && res.complaint) {
        setComplaint(res.complaint);
        setSuccessMessage(`Complaint successfully updated to "${status}"!`);
      }
    } catch (err) {
      setError(err.message || 'Failed to update complaint status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="spinner" />
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="main-content" style={{ maxWidth: '650px' }}>
        <div className="alert alert-danger">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <Link to="/officer/dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Command Center
        </Link>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ maxWidth: '980px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/officer/dashboard" className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
          <ArrowLeft size={16} /> Back to Operations Dashboard
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            ID: {complaint?._id}
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        {/* Left: Complaint Full Information */}
        <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="badge badge-category">{complaint.category}</span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} score={complaint.priorityScore} />
            </div>
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.85rem', lineHeight: 1.3 }}>
            {complaint.title}
          </h1>

          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <span>Priority Score: <strong style={{ color: 'var(--text-main)' }}>{complaint.priorityScore}</strong></span>
            <span>Upvotes: <strong style={{ color: 'var(--text-main)' }}>{complaint.upvotes || 0}</strong></span>
            <span>Days Elapsed: <strong style={{ color: 'var(--text-main)' }}>{complaint.daysSinceCreated ?? 0}d</strong></span>
          </div>

          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Citizen Description
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.65, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
            {complaint.description}
          </p>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <MapPin size={16} color="var(--primary)" />
              Locality: <strong style={{ color: 'var(--text-main)' }}>{complaint.area}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <User size={16} />
              Reported By: <strong style={{ color: 'var(--text-main)' }}>{complaint.createdBy?.name || 'Citizen'}</strong> ({complaint.createdBy?.email || 'N/A'})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <Calendar size={16} />
              Filed Date: <strong style={{ color: 'var(--text-main)' }}>{new Date(complaint.createdAt).toLocaleString()}</strong>
            </div>
          </div>

          {/* Citizen Feedback View */}
          {complaint.feedbackGiven && (
            <div
              style={{
                marginTop: '1.5rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '1rem',
                backgroundColor: '#f0fdf4',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                Citizen Feedback Received:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <StarRating rating={complaint.feedbackRating} readOnly size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#14532d' }}>
                  {complaint.feedbackRating} / 5
                </span>
              </div>
              {complaint.feedbackComment && (
                <p style={{ fontSize: '0.825rem', color: '#14532d', fontStyle: 'italic' }}>
                  "{complaint.feedbackComment}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Officer Action Box */}
        <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-2xl)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Officer Action Panel</h2>
          </div>

          <form onSubmit={handleUpdateStatus}>
            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                <option value="Pending">Pending (Awaiting Inspection)</option>
                <option value="In Progress">In Progress (Team Dispatched / Work Underway)</option>
                <option value="Resolved">Resolved (Work Completed & Verified)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Officer Remark / Public Progress Note</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. Maintenance crew dispatched. Repair scheduled for Friday morning..."
                value={officerRemark}
                onChange={(e) => setOfficerRemark(e.target.value)}
                rows={4}
              />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                This note will be visible to the reporting citizen and public feed to ensure complete transparency.
              </p>
            </div>

            {status === 'Resolved' && (
              <div className="alert alert-info" style={{ fontSize: '0.85rem', padding: '0.85rem' }}>
                <CheckCircle size={16} />
                <span>
                  Marking this issue as <strong>Resolved</strong> will prompt the reporting citizen to rate the resolution service.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={saving}
            >
              <Save size={16} />
              {saving ? 'Saving Updates...' : 'Save & Publish Status Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfficerComplaintReviewPage;