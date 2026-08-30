import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  PlusCircle,
  FolderOpen,
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MessageSquareQuote,
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFeedbackComplaint, setActiveFeedbackComplaint] = useState(null);

  const fetchMyComplaints = async () => {
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
    fetchMyComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const pendingFeedback = complaints.filter((c) => c.status === 'Resolved' && !c.feedbackGiven);

  return (
    <div className="main-content">
      {/* Welcome Banner */}
      <div
        style={{
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
            Citizen Portal Dashboard
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Welcome back, {user?.name || 'Citizen'}!
          </h1>
          <p style={{ opacity: 0.9, marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Track your filed complaints, view municipal updates, and participate in civic improvement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/complaints/new"
            className="btn"
            style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}
          >
            <PlusCircle size={18} />
            Report New Complaint
          </Link>
          <Link
            to="/complaints"
            className="btn btn-secondary"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <Compass size={18} />
            Browse Feed
          </Link>
        </div>
      </div>

      {/* Pending Feedback Alert */}
      {pendingFeedback.length > 0 && (
        <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquareQuote size={22} color="var(--primary)" />
            <div>
              <strong>Resolution Feedback Requested:</strong> You have {pendingFeedback.length} resolved complaint(s) awaiting your satisfaction rating.
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveFeedbackComplaint(pendingFeedback[0])}
          >
            Rate Resolution
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">My Total Reports</div>
          <div className="stat-card-value" style={{ color: 'var(--primary)' }}>
            {total}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label" style={{ color: '#b45309' }}>
            Pending Review
          </div>
          <div className="stat-card-value" style={{ color: '#b45309' }}>
            {pending}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label" style={{ color: '#1e40af' }}>
            In Progress
          </div>
          <div className="stat-card-value" style={{ color: '#1e40af' }}>
            {inProgress}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label" style={{ color: '#065f46' }}>
            Resolved
          </div>
          <div className="stat-card-value" style={{ color: '#065f46' }}>
            {resolved}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderOpen size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Recent Complaints</h2>
          </div>
          {complaints.length > 0 && (
            <Link to="/complaints/mine" className="btn btn-secondary btn-sm">
              View All ({complaints.length}) &rarr;
            </Link>
          )}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
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
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No complaints filed yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Notice a pothole, street lighting issue, or garbage buildup in your area? Report it now!
            </p>
            <Link to="/complaints/new" className="btn btn-primary">
              <PlusCircle size={18} />
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.slice(0, 4).map((c) => (
              <div
                key={c._id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-category">{c.category}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} score={c.priorityScore} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {c.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    📍 Locality: <strong>{c.area}</strong> &bull; Filed:{' '}
                    {new Date(c.createdAt).toLocaleDateString()} &bull; Upvotes: <strong>{c.upvotes}</strong>
                  </div>
                  {c.officerRemark && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.8rem',
                        backgroundColor: '#eff6ff',
                        color: '#1e40af',
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '3px solid var(--primary)',
                      }}
                    >
                      <strong>Officer Note:</strong> {c.officerRemark}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {c.status === 'Resolved' && !c.feedbackGiven && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setActiveFeedbackComplaint(c)}
                    >
                      <MessageSquareQuote size={14} />
                      Give Feedback
                    </button>
                  )}
                  <Link to={`/complaints/${c._id}`} className="btn btn-secondary btn-sm">
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={!!activeFeedbackComplaint}
        complaint={activeFeedbackComplaint}
        onClose={() => setActiveFeedbackComplaint(null)}
        onSuccess={() => {
          fetchMyComplaints();
          setActiveFeedbackComplaint(null);
        }}
      />
    </div>
  );
};

export default CitizenDashboard;
