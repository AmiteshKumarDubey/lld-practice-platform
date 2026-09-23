/**
 * Application Service: AttemptService
 * Orchestrates practice attempts, submissions, async evaluation pipeline execution, retries, and history tracking.
 */

import { IAttemptRepository } from '../domain/repositories/IAttemptRepository';
import { IProblemRepository } from '../domain/repositories/IProblemRepository';
import { Attempt } from '../domain/models/Attempt';
import { Submission, SubmissionFormat } from '../domain/models/Submission';
import { EvaluationPipeline } from '../domain/evaluation/EvaluationPipeline';

export class AttemptService {
  private pipeline: EvaluationPipeline;

  constructor(
    private attemptRepo: IAttemptRepository,
    private problemRepo: IProblemRepository,
    pipeline?: EvaluationPipeline
  ) {
    this.pipeline = pipeline || new EvaluationPipeline();
  }

  async startAttempt(problemId: string): Promise<Attempt> {
    const problem = await this.problemRepo.findById(problemId);
    if (!problem) {
      throw new Error(`Problem with ID '${problemId}' not found.`);
    }

    const attemptId = 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const attempt = new Attempt({
      id: attemptId,
      problemId: problem.id,
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissions: [],
      feedbackReport: null,
      errorMessage: null,
    });

    await this.attemptRepo.save(attempt);
    return attempt;
  }

  async submitAttempt(attemptId: string, format: SubmissionFormat, content: string): Promise<Attempt> {
    const attempt = await this.attemptRepo.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID '${attemptId}' not found.`);
    }

    const problem = await this.problemRepo.findById(attempt.problemId);
    if (!problem) {
      throw new Error(`Problem associated with attempt '${attempt.problemId}' not found.`);
    }

    const version = attempt.submissions.length + 1;
    const submissionId = `sub_${attempt.id}_v${version}`;

    const submission = new Submission({
      id: submissionId,
      attemptId: attempt.id,
      version,
      format,
      content,
      submittedAt: new Date().toISOString(),
    });

    // Domain mutation
    attempt.addSubmission(submission);
    attempt.markEvaluating();
    await this.attemptRepo.save(attempt);

    // Trigger background evaluation
    this.executeEvaluationInBackground(attempt, submission, problem.rubric);

    return attempt;
  }

  async retryEvaluation(attemptId: string): Promise<Attempt> {
    const attempt = await this.attemptRepo.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID '${attemptId}' not found.`);
    }

    const latest = attempt.latestSubmission;
    if (!latest) {
      throw new Error(`Cannot retry evaluation: No submission found for attempt '${attemptId}'.`);
    }

    const problem = await this.problemRepo.findById(attempt.problemId);
    if (!problem) {
      throw new Error(`Problem associated with attempt '${attempt.problemId}' not found.`);
    }

    attempt.markEvaluating();
    await this.attemptRepo.save(attempt);

    this.executeEvaluationInBackground(attempt, latest, problem.rubric);

    return attempt;
  }

  async getAttempt(attemptId: string): Promise<Attempt | null> {
    return this.attemptRepo.findById(attemptId);
  }

  async getHistoryForProblem(problemId: string): Promise<Attempt[]> {
    return this.attemptRepo.findByProblemId(problemId);
  }

  private async executeEvaluationInBackground(attempt: Attempt, submission: Submission, rubric: any): Promise<void> {
    try {
      const report = await this.pipeline.run(submission, rubric);
      attempt.completeEvaluation(report);
      await this.attemptRepo.save(attempt);
    } catch (error: any) {
      console.error(`Evaluation failed for attempt ${attempt.id}:`, error);
      attempt.failEvaluation(error.message || 'Evaluation pipeline encountered an error.');
      await this.attemptRepo.save(attempt);
    }
  }
}
