import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  PlusCircle, FolderOpen, Compass, CheckCircle2, Clock,
  AlertCircle, ArrowRight, TrendingUp, MessageSquareQuote, MapPin, ThumbsUp, Calendar,
} from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';

const statusBorderColor = (s) => ({ Pending: '#f59e0b', 'In Progress': '#3b82f6', Resolved: '#10b981' }[s] || '#e2e8f0');

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
      if (res && res.complaints) setComplaints(res.complaints);
    } catch (err) {
      setError(err.message || 'Failed to load your complaints.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMyComplaints(); }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const pendingFeedback = complaints.filter((c) => c.status === 'Resolved' && !c.feedbackGiven);
  const firstName = user?.name?.split(' ')[0] || 'Citizen';

  const statCards = [
    { label: 'Total Reports', value: total, color: '#2563eb', bg: '#eff6ff', icon: FolderOpen },
    { label: 'Pending Review', value: pending, color: '#d97706', bg: '#fffbeb', icon: Clock },
    { label: 'In Progress', value: inProgress, color: '#2563eb', bg: '#eff6ff', icon: TrendingUp },
    { label: 'Resolved', value: resolved, color: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
  ];

  return (
    <div className="main-content">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
        borderRadius: 'var(--radius-2xl)', padding: '2.25rem 2rem', marginBottom: '2rem',
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1.5rem', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 80% at 100% -10%, rgba(96,165,250,0.2), transparent)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8, marginBottom: '0.3rem', fontWeight: 600 }}>Citizen Portal Dashboard</div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Welcome back, {firstName}!
          </h1>
          <p style={{ opacity: 0.85, fontSize: '0.9rem', maxWidth: '500px', lineHeight: 1.55 }}>
            Track your filed complaints, view municipal updates, and participate in civic improvement.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative' }}>
          <Link to="/complaints/new" className="btn" style={{ background: '#fff', color: 'var(--primary-800)', fontWeight: 700 }}>
            <PlusCircle size={17} /> Report New Complaint
          </Link>
          <Link to="/complaints" className="btn" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}>
            <Compass size={17} /> Browse Feed
          </Link>
        </div>
      </div>

      {/* Pending Feedback Banner */}
      {pendingFeedback.length > 0 && (
        <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquareQuote size={22} />
            <div>
              <strong>Resolution Feedback Requested:</strong> You have {pendingFeedback.length} resolved complaint(s) awaiting your satisfaction rating.
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveFeedbackComplaint(pendingFeedback[0])}>
            Rate Resolution
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="stat-card" style={{ '--stat-color': color }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div className="stat-card-label" style={{ color: 'var(--text-muted)' }}>{label}</div>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <div className="stat-card-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderOpen size={18} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>My Recent Complaints</h2>
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
          <div className="alert alert-danger"><AlertCircle size={18} />{error}</div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--primary-400)' }}>
              <FolderOpen size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No complaints filed yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '360px', margin: '0 auto 1.25rem' }}>
              Notice a pothole, street lighting issue, or garbage buildup? Report it now!
            </p>
            <Link to="/complaints/new" className="btn btn-primary">
              <PlusCircle size={17} /> Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.slice(0, 4).map((c) => (
              <div key={c._id} style={{
                border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.1rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '1rem', borderLeft: `4px solid ${statusBorderColor(c.status)}`,
                transition: 'box-shadow 0.15s',
              }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-category">{c.category}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} score={c.priorityScore} />
                  </div>
                  <h3 style={{ fontSize: '0.97rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{c.title}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} color="var(--primary)" /> {c.area}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ThumbsUp size={12} color="var(--primary)" /> {c.upvotes}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {c.officerRemark && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', background: '#f0fdf4', color: '#166534', padding: '0.35rem 0.6rem', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                      <strong>Officer Note:</strong> {c.officerRemark}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {c.status === 'Resolved' && !c.feedbackGiven && (
                    <button className="btn btn-success btn-sm" onClick={() => setActiveFeedbackComplaint(c)}>
                      <MessageSquareQuote size={13} /> Feedback
                    </button>
                  )}
                  <Link to={`/complaints/${c._id}`} className="btn btn-secondary btn-sm">Details &rarr;</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={!!activeFeedbackComplaint}
        complaint={activeFeedbackComplaint}
        onClose={() => setActiveFeedbackComplaint(null)}
        onSuccess={() => { fetchMyComplaints(); setActiveFeedbackComplaint(null); }}
      />
    </div>
  );
};

export default CitizenDashboard;