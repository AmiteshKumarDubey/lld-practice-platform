import React, { useState, useEffect, useRef } from 'react';
import { Problem, Attempt, SubmissionFormat } from './types';
import { fetchProblems, startAttempt, submitSolution, fetchAttemptStatus, retryEvaluation, fetchProblemHistory } from './services/api';
import { Header } from './components/Header';
import { ProblemList } from './components/ProblemList';
import { DesignWorkspace } from './components/DesignWorkspace';
import { FeedbackView } from './components/FeedbackView';
import { SubmissionHistory } from './components/SubmissionHistory';
import { Loader2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'PROBLEMS' | 'WORKSPACE' | 'HISTORY'>('PROBLEMS');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<Attempt | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<any>(null);

  // Load problems on initial mount
  useEffect(() => {
    loadProblems();
  }, []);

  // Poll active attempt status if status is EVALUATING
  useEffect(() => {
    if (activeAttempt && (activeAttempt.status === 'EVALUATING' || activeAttempt.status === 'SUBMITTED')) {
      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(async () => {
          try {
            const updated = await fetchAttemptStatus(activeAttempt.id);
            setActiveAttempt(updated);
            if (updated.status === 'COMPLETED' || updated.status === 'EVALUATION_FAILED') {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
              // Refresh history
              loadHistory(updated.problemId);
            }
          } catch (err) {
            console.error('Polling error:', err);
          }
        }, 1500);
      }
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [activeAttempt]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProblems();
      setProblems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (problemId: string) => {
    try {
      const history = await fetchProblemHistory(problemId);
      setAttemptHistory(history);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSelectProblem = async (problemId: string) => {
    const prob = problems.find((p) => p.id === problemId);
    if (!prob) return;

    setSelectedProblem(prob);
    setLoading(true);

    try {
      // Start a new practice attempt
      const attempt = await startAttempt(prob.id);
      setActiveAttempt(attempt);
      await loadHistory(prob.id);
      setCurrentView('WORKSPACE');
    } catch (err: any) {
      setError(err.message || 'Could not start attempt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSolution = async (format: SubmissionFormat, content: string) => {
    if (!activeAttempt) return;
    try {
      const updated = await submitSolution(activeAttempt.id, format, content);
      setActiveAttempt(updated);
    } catch (err: any) {
      throw err;
    }
  };

  const handleRetryEvaluation = async () => {
    if (!activeAttempt) return;
    try {
      const updated = await retryEvaluation(activeAttempt.id);
      setActiveAttempt(updated);
    } catch (err: any) {
      throw err;
    }
  };

  const handleSelectHistoricalAttempt = async (attemptId: string) => {
    try {
      const att = await fetchAttemptStatus(attemptId);
      setActiveAttempt(att);
      setCurrentView('WORKSPACE');
    } catch (err: any) {
      setError(err.message || 'Failed to load historical attempt');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeProblemTitle={selectedProblem?.title}
      />

      <main style={{ flex: 1 }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '0.75rem', color: 'var(--text-secondary)' }}>
            <Loader2 size={24} className="spin" />
            <span>Loading LLD Practice Platform...</span>
          </div>
        )}

        {error && (
          <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <h3 style={{ color: '#f87171', marginBottom: '0.5rem' }}>Connection Error</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{error}</p>
            <button className="btn btn-primary" onClick={loadProblems}>Retry Connection</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {currentView === 'PROBLEMS' && (
              <ProblemList problems={problems} onSelectProblem={handleSelectProblem} />
            )}

            {currentView === 'WORKSPACE' && selectedProblem && (
              <>
                {/* Show Feedback if COMPLETED or FAILED, otherwise show DesignWorkspace */}
                {activeAttempt && (activeAttempt.status === 'COMPLETED' || activeAttempt.status === 'EVALUATION_FAILED') ? (
                  <FeedbackView
                    attempt={activeAttempt}
                    onIterateSolution={() => {
                      // Move status to IN_PROGRESS so candidate can edit and resubmit
                      setActiveAttempt({ ...activeAttempt, status: 'IN_PROGRESS' });
                    }}
                    onRetryEvaluation={handleRetryEvaluation}
                  />
                ) : (
                  <DesignWorkspace
                    problem={selectedProblem}
                    attempt={activeAttempt}
                    onSubmitSolution={handleSubmitSolution}
                    onViewHistory={() => setCurrentView('HISTORY')}
                  />
                )}
              </>
            )}

            {currentView === 'HISTORY' && selectedProblem && (
              <SubmissionHistory
                attempts={attemptHistory}
                onSelectAttempt={handleSelectHistoricalAttempt}
                onNewAttempt={() => handleSelectProblem(selectedProblem.id)}
              />
            )}
          </>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)', background: 'var(--bg-primary)' }}>
        LLD Practice Platform — Object-Oriented Design & Architectural Feedback Monolith
      </footer>
    </div>
  );
}

export default App;
