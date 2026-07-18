# String Practical Questions

This document lists the practical questions from the `seed-strings.ts` seed file, including their descriptions and difficulty levels.

## 1. Reverse String (Easy)

**Slug**: `reverse-string-basic`

Given a string \`str\`, return the reversed string.

### Example 1:

**Input:** str = "hello"  
**Output:** "olleh"

### Constraints:

- 0 <= str.length <= 10^4

---

## 2. Reverse String Using While Loop (Easy)

**Slug**: `reverse-string-while-loop`

Given a string \`str\`, reverse it using a \`while\` loop. Return the reversed string.

### Example 1:

**Input:** str = "hello"  
**Output:** "olleh"

### Constraints:

- 0 <= str.length <= 10^4

---

## 3. Reverse Words in a String (Easy)

**Slug**: `reverse-words-in-string`

Given a string of words separated by spaces, reverse the characters of each individual word in-place while maintaining the original word order.

### Example 1:

**Input:** str = "hello world"  
**Output:** "olleh dlrow"

### Constraints:

- 0 <= str.length <= 10^4

---

## 4. Reverse Words in a Sentence (Easy)

**Slug**: `reverse-words-in-sentence`

Given a sentence (words separated by single spaces), reverse the order of the words. The individual words themselves should not be reversed.

### Example 1:

**Input:** sentence = "the sky is blue"  
**Output:** "blue is sky the"

### Constraints:

- 0 <= sentence.length <= 10^4

---

## 5. Remove Duplicates from String (Easy)

**Slug**: `remove-duplicates-from-string`

Given a string \`str\`, return a new string with all duplicate characters removed, keeping only the first occurrence of each character.

### Example 1:

**Input:** str = "banana"  
**Output:** "ban"

### Constraints:

- 0 <= str.length <= 10^4

---

## 6. Find Frequency of Characters (Easy)

**Slug**: `find-frequency-of-characters`

Given a string \`str\`, find the frequency of each character. Return an object where the keys are characters and the values are their counts.

### Example 1:

**Input:** str = "hello"  
**Output:** { "h": 1, "e": 1, "l": 2, "o": 1 }

### Constraints:

- 0 <= str.length <= 10^4

---

## 7. Find Maximum Occurring Character (Easy)

**Slug**: `find-maximum-occurring-character`

Given a string \`str\`, find and return the character that appears the most times. If there is a tie, return the one that appears first in the string. If the string is empty, return \`null\`.

### Example 1:

**Input:** str = "hello"  
**Output:** "l"  
**Explanation:** "l" appears 2 times, which is more than any other character.

### Example 2:

**Input:** str = "today"  
**Output:** "t"  
**Explanation:** All characters appear once. "t" is returned as it appears first.

### Constraints:

- 0 <= str.length <= 10^4

---

## 8. Find First Non-Repeated Character (Easy)

**Slug**: `find-first-non-repeated-character`

Given a string \`str\`, find and return the first non-repeated character. If all characters are repeated or the string is empty, return \`null\`.

### Example 1:

**Input:** str = "swiss"  
**Output:** "w"  
**Explanation:** "w" is the first character that appears only once in the string.

### Example 2:

**Input:** str = "teeter"  
**Output:** "r"

### Constraints:

- 0 <= str.length <= 10^4

---

## 9. Count Occurrence of a Character (Easy)

**Slug**: `count-occurrence-of-character`

Given a string \`str\` and a character \`char\`, return the number of times \`char\` appears in \`str\`.

### Example 1:

**Input:** str = "hello", char = "l"  
**Output:** 2

### Constraints:

- 0 <= str.length <= 10^4
- char.length === 1

---

## 10. Check Palindrome (Easy)

**Slug**: `check-palindrome`

Given a string \`str\`, return \`true\` if the string is a palindrome, and \`false\` otherwise. A palindrome is a string that reads the same backward as forward, case-sensitive.

### Example 1:

**Input:** str = "racecar"  
**Output:** true

### Example 2:

**Input:** str = "Racecar"  
**Output:** false

### Constraints:

- 0 <= str.length <= 10^4

---

## 11. Check Anagram (Easy)

**Slug**: `check-anagram`

Given two strings \`str1\` and \`str2\`, check if they are anagrams of each other. An anagram is a word formed by rearranging the letters of another, using all original letters exactly once. Case-sensitive.

### Example 1:

**Input:** str1 = "listen", str2 = "silent"  
**Output:** true

### Example 2:

**Input:** str1 = "hello", str2 = "world"  
**Output:** false

### Constraints:

- 0 <= str1.length, str2.length <= 10^4

---

## 12. Check Substring (Easy)

**Slug**: `check-substring`

Given two strings \`str\` and \`sub\`, return \`true\` if \`sub\` is a substring of \`str\`, and \`false\` otherwise. Do not use built-in methods like \`.includes()\` or \`.indexOf()\`.

### Example 1:

**Input:** str = "hello world", sub = "world"  
**Output:** true

### Example 2:

**Input:** str = "javascript", sub = "python"  
**Output:** false

### Constraints:

- 0 <= str.length, sub.length <= 10^4

---

## 13. Check if String Contains Only Digits (Easy)

**Slug**: `check-string-only-digits`

Given a string \`str\`, return \`true\` if the string contains only digits (0-9), and \`false\` otherwise. An empty string should return \`false\`.

### Example 1:

**Input:** str = "12345"  
**Output:** true

### Example 2:

**Input:** str = "123a45"  
**Output:** false

### Constraints:

- 0 <= str.length <= 10^4

---

## 14. Convert to lowercase without built-in methods (Easy)

**Slug**: `convert-to-lowercase-without-builtins`

Given a string \`str\`, return a new string where all uppercase English letters are converted to lowercase, without using the built-in \`.toLowerCase()\` or \`.toLocaleLowerCase()\` methods.

### Example 1:

**Input:** str = "Hello WORLD"  
**Output:** "hello world"

### Constraints:

- 0 <= str.length <= 10^4

---

## 15. Remove Spaces (Easy)

**Slug**: `remove-spaces-from-string`

Given a string \`str\`, return a new string with all space characters removed.

### Example 1:

**Input:** str = "h e l l o"  
**Output:** "hello"

### Constraints:

- 0 <= str.length <= 10^4

---

## 16. Count Vowels (Easy)

**Slug**: `count-vowels-in-string`

Given a string \`str\`, count and return the number of vowels (a, e, i, o, u, case-insensitive) in the string.

### Example 1:

**Input:** str = "hello"  
**Output:** 2

### Constraints:

- 0 <= str.length <= 10^4

---

## 17. Find Longest Word (Easy)

**Slug**: `find-longest-word`

Given a string representing a sentence, find and return the longest word. If there are multiple words of the same maximum length, return the first one. Words are separated by single spaces. Ignore punctuation if any are attached to words.

### Example 1:

**Input:** str = "The quick brown fox jumps over the lazy dog"  
**Output:** "quick"  
**Explanation:** Both "quick" and "brown" have length 5. The first one, "quick", is returned.

### Constraints:

- 0 <= str.length <= 10^4

---

## 18. Reverse a String (Easy)

**Slug**: `reverse-a-string`

Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.

### Example 1:

**Input:** s = ["h","e","l","l","o"]  
**Output:** ["o","l","l","e","h"]

---

## 19. Palindrome Checker (Easy)

**Slug**: `palindrome-checker`

A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` _if it is a palindrome, or \`false\` otherwise_.

### Example 1:

**Input:** s = "A man, a plan, a canal: Panama"  
**Output:** true  
**Explanation:** "amanaplanacanalpanama" is a palindrome.

---
