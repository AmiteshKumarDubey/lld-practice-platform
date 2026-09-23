/**
 * Domain Model: Problem
 * Represents an LLD Problem statement, requirements, evaluation rubrics, and starter code templates.
 */

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
  format: 'CODE_TS' | 'CODE_JAVA' | 'CODE_PYTHON' | 'TEXT' | 'DIAGRAM_PLANTUML';
  code: string;
}

export interface ProblemProps {
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

export class Problem {
  readonly id: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly fullDescription: string;
  readonly difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  readonly category: string;
  readonly tags: string[];
  readonly requirements: string[];
  readonly rubric: RubricCriteria;
  readonly templates: Record<string, StarterTemplate>;

  constructor(props: ProblemProps) {
    this.id = props.id;
    this.title = props.title;
    this.shortDescription = props.shortDescription;
    this.fullDescription = props.fullDescription;
    this.difficulty = props.difficulty;
    this.category = props.category;
    this.tags = props.tags;
    this.requirements = props.requirements;
    this.rubric = props.rubric;
    this.templates = props.templates;
  }

  getStarterTemplate(format: string): StarterTemplate | undefined {
    return this.templates[format] || Object.values(this.templates)[0];
  }

  toJSON(): ProblemProps {
    return {
      id: this.id,
      title: this.title,
      shortDescription: this.shortDescription,
      fullDescription: this.fullDescription,
      difficulty: this.difficulty,
      category: this.category,
      tags: [...this.tags],
      requirements: [...this.requirements],
      rubric: this.rubric,
      templates: this.templates,
    };
  }
}
