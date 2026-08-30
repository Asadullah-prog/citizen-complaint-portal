import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Compass, LogIn, UserPlus, ArrowRight, ShieldCheck, CheckCircle, TrendingUp, Zap, Droplets, Trash2, Car, Layers, Users, BarChart3 } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useAuth } from '../context/AuthContext';

const StatCounter = ({ value, label, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem', fontWeight: 500 }}>{label}</div>
  </div>
);

export const LandingPage = () => {
  const { isAuthenticated, isOfficer } = useAuth();
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.getComplaints({ limit: 4 });
        if (res && res.complaints) {
          setRecentComplaints(res.complaints.slice(0, 3));
          const total = res.complaints.length;
          const resolved = res.complaints.filter((c) => c.status === 'Resolved').length;
          const pending = res.complaints.filter((c) => c.status === 'Pending').length;
          setStats({ total, resolved, pending });
        }
      } catch {}
    };
    fetchRecent();
  }, []);

  const categories = [
    { name: 'Road', icon: Car, desc: 'Potholes, damaged tarmac, missing signage & traffic lights', color: '#2563eb', bg: '#eff6ff' },
    { name: 'Garbage', icon: Trash2, desc: 'Overflowing dumpsters, illegal dumping & street sweeping', color: '#16a34a', bg: '#f0fdf4' },
    { name: 'Water', icon: Droplets, desc: 'Pipeline leaks, contaminated water & supply disruptions', color: '#0284c7', bg: '#e0f2fe' },
    { name: 'Electricity', icon: Zap, desc: 'Faulty streetlights, dangling cables & transformer faults', color: '#d97706', bg: '#fffbeb' },
    { name: 'Other', icon: Layers, desc: 'Public parks, noise disturbances & civic infrastructure', color: '#64748b', bg: '#f8fafc' },
  ];

  const steps = [
    { n: '1', title: 'Report & Check Duplicates', desc: 'Submit civic complaints with locality info. Smart duplicate detection prevents redundancy and encourages community upvoting.' },
    { n: '2', title: 'Dynamic Priority Scoring', desc: 'Citizen upvotes + days elapsed calculate urgency automatically: Low, Medium, High, or Critical — ensuring nothing is ignored.' },
    { n: '3', title: 'Officer Action & AI Briefings', desc: 'Municipal officers review AI-generated briefings, update resolution status with remarks, and receive citizen ratings for accountability.' },
  ];

  return (
    <div>
      {/* === HERO === */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #1e40af 70%, #0284c7 100%)', color: '#fff', padding: '5rem 1.5rem 6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)', top: '-150px', right: '-100px' }} />
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)', bottom: '-100px', left: '-80px' }} />
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          {/* Tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem 1.1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.75rem' }}>
            <ShieldCheck size={16} /> Official Municipal Civic Redressal Network
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Citizen Complaint Portal
          </h1>
          <p style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)', opacity: 0.9, maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.55 }}>
            Report local problems. Track progress in real time. Make your community better — powered by AI, driven by citizens.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link to={isAuthenticated ? (isOfficer ? '/officer/dashboard' : '/complaints/new') : '/complaints/new'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', borderRadius: '12px', background: '#ffffff', color: 'var(--primary-800)', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 0.2s' }}
            >
              <PlusCircle size={20} /> Report a Complaint
            </Link>
            <Link to="/complaints"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s' }}
            >
              <Compass size={20} /> Browse Complaints
            </Link>
          </div>

          {!isAuthenticated && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem', opacity: 0.85 }}>
              <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>Already registered? Log In &rarr;</Link>
              <Link to="/signup" style={{ color: '#fff', textDecoration: 'underline' }}>New citizen? Create Account &rarr;</Link>
            </div>
          )}
        </div>
      </section>

      {/* === LIVE STATS BAR === */}
      {stats.total > 0 && (
        <section style={{ background: '#1e293b', color: '#fff', padding: '1.75rem 1.5rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
            <StatCounter value={stats.total} label="Total Reports Filed" color="#60a5fa" />
            <StatCounter value={stats.resolved} label="Issues Resolved" color="#34d399" />
            <StatCounter value={stats.pending} label="Pending Review" color="#fbbf24" />
          </div>
        </section>
      )}

      <div className="main-content">
        {/* === CATEGORIES === */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Select a Problem Category</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto' }}>Direct issue routing to municipal departments for swift inspection and rectification</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {categories.map(({ name, icon: Icon, desc, color, bg }) => (
              <div key={name} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.75rem 1.25rem' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: `1px solid ${color}20` }}>
                  <Icon size={28} color={color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>{desc}</p>
                <Link to={`/complaints?category=${name}`} style={{
                  width: '100%', textAlign: 'center', padding: '0.5rem', borderRadius: '8px',
                  border: `1.5px solid ${color}30`, background: bg, color, fontWeight: 600,
                  fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.15s',
                }}>
                  View {name} Issues &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section className="card" style={{ padding: '2.75rem 2rem', marginBottom: '4rem', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>How the Portal Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>Transparent, algorithmic civic governance connecting citizens and municipal officers</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '2.5rem' }}>
            {steps.map(({ n, title, desc }) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--grad-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.1rem', fontWeight: 900, fontSize: '1.35rem', color: '#fff', boxShadow: '0 6px 18px rgba(37,99,235,0.3)' }}>{n}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === RECENT COMPLAINTS === */}
        {recentComplaints.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Recent Community Reports</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Live feed of complaints filed by citizens across localities</p>
              </div>
              <Link to="/complaints" className="btn btn-secondary btn-sm">View All Feed &rarr;</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {recentComplaints.map((c) => (
                <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column', borderLeft: c.priority === 'Critical' ? '4px solid #ef4444' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-category">{c.category}</span>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} score={c.priorityScore} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.3 }}>{c.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1, lineHeight: 1.5 }}>
                    {c.description.length > 100 ? `${c.description.slice(0, 100)}...` : c.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>📍 {c.area}</span>
                    <Link to={`/complaints/${c._id}`} style={{ fontWeight: 600, color: 'var(--primary)' }}>Details &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LandingPage;