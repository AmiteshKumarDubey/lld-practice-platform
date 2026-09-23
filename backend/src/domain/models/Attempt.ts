/**
 * Domain Model: Attempt
 * Aggregate Root managing an LLD practice attempt lifecycle, state transitions, and submission history.
 */

import { Submission, SubmissionProps } from './Submission';
import { FeedbackReport, FeedbackReportProps } from './FeedbackReport';

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'EVALUATION_FAILED';

export interface AttemptProps {
  id: string;
  problemId: string;
  status: AttemptStatus;
  createdAt: string;
  updatedAt: string;
  submissions: SubmissionProps[];
  feedbackReport?: FeedbackReportProps | null;
  errorMessage?: string | null;
}

export class Attempt {
  readonly id: string;
  readonly problemId: string;
  private _status: AttemptStatus;
  readonly createdAt: string;
  private _updatedAt: string;
  private _submissions: Submission[];
  private _feedbackReport: FeedbackReport | null;
  private _errorMessage: string | null;

  constructor(props: AttemptProps) {
    this.id = props.id;
    this.problemId = props.problemId;
    this._status = props.status;
    this.createdAt = props.createdAt || new Date().toISOString();
    this._updatedAt = props.updatedAt || new Date().toISOString();
    this._submissions = (props.submissions || []).map(s => s instanceof Submission ? s : new Submission(s));
    this._feedbackReport = props.feedbackReport ? (props.feedbackReport instanceof FeedbackReport ? props.feedbackReport : new FeedbackReport(props.feedbackReport)) : null;
    this._errorMessage = props.errorMessage || null;
  }

  get status(): AttemptStatus {
    return this._status;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  get submissions(): readonly Submission[] {
    return this._submissions;
  }

  get feedbackReport(): FeedbackReport | null {
    return this._feedbackReport;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  get latestSubmission(): Submission | null {
    if (this._submissions.length === 0) return null;
    return this._submissions[this._submissions.length - 1];
  }

  /**
   * Domain behavior: Add a new submission to this attempt
   */
  addSubmission(submission: Submission): void {
    if (this._status === 'EVALUATING') {
      throw new Error('Cannot add a new submission while evaluation is in progress.');
    }
    this._submissions.push(submission);
    this._status = 'SUBMITTED';
    this._errorMessage = null;
    this._touch();
  }

  /**
   * Domain behavior: Mark attempt as evaluating
   */
  markEvaluating(): void {
    if (this._submissions.length === 0) {
      throw new Error('Cannot evaluate an attempt without any submissions.');
    }
    this._status = 'EVALUATING';
    this._errorMessage = null;
    this._touch();
  }

  /**
   * Domain behavior: Complete evaluation with feedback report
   */
  completeEvaluation(report: FeedbackReport): void {
    this._status = 'COMPLETED';
    this._feedbackReport = report;
    this._errorMessage = null;
    this._touch();
  }

  /**
   * Domain behavior: Fail evaluation with error message
   */
  failEvaluation(errorMessage: string): void {
    this._status = 'EVALUATION_FAILED';
    this._errorMessage = errorMessage;
    this._touch();
  }

  private _touch(): void {
    this._updatedAt = new Date().toISOString();
  }

  toJSON(): AttemptProps {
    return {
      id: this.id,
      problemId: this.problemId,
      status: this._status,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
      submissions: this._submissions.map(s => s.toJSON()),
      feedbackReport: this._feedbackReport ? this._feedbackReport.toJSON() : null,
      errorMessage: this._errorMessage,
    };
  }
}
