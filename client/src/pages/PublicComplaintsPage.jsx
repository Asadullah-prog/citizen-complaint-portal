import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  Compass,
  Search,
  Filter,
  ThumbsUp,
  MapPin,
  Calendar,
  Layers,
  ArrowUpDown,
  PlusCircle,
} from 'lucide-react';

export const PublicComplaintsPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upvotingIds, setUpvotingIds] = useState({});

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'priority');

  const categories = ['All', 'Road', 'Garbage', 'Water', 'Electricity', 'Other'];
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

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
      if (res && res.complaints) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch public complaints feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [category, status, priority, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleUpvote = async (id) => {
    if (!isAuthenticated) {
      alert('Please log in or create an account to upvote community complaints.');
      return;
    }

    try {
      setUpvotingIds((prev) => ({ ...prev, [id]: true }));
      const res = await api.upvoteComplaint(id);
      if (res && res.complaint) {
        // Immediate UI update
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, ...res.complaint } : c))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to upvote complaint.');
    } finally {
      setUpvotingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="main-content">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Compass size={24} color="var(--primary)" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Public Complaint Feed</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Explore community reported civic issues, monitor progress, and upvote priority concerns
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/complaints/new" className="btn btn-primary">
            <PlusCircle size={18} />
            Report an Issue
          </Link>
        )}
      </div>

      {/* Filter and Search Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit}>
          {/* Search Row */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search keywords in title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ minWidth: '180px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Filter by Locality / Area..."
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={16} />
              Search
            </button>
            {(search || area || category !== 'All' || status !== 'All' || priority !== 'All') && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearch('');
                  setArea('');
                  setCategory('All');
                  setStatus('All');
                  setPriority('All');
                  setSort('priority');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Filter Dropdowns Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
            }}
          >
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                CATEGORY
              </label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                STATUS
              </label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                PRIORITY TIER
              </label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {priorities.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                SORT BY
              </label>
              <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="priority">Highest Priority Score</option>
                <option value="upvotes">Most Community Upvotes</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Showing {complaints.length} complaint report(s)
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Complaints Grid */}
      {loading ? (
        <div className="spinner" />
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Layers size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No matching complaints found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Try broadening your search keywords or clearing active filters.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {complaints.map((c) => (
            <div
              key={c._id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.35rem',
                borderTop: c.priority === 'Critical' ? '4px solid #ef4444' : '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-category">{c.category}</span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <StatusBadge status={c.status} />
                  <PriorityBadge priority={c.priority} score={c.priorityScore} />
                </div>
              </div>

              <h2 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                <Link to={`/complaints/${c._id}`} style={{ color: 'inherit' }}>
                  {c.title}
                </Link>
              </h2>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  flex: 1,
                  lineHeight: 1.5,
                }}
              >
                {c.description.length > 120 ? `${c.description.slice(0, 120)}...` : c.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.75rem',
                  marginBottom: '0.875rem',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <strong>{c.area}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={14} />
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem', flex: 1 }}
                  onClick={() => handleUpvote(c._id)}
                  disabled={upvotingIds[c._id]}
                >
                  <ThumbsUp size={14} color="var(--primary)" />
                  Upvote ({c.upvotes || 0})
                </button>

                <Link to={`/complaints/${c._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  View Details &rarr;
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
