/**
 * Domain Evaluator: MockLLMEvaluator
 * Smart dynamic qualitative evaluator fallback providing realistic design critiques and scoring offline.
 */

import { IEvaluator, EvaluationResultPartial } from './IEvaluator';
import { Submission } from '../models/Submission';
import { RubricCriteria } from '../models/Problem';

export class MockLLMEvaluator implements IEvaluator {
  readonly name = 'MockLLMEvaluator';

  async evaluate(submission: Submission, rubric: RubricCriteria): Promise<EvaluationResultPartial> {
    const rawContent = submission.content.trim();
    const contentLower = rawContent.toLowerCase();
    const lines = rawContent.split('\n').filter(l => l.trim().length > 0);

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const improvementSuggestions: string[] = [];
    const recommendedPatterns: string[] = [...rubric.recommendedPatterns];

    // Helper to format pattern name without "Pattern pattern" duplication
    const formatPatternName = (p: string) => {
      const clean = p.replace(/\s*pattern$/i, '').trim();
      return `the ${clean} Pattern`;
    };

    // 1. Evaluate Minimal / Bad Submission Edge Case
    if (rawContent.length < 50 || lines.length <= 3) {
      const qualitativeScore = Math.min(35, Math.max(15, Math.round(rawContent.length * 0.6)));

      return {
        qualitativeScore,
        summary: `The submission is incomplete or contains minimal code (${lines.length} lines, ${rawContent.length} chars). It earned a qualitative rating of ${qualitativeScore}/100. Key abstractions and design pattern implementations are missing.`,
        strengths: ['Provided initial submission placeholder.'],
        weaknesses: [
          'Submission is incomplete and lacks full class declarations.',
          'Missing interface abstractions and behavioral design patterns.',
          'No method implementations or domain relationships defined.'
        ],
        improvementSuggestions: [
          `Draft complete class declarations for expected domain entities (${rubric.expectedClasses.map(c => c.name).join(', ')}).`,
          `Introduce interface abstractions such as ${formatPatternName(rubric.recommendedPatterns[0] || 'Strategy')}.`,
          'Add method signatures to handle core domain logic.'
        ],
        recommendedPatterns,
      };
    }

    // 2. Comprehensive Quality Evaluation
    let qualitativeScore = 60; // Dynamic base for non-trivial submissions

    // Check pattern adoption
    for (const pattern of rubric.recommendedPatterns) {
      const cleanName = pattern.replace(/\s*pattern$/i, '').trim().toLowerCase();
      if (contentLower.includes(cleanName)) {
        strengths.push(`Good architectural choice: Applied ${formatPatternName(pattern)} effectively.`);
        qualitativeScore += 8;
      } else {
        weaknesses.push(`Consider using ${formatPatternName(pattern)} to decouple key domain responsibilities.`);
        improvementSuggestions.push(`Refactor class relationships to incorporate ${formatPatternName(pattern)}.`);
      }
    }

    // Check design goal coverage
    for (const goal of rubric.keyDesignGoals) {
      const keyword = goal.split(' ')[0].toLowerCase();
      if (contentLower.includes(keyword)) {
        strengths.push(`Addressed core design goal: ${goal}.`);
        qualitativeScore += 5;
      } else {
        weaknesses.push(`Missing explicit design consideration for: ${goal}.`);
        improvementSuggestions.push(`Ensure the design explicitly details ${goal}.`);
      }
    }

    // Check class presence depth
    const declaredClassesCount = rubric.expectedClasses.filter(c => contentLower.includes(c.name.toLowerCase())).length;
    if (declaredClassesCount >= Math.ceil(rubric.expectedClasses.length * 0.75)) {
      qualitativeScore += 7;
      strengths.push(`Well-structured domain model containing ${declaredClassesCount} key entities.`);
    } else {
      weaknesses.push(`Only ${declaredClassesCount}/${rubric.expectedClasses.length} expected domain entities were declared.`);
    }

    // Normalize qualitative score between 35 and 95
    qualitativeScore = Math.min(95, Math.max(35, Math.round(qualitativeScore)));

    // Default fallbacks if strengths/suggestions are sparse
    if (strengths.length === 0) {
      strengths.push('Provided structured initial class definitions with basic domain boundaries.');
    }
    if (improvementSuggestions.length === 0) {
      improvementSuggestions.push('Add unit test interface mocks for dependency injection.');
      improvementSuggestions.push('Consider concurrency controls (e.g. thread-safe queues or atomic variables).');
    }

    const summary = `The design demonstrates a ${qualitativeScore >= 80 ? 'strong' : qualitativeScore >= 60 ? 'good' : 'basic'} understanding of domain boundaries for this problem. ` +
      `The submission earned a qualitative design rating of ${qualitativeScore}/100. ` +
      `Key recommendations focus on refining pattern abstractions and covering edge cases cleanly.`;

    return {
      qualitativeScore,
      summary,
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4),
      improvementSuggestions: improvementSuggestions.slice(0, 4),
      recommendedPatterns,
    };
  }
}
