// ============================================================
// IHintService — Port for AI hint generation service
// ============================================================

export interface IHintService {
  /**
   * Generates a conceptual hint for a problem description and user's current code
   */
  generateHint(problemDescription: string, userCode: string): Promise<string>;
}
