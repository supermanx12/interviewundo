# Dashboard Feature Inventory and Delivery Plan

> Review scope: the deployed dashboard URL and the local repository implementation.
>
> The deployed page requires an authenticated session, so the public browser check reached the
> “Verifying your session…” boundary rather than exposing user-specific dashboard data. The feature
> inventory below is therefore based on the deployed route contract plus the source code in
> `apps/frontend` and `apps/backend-api`.

## 1. Product understanding

interviewUndo is a LeetCode-style technical interview preparation platform. The dashboard is
intended to be the user's progress command center. It should answer four questions quickly:

1. **What should I solve now?** — daily challenge, weekly goal, quick actions.
2. **How am I progressing?** — solved count, success rate, streak, difficulty and category progress.
3. **What have I done recently?** — recent submissions and activity heatmap.
4. **Am I becoming interview-ready?** — readiness score, strengths, achievements and next actions.

The current implementation has a strong visual shell and several real data-backed metrics, but it
also renders multiple placeholder sections as if they were real user analytics. The first priority
is to make every visible metric truthful and every dashboard link functional.

## 2. Feature inventory

Status meanings:

- **Implemented**: visible and backed by a working route/data source.
- **Partial**: visible, but incomplete, misleading, hard-coded, or missing important states.
- **Missing**: referenced by the UI or product concept but no complete implementation was found.

### 2.1 Dashboard shell and navigation

| Feature                       | Status      | Evidence / notes                                                                                                                |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Authenticated dashboard route | Implemented | `apps/frontend/src/app/(authenticated)/dashboard/page.tsx`                                                                      |
| Auth guard                    | Implemented | `apps/frontend/src/components/auth/AuthGuard.tsx`                                                                               |
| Welcome banner with user name | Implemented | Uses the authenticated user and links to `/problems`.                                                                           |
| Desktop/mobile navigation     | Partial     | Sidebar behavior is inconsistent across authenticated routes; desktop sidebar is conditionally rendered mainly for `/problems`. |
| Dashboard route title/header  | Implemented | Header includes streak, daily challenge, AI indicator, and theme controls.                                                      |
| Profile navigation            | Missing     | Sidebar links to `/profile`, but no matching frontend route was found.                                                          |
| AI Assistant navigation       | Missing     | Header/quick actions reference an AI assistant destination, but no complete route was found.                                    |
| Admin navigation              | Partial     | Admin link is conditional; admin experience should be verified separately for authorization and empty/error states.             |

### 2.2 Main progress metrics

| Feature                 | Status        | Evidence / notes                                                                                                                                         |
| ----------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Problems solved / total | Implemented   | `GET /api/dashboard/summary`; unique solved problems and published problem total.                                                                        |
| Success rate            | Implemented   | Accepted submissions divided by total submissions. Define whether retries and duplicate submissions should count.                                        |
| Active streak           | Implemented   | Uses user streak data and recalculates stale state. Needs timezone agreement.                                                                            |
| Total submissions       | Partial / bug | UI label exists, but it displays `Active` or `Get Started`; backend calculates `totalSubmissions` but does not return it.                                |
| Difficulty progress     | Implemented   | Easy, Medium, and Hard solved/total breakdown.                                                                                                           |
| Category progress       | Partial       | Real data exists, but category list is hard-coded to JavaScript, React, Node.js, and TypeScript. SQL and MongoDB are exposed elsewhere but omitted here. |
| Empty-state behavior    | Partial       | Loading and top-level error states exist; per-widget empty states are not consistently explicit.                                                         |

### 2.3 Learning workflow

| Feature                      | Status                | Evidence / notes                                                                                         |
| ---------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| Daily challenge banner       | Implemented           | Fetches `GET /api/problems/daily` and links to the problem slug.                                         |
| Daily challenge solve flow   | Partial               | The dashboard link works when a challenge exists, but a dedicated `/problems/daily` route was not found. |
| Random problem action        | Missing / broken link | Quick action references `/problems/random`; no matching route was found.                                 |
| Weekly goal                  | Partial / mock        | UI shows a goal of 10 and current progress of 2; values are hard-coded.                                  |
| Weekly goal problem list     | Missing / broken link | Links to `/problems?filter=weekly`, but the problems page does not appear to consume the filter.         |
| Daily filter in problem list | Partial / broken link | Links to `/problems?filter=daily`; query parameter is not wired into the problem-list behavior.          |
| Start solving CTA            | Implemented           | Routes to the problems page.                                                                             |
| Quick actions                | Partial               | The visual component exists, but several destinations are missing or not behaviorally connected.         |

### 2.4 Activity and submissions

| Feature                      | Status      | Evidence / notes                                                                                                  |
| ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Recent submissions           | Implemented | Summary includes recent submission records with problem, difficulty, status, and timestamp.                       |
| Submission status display    | Implemented | Recent activity renders verdict/status information. Verify all backend statuses have friendly labels.             |
| Submission detail navigation | Partial     | Confirm that each row links to a useful submission/problem detail view.                                           |
| View all submissions         | Partial     | There should be an explicit action to `/submissions`; the dashboard card currently lacks a clear “view all” flow. |
| Activity heatmap             | Implemented | Backend supplies date/count activity data over approximately one year.                                            |
| Heatmap accessibility        | Partial     | Hover-only detail is insufficient for keyboard and touch users; add labels and focusable cells.                   |
| Timezone correctness         | Partial     | Backend date grouping and frontend local-date construction may disagree near midnight.                            |
| Activity empty state         | Partial     | Add a useful first-action prompt instead of a blank chart.                                                        |

### 2.5 Readiness, strengths, and achievements

| Feature                            | Status         | Evidence / notes                                                                               |
| ---------------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| Interview readiness score          | Partial / mock | `InterviewReadiness.tsx` uses a hard-coded score of 78 and hard-coded component metrics.       |
| Strong topics                      | Partial / mock | `StrongTopics.tsx` uses static topic scores rather than user history.                          |
| Achievements                       | Partial / mock | `Achievements.tsx` contains static unlocked states and only a small fixed set of achievements. |
| Achievement rules                  | Missing        | No complete achievement model, evaluation service, persistence, or API contract was found.     |
| Readiness calculation              | Missing        | Need an agreed formula and a versioned backend calculation.                                    |
| Recommendations / next best action | Missing        | Dashboard should explain what the user should do next based on weak areas and goals.           |

## 3. Backend and API work required

### P0 — Correct misleading or broken behavior

1. **Return and render total submissions**
   - Add `totalSubmissions` to `UserStatsOutput` in `GetUserStats.ts`.
   - Add it to the shared dashboard response type.
   - Replace the `Active` / `Get Started` placeholder in the fourth stat card.
   - Add unit and route integration assertions.

2. **Make solved state user-specific**
   - The problem list currently infers solved state from global `solvedCount > 0`.
   - Add a user-specific solved indicator or a solved-problem ID set to the authenticated problem-list response.
   - Never show a problem as solved merely because another user solved it.

3. **Repair dashboard links and filters**
   - Implement or remove `/profile`, `/ai-assistant`, `/problems/random`, and `/problems/daily`.
   - Parse `filter=daily` and `filter=weekly` in the problems page, or replace those links with real API-backed actions.
   - Add a route-level test for each destination.

4. **Make failure handling local and recoverable**
   - Replace `window.location.reload()` with React Query `refetch`.
   - Give the daily challenge its own error state.
   - Preserve successful dashboard sections when one widget fails.
   - Add retry/backoff for a cold Render backend, with a clear “API is waking up” message.

### P1 — Establish trustworthy dashboard contracts

Create a versioned, typed dashboard contract in `packages/shared-types` rather than duplicating
interfaces in the page component. The summary should eventually contain:

```text
stats
  totalSolved
  totalProblems
  totalSubmissions
  acceptedSubmissions
  successRate
  currentStreak
  longestStreak
  difficultyBreakdown

categoryProgress[]
activity[]
recentSubmissions[]
weeklyGoal
interviewReadiness
strongTopics[]
achievements[]
recommendations[]
```

Do not add fields only to make the UI look complete. Define the calculation, ownership rules,
timezone behavior, and empty-state semantics for each field first.

### P1 — Implement real learning analytics

1. **Weekly goals**
   - Add a user goal model or user preferences model.
   - Store target, week start, progress source, and completion state.
   - Support a default goal for new users without confusing it with persisted user configuration.
   - Add goal editing and reset behavior.

2. **Strong and weak topics**
   - Define how topic accuracy is calculated from submissions.
   - Include a minimum-attempt threshold so one submission does not create a misleading score.
   - Return both strong topics and recommended topics to practice.

3. **Interview readiness**
   - Define a transparent first version, for example weighted inputs from:
     - solved coverage,
     - recent success rate,
     - difficulty mix,
     - consistency/streak,
     - category coverage,
     - recent activity.
   - Show the score breakdown and last-updated timestamp.
   - Version the formula so future changes do not silently rewrite historical expectations.

4. **Achievements**
   - Define achievement types and thresholds in a stable registry.
   - Persist unlock events or calculate them deterministically from user data.
   - Return progress toward locked achievements, not only a boolean.
   - Add a detail view explaining how each achievement was earned.

5. **Category consistency**
   - Use one canonical category enum from `shared-types`.
   - Include SQL and MongoDB if they are supported problem categories.
   - Avoid separate hard-coded lists in the frontend, use case, and repository.

## 4. Frontend work required

### P0 frontend checklist

- [ ] Display numeric total submissions.
- [ ] Remove or implement every broken navigation target.
- [ ] Wire daily and weekly filters to actual problem selection.
- [ ] Replace full-page reload retry with component-level retry.
- [ ] Add clear empty states for zero submissions, zero activity, and unavailable daily challenge.
- [ ] Add “View all submissions” to the recent submissions card.
- [ ] Ensure dashboard works on small screens without losing primary actions.

### P1 frontend checklist

- [ ] Replace static `InterviewReadiness` values with API data.
- [ ] Replace static `WeeklyGoal` values with API data and goal settings.
- [ ] Replace static `StrongTopics` values with API data.
- [ ] Replace static `Achievements` values with API data and progress.
- [ ] Add a “Recommended next problem” card based on the user’s weak topics.
- [ ] Add accessible labels to chart, heatmap, and progress-ring visualizations.
- [ ] Add keyboard/touch-friendly activity details instead of hover-only tooltips.
- [ ] Standardize sidebar/header behavior across all authenticated pages.
- [ ] Add stale/loading indicators when dashboard data is cached.

## 5. Delivery plan

### Phase 0 — Baseline and product decisions

**Goal:** agree on what the dashboard promises before adding more UI.

- Confirm canonical categories: JavaScript, React, Node.js, TypeScript, SQL, MongoDB.
- Define “success rate”: submission-level or problem-level, and whether duplicate attempts count.
- Define streak timezone and week boundary.
- Define weekly goal semantics and whether users can edit the goal.
- Define the first readiness formula and achievement rules.
- Capture the API contract in shared types.

**Exit criteria:** every visible dashboard section has a documented data owner and calculation.

### Phase 1 — Correctness and broken flows

**Goal:** remove misleading metrics and dead ends.

- Fix total submissions.
- Fix user-specific solved state.
- Repair/remove broken links.
- Wire daily/weekly filters.
- Add local retry and per-widget error states.
- Add P0 backend/frontend tests.

**Exit criteria:** a new user can navigate every dashboard action without hitting a missing route,
and all displayed numbers come from the authenticated user’s data.

### Phase 2 — Real goals and analytics

**Goal:** turn static dashboard cards into useful personalized feedback.

- Implement weekly goal persistence and progress.
- Implement strong/weak topic aggregation.
- Implement category progress for every supported category.
- Implement the first readiness score with a visible breakdown.
- Add dashboard recommendations.

**Exit criteria:** two users with different submission histories see different, explainable
dashboard analytics.

### Phase 3 — Achievements and polish

**Goal:** improve retention without sacrificing trust.

- Implement achievement registry, progress, unlock events, and details.
- Add celebratory but accessible unlock feedback.
- Add submission and activity drill-downs.
- Improve responsive layout, loading states, and accessibility.

**Exit criteria:** analytics, achievements, and actions are usable by keyboard, touch, and screen
reader users, and are covered by regression tests.

### Phase 4 — Reliability and operations

**Goal:** make the dashboard dependable on the current Vercel + Render deployment.

- Add backend request timeout and bounded retry behavior.
- Add Render `/health` monitoring and a clear cold-start experience.
- Monitor API latency, error rate, submission execution time, and memory usage.
- Move untrusted code execution out of the API process before production scale.
- Add rate limits and abuse protection around submissions and AI hints.

**Exit criteria:** a sleeping/restarting Render backend produces a recoverable user experience and
does not duplicate submissions.

## 6. Testing plan

### Backend

- Unit tests for every analytics calculation.
- Integration tests for authenticated dashboard summary responses.
- Tests for users with no submissions and no activity.
- Tests for category totals including SQL and MongoDB.
- Tests for timezone boundaries and week boundaries.
- Tests that one user cannot see another user’s solved state or submissions.
- Tests for invalid/capped `limit` query parameters.

### Frontend

- Dashboard loading, success, empty, and error states.
- Retry behavior without a full page reload.
- Daily challenge unavailable/error state.
- Correct display of total submissions.
- User-specific problem solved badges.
- Working navigation for every quick action.
- Responsive layout and keyboard accessibility.

### End-to-end

1. Register or sign in.
2. Open dashboard.
3. Verify initial empty state.
4. Open a problem and submit a solution.
5. Verify recent submissions, solved count, success rate, activity, and streak update.
6. Verify daily/weekly actions.
7. Verify a second user does not inherit the first user’s solved status.

## 7. Recommended product improvements

### Make the dashboard action-oriented

The dashboard should end each section with a next step. Examples:

- “Solve an Easy JavaScript problem to start your streak.”
- “Practice SQL: you are strongest in JavaScript but have no SQL attempts.”
- “Complete 2 more problems to reach this week’s goal.”

### Show confidence, not just a score

Readiness should display the factors behind the score and the number of recent attempts used.
Avoid presenting a precise score when the user has insufficient data; show “Not enough data yet”
with a clear action instead.

### Separate global content from personal progress

Global problem statistics such as total attempts and acceptance rate are useful, but they must be
visually distinct from user-specific solved/progress state.

### Optimize for cold starts and partial failures

The Render free tier can sleep after inactivity. The dashboard should render cached or static shell
content immediately, then load each data card independently. A slow API should not blank the entire
dashboard.

### Protect execution resources

The current backend combines HTTP, Socket.IO, and code execution in one process. For a demo this is
simple, but for production it creates a noisy-neighbor risk. A separate isolated execution worker
with strict CPU, memory, timeout, and network controls is the safer long-term design.

## 8. Highest-impact first sprint

If only one sprint is available, implement these in order:

1. Fix total submissions.
2. Fix user-specific solved state.
3. Remove or repair broken dashboard links.
4. Wire daily/weekly filters.
5. Replace reload-based retry with bounded retry/refetch.
6. Add empty/error states for every card.
7. Add shared dashboard types and integration tests.
8. Only then replace the mock readiness, goals, topics, and achievements with real APIs.
