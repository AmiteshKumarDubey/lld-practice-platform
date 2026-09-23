import React, { useState } from 'react';
import { Attempt, FeedbackReport } from '../types';
import { Award, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, RefreshCw, ArrowRight, FileCheck2, Cpu } from 'lucide-react';

interface FeedbackViewProps {
  attempt: Attempt;
  onIterateSolution: () => void;
  onRetryEvaluation: () => Promise<void>;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ attempt, onIterateSolution, onRetryEvaluation }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STRUCTURE' | 'SOLID' | 'RECOMMENDATIONS'>('OVERVIEW');
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const report = attempt.feedbackReport;

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      await onRetryEvaluation();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRetrying(false);
    }
  };

  if (attempt.status === 'EVALUATION_FAILED') {
    return (
      <div style={{ maxWidth: '800px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <AlertTriangle size={48} color="var(--color-danger)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Evaluation Failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {attempt.errorMessage || 'An error occurred during evaluation pipeline execution.'}
          </p>
          <button className="btn btn-primary" disabled={isRetrying} onClick={handleRetry}>
            <RefreshCw size={16} className={isRetrying ? 'spin' : ''} /> Retry Evaluation
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Top Banner: Score Breakdown Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(31, 41, 61, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* Main Score Gauge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              border: `4px solid ${getScoreColor(report.score)}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px -3px ${getScoreColor(report.score)}`,
              margin: '0 auto 0.5rem'
            }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1 }}>{report.score}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: getScoreColor(report.score) }}>
              {report.score >= 80 ? 'Excellent Design' : report.score >= 60 ? 'Good Progress' : 'Needs Refactoring'}
            </div>
          </div>

          {/* Detailed Score Breakdown */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Evaluation Feedback Report</h2>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <Cpu size={12} /> {report.evaluatorSource === 'HYBRID_LLM' ? 'AI Hybrid Evaluator' : 'Deterministic Evaluator'}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {report.summary}
            </p>

            {/* Score Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Deterministic Structure Check (40%)</span>
                  <span>{report.deterministicScore}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${report.deterministicScore}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>LLM Qualitative Reasoning (60%)</span>
                  <span>{report.qualitativeScore}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${report.qualitativeScore}%`, height: '100%', background: 'var(--accent-secondary)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Action to iterate */}
          <div>
            <button className="btn btn-primary" style={{ padding: '0.85rem 1.5rem' }} onClick={onIterateSolution}>
              Refine & Resubmit <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'OVERVIEW', label: 'Strengths & Weaknesses', icon: Award },
          { id: 'STRUCTURE', label: `Structural Findings (${report.structuralFindings.length})`, icon: FileCheck2 },
          { id: 'SOLID', label: `SOLID Violations (${report.solidViolations.length})`, icon: ShieldAlert },
          { id: 'RECOMMENDATIONS', label: 'Actionable Advice', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Strengths */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} /> Design Strengths
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {report.strengths.map((str, idx) => (
                  <li key={idx} style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: '#e2e8f0' }}>
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} /> Design Weaknesses & Gaps
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {report.weaknesses.map((w, idx) => (
                  <li key={idx} style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: '#e2e8f0' }}>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Structural Findings */}
        {activeTab === 'STRUCTURE' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>AST Code & Structure Inspection</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {report.structuralFindings.map((finding, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid',
                  borderColor: finding.status === 'FOUND' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <span className="badge" style={{ fontSize: '0.65rem' }}>{finding.type}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>{finding.name}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{finding.notes}</div>
                  </div>

                  <span className="badge" style={{
                    background: finding.status === 'FOUND' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: finding.status === 'FOUND' ? '#34d399' : '#f87171'
                  }}>
                    {finding.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: SOLID Violations */}
        {activeTab === 'SOLID' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>SOLID Principles Analysis</h3>
            {report.solidViolations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-success)' }}>
                <CheckCircle2 size={32} style={{ marginBottom: '0.5rem' }} />
                <p>No SOLID principle violations detected in this submission!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {report.solidViolations.map((v, idx) => (
                  <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-hard">{v.principle} Violation</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Severity: {v.severity}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#f87171', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {v.description}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(0, 0, 0, 0.3)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      💡 <strong>Suggestion:</strong> {v.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Actionable Recommendations */}
        {activeTab === 'RECOMMENDATIONS' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-primary)' }}>
              Step-by-Step Refactoring Guide
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {report.improvementSuggestions.map((sug, idx) => (
                <li key={idx} style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ background: 'var(--accent-primary)', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

    </div>
  );
};
