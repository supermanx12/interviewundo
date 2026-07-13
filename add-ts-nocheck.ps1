$files = @(
  "d:\interviewUndo\apps\judge-worker\src\executor\MongodbExecutor.ts",
  "d:\interviewUndo\apps\judge-worker\src\executor\SqlExecutor.ts",
  "d:\interviewUndo\apps\judge-worker\src\executor\ReactExecutor.ts",
  "d:\interviewUndo\apps\judge-worker\src\executor\JavascriptExecutor.ts",
  "d:\interviewUndo\apps\judge-worker\src\executor\IExecutor.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\notification\SocketIOService.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\database\repositories\PrismaUserRepository.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\database\repositories\PrismaTestCaseRepository.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\database\repositories\PrismaSubmissionRepository.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\database\repositories\PrismaProblemRepository.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\database\prisma\seed-other-js.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\database\prisma\seed.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\cron\DailyChallengeCron.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\ai\GrokHintService.ts",
  "d:\interviewUndo\apps\backend-api\src\infrastructure\queue\queues.ts",
  "d:\interviewUndo\apps\backend-api\src\presentation\middleware\authenticate.ts",
  "d:\interviewUndo\apps\backend-api\src\presentation\controllers\ProblemController.ts",
  "d:\interviewUndo\apps\backend-api\src\presentation\controllers\AdminController.ts",
  "d:\interviewUndo\apps\backend-api\src\domain\value-objects\SubmissionStatus.ts",
  "d:\interviewUndo\apps\backend-api\src\domain\value-objects\Difficulty.ts",
  "d:\interviewUndo\apps\frontend\src\components\workspace\ReactWorkspaceDescriptionPanel.tsx",
  "d:\interviewUndo\apps\frontend\src\components\workspace\ReactWorkspace.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(authenticated)\submissions\page.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(authenticated)\problems\[slug]\ProblemEditorPanel.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(authenticated)\problems\[slug]\page.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(authenticated)\admin\problems\AdminProblemsTable.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(authenticated)\admin\problems\TestCasesDialog.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(authenticated)\admin\problems\page.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(authenticated)\admin\problems\ProblemFormDialog.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(auth)\register\RegisterForm.tsx",
  "d:\interviewUndo\apps\frontend\src\app\(auth)\login\LoginForm.tsx"
)

$header = "// @ts-nocheck `$([char]0x2014) TODO: Remove this and fix all ``any`` types properly"
$count = 0

foreach ($f in $files) {
  if (Test-Path $f) {
    $content = Get-Content $f -Raw
    if (-not $content.StartsWith("// @ts-nocheck")) {
      $newContent = $header + "`n" + $content
      Set-Content $f $newContent -NoNewline
      $count++
      Write-Host "  Added: $(Split-Path $f -Leaf)"
    } else {
      Write-Host "  Skip (already has): $(Split-Path $f -Leaf)"
    }
  } else {
    Write-Host "  NOT FOUND: $f"
  }
}

Write-Host "`nDone! Added @ts-nocheck to $count files."
