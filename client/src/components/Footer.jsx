import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        marginTop: 'auto',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--primary)" />
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Citizen Complaint Portal</span>
          <span>&copy; {new Date().getFullYear()} Municipal Public Services</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Empowering civic participation & transparent municipal resolutions</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
