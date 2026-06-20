export class TestCase {
  constructor(
    public readonly id: string,
    public readonly problemId: string,
    public input: string,
    public expectedOutput: string,
    public isHidden: boolean = false,
    public order: number = 0,
    public readonly createdAt: Date = new Date(),
  ) {}
}
