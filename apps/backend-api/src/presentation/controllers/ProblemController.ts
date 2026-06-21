import { Request, Response, NextFunction } from 'express';
import type { GetProblems } from '../../application/use-cases/problem/GetProblems';
import type { GetProblemBySlug } from '../../application/use-cases/problem/GetProblemBySlug';
import type { GetDailyChallenge } from '../../application/use-cases/problem/GetDailyChallenge';

export class ProblemController {
  constructor(
    private readonly getProblems: GetProblems,
    private readonly getProblemBySlug: GetProblemBySlug,
    private readonly getDailyChallenge: GetDailyChallenge,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // The req.query is validated and coerced in the router via validateRequest
      const result = await this.getProblems.execute(req.query as any);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = req.params.slug as string;
      const problem = await this.getProblemBySlug.execute(slug);

      res.status(200).json({
        success: true,
        data: problem,
      });
    } catch (error) {
      next(error);
    }
  };

  getDaily = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const problem = await this.getDailyChallenge.execute();

      res.status(200).json({
        success: true,
        data: problem,
      });
    } catch (error) {
      next(error);
    }
  };
}
