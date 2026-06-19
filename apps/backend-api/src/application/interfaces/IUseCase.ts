// ============================================================
// IUseCase — Generic interface for all use cases
// Every use case implements this with specific Input/Output types
// ============================================================

export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
