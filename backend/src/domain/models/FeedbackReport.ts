/**
 * Domain Model: FeedbackReport
 * Value object encapsulating detailed evaluation feedback for an attempt submission.
 */

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

export interface FeedbackReportProps {
  score: number; // 0 to 100
  deterministicScore: number; // 0 to 100
  qualitativeScore: number; // 0 to 100
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

export class FeedbackReport {
  readonly score: number;
  readonly deterministicScore: number;
  readonly qualitativeScore: number;
  readonly evaluatedAt: string;
  readonly evaluatorSource: 'HYBRID_LLM' | 'DETERMINISTIC_FALLBACK';
  readonly summary: string;
  readonly strengths: string[];
  readonly weaknesses: string[];
  readonly solidViolations: SolidViolation[];
  readonly structuralFindings: StructuralFinding[];
  readonly improvementSuggestions: string[];
  readonly recommendedPatterns: string[];

  constructor(props: FeedbackReportProps) {
    this.score = Math.max(0, Math.min(100, Math.round(props.score)));
    this.deterministicScore = Math.max(0, Math.min(100, Math.round(props.deterministicScore)));
    this.qualitativeScore = Math.max(0, Math.min(100, Math.round(props.qualitativeScore)));
    this.evaluatedAt = props.evaluatedAt || new Date().toISOString();
    this.evaluatorSource = props.evaluatorSource;
    this.summary = props.summary;
    this.strengths = props.strengths;
    this.weaknesses = props.weaknesses;
    this.solidViolations = props.solidViolations;
    this.structuralFindings = props.structuralFindings;
    this.improvementSuggestions = props.improvementSuggestions;
    this.recommendedPatterns = props.recommendedPatterns;
  }

  toJSON(): FeedbackReportProps {
    return {
      score: this.score,
      deterministicScore: this.deterministicScore,
      qualitativeScore: this.qualitativeScore,
      evaluatedAt: this.evaluatedAt,
      evaluatorSource: this.evaluatorSource,
      summary: this.summary,
      strengths: [...this.strengths],
      weaknesses: [...this.weaknesses],
      solidViolations: [...this.solidViolations],
      structuralFindings: [...this.structuralFindings],
      improvementSuggestions: [...this.improvementSuggestions],
      recommendedPatterns: [...this.recommendedPatterns],
    };
  }
}
