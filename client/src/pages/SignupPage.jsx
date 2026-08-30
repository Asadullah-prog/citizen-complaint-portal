import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Shield, User, Building2, CheckCircle } from 'lucide-react';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    try {
      setLoading(true); setError('');
      const newUser = await signup(name, email, password, role);
      navigate(newUser.role === 'officer' ? '/officer/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally { setLoading(false); }
  };

  const features = [
    'Report civic complaints with one click',
    'Community upvoting for faster resolution',
    'AI-powered officer briefings',
    'Transparent issue tracking & feedback',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 45%', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #312e81 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="signup-panel">
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.18), transparent 70%)', top: '-100px', right: '-80px' }} />
          <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.12), transparent 70%)', bottom: '-80px', left: '-60px' }} />
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
            Join Your Community
          </h1>
          <p style={{ opacity: 0.85, fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Create your account to start reporting civic issues and drive real change in your municipality.
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
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div className="card" style={{ padding: '2.5rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(30,58,138,0.3)' }}>
                <UserPlus size={24} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Create New Account</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Register to report civic complaints or manage municipal resolutions</p>
            </div>

            {error && (<div className="alert alert-danger"><AlertCircle size={18} /><span>{error}</span></div>)}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="e.g. Ayesha Khan" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="e.g. citizen@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password (Min. 6 characters)</label>
                <input type="password" className="form-input" placeholder="Create a secure password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {/* Role selector */}
              <div className="form-group">
                <label className="form-label">Account Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setRole('citizen')} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
                    fontSize: '0.875rem', fontFamily: 'inherit', transition: 'all 0.15s',
                    border: role === 'citizen' ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: role === 'citizen' ? 'var(--primary-50)' : '#fff',
                    color: role === 'citizen' ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: role === 'citizen' ? '0 4px 12px rgba(37,99,235,0.15)' : 'none',
                  }}>
                    <User size={16} /> Citizen
                  </button>
                  <button type="button" onClick={() => setRole('officer')} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.75rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
                    fontSize: '0.875rem', fontFamily: 'inherit', transition: 'all 0.15s',
                    border: role === 'officer' ? '2px solid #dc2626' : '2px solid var(--border)',
                    background: role === 'officer' ? '#fef2f2' : '#fff',
                    color: role === 'officer' ? '#dc2626' : 'var(--text-muted)',
                    boxShadow: role === 'officer' ? '0 4px 12px rgba(220,38,38,0.15)' : 'none',
                  }}>
                    <Shield size={16} /> Officer
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {role === 'citizen' ? 'Citizens can report, upvote, and rate municipal resolutions.' : 'Officers access the Command Center, AI briefings, and manage resolution status.'}
                </p>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>Log In here</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .signup-panel { display: none !important; } }
      `}</style>
    </div>
  );
};

export default SignupPage;