import { Router } from 'express';
import { container } from '../../container';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validate-request';
import { SubmitSolutionSchema, RunCodeSchema } from '@interviewprep/shared-types';

const submissionRoutes = Router();

// POST /api/submissions
submissionRoutes.post(
  '/',
  authenticate,
  validateRequest(SubmitSolutionSchema),
  (req, res, next) => {
    container.controllers.submissionController.submit(req, res, next);
  },
);

// POST /api/submissions/run
submissionRoutes.post('/run', authenticate, validateRequest(RunCodeSchema), (req, res, next) => {
  container.controllers.submissionController.run(req, res, next);
});

export { submissionRoutes };
