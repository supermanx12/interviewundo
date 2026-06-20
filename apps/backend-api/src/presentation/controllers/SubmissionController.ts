import { Request, Response, NextFunction } from 'express';
import type { SubmitSolution } from '../../application/use-cases/submission/SubmitSolution';
import type { RunCode } from '../../application/use-cases/submission/RunCode';

export class SubmissionController {
  constructor(
    private readonly submitSolution: SubmitSolution,
    private readonly runCode: RunCode,
  ) {}

  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // The request body is validated by validateRequest middleware before reaching here
      const submission = await this.submitSolution.execute({
        userId,
        problemId: req.body.problemId,
        code: req.body.code,
        language: req.body.language,
      });

      res.status(201).json({
        success: true,
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  };

  run = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // The request body is validated by validateRequest middleware before reaching here
      const result = await this.runCode.execute({
        userId,
        problemId: req.body.problemId,
        code: req.body.code,
        language: req.body.language,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
