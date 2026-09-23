/**
 * In-Memory Repository Implementation for Problem Entity
 */

import { IProblemRepository } from './IProblemRepository';
import { Problem } from '../models/Problem';
import { SAMPLE_PROBLEMS } from '../../data/sampleProblems';

export class MemoryProblemRepository implements IProblemRepository {
  private problems: Map<string, Problem> = new Map();

  constructor() {
    for (const p of SAMPLE_PROBLEMS) {
      this.problems.set(p.id, new Problem(p));
    }
  }

  async findAll(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }

  async findById(id: string): Promise<Problem | null> {
    const problem = this.problems.get(id);
    return problem || null;
  }
}
