# Array Practical Questions

This document lists all the array manipulation questions from the platform, including their descriptions and difficulty levels.

## 1. Average of Even Numbers (Easy)

**Slug**: `average-of-even-numbers`

Given an array of numbers, return the average of all even numbers. If there are no even numbers, return 0.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5, 6]  
**Output:** 4  
**Explanation:** The even numbers are 2, 4, and 6. Their average is (2 + 4 + 6) / 3 = 4.

### Example 2:

**Input:** nums = [1, 3, 5]  
**Output:** 0  
**Explanation:** There are no even numbers, so the output is 0.

---

## 2. Sum of Odd Numbers (Easy)

**Slug**: `sum-of-odd-numbers`

Given an array of numbers, return the sum of all odd numbers.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** 9  
**Explanation:** The odd numbers are 1, 3, and 5. Their sum is 1 + 3 + 5 = 9.

---

## 3. Sum of Prime Numbers (Medium)

**Slug**: `sum-of-prime-numbers`

Given an array of numbers, return the sum of all prime numbers in the array. A prime number is a number greater than 1 with no positive divisors other than 1 and itself.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5, 6, 7]  
**Output:** 14  
**Explanation:** The prime numbers are 2, 3, 5, and 7. Their sum is 2 + 3 + 5 + 7 = 14.

---

## 4. Sum of Positive Numbers (Easy)

**Slug**: `sum-of-positive-numbers`

Given an array of numbers, return the sum of all positive numbers (numbers strictly greater than 0).

### Example 1:

**Input:** nums = [1, -2, 3, -4, 5]  
**Output:** 9  
**Explanation:** The positive numbers are 1, 3, and 5. Their sum is 9.

---

## 5. Sum of Array Elements (Easy)

**Slug**: `sum-of-array-elements`

Given an array of numbers, calculate and return the sum of all elements.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** 15

---

## 6. Calculate Array Sum (Easy)

**Slug**: `calculate-array-sum`

Given an array of numbers, return the sum of all numbers using a loop.

### Example 1:

**Input:** nums = [5, 10, 15]  
**Output:** 30

---

## 7. Reverse an Array (Easy)

**Slug**: `reverse-an-array`

Given an array, return a new array with the elements in reverse order. Do not modify the original array.

### Example 1:

**Input:** nums = [1, 2, 3, 4]  
**Output:** [4, 3, 2, 1]

---

## 8. Reverse Array In-Place (Easy)

**Slug**: `reverse-array-in-place`

Given an array, reverse the elements in-place. Modify the original array and return it.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** [5, 4, 3, 2, 1]

---

## 9. Reverse Array Without Built-ins (Easy)

**Slug**: `reverse-array-without-builtins`

Given an array, return a reversed version of it without using any built-in array methods like \`.reverse()\`, \`.slice()\`, or \`.splice()\`.

### Example 1:

**Input:** nums = [10, 20, 30]  
**Output:** [30, 20, 10]

---

## 10. Reverse Array Without Second Array (Easy)

**Slug**: `reverse-array-no-second-array`

Given an array, reverse the elements in-place without creating a second array. Modify the original array and return it.

### Example 1:

**Input:** nums = [1, 2, 3, 4]  
**Output:** [4, 3, 2, 1]

---

## 11. Reverse and Multiply Halves (Medium)

**Slug**: `reverse-and-multiply-halves`

Given an array, reverse it and then multiply all elements in the first half of the reversed array by 2, and all elements in the second half by 5.
For arrays with odd lengths, the middle element belongs to the first half (and is multiplied by 2).
Return the resulting array.

### Example 1:

**Input:** nums = [1, 2, 3, 4]  
**Output:** [8, 6, 10, 5]  
**Explanation:** Reversing [1, 2, 3, 4] yields [4, 3, 2, 1]. The first half [4, 3] multiplied by 2 is [8, 6]. The second half [2, 1] multiplied by 5 is [10, 5]. Combined result is [8, 6, 10, 5].

---

## 12. Second Largest Element (Easy)

**Slug**: `second-largest-element`

Given an array of numbers, find and return the second largest unique element. If the array contains fewer than two unique elements, return \`null\`.

### Example 1:

**Input:** nums = [12, 35, 1, 10, 34, 1]  
**Output:** 34

---

## 13. Highest Even with Reduce (Medium)

**Slug**: `highest-even-with-reduce`

Given an array of numbers, find the highest even number using the \`.reduce()\` method. If no even numbers exist, return \`null\`.

### Example 1:

**Input:** nums = [1, 12, 3, 4, 15, 6, 7]  
**Output:** 12

---

## 14. Highest Odd Number (Easy)

**Slug**: `highest-odd-number`

Given an array of numbers, find and return the highest odd number. If no odd numbers exist in the array, return \`null\`.

### Example 1:

**Input:** nums = [2, 4, 7, 10, 15, 8]  
**Output:** 15

---

## 15. Find and Remove Duplicates (Medium)

**Slug**: `find-and-remove-duplicates`

Given an array, return a new array with all duplicate elements removed. The unique elements must appear in their original order.

### Example 1:

**Input:** nums = [1, 2, 2, 3, 4, 4, 5]  
**Output:** [1, 2, 3, 4, 5]

---

## 16. Remove Duplicate Even Numbers (Medium)

**Slug**: `remove-duplicate-even-numbers`

Given an array of numbers, filter the array such that all duplicate even numbers are removed, keeping only their first occurrence. All odd numbers must remain in the array in their original places.

### Example 1:

**Input:** nums = [1, 2, 2, 3, 4, 4, 2, 5]  
**Output:** [1, 2, 3, 4, 5]

---

## 17. Remove Multiples of Three (Easy)

**Slug**: `remove-multiples-of-three`

Given an array of numbers, return a new array with all multiples of 3 removed.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]  
**Output:** [1, 2, 4, 5, 7, 8]

---

## 18. Remove Odd Numbers (Easy)

**Slug**: `remove-odd-numbers`

Given an array of numbers, return a new array with all odd numbers removed.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** [2, 4]

---

## 19. Remove Adjacent Odd Numbers (Medium)

**Slug**: `remove-adjacent-odd-numbers`

Given an array of numbers, remove all odd numbers that are adjacent to another odd number in the input array. Odd numbers that are adjacent to only even numbers (or are at the boundaries with no adjacent odds) should be kept.

### Example 1:

**Input:** nums = [1, 3, 2, 5, 4, 7, 9, 11]  
**Output:** [2, 5, 4]  
**Explanation:**

- 1 and 3 are adjacent odds, so both are removed.
- 2 and 4 are even, so they are kept.
- 5 is adjacent to 2 (even) and 4 (even), so it is kept.
- 7, 9, and 11 are adjacent odds, so all are removed.

---

## 20. Replace Odd Numbers with Squares (Easy)

**Slug**: `replace-odds-with-squares`

Given an array of numbers, return a new array where all odd numbers are replaced with their square values, while even numbers remain unchanged.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** [1, 2, 9, 4, 25]

---

## 21. Common Elements from Two Arrays (Medium)

**Slug**: `common-elements-two-arrays`

Given two arrays, find and return all common elements (elements present in both arrays). The result should contain unique elements and maintain the order of their first appearance in the first array.

### Example 1:

**Input:** arr1 = [1, 2, 2, 3, 4], arr2 = [2, 3, 5]  
**Output:** [2, 3]

---

## 22. Concatenate Two Arrays (Easy)

**Slug**: `concatenate-two-arrays`

Given two arrays, return a new array containing the elements of the first array followed by the elements of the second array. Do not modify the original arrays.

### Example 1:

**Input:** arr1 = [1, 2], arr2 = [3, 4]  
**Output:** [1, 2, 3, 4]

---

## 23. Merge Two Arrays Manually (Easy)

**Slug**: `merge-two-arrays-manually`

Given two arrays, merge them into a single new array manually without using the built-in \`.concat()\` method or the spread operator (\`...\`).

### Example 1:

**Input:** arr1 = [1, 2], arr2 = [3, 4]  
**Output:** [1, 2, 3, 4]

---

## 24. Merge Two Arrays with Apply (Medium)

**Slug**: `merge-arrays-with-apply`

Given two arrays, merge the elements of the second array into the first array in-place using \`Array.prototype.push.apply()\`. Modify and return the first array.

### Example 1:

**Input:** arr1 = [1, 2], arr2 = [3, 4]  
**Output:** [1, 2, 3, 4]

---

## 25. Add Element Without Push/Unshift (Medium)

**Slug**: `add-element-without-push-unshift`

Given an array and an element, add the element to the end of the array without using the built-in \`.push()\` or \`.unshift()\` methods. Modify the array in-place and return it.

### Example 1:

**Input:** arr = [1, 2], element = 3  
**Output:** [1, 2, 3]

---

## 26. Remove Last Without Pop (Easy)

**Slug**: `remove-last-without-pop`

Given an array, remove the last element of the array without using the built-in \`.pop()\` method. Modify the array in-place and return it. If the array is empty, return it unchanged.

### Example 1:

**Input:** arr = [1, 2, 3]  
**Output:** [1, 2]

---

## 27. Shift Array Elements Left (Easy)

**Slug**: `shift-elements-left`

Given an array, shift all elements one position to the left. The first element should wrap around to the end of the array (circular shift). Modify the array in-place and return it.

### Example 1:

**Input:** arr = [1, 2, 3, 4]  
**Output:** [2, 3, 4, 1]

---

## 28. Rotate Array N Times (Medium)

**Slug**: `rotate-array-n-times`

Given an array, rotate the elements \`n\` times to the right. Rotation is in-place.
If \`n\` is positive, rotate right. If \`n\` is negative, rotate left.
\`n\` can be larger than the array length.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5], n = 2  
**Output:** [4, 5, 1, 2, 3]

---

## 29. Sort Array Manually (Medium)

**Slug**: `sort-array-manually`

Given an array of numbers, sort the elements in ascending order in-place without using the built-in \`.sort()\` method. Return the sorted array.

### Example 1:

**Input:** arr = [5, 3, 8, 1, 2]  
**Output:** [1, 2, 3, 5, 8]

---

## 30. Check Element Without Includes (Easy)

**Slug**: `check-element-without-includes`

Given an array and a target value, check if the target element exists in the array. Do not use the built-in \`.includes()\` or \`.indexOf()\` methods. Return \`true\` if it exists, and \`false\` otherwise.

### Example 1:

**Input:** arr = [1, 2, 3], target = 2  
**Output:** true

---

## 31. Find First Occurrence (Easy)

**Slug**: `find-first-occurrence`

Given an array and a target, find and return the index of the first occurrence of the target in the array. Do not use the built-in \`.indexOf()\` method. Return \`-1\` if the target is not found.

### Example 1:

**Input:** arr = [1, 2, 3, 2], target = 2  
**Output:** 1

---

## 32. Find All Occurrences (Easy)

**Slug**: `find-all-occurrences`

Given an array and a target, find and return an array containing all indices where the target occurs in the array. If the target is not found, return an empty array.

### Example 1:

**Input:** arr = [1, 2, 3, 2, 4, 2], target = 2  
**Output:** [1, 3, 5]

---

## 33. Find Max and Min Without Math (Easy)

**Slug**: `find-max-min-without-math`

Given an array of numbers, find the maximum and minimum elements in the array without using \`Math.max()\` or \`Math.min()\`. Return an object \`{ max: number, min: number }\`. If the array is empty, return \`{ max: null, min: null }\`.

### Example 1:

**Input:** arr = [5, 2, 9, 1, 7]  
**Output:** {"max": 9, "min": 1}

---

## 34. Frequency of Elements (Medium)

**Slug**: `frequency-of-elements`

Given an array, find the frequency of each element in the array. Return an object where the keys are the elements and the values are their counts (frequencies).

### Example 1:

**Input:** arr = [1, 2, 2, 3, 3, 3]  
**Output:** {"1": 1, "2": 2, "3": 3}

---

## 35. Count 1s in Numbers (Medium)

**Slug**: `count-ones-in-numbers`

Given an array of numbers, count the total number of times the digit \`1\` appears across all numbers. E.g. in the number \`11\`, the digit \`1\` appears twice.

### Example 1:

**Input:** arr = [1, 11, 21, 31, 41]  
**Output:** 6  
**Explanation:** Digit 1 appears once in 1, twice in 11, once in 21, once in 31, and once in 41. Total is 1 + 2 + 1 + 1 + 1 = 6.

---

## 36. Flip Sign with ForEach (Easy)

**Slug**: `flip-sign-with-foreach`

Given an array of numbers, flip the sign of all numbers using the \`.forEach()\` method. The operation must modify the original array in-place and return it. Handle \`0\` such that it remains \`0\` (rather than \`-0\`).

### Example 1:

**Input:** arr = [1, -2, 3]  
**Output:** [-1, 2, -3]

---

## 37. Sum Values Multiple Ways (Medium)

**Slug**: `sum-values-multiple-ways`

Given an array of numbers, calculate the sum of all elements three different ways. Return an object with three properties: \`{ whileSum: number, forEachSum: number, reduceSum: number }\` indicating the sum computed via a \`while\` loop, \`.forEach()\`, and \`.reduce()\` respectively.

### Example 1:

**Input:** arr = [1, 2, 3, 4]  
**Output:** {"whileSum": 10, "forEachSum": 10, "reduceSum": 10}

---

## 38. FizzBuzz Array (Easy)

**Slug**: `fizzbuzz-array`

Given an integer \`n\`, return a string array of length \`n\` (1-indexed representation) where:

- \`arr[i - 1] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`arr[i - 1] == "Fizz"\` if \`i\` is divisible by 3.
- \`arr[i - 1] == "Buzz"\` if \`i\` is divisible by 5.
- \`arr[i - 1] == String(i)\` if none of the above are true.

### Example 1:

**Input:** n = 5  
**Output:** ["1", "2", "Fizz", "4", "Buzz"]

---

## 39. Pairs with Target Sum (Medium)

**Slug**: `pairs-with-target-sum`

Given an array of integers and a target sum, find all unique pairs of numbers that add up to the target.
Each pair \`[a, b]\` in the return array should be sorted such that \`a <= b\`.
The list of pairs should be sorted lexicographically by their first element \`a\` to ensure a deterministic output.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5], target = 6  
**Output:** [[1, 5], [2, 4]]

---

## 40. Two Numbers Closest to Zero (Medium)

**Slug**: `two-numbers-closest-to-zero`

Given an array of numbers, find two numbers whose sum is closest to zero. Return the two numbers as an array \`[a, b]\` sorted in ascending order (\`a <= b\`).
If there are multiple pairs with the same absolute sum, return the one with the smaller first number.
If the array contains fewer than two elements, return an empty array \`[]\`.

### Example 1:

**Input:** arr = [1, 60, -10, 70, -80, 85]  
**Output:** [-80, 85]  
**Explanation:** -80 + 85 = 5, which is closest to 0 among all pairs.

---

## 41. Remove the Nth Element (Easy)

**Slug**: `remove-nth-element`

Given an array and an index \`n\`, return a new array with the element at index \`n\` removed. Do not modify the original array.
If \`n\` is out of bounds (negative or greater than or equal to the array length), return a copy of the original array.

### Example 1:

**Input:** arr = [1, 2, 3, 4], n = 2  
**Output:** [1, 2, 4]

---

## 42. Remove Second-Last Element (Easy)

**Slug**: `remove-second-last-element`

Given an array, remove the second-to-last element of the array in-place. Return the modified array.
If the array contains fewer than 2 elements, return the array unmodified.

### Example 1:

**Input:** arr = [1, 2, 3, 4]  
**Output:** [1, 2, 4]

---

## 43. Insert at Specific Index (Easy)

**Slug**: `insert-at-specific-index`

Given an array, an element, and an index, return a new array with the element inserted at that specific index. Do not modify the original array.
If the index is negative, insert it at the beginning (index 0). If the index is larger than the array length, insert it at the end.

### Example 1:

**Input:** arr = [1, 2, 4], element = 3, index = 2  
**Output:** [1, 2, 3, 4]

---

## 44. First 5 Multiples of 3 (while) (Easy)

**Slug**: `first-five-multiples-of-three`

Write a function that returns an array containing the first 5 positive multiples of 3 (3, 6, 9, 12, 15) using a \`while\` loop.

### Example:

**Output:** [3, 6, 9, 12, 15]

---

## 45. Even Numbers 20 to 2 (while) (Easy)

**Slug**: `even-numbers-20-to-2`

Write a function that returns an array containing all even numbers from 20 down to 2 inclusive in descending order using a \`while\` loop.

### Example:

**Output:** [20, 18, 16, 14, 12, 10, 8, 6, 4, 2]

---

## 46. Array Length Without .length (Medium)

**Slug**: `array-length-without-property`

Given an array, find and return its length without using the \`.length\` property of the array.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** 5

---

## 47. Remove Duplicates with Reduce (Medium)

**Slug**: `remove-duplicates-with-reduce`

Given an array, remove all duplicate elements using the \`.reduce()\` method. Return a new array with the unique values in their original order.

### Example 1:

**Input:** arr = [1, 2, 2, 3, 1, 4]  
**Output:** [1, 2, 3, 4]

---

## 48. Create an Array (Easy)

**Slug**: `create-array`

Write a function that creates and returns a new array of a given size, filled with a specified value.

### Example 1:

**Input:** size = 3, value = "a"  
**Output:** ["a", "a", "a"]  
**Explanation:** An array of size 3 is created where every element is "a".

### Example 2:

**Input:** size = 4, value = 0  
**Output:** [0, 0, 0, 0]  
**Explanation:** An array of size 4 is created filled with 0.

### Constraints:

- 0 <= size <= 100

---

## 49. Find Largest Element (Easy)

**Slug**: `find-largest-element`

Given an array of numbers, find and return the largest element. If the array is empty, return \`null\`.

### Example 1:

**Input:** arr = [1, 5, 3, 9, 2]  
**Output:** 9

### Example 2:

**Input:** arr = [-5, -2, -10]  
**Output:** -2

### Constraints:

- 0 <= arr.length <= 10^4
- -10^9 <= arr[i] <= 10^9

---

## 50. Find Smallest Element (Easy)

**Slug**: `find-smallest-element`

Given an array of numbers, find and return the smallest element. If the array is empty, return \`null\`.

### Example 1:

**Input:** arr = [1, 5, 3, 9, 2]  
**Output:** 1

### Example 2:

**Input:** arr = [-5, -2, -10]  
**Output:** -10

### Constraints:

- 0 <= arr.length <= 10^4
- -10^9 <= arr[i] <= 10^9

---

## 51. Find First Even Number (Easy)

**Slug**: `find-first-even-number`

Given an array of numbers, find and return the first even number. If there is no even number, return \`null\`.

### Example 1:

**Input:** arr = [1, 3, 5, 4, 7, 8]  
**Output:** 4

### Example 2:

**Input:** arr = [1, 3, 5, 7]  
**Output:** null

### Constraints:

- 0 <= arr.length <= 10^4

---

## 52. Find Average of Numbers (Easy)

**Slug**: `find-average-of-numbers`

Given an array of numbers, find and return their average value. If the array is empty, return 0.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** 3

### Example 2:

**Input:** arr = [10, 20]  
**Output:** 15

### Constraints:

- 0 <= arr.length <= 10^4

---

## 53. Find Middle Element (Easy)

**Slug**: `find-middle-element`

Given an array, return the middle element. For arrays with an even number of elements, return the element at the index \`(length / 2) - 1\` (the left-middle element). If the array is empty, return \`null\`.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** 3  
**Explanation:** The middle element is 3 at index 2.

### Example 2:

**Input:** arr = [10, 20, 30, 40]  
**Output:** 20  
**Explanation:** Even length. The middle elements are 20 and 30. The left-middle element 20 is returned.

### Constraints:

- 0 <= arr.length <= 10^4

---

## 54. Find Square of Numbers (Easy)

**Slug**: `find-square-of-numbers`

Given an array of numbers, return a new array containing the square of each number.

### Example 1:

**Input:** arr = [1, 2, 3]  
**Output:** [1, 4, 9]

### Example 2:

**Input:** arr = [-2, 0, 4]  
**Output:** [4, 0, 16]

### Constraints:

- 0 <= arr.length <= 10^4

---

## 55. Find Unique Elements (Easy)

**Slug**: `find-unique-elements`

Given an array, return a new array containing only the unique elements. The elements must appear in the same order as their first appearance in the input array.

### Example 1:

**Input:** arr = [1, 2, 2, 3, 4, 4, 1]  
**Output:** [1, 2, 3, 4]

### Example 2:

**Input:** arr = ["a", "b", "a", "c"]  
**Output:** ["a", "b", "c"]

### Constraints:

- 0 <= arr.length <= 10^4

---

## 56. Find Unique Number (Easy)

**Slug**: `find-unique-number`

Given a non-empty array of integers where every element appears twice except for one, find and return that single unique number.

### Example 1:

**Input:** arr = [2, 2, 1]  
**Output:** 1

### Example 2:

**Input:** arr = [4, 1, 2, 1, 2]  
**Output:** 4

### Constraints:

- 1 <= arr.length <= 3 \* 10^4
- Each element in the array appears twice except for one element which appears only once.

---

## 57. Find Duplicate Elements (Easy)

**Slug**: `find-duplicate-elements`

Given an array, find and return all elements that appear more than once. The resulting array should contain unique values and maintain their order of first duplication.

### Example 1:

**Input:** arr = [1, 2, 3, 2, 1, 4]  
**Output:** [2, 1]

### Example 2:

**Input:** arr = [1, 2, 3, 4]  
**Output:** []

### Constraints:

- 0 <= arr.length <= 10^4

---

## 58. Find Missing Numbers in Sorted Array (Easy)

**Slug**: `find-missing-numbers`

Given a sorted array of unique integers representing a sequential range with some numbers missing, return a new array containing all the missing numbers.

### Example 1:

**Input:** arr = [1, 2, 4, 6]  
**Output:** [3, 5]

### Example 2:

**Input:** arr = [10, 11, 15]  
**Output:** [12, 13, 14]

### Constraints:

- 0 <= arr.length <= 10^3

---

## 59. Sum of Two Numbers Equals Target (Easy)

**Slug**: `sum-of-two-numbers-equals-target`

Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`. If no such pair exists, return \`null\`.
Assume each input would have at most one solution. Return indices as \`[index1, index2]\` where \`index1 < index2\`.

### Example 1:

**Input:** nums = [2, 7, 11, 15], target = 9  
**Output:** [0, 1]  
**Explanation:** nums[0] + nums[1] = 2 + 7 = 9.

### Example 2:

**Input:** nums = [3, 2, 4], target = 6  
**Output:** [1, 2]

### Constraints:

- 2 <= nums.length <= 10^4
- -10^9 <= nums[i], target <= 10^9

---

## 60. Sort Array Descending (Easy)

**Slug**: `sort-array-descending`

Given an array of numbers, return a new array containing the elements sorted in descending order. Do not modify the original array.

### Example 1:

**Input:** arr = [3, 1, 4, 1, 5, 9]  
**Output:** [9, 5, 4, 3, 1, 1]

### Example 2:

**Input:** arr = [10, -5, 20]  
**Output:** [20, 10, -5]

### Constraints:

- 0 <= arr.length <= 10^4

---

## 61. Sort Using While Loop (Medium)

**Slug**: `sort-using-while-loop`

Given an array of numbers, sort the elements in ascending order in-place using a \`while\` loop (instead of a \`for\` loop or the built-in \`.sort()\` method). Return the sorted array.

### Example 1:

**Input:** arr = [5, 3, 8, 1, 2]  
**Output:** [1, 2, 3, 5, 8]

### Constraints:

- 0 <= arr.length <= 10^3

---

## 62. Sort Prime Numbers from an Unsorted Array (Medium)

**Slug**: `sort-primes-unsorted-array`

Given an unsorted array of positive integers, return a new array containing only the prime numbers sorted in ascending order. A prime number is a positive integer greater than 1 that has no positive divisors other than 1 and itself.

### Example 1:

**Input:** nums = [10, 3, 7, 1, 4, 5, 2]  
**Output:** [2, 3, 5, 7]  
**Explanation:** The primes in the array are 2, 3, 5, and 7. Sorted ascending: [2, 3, 5, 7].

### Example 2:

**Input:** nums = [4, 6, 8, 9, 10]  
**Output:** []

### Constraints:

- 0 <= nums.length <= 10^4
- 1 <= nums[i] <= 10^6

---

## 63. Reverse Array Using For Loop (Easy)

**Slug**: `reverse-array-using-for-loop`

Given an array, return a new array with elements in reverse order. You must construct the reversed array using a \`for\` loop (do not use the built-in \`.reverse()\` method). Do not modify the original array.

### Example 1:

**Input:** arr = [1, 2, 3]  
**Output:** [3, 2, 1]

### Constraints:

- 0 <= arr.length <= 10^4

---

## 64. Reverse Array Using While Loop (Easy)

**Slug**: `reverse-array-using-while-loop`

Given an array, return a new array with elements in reverse order. You must construct the reversed array using a \`while\` loop (do not use the built-in \`.reverse()\` method). Do not modify the original array.

### Example 1:

**Input:** arr = [1, 2, 3]  
**Output:** [3, 2, 1]

### Constraints:

- 0 <= arr.length <= 10^4

---

## 65. Swap Two Arrays Without Extra Array (Medium)

**Slug**: `swap-two-arrays-without-extra-array`

Given two arrays of the same length \`arr1\` and \`arr2\`, swap all their elements in-place without creating a new helper array (i.e. you can swap index-by-index in-place). Return a 2D array \`[arr1, arr2]\` representing the modified arrays.

### Example 1:

**Input:** arr1 = [1, 2, 3], arr2 = [4, 5, 6]  
**Output:** [[4, 5, 6], [1, 2, 3]]

### Constraints:

- arr1.length === arr2.length
- 0 <= arr1.length <= 10^3

---

## 66. Swap All Elements Between Two Arrays (Medium)

**Slug**: `swap-all-elements-between-two-arrays`

Given two arrays of potentially different lengths \`arr1\` and \`arr2\`, swap their entire contents in-place so that \`arr1\` gets the original contents of \`arr2\` and vice versa. Modify the original arrays in-place and return a 2D array \`[arr1, arr2]\` containing the modified arrays.
Note: You can use array manipulation methods like \`.splice()\` to change the lengths of the arrays in-place.

### Example 1:

**Input:** arr1 = [1, 2, 3], arr2 = [4, 5]  
**Output:** [[4, 5], [1, 2, 3]]

### Constraints:

- 0 <= arr1.length, arr2.length <= 10^3

---

## 67. Store Odd Numbers in One Array and Even Numbers in Another Without New Array (Medium)

**Slug**: `store-odd-even-without-new-array`

Given a source array \`arr\` and two target arrays \`odds\` and \`evens\`, distribute the odd and even numbers from \`arr\` into \`odds\` and \`evens\` respectively in-place without declaring any new arrays inside the function. Modify \`odds\` and \`evens\` and return a 2D array \`[odds, evens]\`.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5], odds = [], evens = []  
**Output:** [[1, 3, 5], [2, 4]]

### Constraints:

- 0 <= arr.length <= 10^3

---

## 68. Delete Duplicate Without Built-in Methods (Medium)

**Slug**: `delete-duplicate-without-builtin-methods`

Given an array, remove all duplicate elements in-place and return the modified array. You must do this manually without using built-in methods like \`Set\`, \`filter\`, \`indexOf\`, \`includes\`, or allocating a new array.

### Example 1:

**Input:** arr = [1, 2, 2, 3, 1, 4]  
**Output:** [1, 2, 3, 4]

### Constraints:

- 0 <= arr.length <= 10^3

---

## 69. Delete Odd Numbers Without New Array (Medium)

**Slug**: `delete-odd-numbers-without-new-array`

Given an array of numbers, remove all odd numbers in-place (modifying the array directly) without allocating a new array or using \`.filter()\`. Return the modified array.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** [2, 4]

### Constraints:

- 0 <= arr.length <= 10^3

---

## 70. Remove Elements Between Two Indexes (Easy)

**Slug**: `remove-elements-between-indexes`

Given an array, a start index \`start\`, and an end index \`end\`, return a new array with all elements between \`start\` and \`end\` inclusive removed. Do not modify the original array.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5], start = 1, end = 3  
**Output:** [1, 5]  
**Explanation:** Elements at index 1, 2, and 3 (2, 3, and 4) are removed.

### Constraints:

- 0 <= start <= end < arr.length

---

## 71. Delete Middle Element (Easy)

**Slug**: `delete-middle-element`

Given an array, remove the middle element of the array in-place. If the array has an even number of elements, remove the left-middle element (at index \`(length / 2) - 1\`). Return the modified array.
If the array is empty, return it unchanged.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** [1, 2, 4, 5]  
**Explanation:** Middle element is 3 (index 2), which is removed.

### Example 2:

**Input:** arr = [10, 20, 30, 40]  
**Output:** [10, 30, 40]  
**Explanation:** Even length. The left-middle element is 20 (index 1), which is removed.

### Constraints:

- 0 <= arr.length <= 10^3

---

## 72. Insert into Same Array Without Built-in Methods (Medium)

**Slug**: `insert-into-same-array-without-builtins`

Given an array, a target index, and an element, insert the element at the specified index in-place (modifying the original array) without using any built-in array methods (like \`.splice()\`, \`.push()\`, or \`.unshift()\`). Return the modified array.
If the index is out of bounds (negative or greater than array length), you should cap it to 0 or array length.

### Example 1:

**Input:** arr = [1, 2, 4], index = 2, element = 3  
**Output:** [1, 2, 3, 4]

### Constraints:

- 0 <= arr.length <= 1000

---

## 73. Push Elements into Another Array Without push() (Easy)

**Slug**: `push-elements-without-push-method`

Given two arrays \`arr\` and \`elements\`, append all elements from the \`elements\` array to the end of \`arr\` in-place without using the built-in \`.push()\` method. Return the modified \`arr\`.

### Example 1:

**Input:** arr = [1, 2], elements = [3, 4]  
**Output:** [1, 2, 3, 4]

### Constraints:

- 0 <= arr.length, elements.length <= 10^3

---

## 74. Multiply Every Element by 2 (Easy)

**Slug**: `multiply-every-element-by-two`

Given an array of numbers, return a new array containing each element multiplied by 2. Do not modify the original array.

### Example 1:

**Input:** arr = [1, 2, 3]  
**Output:** [2, 4, 6]

### Constraints:

- 0 <= arr.length <= 10^4

---

## 75. Multiply Even Numbers and Store in Another Array (Easy)

**Slug**: `multiply-evens-and-store`

Given an array of numbers \`arr\` and a target array \`target\`, multiply all even numbers in \`arr\` by 2 and store them at the end of the \`target\` array in-place. Return the modified \`target\` array. Do not allocate any new arrays.

### Example 1:

**Input:** arr = [1, 2, 3, 4], target = [10]  
**Output:** [10, 4, 8]  
**Explanation:** Even numbers in arr are 2 and 4. Multiplied by 2: 4 and 8. Appended to [10]: [10, 4, 8].

### Constraints:

- 0 <= arr.length, target.length <= 10^3

---

## 76. Filter Prime Numbers (Easy)

**Slug**: `filter-prime-numbers`

Given an array of numbers, return a new array containing only the prime numbers. A prime number is a positive integer greater than 1 that has no positive divisors other than 1 and itself.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5, 6, 7]  
**Output:** [2, 3, 5, 7]

### Constraints:

- 0 <= arr.length <= 10^4
- -10^6 <= arr[i] <= 10^6

---

## 77. Two Sum (Easy)

**Slug**: `two-sum`

Given an array of integers \`nums\` and an integer \`target\`, return _indices of the two numbers such that they add up to \`target\`_.

You may assume that each input would have **_exactly_ one solution**, and you may not use the _same_ element twice.

You can return the answer in any order.

### Example 1:

**Input:** nums = [2,7,11,15], target = 9  
**Output:** [0,1]  
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

---

## 78. Chunk Array (Easy)

**Slug**: `chunk-array`

Given an array \`arr\` and a chunk size \`size\`, return a **chunked** array.

A chunked array contains the original elements broken into sub-arrays of length \`size\`. The last sub-array may be shorter than \`size\` if the array length is not evenly divisible.

You must not modify the original array.

### Example 1:

**Input:** arr = [1, 2, 3, 4, 5], size = 2  
**Output:** [[1, 2], [3, 4], [5]]

---

## 79. Flatten Array (Medium)

**Slug**: `flatten-array`

Given a multi-dimensional array \`arr\` and a depth \`n\`, return a **flattened** array.

A multi-dimensional array is a recursive data structure containing integers or other multi-dimensional arrays. A flattened array contains the elements in their original order, with all sub-arrays flattened up to depth \`n\`.

If \`n\` is not provided, flatten the array completely.

### Example 1:

**Input:** arr = [1, 2, 3, [4, 5, [6, 7]], 8, [9]], n = 1  
**Output:** [1, 2, 3, 4, 5, [6, 7], 8, 9]

---

## 80. Merge Sorted Arrays (Easy)

**Slug**: `merge-sorted-arrays`

You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

The modification must be in-place. The array \`nums1\` has a length of \`m + n\`, where the first \`m\` elements denote the elements that should be merged, and the last \`n\` elements are set to 0 and should be ignored.

### Example 1:

**Input:** nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3  
**Output:** [1,2,2,3,5,6]

---

## 81. Sum of Elements Using Reduce (Easy)

**Slug**: `sum-elements-using-reduce`

Given an array of numbers, return the sum of all elements using the \`reduce()\` method.

### Example 1:

**Input:** nums = [ 1, 2, 3, 4 ]  
**Output:** 10

### Constraints:

- 0 <= nums.length <= 10^4
- -10^6 <= nums[i] <= 10^6

---

## 82. Highest Even Number Using Reduce (Easy)

**Slug**: `highest-even-number-using-reduce`

Given an array of numbers, find and return the highest even number in the array using the \`reduce()\` method. If there are no even numbers, return \`null\`.

### Example 1:

**Input:** nums = [ 1, 5, 8, 3, 10, 2 ]  
**Output:** 10

---

## 83. Sum Positive Numbers Using Reduce (Easy)

**Slug**: `sum-positive-numbers-using-reduce`

Given an array of numbers, return the sum of all positive numbers (strictly greater than 0) in the array using the \`reduce()\` method. If there are no positive numbers, return 0.

### Example 1:

**Input:** nums = [ 1, -2, 3, 4, -5 ]  
**Output:** 8

---

## 84. Double Numbers Using Map (Easy)

**Slug**: `double-numbers-using-map`

Given an array of numbers, return a new array where each number is doubled, using the \`map()\` method.

### Example 1:

**Input:** nums = [ 1, 2, 3 ]  
**Output:** [ 2, 4, 6 ]

---

## 85. Filter Even Numbers (Easy)

**Slug**: `filter-even-numbers`

Given an array of numbers, return a new array containing only the even numbers, using the \`filter()\` method.

### Example 1:

**Input:** nums = [ 1, 2, 3, 4, 5, 6 ]  
**Output:** [ 2, 4, 6 ]

---
