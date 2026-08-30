import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import DuplicateWarningModal from '../components/DuplicateWarningModal';
import { PlusCircle, AlertCircle, ArrowLeft, Send, CheckCircle, FileText, MapPin, Tag } from 'lucide-react';

export const NewComplaintPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Road');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const categories = ['Road', 'Garbage', 'Water', 'Electricity', 'Other'];

  const categoryColors = {
    Road: '#2563eb', Garbage: '#16a34a', Water: '#0284c7',
    Electricity: '#eab308', Other: '#64748b',
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !category || !area.trim() || !description.trim()) {
      setError('Please fill in all fields (Title, Category, Area, Description).');
      return;
    }
    try {
      setCheckingDuplicates(true);
      const dupRes = await api.checkDuplicate(category, area.trim());
      if (dupRes && dupRes.hasDuplicates && dupRes.duplicates.length > 0) {
        setDuplicates(dupRes.duplicates);
        setShowDuplicateModal(true);
        setCheckingDuplicates(false);
        return;
      }
      await executeCreateComplaint();
    } catch (err) {
      await executeCreateComplaint();
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const executeCreateComplaint = async () => {
    try {
      setSubmitting(true);
      setError('');
      await api.createComplaint({ title: title.trim(), category, area: area.trim(), description: description.trim() });
      setSuccess('Complaint filed successfully! Redirecting to your complaints...');
      setShowDuplicateModal(false);
      setTimeout(() => navigate('/complaints/mine'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint.');
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '720px' }}>
      <Link
        to="/dashboard"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600,
          marginBottom: '1.5rem', transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
        borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '1.5rem',
        color: '#ffffff', position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 90% -20%, rgba(96,165,250,0.2), transparent)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.25)', flexShrink: 0,
          }}>
            <PlusCircle size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.2 }}>Report a Civic Issue</h1>
            <p style={{ opacity: 0.85, fontSize: '0.9rem', marginTop: '0.3rem' }}>
              Submit a localized report to notify municipal administration and community members
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem 2.25rem' }}>
        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} /> <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} color="var(--primary)" /> Complaint Title *
            </label>
            <input
              type="text" className="form-input"
              placeholder="e.g. Broken streetlight causing nighttime safety hazard"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
          </div>

          {/* Category + Area */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={14} color="var(--primary)" /> Problem Category *
              </label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {category && (
                <div style={{
                  marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  fontSize: '0.75rem', fontWeight: 600, color: categoryColors[category] || '#64748b',
                  background: `${categoryColors[category] || '#64748b'}15`,
                  padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: categoryColors[category] || '#64748b' }} />
                  {category} Issues
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="var(--primary)" /> Area / Locality *
              </label>
              <input
                type="text" className="form-input"
                placeholder="e.g. Satellite Town, Gulberg, F-7 Markaz"
                value={area} onChange={(e) => setArea(e.target.value)} required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the exact location, duration of the problem, severity, and any landmarks to help municipal teams inspect and resolve it..."
              value={description} onChange={(e) => setDescription(e.target.value)} required rows={5}
            />
            <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'right' }}>
              {description.length} characters
            </div>
          </div>

          {/* Info Note */}
          <div style={{
            background: 'var(--primary-50)', border: '1px solid var(--primary-100)',
            borderRadius: 'var(--radius-md)', padding: '0.9rem 1rem',
            marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--primary-800)',
            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
          }}>
            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>
              New complaints are registered as <strong>Pending</strong> and receive dynamic urgency scoring based on community upvotes and time elapsed.
            </span>
          </div>

          <button
            type="submit" className="btn btn-primary btn-xl"
            style={{ width: '100%' }}
            disabled={submitting || checkingDuplicates}
          >
            <Send size={18} />
            {checkingDuplicates ? 'Checking for Duplicates...' : submitting ? 'Submitting Report...' : 'Submit Complaint Report'}
          </button>
        </form>
      </div>

      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        duplicates={duplicates}
        onClose={() => setShowDuplicateModal(false)}
        onContinueAnyway={executeCreateComplaint}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default NewComplaintPage;