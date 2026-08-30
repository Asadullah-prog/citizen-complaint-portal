import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  PlusCircle,
  FolderOpen,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isOfficer, isCitizen, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to={isAuthenticated ? (isOfficer ? '/officer/dashboard' : '/dashboard') : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)', lineHeight: 1.1 }}>
              Citizen Portal
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              CIVIC RESOLUTION SYSTEM
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav"
        >
          {/* Public links */}
          {!isAuthenticated && (
            <>
              <Link
                to="/"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                Home
              </Link>
              <Link
                to="/complaints"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/complaints') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                Browse Complaints
              </Link>
            </>
          )}

          {/* Citizen links */}
          {isCitizen && (
            <>
              <Link
                to="/dashboard"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link
                to="/complaints/new"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/complaints/new') ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <PlusCircle size={16} />
                Report Complaint
              </Link>
              <Link
                to="/complaints/mine"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/complaints/mine') ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <FolderOpen size={16} />
                My Complaints
              </Link>
              <Link
                to="/complaints"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/complaints') ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Compass size={16} />
                Browse Feed
              </Link>
            </>
          )}

          {/* Officer links */}
          {isOfficer && (
            <>
              <Link
                to="/officer/dashboard"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/officer/dashboard') ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ShieldCheck size={16} />
                Officer Command Center
              </Link>
              <Link
                to="/complaints"
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isActive('/complaints') ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Compass size={16} />
                Browse Feed
              </Link>
            </>
          )}
        </div>

        {/* Right side auth controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <User size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    backgroundColor: isOfficer ? '#fee2e2' : '#e0e7ff',
                    color: isOfficer ? '#991b1b' : '#3730a3',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                  }}
                >
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={15} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem 1.5rem',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {!isAuthenticated && (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/complaints" onClick={() => setMobileMenuOpen(false)}>
                Browse Complaints
              </Link>
            </>
          )}

          {isCitizen && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Citizen Dashboard
              </Link>
              <Link to="/complaints/new" onClick={() => setMobileMenuOpen(false)}>
                Report Complaint
              </Link>
              <Link to="/complaints/mine" onClick={() => setMobileMenuOpen(false)}>
                My Complaints
              </Link>
              <Link to="/complaints" onClick={() => setMobileMenuOpen(false)}>
                Browse Public Feed
              </Link>
            </>
          )}

          {isOfficer && (
            <>
              <Link to="/officer/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Officer Dashboard
              </Link>
              <Link to="/complaints" onClick={() => setMobileMenuOpen(false)}>
                Browse Public Feed
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-toggle {
            display: block !important;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
