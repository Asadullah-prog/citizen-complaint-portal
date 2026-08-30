import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StarRating from '../components/StarRating';
import {
  ShieldCheck, Sparkles, Download, Search, Filter, RefreshCw,
  AlertTriangle, Flame, CheckCircle2, Clock, Layers,
  FileSpreadsheet, ArrowUpDown, ExternalLink, ChevronRight,
  TrendingUp, BarChart3, Star, MapPin, Calendar, Tag,
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

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const critical = complaints.filter((c) => c.priority === 'Critical').length;
  const high = complaints.filter((c) => c.priority === 'High').length;

  const statCards = [
    { label: 'Total Reports', value: total, color: '#2563eb', bg: '#eff6ff', icon: BarChart3 },
    { label: 'Pending Triage', value: pending, color: '#d97706', bg: '#fffbeb', icon: Clock },
    { label: 'In Progress', value: inProgress, color: '#0284c7', bg: '#e0f2fe', icon: TrendingUp },
    { label: 'Resolved', value: resolved, color: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
    { label: 'Critical Urgency', value: critical, color: '#dc2626', bg: '#fef2f2', icon: Flame },
    { label: 'Avg Satisfaction', value: aiStats?.avgSatisfaction ? `${aiStats.avgSatisfaction}★` : '4.8★', color: '#7c3aed', bg: '#f5f3ff', icon: Star },
  ];

  return (
    <div className="main-content main-content-wide">
      {/* Header bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: '2.25rem 2rem',
          marginBottom: '2rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 80% at 100% 0%, rgba(96,165,250,0.18), transparent)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Operations Command Center
            </h1>
          </div>
          <p style={{ opacity: 0.85, fontSize: '0.92rem', maxWidth: '680px', lineHeight: 1.55 }}>
            Administrative dashboard for civic complaint triage, emergency dispatch, resolution metrics, and AI operations analysis.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative' }}>
          <button
            type="button"
            className="btn"
            onClick={handleDownloadCSV}
            disabled={exporting}
            style={{
              background: '#ffffff',
              color: 'var(--primary-900)',
              fontWeight: 700,
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            <Download size={16} color="var(--primary-800)" />
            {exporting ? 'Generating CSV...' : 'Export Filtered CSV'}
          </button>
        </div>
      </div>

      {/* AI Briefing Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #172554 0%, #1e3a8a 50%, #1d4ed8 100%)',
          color: '#ffffff',
          padding: '2rem',
          marginBottom: '2rem',
          borderRadius: 'var(--radius-2xl)',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <Sparkles size={22} color="#fde047" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 700 }}>
                AI EXECUTIVE SUMMARY &bull; {isAiGenerated ? 'Google Gemini 1.5' : 'Deterministic Civic Engine'}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Daily Civic Operations Briefing</h2>
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
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            <RefreshCw size={14} className={aiLoading ? 'spinner' : ''} />
            {aiLoading ? 'Analyzing...' : 'Regenerate Briefing'}
          </button>
        </div>

        <p style={{ fontSize: '1.02rem', lineHeight: 1.7, opacity: 0.95, maxWidth: '1100px', fontWeight: 400 }}>
          {aiBriefing || 'Analyzing municipal database and calculating real-time response statistics...'}
        </p>

        {aiStats && (
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.75rem',
              fontSize: '0.85rem',
              opacity: 0.95,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              📌 Top Category: <strong style={{ color: '#93c5fd' }}>{aiStats.topCategory}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              📍 Hotspot Area: <strong style={{ color: '#93c5fd' }}>{aiStats.hotspotArea}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              ⭐ Avg Rating: <strong style={{ color: '#fde047' }}>{aiStats.avgSatisfaction ? `${aiStats.avgSatisfaction}/5.0` : '4.8/5.0'}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              🚨 Escalations: <strong style={{ color: '#fca5a5' }}>{aiStats.critical} Critical</strong>
            </span>
          </div>
        )}
      </div>

      {/* Statistics Cards Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', marginBottom: '2rem' }}>
        {statCards.map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <div className="stat-card-label">{label}</div>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <div className="stat-card-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.35rem 1.5rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search title, description, or locality..."
                style={{ paddingLeft: '2.5rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ minWidth: '180px', position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Locality / Area..."
                style={{ paddingLeft: '2.5rem' }}
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={16} />
              Filter Queue
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
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>
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
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>
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
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>
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
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', letterSpacing: '0.06em' }}>
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
      <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fafbfc',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Municipal Triage Queue ({complaints.length})
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any complaint row to inspect details, dispatch crews, and submit remarks
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem' }}>
            <div className="spinner" />
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <Layers size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No complaints match current filters</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Clear or change filter options above.
            </p>
          </div>
        ) : (
          <div className="table-responsive" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
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
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/officer/complaints/${c._id}`)}
                  >
                    <td style={{ maxWidth: '320px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.description}
                      </div>
                      {c.officerRemark && (
                        <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '0.25rem', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
                          <strong>Note:</strong> {c.officerRemark}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-category">{c.category}</span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.875rem' }}>
                        <MapPin size={13} color="var(--primary)" /> {c.area}
                      </span>
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
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/officer/complaints/${c._id}`}
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.3rem' }}
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