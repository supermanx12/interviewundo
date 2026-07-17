import type { IUseCase } from '../../interfaces/IUseCase';
import { prisma } from '../../../config/database';
import { NotFoundError } from '../../../domain/errors';

interface ToggleLikeInput {
  userId: string;
  slug: string;
}

interface ToggleLikeOutput {
  liked: boolean;
  likesCount: number;
}

export class ToggleProblemLike implements IUseCase<ToggleLikeInput, ToggleLikeOutput> {
  async execute(input: ToggleLikeInput): Promise<ToggleLikeOutput> {
    const { userId, slug } = input;

    // Find the problem first to get its ID and ensure it exists
    const problem = await prisma.problem.findUnique({
      where: { slug },
      select: { id: true, likesCount: true },
    });

    if (!problem) {
      throw new NotFoundError('Problem', slug);
    }

    const problemId = problem.id;

    // Perform inside an atomic transaction
    return prisma.$transaction(async (tx) => {
      // Check if user already liked the problem
      const existingLike = await tx.problemLike.findUnique({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
      });

      let liked = false;
      let newLikesCount = problem.likesCount;

      if (existingLike) {
        // Delete the like
        await tx.problemLike.delete({
          where: {
            id: existingLike.id,
          },
        });

        // Decrement likesCount
        const updated = await tx.problem.update({
          where: { id: problemId },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
          select: { likesCount: true },
        });

        liked = false;
        newLikesCount = updated.likesCount;
      } else {
        // Create the like
        await tx.problemLike.create({
          data: {
            userId,
            problemId,
          },
        });

        // Increment likesCount
        const updated = await tx.problem.update({
          where: { id: problemId },
          data: {
            likesCount: {
              increment: 1,
            },
          },
          select: { likesCount: true },
        });

        liked = true;
        newLikesCount = updated.likesCount;
      }

      return {
        liked,
        likesCount: newLikesCount,
      };
    });
  }
}
