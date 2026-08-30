import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const year = new Date().getFullYear();

  const techBadge = (label, color) => (
    <span key={label} style={{
      padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem',
      fontWeight: 700, letterSpacing: '0.04em', background: `${color}15`,
      color, border: `1px solid ${color}30`, whiteSpace: 'nowrap',
    }}>{label}</span>
  );

  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      {/* Main Footer Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>

        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-900)' }}>CivicPortal</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Municipal Redressal Network</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '260px' }}>
            Empowering citizens to report civic issues and enabling transparent, accountable municipal resolutions.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>Quick Links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              ['/complaints/new', 'Report an Issue'],
              ['/complaints', 'Browse Feed'],
              ['/login', 'Citizen Login'],
              ['/signup', 'Create Account'],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{
                fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500,
                transition: 'color 0.15s', textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Technology Column */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>Technology Stack</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {techBadge('React 18', '#0ea5e9')}
            {techBadge('Node.js', '#22c55e')}
            {techBadge('MongoDB Atlas', '#16a34a')}
            {techBadge('Express.js', '#64748b')}
            {techBadge('JWT Auth', '#7c3aed')}
            {techBadge('Gemini AI', '#f59e0b')}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>&copy; {year} CivicPortal — Municipal Public Services. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={13} color="#ef4444" fill="#ef4444" /> for civic participation
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;