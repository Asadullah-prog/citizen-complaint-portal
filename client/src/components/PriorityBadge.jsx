import React from 'react';
import { Flame, AlertTriangle, Info, Zap } from 'lucide-react';

export const PriorityBadge = ({ priority, score }) => {
  const p = (priority || 'Low').trim();

  let badgeClass = 'badge-priority-low';
  let Icon = Info;

  if (p === 'Critical') {
    badgeClass = 'badge-priority-critical';
    Icon = Flame;
  } else if (p === 'High') {
    badgeClass = 'badge-priority-high';
    Icon = Zap;
  } else if (p === 'Medium') {
    badgeClass = 'badge-priority-medium';
    Icon = AlertTriangle;
  }

  return (
    <span className={`badge ${badgeClass}`} title={score !== undefined ? `Priority Score: ${score}` : undefined}>
      <Icon size={12} />
      {p}
      {score !== undefined && <span style={{ opacity: 0.85, fontWeight: 500 }}>({score})</span>}
    </span>
  );
};

export default PriorityBadge;
