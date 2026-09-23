import React from 'react';
import { Problem } from '../types';
import { ArrowRight, Tag, CheckSquare, Sparkles } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  onSelect: (problemId: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSelect }) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY': return <span className="badge badge-easy">Easy</span>;
      case 'MEDIUM': return <span className="badge badge-medium">Medium</span>;
      case 'HARD': return <span className="badge badge-hard">Hard</span>;
      default: return <span className="badge">{diff}</span>;
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.25s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = 'var(--border-glow)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
    }}
    >
      <div>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {getDifficultyBadge(problem.difficulty)}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {problem.category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {problem.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {problem.shortDescription}
        </p>

        {/* Key Design Rubric Targets */}
        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={12} /> Key Design Goals
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            {problem.rubric.keyDesignGoals.slice(0, 2).map((goal, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <CheckSquare size={13} color="var(--color-success)" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {problem.tags.map((tag, idx) => (
            <span key={idx} style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action button */}
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onSelect(problem.id)}>
        Start Practice <ArrowRight size={16} />
      </button>
    </div>
  );
};
