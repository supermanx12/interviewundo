// ============================================================
// DomainError — Base class for all domain errors
// The presentation layer maps these to HTTP status codes
// ============================================================

export abstract class DomainError extends Error {
  public readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;

    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
