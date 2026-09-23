import { Problem, Attempt, SubmissionFormat } from '../types';

const API_BASE = '/api';

export async function fetchProblems(): Promise<Problem[]> {
  const res = await fetch(`${API_BASE}/problems`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problems');
  return json.data;
}

export async function fetchProblemById(id: string): Promise<Problem> {
  const res = await fetch(`${API_BASE}/problems/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problem details');
  return json.data;
}

export async function startAttempt(problemId: string): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemId }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to start attempt');
  return json.data;
}

export async function submitSolution(
  attemptId: string,
  format: SubmissionFormat,
  content: string
): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, content }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to submit solution');
  return json.data;
}

export async function fetchAttemptStatus(attemptId: string): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch attempt status');
  return json.data;
}

export async function retryEvaluation(attemptId: string): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/retry-evaluation`, {
    method: 'POST',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to retry evaluation');
  return json.data;
}

export async function fetchProblemHistory(problemId: string): Promise<Attempt[]> {
  const res = await fetch(`${API_BASE}/attempts/problem/${problemId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problem history');
  return json.data;
}
