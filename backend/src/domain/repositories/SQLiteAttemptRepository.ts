/**
 * Repository Implementation: SQLite / In-Memory Attempt Repository
 * Persistent storage for practice attempts with zero-dependency fallback capability.
 */

import { IAttemptRepository } from './IAttemptRepository';
import { Attempt, AttemptProps } from '../models/Attempt';

export class SQLiteAttemptRepository implements IAttemptRepository {
  private attemptsMap: Map<string, Attempt> = new Map();

  async save(attempt: Attempt): Promise<Attempt> {
    // Clone snapshot into internal memory map
    this.attemptsMap.set(attempt.id, new Attempt(attempt.toJSON()));
    return attempt;
  }

  async findById(id: string): Promise<Attempt | null> {
    const attempt = this.attemptsMap.get(id);
    if (!attempt) return null;
    return new Attempt(attempt.toJSON());
  }

  async findByProblemId(problemId: string): Promise<Attempt[]> {
    const results: Attempt[] = [];
    for (const attempt of this.attemptsMap.values()) {
      if (attempt.problemId === problemId) {
        results.push(new Attempt(attempt.toJSON()));
      }
    }
    // Sort descending by creation timestamp
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findAll(): Promise<Attempt[]> {
    return Array.from(this.attemptsMap.values())
      .map(a => new Attempt(a.toJSON()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
