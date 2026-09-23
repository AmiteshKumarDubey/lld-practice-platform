import { DeterministicChecker } from '../src/domain/evaluation/DeterministicChecker';
import { MockLLMEvaluator } from '../src/domain/evaluation/MockLLMEvaluator';
import { EvaluationPipeline } from '../src/domain/evaluation/EvaluationPipeline';
import { Submission } from '../src/domain/models/Submission';
import { SAMPLE_PROBLEMS } from '../src/data/sampleProblems';

describe('Evaluation Engine & Pipeline', () => {
  const parkingLotRubric = SAMPLE_PROBLEMS[0].rubric; // Parking Lot rubric
  const elevatorRubric = SAMPLE_PROBLEMS[1].rubric; // Elevator rubric

  test('DeterministicChecker detects expected classes and methods across Java & TS', async () => {
    const checker = new DeterministicChecker();
    const submission = new Submission({
      id: 'sub_elevator_java',
      attemptId: 'att_test',
      version: 1,
      format: 'CODE_JAVA',
      content: `
        public enum ElevatorState { IDLE, MOVING_UP, MOVING_DOWN, MAINTENANCE }
        public enum Direction { UP, DOWN, NONE }
        public interface IDispatchStrategy {
          ElevatorCar selectElevator();
        }
        public class ElevatorCar {
          public void moveToFloor(int floor) {}
        }
        public class ElevatorController {
          public void requestElevator(int floor) {}
        }
      `,
      submittedAt: new Date().toISOString(),
    });

    const result = await checker.evaluate(submission, elevatorRubric);
    expect(result.deterministicScore).toBeGreaterThanOrEqual(80);
    expect(result.structuralFindings).toBeDefined();

    const missing = result.structuralFindings?.filter(f => f.status === 'MISSING');
    expect(missing?.length).toBe(0);
  });

  test('MockLLMEvaluator generates dynamic score: Low for minimal code, High for rich code', async () => {
    const mockEvaluator = new MockLLMEvaluator();
    
    // Minimal bad submission
    const badSubmission = new Submission({
      id: 'sub_bad',
      attemptId: 'att_test',
      version: 1,
      format: 'CODE_JAVA',
      content: 'class Elevator {}',
      submittedAt: new Date().toISOString(),
    });

    const badResult = await mockEvaluator.evaluate(badSubmission, elevatorRubric);
    expect(badResult.qualitativeScore).toBeLessThanOrEqual(35);
    expect(badResult.summary).toContain('incomplete or contains minimal code');

    // Rich submission
    const richSubmission = new Submission({
      id: 'sub_rich',
      attemptId: 'att_test',
      version: 1,
      format: 'CODE_TS',
      content: `
        export enum ElevatorState { IDLE, MOVING_UP }
        export enum Direction { UP, DOWN }
        export interface IDispatchStrategy { selectElevator(): ElevatorCar; }
        export class NearestCarStrategy implements IDispatchStrategy { selectElevator() { return new ElevatorCar('1'); } }
        export class ElevatorCar { moveToFloor(f: number) {} }
        export class ElevatorController { requestElevator(f: number) {} }
      `,
      submittedAt: new Date().toISOString(),
    });

    const richResult = await mockEvaluator.evaluate(richSubmission, elevatorRubric);
    expect(richResult.qualitativeScore).toBeGreaterThanOrEqual(75);
  });

  test('MockLLMEvaluator does NOT output duplicate "Pattern pattern" wording', async () => {
    const mockEvaluator = new MockLLMEvaluator();
    const submission = new Submission({
      id: 'sub_test',
      attemptId: 'att_test',
      version: 1,
      format: 'CODE_TS',
      content: 'class Solution {}',
      submittedAt: new Date().toISOString(),
    });

    const result = await mockEvaluator.evaluate(submission, parkingLotRubric);
    const textCombined = JSON.stringify(result);
    expect(textCombined).not.toContain('Pattern pattern');
    expect(textCombined).not.toContain('pattern pattern');
  });

  test('EvaluationPipeline orchestrates full report and handles score weighting', async () => {
    const pipeline = new EvaluationPipeline();
    const submission = new Submission({
      id: 'sub_test',
      attemptId: 'att_test',
      version: 1,
      format: 'CODE_TS',
      content: `
        export enum ElevatorState { IDLE }
        export enum Direction { UP }
        export interface IDispatchStrategy { selectElevator(): void; }
        export class ElevatorCar { moveToFloor() {} }
        export class ElevatorController { requestElevator() {} }
      `,
      submittedAt: new Date().toISOString(),
    });

    const report = await pipeline.run(submission, elevatorRubric);
    expect(report.score).toBeGreaterThanOrEqual(70);
    expect(report.score).toBeLessThanOrEqual(100);
    expect(report.deterministicScore).toBeGreaterThanOrEqual(80);
  });
});
