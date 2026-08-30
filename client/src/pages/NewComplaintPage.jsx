import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import DuplicateWarningModal from '../components/DuplicateWarningModal';
import { PlusCircle, AlertCircle, ArrowLeft, Send, CheckCircle } from 'lucide-react';

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

  // Duplicate modal states
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const categories = ['Road', 'Garbage', 'Water', 'Electricity', 'Other'];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !category || !area.trim() || !description.trim()) {
      setError('Please fill in all fields (Title, Category, Area, Description).');
      return;
    }

    try {
      setCheckingDuplicates(true);
      // First check for active duplicates in same category and area
      const dupRes = await api.checkDuplicate(category, area.trim());

      if (dupRes && dupRes.hasDuplicates && dupRes.duplicates.length > 0) {
        setDuplicates(dupRes.duplicates);
        setShowDuplicateModal(true);
        setCheckingDuplicates(false);
        return; // Pause for user review
      }

      // No duplicates found, execute direct creation
      await executeCreateComplaint();
    } catch (err) {
      console.error('Submission pre-check error:', err);
      // If duplicate check failed, proceed with direct creation
      await executeCreateComplaint();
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const executeCreateComplaint = async () => {
    try {
      setSubmitting(true);
      setError('');
      await api.createComplaint({
        title: title.trim(),
        category,
        area: area.trim(),
        description: description.trim(),
      });

      setSuccess('Complaint filed successfully! Redirecting to your complaints...');
      setShowDuplicateModal(false);
      
      setTimeout(() => {
        navigate('/complaints/mine');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint.');
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem 2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.65rem',
              borderRadius: '50%',
              display: 'flex',
            }}
          >
            <PlusCircle size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Report a Civic Issue</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Submit a localized report to notify municipal administration and community members
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Complaint Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Broken streetlight causing nighttime safety hazard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Problem Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Area / Locality *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Satellite Town, Gulberg, F-7 Markaz"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the exact location, duration of the problem, severity, and any landmarks to help municipal teams inspect and resolve it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            />
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            <strong>Note:</strong> New complaints are automatically registered with <strong>Pending</strong> status and will receive dynamic urgency scoring as community members view and upvote the issue.
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={submitting || checkingDuplicates}
          >
            {checkingDuplicates ? 'Checking Duplicates...' : submitting ? 'Submitting Report...' : 'Submit Complaint'}
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Duplicate Warning Modal */}
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
