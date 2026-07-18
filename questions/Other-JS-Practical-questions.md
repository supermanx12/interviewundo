# Other JavaScript Practical Questions

This document lists the practical questions from the `seed-other-js.ts` seed file, including their descriptions and difficulty levels.

## 1. Create an Object (Easy)

**Slug**: `create-an-object`

Write a function that creates and returns an object with the properties: \`name\` (string), \`age\` (number), and \`isDeveloper\` (boolean) matching the passed arguments.

### Example 1:

**Input:** name = "Alice", age = 25, isDeveloper = true  
**Output:** { "name": "Alice", "age": 25, "isDeveloper": true }

---

## 2. Manipulate Objects (Easy)

**Slug**: `manipulate-objects`

Given an object with \`name\` and \`age\` properties, update the \`age\` property by adding 1 to it and add a new property \`status\` set to the string \`"active"\`. Return the modified object.

### Example 1:

**Input:** obj = { "name": "Alice", "age": 25 }  
**Output:** { "name": "Alice", "age": 26, "status": "active" }

---

## 3. Check If Object Is Empty (Easy)

**Slug**: `check-object-empty`

Write a function that checks whether an object has no keys. Return \`true\` if empty, and \`false\` otherwise.

### Example 1:

**Input:** obj = {}  
**Output:** true

### Example 2:

**Input:** obj = { "a": 1 }  
**Output:** false

---

## 4. Deep Copy an Object (JSON) (Easy)

**Slug**: `deep-copy-object-json`

Create a deep copy of the passed object using \`JSON.parse(JSON.stringify(obj))\`. Do not modify the original object.

### Example 1:

**Input:** obj = { "a": 1, "b": { "c": 2 } }  
**Output:** { "a": 1, "b": { "c": 2 } }

---

## 5. Deep Clone Manual (Medium)

**Slug**: `deep-clone-manual`

Implement a manual deep clone function that handles nested objects, arrays, and primitive values recursively without using \`structuredClone()\` or \`JSON.parse/stringify\`.

### Example 1:

**Input:** obj = { "a": 1, "b": [2, 3] }  
**Output:** { "a": 1, "b": [2, 3] }

---

## 6. Shallow Copy (Easy)

**Slug**: `shallow-copy-object`

Create and return a shallow copy of an object using the spread operator (\`...\`).

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "a": 1, "b": 2 }

---

## 7. Delete a Property (Easy)

**Slug**: `delete-object-property`

Given an object and a key string, delete the property corresponding to the key from the object in-place. Return the updated object.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }, key = "a"  
**Output:** { "b": 2 }

---

## 8. Remove the Last Property (Medium)

**Slug**: `remove-last-property`

Remove the last property added to an object (based on \`Object.keys()\` property ordering). Return the modified object in-place.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "a": 1 }

---

## 9. Remove Highest Valued Property (Medium)

**Slug**: `remove-highest-property`

Delete the property with the highest numeric value from the object. Return the updated object.

### Example 1:

**Input:** obj = { "a": 10, "b": 20, "c": 5 }  
**Output:** { "a": 10, "c": 5 }

---

## 10. Remove Lowest Valued Property (Medium)

**Slug**: `remove-lowest-property`

Delete the property with the lowest numeric value from the object. Return the updated object.

### Example 1:

**Input:** obj = { "a": 10, "b": 20, "c": 5 }  
**Output:** { "a": 10, "b": 20 }

---

## 11. Remove Odd Valued Properties (Easy)

**Slug**: `remove-odd-properties`

Remove all properties from the passed object where the values are odd integers. Return the updated object.

### Example 1:

**Input:** obj = { "a": 2, "b": 3, "c": 4 }  
**Output:** { "a": 2, "c": 4 }

---

## 12. Add a New Property (Easy)

**Slug**: `add-object-property`

Add a new key-value pair to the given object. Return the updated object.

### Example 1:

**Input:** obj = { "a": 1 }, key = "b", val = 2  
**Output:** { "a": 1, "b": 2 }

---

## 13. Merge Two Objects (Easy)

**Slug**: `merge-two-objects`

Merge the properties of two objects together. Return a new merged object containing properties of both.

### Example 1:

**Input:** obj1 = { "a": 1 }, obj2 = { "b": 2 }  
**Output:** { "a": 1, "b": 2 }

---

## 14. Combine Two Objects (Medium)

**Slug**: `combine-two-objects`

Combine properties of two objects. If they share a key and both values are numbers, sum their values. Otherwise, the value from the second object should overwrite the first. Return the resulting object.

### Example 1:

**Input:** obj1 = { "a": 1, "b": 2 }, obj2 = { "b": 3, "c": 4 }  
**Output:** { "a": 1, "b": 5, "c": 4 }

---

## 15. Convert Nested to Flat Object (Medium)

**Slug**: `flatten-nested-object`

Flatten a nested object. The keys of the flattened object should represent the paths to the nested values, separated by a dot (\`.\`).

### Example 1:

**Input:** obj = { "a": 1, "b": { "c": 2, "d": { "e": 3 } } }  
**Output:** { "a": 1, "b.c": 2, "b.d.e": 3 }

---

## 16. Convert Object to Key-Value Array (Easy)

**Slug**: `object-to-array-of-kv`

Convert an object into an array of objects where each element is an object with \`key\` and \`value\` properties.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ { "key": "a", "value": 1 }, { "key": "b", "value": 2 } ]

---

## 17. Key with Highest Value (Easy)

**Slug**: `key-with-highest-value`

Find and return the key name that holds the highest numeric value in the object. Return \`null\` if empty.

### Example 1:

**Input:** obj = { "a": 10, "b": 25, "c": 5 }  
**Output:** "b"

---

## 18. Key with Lowest Value (Easy)

**Slug**: `key-with-lowest-value`

Find and return the key name that holds the lowest numeric value in the object. Return \`null\` if empty.

### Example 1:

**Input:** obj = { "a": 10, "b": 25, "c": 5 }  
**Output:** "c"

---

## 19. Sum of Object Values (Easy)

**Slug**: `sum-of-object-values`

Return the sum of all numeric values inside an object. Ignore properties that are not numbers.

### Example 1:

**Input:** obj = { "a": 10, "b": 20, "c": "test" }  
**Output:** 30

---

## 20. Sum of Object Keys Length (Easy)

**Slug**: `sum-of-object-keys-lengths`

Calculate and return the sum of the string lengths of all key names in an object.

### Example 1:

**Input:** obj = { "apple": 1, "banana": 2 }  
**Output:** 11  
**Explanation:** Keys are "apple" (length 5) and "banana" (length 6). Total sum of key lengths is 11.

---

## 21. Check Object Value Types (Medium)

**Slug**: `check-object-value-types`

Check the types of all values in the object. If all values are of the exact same type (e.g. all numbers or all strings), return the string \`"Error: All values are of the same type"\`. Otherwise, return \`true\`.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** "Error: All values are of the same type"

### Example 2:

**Input:** obj = { "a": 1, "b": "hello" }  
**Output:** true

---

## 22. Loop Through Objects (Easy)

**Slug**: `loop-through-objects`

Loop through the key-value pairs of an object using a \`for...in\` loop and return an array of strings formatted as \`"key:value"\`.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ "a:1", "b:2" ]

---

## 23. Object Methods Demo (Easy)

**Slug**: `object-methods-demo`

Given an object, return an object containing its keys, values, and entries formatted as:
\`{ keys: string[], values: any[], entries: [string, any][] }\` using \`Object.keys()\`, \`Object.values()\`, and \`Object.entries()\`.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "keys": ["a", "b"], "values": [1, 2], "entries": [["a", 1], ["b", 2]] }

---

## 24. Reverse Each Word (Medium)

**Slug**: `reverse-each-word`

Given a sentence, reverse the characters of each word in-place while keeping the original word order.

### Example 1:

**Input:** sentence = "How Are You"  
**Output:** "woH erA uoY"

---

## 25. Reverse String (No Built-ins) (Easy)

**Slug**: `reverse-string-loop`

Reverse a string using a loop. Do not use the built-in \`.reverse()\` array method.

### Example 1:

**Input:** str = "hello"  
**Output:** "olleh"

---

## 26. Palindrome Checker (Ignore Special) (Easy)

**Slug**: `string-palindrome-check`

Check if a string is a palindrome. Ignore cases, spaces, and all non-alphanumeric characters.

### Example 1:

**Input:** str = "Racecar"  
**Output:** true

---

## 27. Reverse Words Order (Easy)

**Slug**: `reverse-words-order`

Reverse the order of words in a sentence.

### Example 1:

**Input:** sentence = "hello world"  
**Output:** "world hello"

---

## 28. Capitalize Every Word (Easy)

**Slug**: `capitalize-every-word`

Capitalize the first letter of every word in a sentence.

### Example 1:

**Input:** sentence = "hello world from javascript"  
**Output:** "Hello World From Javascript"

---

## 29. Capitalize First Letter (Easy)

**Slug**: `capitalize-first-letter`

Capitalize only the first character of a string.

### Example 1:

**Input:** str = "javascript"  
**Output:** "Javascript"

---

## 30. Capitalize First and Last Letters (Easy)

**Slug**: `capitalize-first-last-letters`

Capitalize the first and last characters of every word in a sentence.

### Example 1:

**Input:** sentence = "hello world"  
**Output:** "HellO WorlD"

---

## 31. Remove Character (Easy)

**Slug**: `remove-character`

Remove all occurrences of a specified character from a string.

### Example 1:

**Input:** str = "banana", char = "a"  
**Output:** "bnn"

---

## 32. Split First Two Characters (Easy)

**Slug**: `split-first-two-characters`

Split the first two characters of a string and place them in a two-element array: the first two characters as the first element, and the rest of the string as the second. If the string has fewer than 2 characters, place the entire string in the first index, and an empty string in the second.

### Example 1:

**Input:** str = "javascript"  
**Output:** [ "ja", "vascript" ]

---

## 33. Longest Word using Reduce (Easy)

**Slug**: `longest-word-reduce`

Find the longest word in a sentence using the \`.reduce()\` array method.

### Example 1:

**Input:** sentence = "I love programming in Javascript"  
**Output:** "programming"

---

## 34. Count Characters (Easy)

**Slug**: `count-characters`

Count the occurrences of each character in a string. Return an object where keys are the characters and values are their counts.

### Example 1:

**Input:** str = "hello"  
**Output:** { "h": 1, "e": 1, "l": 2, "o": 1 }

---

## 35. Remove Smallest String (Easy)

**Slug**: `remove-smallest-string`

Given an array of strings, remove the shortest string. If there are multiple strings sharing the shortest length, remove the first occurrence. Return the updated array.

### Example 1:

**Input:** arr = [ "apple", "cat", "banana" ]  
**Output:** [ "apple", "banana" ]

---

## 36. Array of Strings to Object (Easy)

**Slug**: `array-of-strings-to-object`

Convert an array of strings into an object where keys are the strings and values are their respective lengths.

### Example 1:

**Input:** arr = [ "a", "ab", "abc" ]  
**Output:** { "a": 1, "b": 2, "abc": 3 }

---

## 37. Create a Promise (Easy)

**Slug**: `create-a-promise`

Create and return a Promise that resolves with the string \`"Success"\` after a specified delay in milliseconds.

### Example 1:

**Input:** delay = 50  
**Output:** "Success"

---

## 38. Create Callback Code (Easy)

**Slug**: `create-callback-code`

Write a wrapper function \`runCallbackExample(name)\` which internally declares a callback-expecting function \`greet(name, cb)\`. \`greet\` executes the callback passing \`"Hello, [name]"\`. Execute and return the callback's result.

### Example 1:

**Input:** name = "Alice"  
**Output:** "Hello, Alice"

---

## 39. Convert Callback to Promise (Medium)

**Slug**: `callback-to-promise`

Wrap a callback-based asynchronous function inside a Promise so that it resolves with the callback value.

### Example 1:

**Input:** value = "test"  
**Output:** "Data: test"

---

## 40. Async/Await Handler (Easy)

**Slug**: `async-await-handler`

Create an asynchronous function \`handleAsyncAwait(shouldResolve, value)\` that awaits a promise. If the promise resolves, return the resolved value. If it rejects, catch the error and return \`"Error: [error-message]"\`.

### Example 1:

**Input:** shouldResolve = true, value = "success"  
**Output:** "success"

---

## 41. Promise Chaining (Medium)

**Slug**: `promise-chaining`

Chain two promises. The first promise resolves with \`n\`, and the second resolves with \`n \* 2\`. Return the final resolved value from the promise chain.

### Example 1:

**Input:** n = 5  
**Output:** 10

---

## 42. Arrow Function: Square (Easy)

**Slug**: `arrow-square`

Write a short arrow function \`square\` that returns the square of the given number.

### Example 1:

**Input:** x = 4  
**Output:** 16

---

## 43. Arrow Function: Sum (Easy)

**Slug**: `arrow-sum`

Write an arrow function \`sum\` that takes two numbers and returns their sum.

### Example 1:

**Input:** a = 3, b = 5  
**Output:** 8

---

## 44. Arrow Function: Sum N Numbers (Easy)

**Slug**: `arrow-sum-n`

Write an arrow function \`sumAll\` that takes any number of arguments using rest parameters and returns their sum.

### Example 1:

**Input:** args = [ 1, 2, 3, 4 ]  
**Output:** 10

---

## 45. Higher Order Multiplier (Medium)

**Slug**: `higher-order-func`

Create a higher-order function \`multiplier(factor)\` that returns a function. The returned function should take a number and multiply it by \`factor\`. We will test it using the wrapper \`testMultiplier(factor, num)\`.

### Example 1:

**Input:** factor = 3, num = 5  
**Output:** 15

---

## 46. Generator Count Up (Medium)

**Slug**: `generator-basics`

Write a generator function \`countUp(n)\` that yields numbers from 1 to \`n\`. We will test it using the wrapper \`runCountUp(n)\` which returns yielded values as an array.

### Example 1:

**Input:** n = 5  
**Output:** [ 1, 2, 3, 4, 5 ]

---

## 47. Generator Countdown (Medium)

**Slug**: `generator-reverse`

Write a generator function that yields numbers from \`n\` down to 1. Return them as an array.

### Example 1:

**Input:** n = 3  
**Output:** [ 3, 2, 1 ]

---

## 48. Generator Multiples (Medium)

**Slug**: `generator-multiples`

Write a generator function that yields the first \`count\` positive multiples of \`num\`. Return them as an array.

### Example 1:

**Input:** num = 3, count = 4  
**Output:** [ 3, 6, 9, 12 ]

---

## 49. Currying Example (Medium)

**Slug**: `currying-example`

Implement a curried multiplication function \`multiply(a)(b)(c)\` which multiplies three numbers together. We will test it using the wrapper \`runCurry(a, b, c)\`.

### Example 1:

**Input:** a = 2, b = 3, c = 4  
**Output:** 24

---

## 50. Closure Counter Object (Medium)

**Slug**: `closure-counter`

Create a counter closure using a private state variable. \`runCounter(actions)\` should initialize a counter at 0 and perform an array of string actions: \`"inc"\` (increment) or \`"dec"\` (decrement), and return the final count.

### Example 1:

**Input:** actions = [ "inc", "inc", "dec", "inc" ]  
**Output:** 2

---

## 51. Memoization Factorial (Medium)

**Slug**: `memoization-factorial`

Create a memoized factorial function. Implement factorial recursive computation, storing calculated results in a cache map so subsequent queries are fetched in O(1) time.

### Example 1:

**Input:** n = 5  
**Output:** 120

---

## 52. Function Borrowing (Medium)

**Slug**: `function-borrowing`

Use function borrowing methods (\`call\`, \`apply\`, and \`bind\`) to apply a greeting method declared on one object onto a different object. Return results as an object: \`{ callResult, applyResult, bindResult }\`.

### Example 1:

**Input:** obj1 = { "name": "Alice" }, obj2 = { "name": "Bob" }  
**Output:** { "callResult": "Hello, Bob!", "applyResult": "Hi, Bob.", "bindResult": "Hey, Bob?" }

---

## 53. Custom Filter Method (Medium)

**Slug**: `custom-filter-impl`

Implement a custom filtering algorithm \`customFilter(arr, callback)\` that replicates the functionality of \`Array.prototype.filter()\` without using it. We will test it using the wrapper \`runCustomFilter(arr, threshold)\` which returns elements greater than the threshold.

### Example 1:

**Input:** arr = [ 1, 5, 8, 2 ], threshold = 4  
**Output:** [ 5, 8 ]

---

## 54. Function Composition (Medium)

**Slug**: `function-composition`

Implement a function composition utility \`compose(...funcs)\` which pipes values sequentially from right to left. E.g. \`compose(f, g)(x)\` evaluates to \`f(g(x))\`.

### Example 1:

**Input:** x = 4  
**Output:** 14  
**Explanation:** Composition of add2 (x+2) and multiply3 (x\*3) evaluates: add2(multiply3(4)) = add2(12) = 14.

---

## 55. Factory Function Profile (Easy)

**Slug**: `factory-function-demo`

Create a factory function \`createUser(name, role)\` that instantiates an object with properties \`name\` and \`role\`, and a method \`getProfile()\` returning \`"Name: [name], Role: [role]"\`.

### Example 1:

**Input:** name = "Alice", role = "Admin"  
**Output:** "Name: Alice, Role: Admin"

---

## 56. Constructor Function Profile (Easy)

**Slug**: `constructor-function-demo`

Create a constructor function \`User(name, role)\` that creates an object, adding a method \`getProfile()\` on its prototype returning \`"Name: [name], Role: [role]"\`.

### Example 1:

**Input:** name = "Bob", role = "Moderator"  
**Output:** "Name: Bob, Role: Moderator"

---

## 57. Declare and Call Function (Easy)

**Slug**: `declare-and-call-fn`

Write a function \`runCalculation(a, b)\` which declares a nested helper function \`addAndMultiply(x, y)\` inside it. The helper function sums \`x\` and \`y\` and multiplies the result by 5. Return the result of calling it with arguments \`a\` and \`b\`.

### Example 1:

**Input:** a = 2, b = 3  
**Output:** 25

---

## 58. Sum Numbers to Limit (while) (Easy)

**Slug**: `sum-to-100-while`

Sum numbers from 1 up to a specified limit using a \`while\` loop. Return the total sum.

### Example 1:

**Input:** limit = 100  
**Output:** 5050

---

## 59. Print with Delay (async) (Medium)

**Slug**: `print-with-delay`

Write an asynchronous function \`printWithDelay(n)\` that generates an array of numbers from 1 to \`n\` sequentially with a short simulated async delay in each iteration.

### Example 1:

**Input:** n = 5  
**Output:** [ 1, 2, 3, 4, 5 ]

---

## 60. Print Countdown (async) (Medium)

**Slug**: `print-countdown-delay`

Write an asynchronous function \`printCountdown(n)\` that generates an array of numbers from \`n\` down to 1 sequentially with a short simulated async delay in each iteration.

### Example 1:

**Input:** n = 5  
**Output:** [ 5, 4, 3, 2, 1 ]

---

## 61. Countdown Timer to Zero (async) (Medium)

**Slug**: `countdown-timer-zero`

Write an asynchronous function \`countdownToZero(n)\` that generates an array of numbers from \`n\` down to 0 sequentially with a short simulated async delay in each iteration.

### Example 1:

**Input:** n = 3  
**Output:** [ 3, 2, 1, 0 ]

---

## 62. Deterministic Pseudo-Random LCG (Easy)

**Slug**: `generate-random-in-range`

Implement a deterministic pseudo-random number generator using the Linear Congruential Generator (LCG) algorithm. Formula: \`X\_{n+1} = (a _ X_n + c) % m\`.
Use the constants: \`a = 1664525\`, \`c = 1013904223\`, and \`m = 2^32\`.
Return the next integer scaled to the range \`[min, max]\` inclusive: \`Math.floor(scale _ (max - min + 1)) + min\`, where \`scale = nextSeed / m\`.

### Example 1:

**Input:** seed = 42, min = 0, max = 10  
**Output:** 2

---

## 63. Format Time (HH:MM:SS) (Easy)

**Slug**: `format-current-time`

Given a Date timestamp (milliseconds), extract and format the UTC time into a string pattern: \`HH:MM:SS\`. Ensure numbers under 10 are zero-padded (e.g. \`"05"\`).

### Example 1:

**Input:** timestamp = 1716382000000  
**Output:** "12:46:40"

---

## 64. First 5 Multiples of 3 (while loop) (Easy)

**Slug**: `first-five-multiples-three-loop`

Return an array containing the first 5 positive multiples of 3 (3, 6, 9, 12, 15) using a \`while\` loop.

### Example:

**Output:** [ 3, 6, 9, 12, 15 ]

---

## 65. Promise.all Polyfill (Hard)

**Slug**: `promise-all-polyfill`

Implement the \`promiseAll\` function which mimics \`Promise.all\`.

The function takes an array of Promises and returns a single Promise that resolves when all input promises have resolved, or rejects immediately when any input promise rejects.

### Example:

\`\`\`javascript
const p1 = Promise.resolve(3);
const p2 = 42;
const p3 = new Promise((resolve) => setTimeout(resolve, 100, 'foo'));

promiseAll([p1, p2, p3]).then(values => console.log(values)); // [3, 42, 'foo']
\`\`\`

---
