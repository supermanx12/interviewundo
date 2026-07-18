# TypeScript Practical Questions

This document lists the practical questions from the `seed-typescript.ts` seed file, including their descriptions and difficulty levels.

## 1. TypeScript Type Utility: Omit (Medium)

**Slug**: `ts-omit-utility`

In TypeScript, write a generic type utility \`MyOmit<T, K>\` that constructs a type by picking all properties from \`T\` and then removing \`K\`.

This is a types-only question, but represented as a verification script.

### Example:

\`\`\`typescript
interface Todo {
title: string
description: string
completed: boolean
}
type TodoPreview = MyOmit<Todo, 'description' | 'completed'>
// Expected: { title: string }
\`\`\`

---
