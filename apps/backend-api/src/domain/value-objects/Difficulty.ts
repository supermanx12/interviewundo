import { ValidationError } from '../errors/ValidationError';
import { Difficulty as DifficultyEnum } from '@interviewprep/shared-types';

export class Difficulty {
  private readonly value: DifficultyEnum;

  constructor(value: any) {
    if (!value) {
      throw new ValidationError('Difficulty is required');
    }
    if (!Object.values(DifficultyEnum).includes(value)) {
      throw new ValidationError(`Invalid difficulty: ${value}`);
    }
    this.value = value as DifficultyEnum;
  }

  public getValue(): DifficultyEnum {
    return this.value;
  }

  public equals(other: Difficulty): boolean {
    return this.value === other.getValue();
  }
}
