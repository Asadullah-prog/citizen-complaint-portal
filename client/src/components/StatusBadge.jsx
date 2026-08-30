import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'Pending').trim();

  if (normalized === 'Resolved') {
    return (
      <span className="badge badge-resolved">
        <CheckCircle2 size={12} />
        Resolved
      </span>
    );
  }

  if (normalized === 'In Progress') {
    return (
      <span className="badge badge-in-progress">
        <Clock size={12} />
        In Progress
      </span>
    );
  }

  return (
    <span className="badge badge-pending">
      <AlertCircle size={12} />
      Pending
    </span>
  );
};

export default StatusBadge;
