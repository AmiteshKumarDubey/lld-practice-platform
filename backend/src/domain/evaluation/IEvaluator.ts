/**
 * Domain Evaluation Strategy Interface
 * Strategy pattern interface for submission evaluators.
 */

import { Submission } from '../models/Submission';
import { RubricCriteria } from '../models/Problem';
import { SolidViolation, StructuralFinding } from '../models/FeedbackReport';

export interface EvaluationResultPartial {
  score?: number;
  deterministicScore?: number;
  qualitativeScore?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  solidViolations?: SolidViolation[];
  structuralFindings?: StructuralFinding[];
  improvementSuggestions?: string[];
  recommendedPatterns?: string[];
}

export interface IEvaluator {
  readonly name: string;
  evaluate(submission: Submission, rubric: RubricCriteria): Promise<EvaluationResultPartial>;
}
