import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

// ============================================================
// Prisma v7 Configuration
// Connection URL moved here from schema.prisma
// See: https://pris.ly/d/config-datasource
// ============================================================

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'src', 'infrastructure', 'database', 'prisma', 'schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
});
