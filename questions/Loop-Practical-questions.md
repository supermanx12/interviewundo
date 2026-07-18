# Loop Practical Questions

This document lists the practical questions from the `seed-loops.ts` seed file, including their descriptions and difficulty levels.

## 1. Print Even Numbers (Easy)

**Slug**: `print-even-numbers`

Write a function \`getEvenNumbers(n)\` that returns an array of all even integers from \`2\` up to \`n\` (inclusive) using a loop.

### Example 1:

**Input:** n = 10  
**Output:** [ 2, 4, 6, 8, 10 ]

### Constraints:

- 1 <= n <= 10^3

---

## 2. Print Even Numbers in Reverse (Easy)

**Slug**: `print-even-numbers-reverse`

Write a function \`getEvenNumbersReverse(n)\` that returns an array of all even integers from \`n\` down to \`2\` (inclusive) in descending order.

### Example 1:

**Input:** n = 10  
**Output:** [ 10, 8, 6, 4, 2 ]

---

## 3. Sum from 1 to N (Easy)

**Slug**: `sum-1-to-n`

Write a function \`sumToN(n)\` that returns the sum of all integers from 1 to \`n\` (inclusive) using a loop.

### Example 1:

**Input:** n = 5  
**Output:** 15  
**Explanation:** 1 + 2 + 3 + 4 + 5 = 15.

---

## 4. Sort Array Using While Loop (Easy)

**Slug**: `sort-array-using-while`

Implement a sorting algorithm using a \`while\` loop. The function \`sortArrayWhile(arr)\` should modify the input array in-place and return it sorted in ascending order. Do not use built-in \`Array.prototype.sort()\`.

### Example 1:

**Input:** arr = [ 5, 3, 8, 2 ]  
**Output:** [ 2, 3, 5, 8 ]

---

## 5. Reverse String Using While Loop (Easy)

**Slug**: `reverse-string-using-while`

Write a function \`reverseStringWhile(str)\` that returns the reversed version of the input string using a \`while\` loop.

### Example 1:

**Input:** str = "hello"  
**Output:** "olleh"

---

## 6. Multiples Using While Loop (Easy)

**Slug**: `multiples-using-while`

Write a function \`getMultiplesWhile(base, limit)\` that returns an array of positive multiples of \`base\` that are strictly less than \`limit\`, using a \`while\` loop.

### Example 1:

**Input:** base = 3, limit = 10  
**Output:** [ 3, 6, 9 ]

---

## 7. Basic Do-While Loop (Easy)

**Slug**: `basic-do-while-loop`

Write a function \`doWhileDemo(n)\` that returns an array containing integers from \`1\` up to \`n\` using a \`do-while\` loop. Note that because a \`do-while\` loop executes at least once, calling \`doWhileDemo(0)\` should return \`[1]\`.

### Example 1:

**Input:** n = 3  
**Output:** [ 1, 2, 3 ]

### Example 2:

**Input:** n = 0  
**Output:** [ 1 ]

---

## 8. Multiples of 5 (Easy)

**Slug**: `multiples-of-five-loop`

Write a function \`countMultiplesOfFive(start, end)\` that counts and returns how many multiples of 5 exist in the range \`[start, end]\` (inclusive) using a loop.

### Example 1:

**Input:** start = 4, end = 15  
**Output:** 3  
**Explanation:** 5, 10, and 15 are multiples of 5 in the range.

---

## 9. Multiplication Table (Easy)

**Slug**: `multiplication-table-array`

Write a function \`getMultiplicationTable(n)\` that returns an array representing the multiplication table of \`n\` from 1 to 10 (i.e. \`[n*1, n*2, ..., n*10]\`) using a loop.

### Example 1:

**Input:** n = 5  
**Output:** [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 ]

---

## 10. Reverse Array Using Loop (Easy)

**Slug**: `reverse-array-using-loop`

Write a function \`reverseArrayLoop(arr)\` that reverses the elements of the array in-place and returns it, using a loop. Do not use the built-in \`Array.prototype.reverse()\` method.

### Example 1:

**Input:** arr = [ 1, 2, 3, 4 ]  
**Output:** [ 4, 3, 2, 1 ]

---

## 11. Merge Arrays Using Loop (Easy)

**Slug**: `merge-arrays-using-loop`

Write a function \`mergeArraysLoop(arr1, arr2)\` that merges two arrays together by copying elements into a new array using loops. Do not use spread operators (\`...\`) or \`Array.prototype.concat()\`.

### Example 1:

**Input:** arr1 = [ 1, 2 ], arr2 = [ 3, 4 ]  
**Output:** [ 1, 2, 3, 4 ]

---

## 12. Break and Continue Output (Easy)

**Slug**: `break-and-continue-output`

Write a function \`loopControl(n)\` that loops from 1 to \`n\` (inclusive). If the current number is divisible by 5, skip it using \`continue\`. If the sum of the processed numbers (including the current number if added) exceeds 50, terminate the loop using \`break\`. Return the sum of all the processed numbers.

### Example 1:

**Input:** n = 15  
**Output:** 45  
**Explanation:** 1 + 2 + 3 + 4 + (skip 5) + 6 + 7 + 8 + 9 + (skip 10) + 11 = 62, which exceeds 50, so we break before adding 11. The sum is 1+2+3+4+6+7+8+9 = 40. Wait, 1+2+3+4+6+7+8+9 = 40. Next is 11, sum + 11 = 51 (exceeds 50), so we break. Return 40.

---

## 13. Post and Pre Increment (Easy)

**Slug**: `post-and-pre-increment`

Write a function \`incrementOperations(x, y)\` that performs a sequence of pre-increment and post-increment operations on variables \`x\` and \`y\`, then returns their sum.

Specifically:

1. Declare \`let a = ++x;\` (pre-increment)
2. Declare \`let b = y++;\` (post-increment)
3. Return \`a + b + x + y;\`

### Example 1:

**Input:** x = 2, y = 3  
**Output:** 13  
**Explanation:**

- \`++x\` increments \`x\` to 3 and returns 3. So \`a = 3, x = 3\`.
- \`y++\` returns 3 and then increments \`y\` to 4. So \`b = 3, y = 4\`.
- Return \`3 + 3 + 3 + 4 = 13\`.

---

## 14. Increment and Decrement Demo (Easy)

**Slug**: `increment-decrement-demo`

Write a function \`incDecDemo(n)\` that simulates a series of increment and decrement operations.
Initialize \`let count = n;\` and \`let result = 0;\`.
Run a loop while \`count > 0\`. In each iteration:

- If \`count\` is even, add \`count--\` to \`result\`.
- If \`count\` is odd, add \`--count\` to \`result\`.
  Return \`result\`.

### Example 1:

**Input:** n = 4  
**Output:** 8  
**Explanation:**

- Iteration 1: count = 4 (even), adds 4 to result (result=4), count becomes 3.
- Iteration 2: count = 3 (odd), decrements count to 2, adds 2 to result (result=6).
- Iteration 3: count = 2 (even), adds 2 to result (result=8), count becomes 1.
- Iteration 4: count = 1 (odd), decrements count to 0, adds 0 to result (result=8).
- Loop terminates. Return 8.

---

## 15. Fibonacci Generator (Medium)

**Slug**: `fibonacci-generator`

Write a generator function that yields the infinite Fibonacci sequence.

The sequence starts with 0 and 1, and each subsequent number is the sum of the previous two.

### Example:

\`\`\`javascript
const gen = fibonacciGenerator();
gen.next().value; // 0
gen.next().value; // 1
gen.next().value; // 1
gen.next().value; // 2
\`\`\`  
Write a function \`getFibonacciArray(n)\` that returns the first \`n\` Fibonacci numbers using a generator.

---

## 16. FizzBuzz (Easy)

**Slug**: `fizz-buzz`

Given an integer \`n\`, return _a string array \`answer\` (1-indexed) where_:

- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.

### Example 1:

**Input:** n = 3  
**Output:** ["1","2","Fizz"]

---
