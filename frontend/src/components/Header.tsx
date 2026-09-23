import React from 'react';
import { Cpu, Layers, History, Home } from 'lucide-react';

interface HeaderProps {
  currentView: 'PROBLEMS' | 'WORKSPACE' | 'HISTORY';
  onNavigate: (view: 'PROBLEMS' | 'WORKSPACE' | 'HISTORY') => void;
  activeProblemTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, activeProblemTitle }) => {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand logo & title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => onNavigate('PROBLEMS')}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Cpu size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LLD Practice Platform
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Low-Level Design Evaluation Engine</p>
          </div>
        </div>

        {/* Center active problem indicator */}
        {activeProblemTitle && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Layers size={16} color="var(--accent-primary)" />
            <span style={{ color: 'var(--text-muted)' }}>Problem:</span>
            <span>{activeProblemTitle}</span>
          </div>
        )}

        {/* Navigation tabs */}
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${currentView === 'PROBLEMS' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onNavigate('PROBLEMS')}
          >
            <Home size={16} /> Problems
          </button>

          {activeProblemTitle && (
            <button
              className={`btn ${currentView === 'WORKSPACE' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onNavigate('WORKSPACE')}
            >
              <Layers size={16} /> Workspace
            </button>
          )}

          {activeProblemTitle && (
            <button
              className={`btn ${currentView === 'HISTORY' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onNavigate('HISTORY')}
            >
              <History size={16} /> Attempt History
            </button>
          )}
        </nav>

      </div>
    </header>
  );
};
