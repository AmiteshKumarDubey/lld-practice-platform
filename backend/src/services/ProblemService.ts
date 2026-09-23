/**
 * Application Service: ProblemService
 * Business logic for retrieving LLD problems and starter templates.
 */

import { IProblemRepository } from '../domain/repositories/IProblemRepository';
import { Problem } from '../domain/models/Problem';

export class ProblemService {
  constructor(private problemRepo: IProblemRepository) {}

  async getAllProblems(): Promise<Problem[]> {
    return this.problemRepo.findAll();
  }

  async getProblemById(id: string): Promise<Problem | null> {
    return this.problemRepo.findById(id);
  }
}
