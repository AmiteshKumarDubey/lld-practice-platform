import { Request, Response } from 'express';
import { AttemptService } from '../services/AttemptService';

export class AttemptController {
  constructor(private attemptService: AttemptService) {}

  startAttempt = async (req: Request, res: Response): Promise<void> => {
    try {
      const { problemId } = req.body;
      if (!problemId) {
        res.status(400).json({ success: false, error: 'Missing required body field: problemId' });
        return;
      }
      const attempt = await this.attemptService.startAttempt(problemId);
      res.status(201).json({ success: true, data: attempt.toJSON() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  submitSolution = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { format, content } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        res.status(400).json({ success: false, error: 'Submission content cannot be empty.' });
        return;
      }

      const validFormats = ['CODE_TS', 'CODE_JAVA', 'CODE_PYTHON', 'TEXT', 'DIAGRAM_PLANTUML'];
      const submissionFormat = format && validFormats.includes(format) ? format : 'CODE_TS';

      const attempt = await this.attemptService.submitAttempt(id, submissionFormat, content);
      res.json({ success: true, data: attempt.toJSON() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  getAttemptStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const attempt = await this.attemptService.getAttempt(id);
      if (!attempt) {
        res.status(404).json({ success: false, error: `Attempt with ID '${id}' not found.` });
        return;
      }
      res.json({ success: true, data: attempt.toJSON() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  retryEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const attempt = await this.attemptService.retryEvaluation(id);
      res.json({ success: true, data: attempt.toJSON() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  getProblemHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { problemId } = req.params;
      const attempts = await this.attemptService.getHistoryForProblem(problemId);
      res.json({ success: true, data: attempts.map(a => a.toJSON()) });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
