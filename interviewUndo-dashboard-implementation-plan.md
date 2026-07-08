# interviewUndo Dashboard Implementation Plan

## Goal

Build a modern developer-focused dashboard inspired by GitHub, Linear,
Vercel, and LeetCode. The dashboard should prioritize **what to do
next**, **current progress**, and **long-term improvement**.

---

# Phase 1 --- Layout Foundation

## Objective

Create the overall page layout before implementing individual widgets.

### Structure

    Dashboard
    │
    ├── Hero Section
    ├── Stats Cards
    ├── Quick Actions
    ├── Daily Challenge
    ├── Progress Section
    │   ├── Difficulty Progress
    │   ├── Category Progress
    ├── Submission Activity
    ├── Weekly Goal
    ├── Recent Submissions
    ├── Interview Readiness
    ├── Strong Topics
    └── Achievements

### Tasks

- Create responsive dashboard container
- 12-column CSS Grid
- Consistent spacing (24px gaps)
- Card component
- Section header component
- Loading skeletons

---

# Phase 2 --- Design System

## Typography

Element Font Weight

---

Headings Geist / Inter 700
Body Inter 500
Numbers Geist Mono / JetBrains Mono 600

### Colors

Background: `#09090B`

Card: `#111113`

Border: `#27272A`

Primary: `#7C3AED`

Green: `#22C55E`

Orange: `#F59E0B`

Red: `#EF4444`

Muted Text: `#A1A1AA`

### Border Radius

- Cards: 24px
- Buttons: 16px

---

# Phase 3 --- Hero Section

## Purpose

Immediately tell the user what to do next.

### Components

- Greeting
- Short motivation
- Status pills
- Illustration
- CTA Buttons

### Status Pills

- 🔥 Streak
- 🤖 AI Ready
- ⚡ Judge Online
- 🎯 Daily Challenge

### Buttons

- Continue Practice
- Daily Challenge

---

# Phase 4 --- Statistics Cards

Implement four cards.

## Problems Solved

Display:

- Solved
- Total
- Progress Bar
- Weekly increase

---

## Success Rate

Display

- Percentage
- Accepted
- Rejected
- Weekly improvement

---

## Active Streak

Display

- Current streak
- Longest streak
- Flame animation

---

## Total Submissions

Display

- Today
- This Week
- This Month

---

# Phase 5 --- Quick Actions

Large clickable cards.

Actions

- Continue Practice
- Daily Challenge
- Random Problem
- AI Assistant

---

# Phase 6 --- Difficulty Progress

Show

Easy

Medium

Hard

Each contains

- solved
- total
- percentage
- animated progress bar

Optional

Donut chart on the right.

---

# Phase 7 --- Category Progress

Categories

- JavaScript
- React
- Node.js
- TypeScript

Each row

    Icon

    Category

    Progress Bar

    Percentage

---

# Phase 8 --- Submission Heatmap

GitHub-style contribution graph.

Features

- Daily submissions
- Hover tooltip
- Current streak
- Longest streak
- Most active day
- Monthly submissions

---

# Phase 9 --- Weekly Goal

Card

    2 / 10

    Problems

    Solve 8 more this week

Include circular progress.

Button

View Goal

---

# Phase 10 --- Daily Challenge

Display

- Problem title
- Difficulty
- XP
- Estimated time
- Success rate
- Countdown timer
- Solve button

---

# Phase 11 --- Recent Submissions

Each row should include

- Status Icon
- Problem
- Difficulty
- Runtime
- Memory
- Time submitted

Expandable row

Show

Expected Output

Actual Output

Error

---

# Phase 12 --- Interview Readiness

Calculate from

- Accuracy
- Consistency
- Topic coverage
- Difficulty completed

Display

- Circular score
- Progress bars

---

# Phase 13 --- Strong Topics

Top three strongest categories.

Example

- Arrays
- Strings
- Loops

Progress bars

---

# Phase 14 --- Achievements

Examples

- First Accepted
- 7-Day Streak
- 100 Problems
- JavaScript Master
- React Explorer

Locked badges appear dimmed.

---

# Phase 15 --- Animations

Implement subtle animations only.

- Card hover
- Progress bar fill
- Count-up numbers
- Fade-in sections
- Button hover
- Heatmap hover
- Flame pulse

---

# Phase 16 --- Responsive Layout

Desktop

- 4-column cards

Tablet

- 2-column cards

Mobile

- Single column

Sidebar collapses.

---

# Suggested Component Tree

    DashboardPage
    │
    ├── DashboardHero
    ├── StatsGrid
    │   ├── ProblemsSolvedCard
    │   ├── SuccessRateCard
    │   ├── StreakCard
    │   └── SubmissionCard
    ├── QuickActions
    ├── DifficultyProgress
    ├── CategoryProgress
    ├── SubmissionHeatmap
    ├── WeeklyGoal
    ├── DailyChallenge
    ├── RecentSubmissions
    ├── InterviewReadiness
    ├── StrongTopics
    └── Achievements

---

# Recommended Tech Stack

- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Query
- Recharts
- react-github-calendar (or custom heatmap)
- Lucide Icons
- Zustand (UI state)

---

# Suggested Build Order

1.  Layout & Grid
2.  Design Tokens
3.  Hero
4.  Stats Cards
5.  Quick Actions
6.  Difficulty Progress
7.  Category Progress
8.  Heatmap
9.  Weekly Goal
10. Daily Challenge
11. Recent Submissions
12. Interview Readiness
13. Strong Topics
14. Achievements
15. Animations
16. Responsive Polish
17. Performance Optimization
18. Accessibility Review
19. Final QA
