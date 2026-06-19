import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { router } from './presentation/routes';
import { errorHandler } from './presentation/middleware/error-handler';
import { requestId } from './presentation/middleware/request-id';

// ============================================================
// Express App Bootstrap
// ============================================================

const app = express();

// --- Global Middleware ---
app.use(requestId);
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  pinoHttp({
    logger,
    quietReqLogger: true,
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  }),
);

// --- Routes ---
app.use(router);

// --- Global Error Handler (must be last) ---
app.use(errorHandler);

export { app };
