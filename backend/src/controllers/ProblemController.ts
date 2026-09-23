import { Request, Response } from 'express';
import { ProblemService } from '../services/ProblemService';

export class ProblemController {
  constructor(private problemService: ProblemService) {}

  getAllProblems = async (req: Request, res: Response): Promise<void> => {
    try {
      const problems = await this.problemService.getAllProblems();
      res.json({ success: true, data: problems.map(p => p.toJSON()) });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  getProblemById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const problem = await this.problemService.getProblemById(id);
      if (!problem) {
        res.status(404).json({ success: false, error: `Problem with ID '${id}' not found.` });
        return;
      }
      res.json({ success: true, data: problem.toJSON() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
