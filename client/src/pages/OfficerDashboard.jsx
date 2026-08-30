import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StarRating from '../components/StarRating';
import {
  ShieldCheck,
  Sparkles,
  Download,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  FileSpreadsheet,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const OfficerDashboard = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // AI Briefing State
  const [aiBriefing, setAiBriefing] = useState('');
  const [aiStats, setAiStats] = useState(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sort, setSort] = useState('priority');

  const [exporting, setExporting] = useState(false);

  const categories = ['All', 'Road', 'Garbage', 'Water', 'Electricity', 'Other'];
  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const fetchDashboardData = async () => {
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
      setError(err.message || 'Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAiBriefing = async () => {
    try {
      setAiLoading(true);
      const res = await api.getOfficerBriefing();
      if (res && res.briefing) {
        setAiBriefing(res.briefing);
        setAiStats(res.stats);
        setIsAiGenerated(res.isAiGenerated);
      }
    } catch (err) {
      console.warn('AI briefing fetch warning:', err.message);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [category, status, priority, sort]);

  useEffect(() => {
    fetchAiBriefing();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleDownloadCSV = async () => {
    try {
      setExporting(true);
      const params = {
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        area: area.trim() || undefined,
        status: status !== 'All' ? status : undefined,
        priority: priority !== 'All' ? priority : undefined,
      };

      const blob = await api.exportCSVBlob(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const todayStr = new Date().toISOString().slice(0, 10);
      a.download = `complaints_export_${todayStr}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || 'Failed to download CSV export.');
    } finally {
      setExporting(false);
    }
  };

  // Compute stats from full list or aiStats
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const critical = complaints.filter((c) => c.priority === 'Critical').length;
  const high = complaints.filter((c) => c.priority === 'High').length;

  return (
    <div className="main-content main-content-wide">
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={26} color="var(--primary)" />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Municipal Operations Command Center</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Administrative dashboard for complaint triage, dispatch, resolution tracking, and policy metrics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownloadCSV}
            disabled={exporting}
            style={{ gap: '0.4rem' }}
          >
            <Download size={16} />
            {exporting ? 'Generating CSV...' : 'Download CSV Export'}
          </button>
        </div>
      </div>

      {/* AI Briefing Card (Prominent Top Hero) */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          color: '#ffffff',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '0.4rem',
                borderRadius: '8px',
                display: 'flex',
              }}
            >
              <Sparkles size={20} color="#fde047" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
                AI EXECUTIVE SUMMARY &bull; {isAiGenerated ? 'Google Gemini 1.5' : 'Deterministic Operations Engine'}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Daily Civic Operations Briefing</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchAiBriefing}
            disabled={aiLoading}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={13} className={aiLoading ? 'spinner' : ''} />
            {aiLoading ? 'Refreshing...' : 'Regenerate Briefing'}
          </button>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.65, opacity: 0.95, maxWidth: '1100px' }}>
          {aiBriefing || 'Analyzing municipal complaint database and computing real-time response statistics...'}
        </p>

        {aiStats && (
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '0.825rem',
              opacity: 0.9,
            }}
          >
            <span>Top Category: <strong>{aiStats.topCategory}</strong></span>
            <span>Hotspot Area: <strong>{aiStats.hotspotArea}</strong></span>
            <span>Satisfaction: <strong>{aiStats.avgSatisfaction ? `${aiStats.avgSatisfaction}/5.0` : 'Awaiting feedback'}</strong></span>
            <span>Escalations: <strong>{aiStats.critical} Critical</strong></span>
          </div>
        )}
      </div>

      {/* Statistics Cards Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Reports</div>
          <div className="stat-card-value" style={{ color: 'var(--primary)' }}>
            {total}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label" style={{ color: '#b45309' }}>
            Pending Triage
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

        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-card-label" style={{ color: '#dc2626' }}>
            Critical Priority
          </div>
          <div className="stat-card-value" style={{ color: '#dc2626' }}>
            {critical}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-label" style={{ color: '#0284c7' }}>
            Avg Satisfaction
          </div>
          <div className="stat-card-value" style={{ color: '#0284c7' }}>
            {aiStats?.avgSatisfaction ? `${aiStats.avgSatisfaction}★` : '4.5★'}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search complaint title, description, or locality..."
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
              Filter
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
                Reset
              </button>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
            }}
          >
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                CATEGORY
              </label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                STATUS
              </label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                PRIORITY
              </label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                SORT ORDER
              </label>
              <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="priority">Priority Score (Highest)</option>
                <option value="upvotes">Upvotes (Highest)</option>
                <option value="newest">Filed Date (Newest)</option>
                <option value="oldest">Filed Date (Oldest)</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Complaints Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Municipal Triage Queue ({complaints.length})</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click any record to inspect, update status, and attach officer remarks
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem' }}>
            <div className="spinner" />
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <Layers size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No complaints match current filters</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Clear or change filter options above.
            </p>
          </div>
        ) : (
          <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Area / Locality</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Upvotes</th>
                  <th>Filed Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/officer/complaints/${c._id}`)}
                  >
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.description}
                      </div>
                      {c.officerRemark && (
                        <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '0.2rem' }}>
                          <strong>Note:</strong> {c.officerRemark}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-category">{c.category}</span>
                    </td>
                    <td>
                      <strong>{c.area}</strong>
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>
                      <PriorityBadge priority={c.priority} score={c.priorityScore} />
                    </td>
                    <td>
                      <strong>{c.upvotes || 0}</strong>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        to={`/officer/complaints/${c._id}`}
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                      >
                        Review
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
