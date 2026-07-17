import { Router } from 'express';
import { container } from '../../container';
import { validateRequest } from '../middleware/validate-request';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate';
import { ProblemFilterSchema } from '@interviewprep/shared-types';

const problemRoutes = Router();

// GET /api/problems
problemRoutes.get('/', validateRequest(ProblemFilterSchema, 'query'), (req, res, next) => {
  container.controllers.problemController.list(req, res, next);
});

// GET /api/problems/daily
problemRoutes.get('/daily', (req, res, next) => {
  container.controllers.problemController.getDaily(req, res, next);
});

// POST /api/problems/:slug/hint
problemRoutes.post('/:slug/hint', authenticate, (req, res, next) => {
  container.controllers.problemController.getHint(req, res, next);
});

// POST /api/problems/:slug/like
problemRoutes.post('/:slug/like', authenticate, (req, res, next) => {
  container.controllers.problemController.toggleLike(req, res, next);
});

// GET /api/problems/:slug/active
problemRoutes.get('/:slug/active', (req, res, next) => {
  container.controllers.problemController.getActiveSolvers(req, res, next);
});

// GET /api/problems/:slug
problemRoutes.get('/:slug', optionalAuthenticate, (req, res, next) => {
  container.controllers.problemController.getBySlug(req, res, next);
});

export { problemRoutes };
