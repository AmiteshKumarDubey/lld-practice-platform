import { Router } from 'express';
import { MemoryProblemRepository } from '../domain/repositories/MemoryProblemRepository';
import { SQLiteAttemptRepository } from '../domain/repositories/SQLiteAttemptRepository';
import { ProblemService } from '../services/ProblemService';
import { AttemptService } from '../services/AttemptService';
import { ProblemController } from '../controllers/ProblemController';
import { AttemptController } from '../controllers/AttemptController';

const router = Router();

// Dependency Injection Wiring
const problemRepo = new MemoryProblemRepository();
const attemptRepo = new SQLiteAttemptRepository();

const problemService = new ProblemService(problemRepo);
const attemptService = new AttemptService(attemptRepo, problemRepo);

const problemController = new ProblemController(problemService);
const attemptController = new AttemptController(attemptService);

// Problem Routes
router.get('/problems', problemController.getAllProblems);
router.get('/problems/:id', problemController.getProblemById);

// Attempt & Practice Routes
router.post('/attempts', attemptController.startAttempt);
router.get('/attempts/:id', attemptController.getAttemptStatus);
router.post('/attempts/:id/submit', attemptController.submitSolution);
router.post('/attempts/:id/retry-evaluation', attemptController.retryEvaluation);
router.get('/attempts/problem/:problemId', attemptController.getProblemHistory);

export default router;
