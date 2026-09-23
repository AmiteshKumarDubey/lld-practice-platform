/**
 * Repository Interface: IAttemptRepository
 */

import { Attempt } from '../models/Attempt';

export interface IAttemptRepository {
  save(attempt: Attempt): Promise<Attempt>;
  findById(id: string): Promise<Attempt | null>;
  findByProblemId(problemId: string): Promise<Attempt[]>;
  findAll(): Promise<Attempt[]>;
}
