/**
 * Domain Orchestrator: EvaluationPipeline
 * Orchestrates deterministic AST checks + LLM qualitative analysis into a synthesized FeedbackReport.
 * Handles timeouts, invalid inputs, and evaluator source tracking.
 */

import { IEvaluator } from './IEvaluator';
import { DeterministicChecker } from './DeterministicChecker';
import { LLMEvaluator } from './LLMEvaluator';
import { Submission } from '../models/Submission';
import { RubricCriteria } from '../models/Problem';
import { FeedbackReport, SolidViolation, StructuralFinding } from '../models/FeedbackReport';

export class EvaluationPipeline {
  private evaluators: IEvaluator[];

  constructor(evaluators?: IEvaluator[]) {
    this.evaluators = evaluators || [
      new DeterministicChecker(),
      new LLMEvaluator(),
    ];
  }

  async run(submission: Submission, rubric: RubricCriteria): Promise<FeedbackReport> {
    if (!submission || !submission.content || submission.content.trim().length === 0) {
      throw new Error('Malformed or empty submission content.');
    }

    let deterministicScore = 0;
    let qualitativeScore = 0;
    let evaluatorSource: 'HYBRID_LLM' | 'DETERMINISTIC_FALLBACK' = 'DETERMINISTIC_FALLBACK';
    
    const allFindings: StructuralFinding[] = [];
    const allSolidViolations: SolidViolation[] = [];
    const allStrengths: string[] = [];
    const allWeaknesses: string[] = [];
    const allSuggestions: string[] = [];
    let summaryText = '';

    for (const evaluator of this.evaluators) {
      try {
        const partial = await evaluator.evaluate(submission, rubric);

        if (partial.deterministicScore !== undefined) {
          deterministicScore = partial.deterministicScore;
        }

        if (partial.qualitativeScore !== undefined) {
          qualitativeScore = partial.qualitativeScore;
        }

        if (evaluator.name === 'LLMEvaluator' && partial.summary && !partial.summary.includes('Offline Fallback')) {
          evaluatorSource = 'HYBRID_LLM';
        }

        if (partial.summary) summaryText += (summaryText ? ' ' : '') + partial.summary;
        if (partial.structuralFindings) allFindings.push(...partial.structuralFindings);
        if (partial.solidViolations) allSolidViolations.push(...partial.solidViolations);
        if (partial.strengths) allStrengths.push(...partial.strengths);
        if (partial.weaknesses) allWeaknesses.push(...partial.weaknesses);
        if (partial.improvementSuggestions) allSuggestions.push(...partial.improvementSuggestions);
      } catch (err) {
        console.error(`Evaluator '${evaluator.name}' encountered an error:`, err);
        // Continue gracefully with other evaluators
      }
    }

    // Weighted Overall Score: 40% Deterministic + 60% Qualitative
    const overallScore = Math.round((deterministicScore * 0.4) + (qualitativeScore * 0.6));

    return new FeedbackReport({
      score: overallScore,
      deterministicScore,
      qualitativeScore,
      evaluatedAt: new Date().toISOString(),
      evaluatorSource,
      summary: summaryText || `Completed evaluation with an overall score of ${overallScore}/100.`,
      strengths: Array.from(new Set(allStrengths)),
      weaknesses: Array.from(new Set(allWeaknesses)),
      solidViolations: allSolidViolations,
      structuralFindings: allFindings,
      improvementSuggestions: Array.from(new Set(allSuggestions)),
      recommendedPatterns: rubric.recommendedPatterns,
    });
  }
}
