-- CreateTable
CREATE TABLE "problem_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "problem_likes_problemId_idx" ON "problem_likes"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "problem_likes_userId_problemId_key" ON "problem_likes"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "problem_likes" ADD CONSTRAINT "problem_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_likes" ADD CONSTRAINT "problem_likes_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
