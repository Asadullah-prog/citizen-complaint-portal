import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Compass,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Zap,
  Droplets,
  Trash2,
  Car,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useAuth } from '../context/AuthContext';

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
      } catch {
        // Fallback silently if offline or initial load
      }
    };
    fetchRecent();
  }, []);

  const categories = [
    { name: 'Road', icon: Car, desc: 'Potholes, damaged tarmac, missing signage & traffic lights', color: '#2563eb' },
    { name: 'Garbage', icon: Trash2, desc: 'Overflowing dumpsters, illegal dumping & street sweeping', color: '#16a34a' },
    { name: 'Water', icon: Droplets, desc: 'Pipeline leaks, contaminated water & supply disruptions', color: '#0284c7' },
    { name: 'Electricity', icon: Zap, desc: 'Faulty streetlights, dangling cables & transformer faults', color: '#eab308' },
    { name: 'Other', icon: Layers, desc: 'Public parks, noise disturbances & civic infrastructure', color: '#64748b' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)',
          color: '#ffffff',
          padding: '4.5rem 1.5rem 5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <ShieldCheck size={16} />
            Official Municipal Civic Redressal Network
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Citizen Complaint Portal
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              opacity: 0.95,
              maxWidth: '750px',
              margin: '0 auto 2.25rem',
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Report local problems. Track progress. Make your community better.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to={isAuthenticated ? (isOfficer ? '/officer/dashboard' : '/complaints/new') : '/complaints/new'}
              className="btn btn-lg"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <PlusCircle size={20} />
              Report a Complaint
            </Link>
            <Link
              to="/complaints"
              className="btn btn-lg btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Compass size={20} />
              Browse Complaints
            </Link>
          </div>

          {!isAuthenticated && (
            <div
              style={{
                marginTop: '1.75rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                fontSize: '0.9rem',
                opacity: 0.9,
              }}
            >
              <Link to="/login" style={{ textDecoration: 'underline', color: '#ffffff' }}>
                Already registered? Log In &rarr;
              </Link>
              <Link to="/signup" style={{ textDecoration: 'underline', color: '#ffffff' }}>
                New citizen? Create Account &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <div className="main-content">
        {/* Civic Categories Grid */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Select a Problem Category
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Direct issue routing to municipal departments for swift inspection and rectification
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '1.75rem 1.25rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                      padding: '1rem',
                      borderRadius: '50%',
                      marginBottom: '1rem',
                    }}
                  >
                    <Icon size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    {cat.desc}
                  </p>
                  <Link
                    to={`/complaints?category=${cat.name}`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 'auto', width: '100%' }}
                  >
                    View {cat.name} Issues &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="card"
          style={{
            backgroundColor: '#ffffff',
            padding: '2.5rem 2rem',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>How the Portal Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Transparent, algorithmic civic governance connecting citizens and municipal officers
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  margin: '0 auto 1rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Report & Check Duplicates</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Submit civic complaints with locality information. Smart duplicate detection prevents redundancy.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  margin: '0 auto 1rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dynamic Priority Scoring</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Citizen upvotes combined with days elapsed mathematically calculate urgency: Low, Medium, High, or Critical.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  margin: '0 auto 1rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Officer Action & Feedback</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Municipal officers review AI briefings, update resolution status with remarks, and receive citizen ratings.
              </p>
            </div>
          </div>
        </section>

        {/* Live Complaints Showcase */}
        {recentComplaints.length > 0 && (
          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Recent Community Reports</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Live feed of complaints filed by citizens across localities
                </p>
              </div>
              <Link to="/complaints" className="btn btn-secondary btn-sm">
                View All Feed &rarr;
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {recentComplaints.map((c) => (
                <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
                    <span className="badge badge-category">{c.category}</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} score={c.priorityScore} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
                    {c.description.length > 100 ? `${c.description.slice(0, 100)}...` : c.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '0.75rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>📍 {c.area}</span>
                    <Link to={`/complaints/${c._id}`} style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      Details &rarr;
                    </Link>
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
