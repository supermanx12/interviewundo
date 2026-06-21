// ============================================================
// IHintUsageRepository — Port for hint usage data access
// ============================================================

export interface IHintUsageRepository {
  /**
   * Counts the number of hints requested by a user for a specific problem today (UTC date).
   */
  countTodayUsage(userId: string, problemId: string): Promise<number>;

  /**
   * Creates a new hint usage record.
   */
  create(userId: string, problemId: string): Promise<void>;
}
