// ============================================================
// API Response Types — Consistent response format
// ============================================================

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  requestId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================
// Error Codes
// ============================================================

export enum ErrorCode {
  // Auth
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Resources
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Rate Limiting
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',

  // Submission
  EXECUTION_TIMEOUT = 'EXECUTION_TIMEOUT',
  EXECUTION_ERROR = 'EXECUTION_ERROR',
}
