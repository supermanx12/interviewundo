# Function Practical Questions

This document lists the practical questions from the `seed-functions.ts` seed file, including their descriptions and difficulty levels.

## 1. Debounce Implementation (Medium)

**Slug**: `debounce-implementation`

Implement a \`debounce\` function. A debounced function delays invoking the original function until after \`wait\` milliseconds have elapsed since the last time the debounced function was invoked.

The debounced function should also expose a \`cancel\` method to abort delayed executions.

### Example:

\`\`\`javascript
let counter = 0;
const increment = () => counter++;
const debounced = debounce(increment, 100);

debounced();
debounced();
// Wait 100ms... counter === 1
\`\`\`  
_Note: Due to asynchronous nature, test cases will execute mock timers to verify debounce._

---

## 2. Memoize Function (Medium)

**Slug**: `memoize-function`

Write a function \`memoize(fn)\` that returns a memoized version of \`fn\`.

A memoized function caches execution results based on its argument list. If called again with the same arguments, it returns the cached result without executing the function.

Assume arguments are serializable (e.g. primitive values or JSON objects).

### Example:

\`\`\`javascript
let callCount = 0;
const add = (a, b) => {
callCount++;
return a + b;
};
const memoizedAdd = memoize(add);
memoizedAdd(1, 2); // 3
memoizedAdd(1, 2); // 3 (returns cached)
callCount; // 1
\`\`\`

---

## 3. Currying Function (Medium)

**Slug**: `currying-function`

Implement the \`curry\` function. Currying is the technique of converting a function that takes multiple arguments into a sequence of functions that each take a single argument.

It should allow the curried function to be called either with single arguments sequentially, or with multiple arguments at once.

### Example:

\`\`\`javascript
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6
curriedSum(1, 2, 3); // 6
\`\`\`

---

## 4. React Todo Reducer (Easy)

**Slug**: `react-todo-reducer`

Write a reducer function \`todoReducer\` that manages a todo list state in a React application.

The state is an array of todo objects: \`{ id: number, text: string, completed: boolean }\`.

The reducer must handle three actions:

1. \`{ type: 'ADD', payload: { id: number, text: string } }\`: Adds a new todo to the end of the state with \`completed: false\`.
2. \`{ type: 'TOGGLE', payload: { id: number } }\`: Toggles the \`completed\` status of the todo with the given \`id\`.
3. \`{ type: 'DELETE', payload: { id: number } }\`: Deletes the todo with the given \`id\`.

If the action type is unknown, return the current state.

### Example:

**Input:** state = [], action = { type: 'ADD', payload: { id: 1, text: 'Learn React' } }  
**Output:** [{ id: 1, text: 'Learn React', completed: false }]

---

## 5. React Wizard Derived State (Medium)

**Slug**: `react-wizard-derived-state`

In forms with multiple steps (wizards), state is often derived from the list of steps, the current step index, and user answers.

Write a function \`deriveWizardState(steps, currentStepIndex, formAnswers)\` that returns an object containing derived states:

- \`canGoNext\`: boolean, \`true\` if all fields listed in \`requiredFields\` of the current step are present in \`formAnswers\` (i.e. not undefined, null, or empty string \`""\`).
- \`canGoBack\`: boolean, \`true\` if \`currentStepIndex > 0\`.
- \`progress\`: integer, from 0 to 100 representing the percentage of steps where all required fields have been completed.
- \`isLastStep\`: boolean, \`true\` if the user is on the final step.

### Example:

**Input:**
\`steps\` = [{ title: 'Step 1', requiredFields: ['email'] }, { title: 'Step 2', requiredFields: ['password'] }]  
\`currentStepIndex\` = 0  
\`formAnswers\` = { email: 'user@test.com' }

**Output:**
\`{ canGoNext: true, canGoBack: false, progress: 50, isLastStep: false }\`

---
