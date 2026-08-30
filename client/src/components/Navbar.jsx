import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2, PlusCircle, FolderOpen, Compass, LayoutDashboard,
  ShieldCheck, LogOut, LogIn, UserPlus, Menu, X, User,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isOfficer, isCitizen, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMobileMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  const navLink = (to, icon, label) => {
    const active = isActive(to);
    const Icon = icon;
    return (
      <Link
        key={to}
        to={to}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.45rem 0.9rem', borderRadius: '9999px', fontWeight: 600,
          fontSize: '0.88rem', textDecoration: 'none', transition: 'all 0.15s',
          background: active ? 'var(--grad-accent)' : 'transparent',
          color: active ? '#ffffff' : 'var(--text-muted)',
          boxShadow: active ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--primary-50)'; e.currentTarget.style.color = 'var(--primary)'; }}}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
      >
        <Icon size={15} /> {label}
      </Link>
    );
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226,232,240,0.8)',
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Brand */}
        <Link
          to={isAuthenticated ? (isOfficer ? '/officer/dashboard' : '/dashboard') : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div style={{
            width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
          }}>
            <Building2 size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-900)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              CivicPortal
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, lineHeight: 1 }}>
              Redressal Network
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }}>
          {!isAuthenticated && (<>
            {navLink('/', Building2, 'Home')}
            {navLink('/complaints', Compass, 'Browse')}
          </>)}
          {isCitizen && (<>
            {navLink('/dashboard', LayoutDashboard, 'Dashboard')}
            {navLink('/complaints/new', PlusCircle, 'Report Issue')}
            {navLink('/complaints/mine', FolderOpen, 'My Reports')}
            {navLink('/complaints', Compass, 'Feed')}
          </>)}
          {isOfficer && (<>
            {navLink('/officer/dashboard', ShieldCheck, 'Command Center')}
            {navLink('/complaints', Compass, 'Browse Feed')}
          </>)}
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* User pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.55rem',
                padding: '0.35rem 0.85rem 0.35rem 0.35rem',
                background: '#f8fafc', borderRadius: '9999px',
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: isOfficer ? 'linear-gradient(135deg, #1e293b, #7c3aed)' : 'linear-gradient(135deg, #1e3a8a, #0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '0.85rem',
                }}>
                  {firstLetter}
                </div>
                <span className="hide-mobile" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                  background: isOfficer ? '#fee2e2' : '#dbeafe',
                  color: isOfficer ? '#b91c1c' : '#1e40af',
                  padding: '0.15rem 0.45rem', borderRadius: '4px',
                }}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1.5px solid var(--border)',
                background: '#fff', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#fca5a5'; e.currentTarget.style.color='#dc2626'; e.currentTarget.style.background='#fef2f2'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='#fff'; }}
              >
                <LogOut size={15} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 1rem', borderRadius: '8px', border: '1.5px solid var(--border)',
                background: '#fff', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
                transition: 'all 0.15s',
              }}>
                <LogIn size={15} /> Login
              </Link>
              <Link to="/signup" style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 1rem', borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                color: '#fff', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                transition: 'all 0.15s',
              }}>
                <UserPlus size={15} /> Sign Up
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: '8px', border: '1.5px solid var(--border)',
              background: mobileMenuOpen ? 'var(--primary-50)' : '#fff',
              color: mobileMenuOpen ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
            }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)', padding: '1rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          animation: 'mobileMenuIn 0.2s ease',
        }}>
          {[
            ...(!isAuthenticated ? [['/','Home'],['/complaints','Browse Complaints']] : []),
            ...(isCitizen ? [['/dashboard','Dashboard'],['/complaints/new','Report Complaint'],['/complaints/mine','My Complaints'],['/complaints','Browse Feed']] : []),
            ...(isOfficer ? [['/officer/dashboard','Command Center'],['/complaints','Browse Feed']] : []),
          ].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} style={{
              padding: '0.65rem 0.85rem', borderRadius: '8px', fontWeight: 600,
              fontSize: '0.9rem', color: isActive(to) ? 'var(--primary)' : 'var(--text-main)',
              background: isActive(to) ? 'var(--primary-50)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .desktop-nav { display: flex !important; } .mobile-toggle { display: none !important; } }
        @media (max-width: 767px) { .mobile-toggle { display: flex !important; } .hide-mobile { display: none !important; } }
        @keyframes mobileMenuIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
      `}</style>
    </nav>
  );
};

export default Navbar;