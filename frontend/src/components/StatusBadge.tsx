import React from 'react';
import { AttemptStatus } from '../types';
import { Clock, Loader2, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

interface StatusBadgeProps {
  status: AttemptStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'IN_PROGRESS':
      return (
        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <FileCode size={13} /> Drafting
        </span>
      );
    case 'SUBMITTED':
      return (
        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <Clock size={13} /> Submitted
        </span>
      );
    case 'EVALUATING':
      return (
        <span className="badge pulse" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <Loader2 size={13} className="spin" /> Evaluating Design...
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <CheckCircle2 size={13} /> Evaluated
        </span>
      );
    case 'EVALUATION_FAILED':
      return (
        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <AlertTriangle size={13} /> Evaluation Failed
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
