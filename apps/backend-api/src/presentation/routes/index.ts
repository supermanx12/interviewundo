import { Router } from 'express';
import { healthRoutes } from './health.routes';

// ============================================================
// Route Aggregator
// All route modules are mounted here
// ============================================================

const router = Router();

// Health checks (no /api prefix)
router.use('/', healthRoutes);

// TODO: Add feature routes as they are built
// router.use('/api/auth', authRoutes);
// router.use('/api/problems', problemRoutes);
// router.use('/api/submissions', submissionRoutes);
// router.use('/api/dashboard', dashboardRoutes);
// router.use('/api/admin', adminRoutes);

export { router };
