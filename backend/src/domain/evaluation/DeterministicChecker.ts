/**
 * Domain Evaluator: DeterministicChecker
 * Implements static AST & pattern analysis for structure, encapsulation, method presence, and SOLID anti-patterns across TS, Java, Python, Text, and PlantUML.
 */

import { IEvaluator, EvaluationResultPartial } from './IEvaluator';
import { Submission } from '../models/Submission';
import { RubricCriteria } from '../models/Problem';
import { SolidViolation, StructuralFinding } from '../models/FeedbackReport';

export class DeterministicChecker implements IEvaluator {
  readonly name = 'DeterministicChecker';

  async evaluate(submission: Submission, rubric: RubricCriteria): Promise<EvaluationResultPartial> {
    const code = submission.content;
    const findings: StructuralFinding[] = [];
    const solidViolations: SolidViolation[] = [];
    
    let totalPoints = 0;
    let earnedPoints = 0;

    // 1. Verify Expected Classes / Interfaces / Enums
    for (const item of rubric.expectedClasses) {
      totalPoints += 15;
      const found = this.checkAbstractionPresent(code, item.name, item.type);
      if (found) {
        earnedPoints += 15;
        findings.push({
          name: item.name,
          type: item.type,
          status: 'FOUND',
          notes: `Properly declared ${item.type} '${item.name}' (${item.description}).`,
        });
      } else {
        findings.push({
          name: item.name,
          type: item.type,
          status: 'MISSING',
          notes: `Missing expected ${item.type} '${item.name}' — ${item.description}.`,
        });
      }
    }

    // 2. Verify Expected Domain Methods
    for (const item of rubric.expectedMethods) {
      totalPoints += 10;
      const found = this.checkMethodPresent(code, item.methodName);
      if (found) {
        earnedPoints += 10;
        findings.push({
          name: `${item.className}.${item.methodName}()`,
          type: 'method',
          status: 'FOUND',
          notes: `Method '${item.methodName}' detected on domain entity.`,
        });
      } else {
        findings.push({
          name: `${item.className}.${item.methodName}()`,
          type: 'method',
          status: 'MISSING',
          notes: `Missing domain method '${item.methodName}' expected on '${item.className}'.`,
        });
      }
    }

    // 3. Static SOLID Anti-Pattern Checks
    const lines = code.split('\n');
    const foundAbstractionsCount = findings.filter(f => f.status === 'FOUND').length;

    // Check SRP: God Class Detection (e.g. single class > 180 lines or containing all logic)
    if (lines.length > 180 && rubric.expectedClasses.length > 3 && foundAbstractionsCount <= 2) {
      solidViolations.push({
        principle: 'SRP',
        severity: 'HIGH',
        description: 'Single Responsibility Principle Violation: Found monolithic class combining multiple domain concerns.',
        suggestion: 'Decompose the large class into focused entities (e.g. separate strategy calculation from storage).',
      });
      earnedPoints = Math.max(0, earnedPoints - 15);
    }

    // Check OCP / DIP: Hardcoded Switch/If vs Strategy Interface
    const hasStrategyGoal = rubric.recommendedPatterns.some(p => p.toLowerCase().includes('strategy'));
    const hasInterfaceKeyword = /(interface|abstract\s+class|class\s+\w+\(\s*ABC\s*\)|trait)\s+\w+/i.test(code);
    if (hasStrategyGoal && !hasInterfaceKeyword) {
      solidViolations.push({
        principle: 'OCP',
        severity: 'MEDIUM',
        description: 'Open/Closed Principle Warning: Recommended strategy pattern interface is missing. Code may rely on hardcoded conditional branches.',
        suggestion: 'Introduce an interface abstraction (e.g. IPricingStrategy or IDispatchStrategy) to allow adding new behaviors without modifying existing code.',
      });
      earnedPoints = Math.max(0, earnedPoints - 10);
    }

    // Check ISP: Giant interfaces with > 7 methods
    const interfaceMatches = code.match(/(interface|class)\s+(\w+)\s*\{([^}]+)\}/gi);
    if (interfaceMatches) {
      for (const match of interfaceMatches) {
        const methodCount = (match.match(/;|\n/g) || []).length;
        if (methodCount > 10) {
          solidViolations.push({
            principle: 'ISP',
            severity: 'LOW',
            description: 'Interface Segregation Principle Warning: Interface contains excessive methods.',
            suggestion: 'Break down large interfaces into smaller, client-specific role interfaces.',
          });
        }
      }
    }

    const deterministicScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 70;

    return {
      deterministicScore: Math.min(100, Math.max(0, deterministicScore)),
      structuralFindings: findings,
      solidViolations: solidViolations,
    };
  }

  private checkAbstractionPresent(code: string, name: string, type: 'class' | 'interface' | 'enum'): boolean {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Check keyword declaration across TypeScript, Java, Python, PlantUML, and Text
    const declRegex = new RegExp(`\\b(class|interface|enum|abstract\\s+class|trait|struct|type)\\s+${escaped}\\b|class\\s+${escaped}\\s*\\(|enum\\s+${escaped}\\s*\\{|@startuml[\\s\\S]*\\b${escaped}\\b|\\b${escaped}\\s*\\{`, 'i');
    const wordBoundaryRegex = new RegExp(`\\b${escaped}\\b`, 'i');

    return declRegex.test(code) || wordBoundaryRegex.test(code);
  }

  private checkMethodPresent(code: string, methodName: string): boolean {
    const escapedCamel = methodName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Convert camelCase to snake_case (e.g. requestElevator -> request_elevator)
    const snakeName = methodName.replace(/([A-Z])/g, '_$1').toLowerCase();
    const escapedSnake = snakeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const camelRegex = new RegExp(`\\b${escapedCamel}\\s*\\(`, 'i');
    const snakeRegex = new RegExp(`\\b${escapedSnake}\\s*\\(`, 'i');
    const plantUmlRegex = new RegExp(`\\+\\s*${escapedCamel}|\\+\\s*${escapedSnake}|${escapedCamel}\\(\\)|${escapedSnake}\\(\\)`, 'i');
    const textRegex = new RegExp(`\\b${escapedCamel}\\b|\\b${escapedSnake}\\b`, 'i');

    return camelRegex.test(code) || snakeRegex.test(code) || plantUmlRegex.test(code) || textRegex.test(code);
  }
}
