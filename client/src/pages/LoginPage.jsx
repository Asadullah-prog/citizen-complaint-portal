import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, User, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedInUser = await login(email, password);

      // Redirect according to role or location state
      const from = location.state?.from?.pathname;
      if (from && !from.includes('login') && !from.includes('signup')) {
        navigate(from, { replace: true });
      } else {
        if (loggedInUser.role === 'officer') {
          navigate('/officer/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillCitizen = () => {
    setEmail('citizen@citizenportal.com');
    setPassword('Citizen123!');
    setError('');
  };

  const autofillOfficer = () => {
    setEmail('officer@citizenportal.com');
    setPassword('Officer123!');
    setError('');
  };

  return (
    <div className="main-content" style={{ maxWidth: '480px', marginTop: '2rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <LogIn size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Account Login</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Access the Citizen Complaint & Municipal Portal
          </p>
        </div>

        {/* Demo Fast-Login Helper Cards */}
        <div
          style={{
            backgroundColor: '#f1f5f9',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={14} color="var(--primary)" />
            Quick Demo Autofill (One-Click)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={autofillCitizen}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
            >
              <User size={14} color="var(--accent)" />
              Citizen Demo
            </button>
            <button
              type="button"
              onClick={autofillOfficer}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', justifyContent: 'flex-start', padding: '0.4rem 0.6rem' }}
            >
              <Shield size={14} color="#dc2626" />
              Officer Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. citizen@citizenportal.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Log In to Portal'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}
        >
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Sign Up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
