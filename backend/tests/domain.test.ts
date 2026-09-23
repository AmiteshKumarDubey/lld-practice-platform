import { Problem } from '../src/domain/models/Problem';
import { Submission } from '../src/domain/models/Submission';
import { Attempt } from '../src/domain/models/Attempt';
import { FeedbackReport } from '../src/domain/models/FeedbackReport';
import { SAMPLE_PROBLEMS } from '../src/data/sampleProblems';

describe('Domain Models & State Lifecycle', () => {
  test('Problem entity initializes correctly from props', () => {
    const problem = new Problem(SAMPLE_PROBLEMS[0]);
    expect(problem.id).toBe('parking-lot');
    expect(problem.difficulty).toBe('MEDIUM');
    expect(problem.rubric.expectedClasses.length).toBeGreaterThan(0);
    expect(problem.getStarterTemplate('CODE_TS')).toBeDefined();
  });

  test('Submission entity throws error on empty content', () => {
    expect(() => {
      new Submission({
        id: 'sub_1',
        attemptId: 'att_1',
        version: 1,
        format: 'CODE_TS',
        content: '   ',
        submittedAt: new Date().toISOString(),
      });
    }).toThrow('Submission content cannot be empty.');
  });

  test('Attempt aggregate root enforces valid status transitions', () => {
    const attempt = new Attempt({
      id: 'att_100',
      problemId: 'parking-lot',
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissions: [],
    });

    expect(attempt.status).toBe('IN_PROGRESS');

    const sub = new Submission({
      id: 'sub_1',
      attemptId: 'att_100',
      version: 1,
      format: 'CODE_TS',
      content: 'class ParkingLot {}',
      submittedAt: new Date().toISOString(),
    });

    attempt.addSubmission(sub);
    expect(attempt.status).toBe('SUBMITTED');
    expect(attempt.submissions.length).toBe(1);

    attempt.markEvaluating();
    expect(attempt.status).toBe('EVALUATING');

    // Attempting to add submission while evaluating should throw
    expect(() => {
      attempt.addSubmission(sub);
    }).toThrow('Cannot add a new submission while evaluation is in progress.');

    const report = new FeedbackReport({
      score: 85,
      deterministicScore: 90,
      qualitativeScore: 80,
      evaluatedAt: new Date().toISOString(),
      evaluatorSource: 'DETERMINISTIC_FALLBACK',
      summary: 'Solid design',
      strengths: ['Clear classes'],
      weaknesses: [],
      solidViolations: [],
      structuralFindings: [],
      improvementSuggestions: [],
      recommendedPatterns: ['Strategy Pattern'],
    });

    attempt.completeEvaluation(report);
    expect(attempt.status).toBe('COMPLETED');
    expect(attempt.feedbackReport?.score).toBe(85);
  });
});
