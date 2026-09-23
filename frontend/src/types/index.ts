export type SubmissionFormat = 'CODE_TS' | 'CODE_JAVA' | 'CODE_PYTHON' | 'TEXT' | 'DIAGRAM_PLANTUML';

export interface RequiredAbstraction {
  name: string;
  type: 'class' | 'interface' | 'enum';
  description: string;
}

export interface RequiredMethod {
  className: string;
  methodName: string;
  description: string;
}

export interface RubricCriteria {
  expectedClasses: RequiredAbstraction[];
  expectedMethods: RequiredMethod[];
  recommendedPatterns: string[];
  keyDesignGoals: string[];
  commonAntiPatterns: string[];
}

export interface StarterTemplate {
  format: SubmissionFormat;
  code: string;
}

export interface Problem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  tags: string[];
  requirements: string[];
  rubric: RubricCriteria;
  templates: Record<string, StarterTemplate>;
}

export interface Submission {
  id: string;
  attemptId: string;
  version: number;
  format: SubmissionFormat;
  content: string;
  submittedAt: string;
}

export interface SolidViolation {
  principle: 'SRP' | 'OCP' | 'LSP' | 'ISP' | 'DIP';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  suggestion: string;
}

export interface StructuralFinding {
  name: string;
  type: 'class' | 'interface' | 'enum' | 'method';
  status: 'FOUND' | 'MISSING' | 'MALFORMED';
  notes: string;
}

export interface FeedbackReport {
  score: number;
  deterministicScore: number;
  qualitativeScore: number;
  evaluatedAt: string;
  evaluatorSource: 'HYBRID_LLM' | 'DETERMINISTIC_FALLBACK';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  solidViolations: SolidViolation[];
  structuralFindings: StructuralFinding[];
  improvementSuggestions: string[];
  recommendedPatterns: string[];
}

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'EVALUATION_FAILED';

export interface Attempt {
  id: string;
  problemId: string;
  status: AttemptStatus;
  createdAt: string;
  updatedAt: string;
  submissions: Submission[];
  feedbackReport?: FeedbackReport | null;
  errorMessage?: string | null;
}
