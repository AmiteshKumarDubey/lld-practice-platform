/**
 * Domain Model: Submission
 * Value object representing a candidate solution submission for an LLD attempt.
 */

export type SubmissionFormat = 'CODE_TS' | 'CODE_JAVA' | 'CODE_PYTHON' | 'TEXT' | 'DIAGRAM_PLANTUML';

export interface SubmissionProps {
  id: string;
  attemptId: string;
  version: number;
  format: SubmissionFormat;
  content: string;
  submittedAt: string;
}

export class Submission {
  readonly id: string;
  readonly attemptId: string;
  readonly version: number;
  readonly format: SubmissionFormat;
  readonly content: string;
  readonly submittedAt: string;

  constructor(props: SubmissionProps) {
    if (!props.content || props.content.trim().length === 0) {
      throw new Error('Submission content cannot be empty.');
    }
    this.id = props.id;
    this.attemptId = props.attemptId;
    this.version = props.version;
    this.format = props.format;
    this.content = props.content;
    this.submittedAt = props.submittedAt || new Date().toISOString();
  }

  toJSON(): SubmissionProps {
    return {
      id: this.id,
      attemptId: this.attemptId,
      version: this.version,
      format: this.format,
      content: this.content,
      submittedAt: this.submittedAt,
    };
  }
}
