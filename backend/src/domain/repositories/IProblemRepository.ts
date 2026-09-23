/**
 * Repository Interface: IProblemRepository
 */

import { Problem } from '../models/Problem';

export interface IProblemRepository {
  findAll(): Promise<Problem[]>;
  findById(id: string): Promise<Problem | null>;
}
