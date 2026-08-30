import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, User, AlertCircle, Sparkles, CheckCircle, Building2 } from 'lucide-react';

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
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    try {
      setLoading(true); setError('');
      const loggedInUser = await login(email, password);
      const from = location.state?.from?.pathname;
      if (from && !from.includes('login') && !from.includes('signup')) {
        navigate(from, { replace: true });
      } else {
        navigate(loggedInUser.role === 'officer' ? '/officer/dashboard' : '/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  const autofillCitizen = () => { setEmail('citizen@citizenportal.com'); setPassword('Citizen123!'); setError(''); };
  const autofillOfficer = () => { setEmail('officer@citizenportal.com'); setPassword('Officer123!'); setError(''); };

  const features = [
    'Smart duplicate complaint detection',
    'Real-time priority scoring algorithm',
    'AI-powered officer briefings',
    'Transparent municipal accountability',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 45%', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1e40af 75%, #0284c7 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="login-panel">
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.18), transparent 70%)', top: '-100px', right: '-80px' }} />
          <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12), transparent 70%)', bottom: '-80px', left: '-60px' }} />
        </div>
        <div style={{ position: 'relative', color: '#fff', maxWidth: '420px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>CivicPortal</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.75, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Municipal Redressal Network</div>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>
            Welcome to Civic Governance
          </h1>
          <p style={{ opacity: 0.85, fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Connect citizens and municipal officers in a transparent, AI-powered complaint resolution system.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {features.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', opacity: 0.9 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={13} />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-main)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="card" style={{ padding: '2.5rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--grad-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-primary)' }}>
                <LogIn size={24} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Account Login</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Access the Citizen Complaint & Municipal Portal</p>
            </div>

            {/* Demo autofill */}
            <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', borderRadius: 'var(--radius-md)', padding: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-700)', marginBottom: '0.5rem' }}>
                <Sparkles size={13} /> Quick Demo Autofill
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button type="button" onClick={autofillCitizen} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}>
                  <User size={14} color="var(--primary)" /> Citizen Demo
                </button>
                <button type="button" onClick={autofillOfficer} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}>
                  <Shield size={14} color="#dc2626" /> Officer Demo
                </button>
              </div>
            </div>

            {error && (<div className="alert alert-danger"><AlertCircle size={18} /><span>{error}</span></div>)}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="e.g. citizen@citizenportal.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Authenticating...' : 'Log In to Portal'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Don't have an account yet?{' '}
              <Link to="/signup" style={{ fontWeight: 700, color: 'var(--primary)' }}>Sign Up here</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .login-panel { display: none !important; } }
      `}</style>
    </div>
  );
};

export default LoginPage;