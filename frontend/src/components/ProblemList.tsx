import React, { useState } from 'react';
import { Problem } from '../types';
import { ProblemCard } from './ProblemCard';
import { Search, Filter, Code2, Target, Award } from 'lucide-react';

interface ProblemListProps {
  problems: Problem[];
  onSelectProblem: (problemId: string) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({ problems, onSelectProblem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty = difficultyFilter === 'ALL' || p.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Hero Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '800px' }}>
          <div className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', marginBottom: '1rem' }}>
            <Target size={14} /> Low-Level Design Mastery
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Practice System Design & Receive <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Instant AI Evaluation</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Select an object-oriented design problem, draft class hierarchies and design patterns, submit your solution, and receive immediate deterministic + LLM-based design feedback.
          </p>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Code2 size={20} color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Multi-Format</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TS, Java, Python & Diagrams</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={20} color="var(--color-success)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Hybrid Feedback</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SOLID checks + Reasoning</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search problems by title, pattern, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" />
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`btn ${difficultyFilter === diff ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              {diff}
            </button>
          ))}
        </div>

      </div>

      {/* Problem Grid */}
      {filteredProblems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No LLD problems matched your filter criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} onSelect={onSelectProblem} />
          ))}
        </div>
      )}

    </div>
  );
};
