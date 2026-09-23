import React from 'react';
import { Attempt } from '../types';
import { StatusBadge } from './StatusBadge';
import { History, Calendar, CheckCircle2, RotateCcw, FileCode2 } from 'lucide-react';

interface SubmissionHistoryProps {
  attempts: Attempt[];
  onSelectAttempt: (attemptId: string) => void;
  onNewAttempt: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ attempts, onSelectAttempt, onNewAttempt }) => {
  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={24} color="var(--accent-primary)" /> Learner Attempt History
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Track your score progression and design iteration history over time.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onNewAttempt}>
          <RotateCcw size={16} /> Start New Attempt
        </button>
      </div>

      {attempts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No previous attempts recorded for this problem yet. Start your first attempt!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {attempts.map((att, idx) => {
            const report = att.feedbackReport;
            const subCount = att.submissions.length;
            const latestSub = att.submissions && att.submissions.length > 0
              ? att.submissions[att.submissions.length - 1]
              : null;

            return (
              <div
                key={att.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: report ? `4px solid ${report.score >= 80 ? 'var(--color-success)' : report.score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'}` : '4px solid var(--border-subtle)'
                }}
                onClick={() => onSelectAttempt(att.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {/* Iteration Badge */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: 'var(--accent-primary)'
                  }}>
                    #{attempts.length - idx}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <StatusBadge status={att.status} />
                      {latestSub && (
                        <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-muted)' }}>
                          <FileCode2 size={12} /> {latestSub.format} ({subCount} submissions)
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={13} /> {new Date(att.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Right side score badge */}
                {report ? (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: report.score >= 80 ? 'var(--color-success)' : report.score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                      {report.score} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Det: {report.deterministicScore}% • LLM: {report.qualitativeScore}%
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    In Progress
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
