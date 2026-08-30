import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  Compass, Search, Filter, ThumbsUp, MapPin, Calendar,
  Layers, ArrowUpDown, PlusCircle, X,
} from 'lucide-react';

export const PublicComplaintsPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upvotingIds, setUpvotingIds] = useState({});

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'priority');

  const categories = ['All', 'Road', 'Garbage', 'Water', 'Electricity', 'Other'];
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const hasActiveFilters = search || area || category !== 'All' || status !== 'All' || priority !== 'All';

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        area: area.trim() || undefined,
        status: status !== 'All' ? status : undefined,
        priority: priority !== 'All' ? priority : undefined,
        sort,
      };
      const res = await api.getComplaints(params);
      if (res && res.complaints) setComplaints(res.complaints);
    } catch (err) {
      setError(err.message || 'Failed to fetch public complaints feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [category, status, priority, sort]);

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchComplaints(); };

  const handleUpvote = async (id) => {
    if (!isAuthenticated) { alert('Please log in or create an account to upvote community complaints.'); return; }
    try {
      setUpvotingIds((prev) => ({ ...prev, [id]: true }));
      const res = await api.upvoteComplaint(id);
      if (res && res.complaint) setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, ...res.complaint } : c)));
    } catch (err) {
      alert(err.message || 'Failed to upvote complaint.');
    } finally {
      setUpvotingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const resetFilters = () => { setSearch(''); setArea(''); setCategory('All'); setStatus('All'); setPriority('All'); setSort('priority'); };

  const priorityBorderColor = (p) => ({
    Critical: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#94a3b8',
  }[p] || '#e2e8f0');

  return (
    <div className="main-content" style={{ maxWidth: '1300px' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #0284c7 100%)',
        borderRadius: 'var(--radius-xl)', padding: '2rem 2.25rem', marginBottom: '1.75rem',
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 90% -10%, rgba(96,165,250,0.18), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <Compass size={26} />
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Public Complaint Feed</h1>
          </div>
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
            Explore civic issues, monitor municipal progress, and upvote priority concerns in your community
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/complaints/new" className="btn btn-xl" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, position: 'relative', flexShrink: 0 }}>
            <PlusCircle size={18} /> Report an Issue
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
              <input
                type="text" className="form-input" placeholder="Search keywords..."
                style={{ paddingLeft: '2.5rem' }}
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ minWidth: '180px', position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
              <input
                type="text" className="form-input" placeholder="Locality / Area..."
                style={{ paddingLeft: '2.5rem' }}
                value={area} onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Search size={16} /> Search
            </button>
            {hasActiveFilters && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={resetFilters} style={{ flexShrink: 0 }}>
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            {[
              { label: 'CATEGORY', value: category, onChange: setCategory, options: categories },
              { label: 'STATUS', value: status, onChange: setStatus, options: statuses },
              { label: 'PRIORITY', value: priority, onChange: setPriority, options: priorities },
            ].map(({ label, value, onChange, options }) => (
              <div key={label}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>{label}</label>
                <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>SORT BY</label>
              <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="priority">Highest Priority</option>
                <option value="upvotes">Most Upvotes</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results count */}
      {!loading && (
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing <strong style={{ color: 'var(--text-main)' }}>{complaints.length}</strong> complaint report(s)
            {hasActiveFilters && <span style={{ marginLeft: '0.5rem', color: 'var(--primary-600)' }}>(filtered)</span>}
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Complaints Grid */}
      {loading ? (
        <div className="spinner" />
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--primary-400)' }}>
            <Layers size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No matching complaints found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try broadening your search or clearing active filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {complaints.map((c) => (
            <div
              key={c._id}
              className="card card-interactive"
              style={{
                display: 'flex', flexDirection: 'column', padding: '1.35rem',
                borderLeft: `4px solid ${priorityBorderColor(c.priority)}`,
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <span className="badge badge-category">{c.category}</span>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} score={c.priorityScore} />
                </div>
              </div>

              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.5rem' }}>
                <Link to={`/complaints/${c._id}`} style={{ color: 'var(--text-main)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-main)'}
                >
                  {c.title}
                </Link>
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', flex: 1, lineHeight: 1.55, marginBottom: '1rem' }}>
                {c.description.length > 115 ? `${c.description.slice(0, 115)}...` : c.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginBottom: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                  <MapPin size={13} color="var(--primary)" /> {c.area}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={13} /> {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button" className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleUpvote(c._id)} disabled={upvotingIds[c._id]}
                >
                  <ThumbsUp size={14} color={upvotingIds[c._id] ? 'var(--primary)' : undefined} />
                  Upvote ({c.upvotes || 0})
                </button>
                <Link to={`/complaints/${c._id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicComplaintsPage;