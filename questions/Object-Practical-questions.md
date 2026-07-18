# Object Practical Questions

This document lists the practical questions from the `seed-objects.ts` seed file, including their descriptions and difficulty levels.

## 1. Remove Last Property (Medium)

**Slug**: `objects-remove-last-property`

Given an object, remove the last property from it in-place and return the modified object. The last property is defined by the order returned by \`Object.keys()\`. If the object is empty, return it unchanged.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "a": 1 }

---

## 2. Add Field to Object (Easy)

**Slug**: `add-field-to-object`

Given an object, a key, and a value, add the key-value pair to the object in-place and return the modified object.

### Example 1:

**Input:** obj = { "name": "Alice" }, key = "age", value = 25  
**Output:** { "name": "Alice", "age": 25 }

---

## 3. Object Manipulation (Easy)

**Slug**: `objects-manipulation-basic`

Given an object representing a user, update their \`role\` to \`"admin"\` and add a boolean field \`verified\` set to \`true\`. Do this in-place and return the modified object.

### Example 1:

**Input:** user = { "name": "Bob", "role": "user" }  
**Output:** { "name": "Bob", "role": "admin", "verified": true }

---

## 4. Check if Object is Empty (Easy)

**Slug**: `check-if-object-is-empty`

Given an object, return \`true\` if it contains no properties, and \`false\` otherwise.

### Example 1:

**Input:** obj = {}  
**Output:** true

### Example 2:

**Input:** obj = { "a": 1 }  
**Output:** false

---

## 5. Find Sum of Keys (Easy)

**Slug**: `find-sum-of-keys`

Given an object where all keys represent numbers (as strings), return the sum of all keys as numbers. If the object has no keys, return 0.

### Example 1:

**Input:** obj = { "10": "apple", "20": "banana" }  
**Output:** 30

---

## 6. Find Sum of Values (Easy)

**Slug**: `find-sum-of-values`

Given an object containing numeric values, return the sum of all its values. Ignore any values that are not numbers.

### Example 1:

**Input:** obj = { "a": 10, "b": 20, "c": "ignore" }  
**Output:** 30

---

## 7. Find Average of Values (Easy)

**Slug**: `find-average-of-values`

Given an object with numeric values, return the average of all its values. Ignore any non-numeric values. If the object contains no numeric values, return 0.

### Example 1:

**Input:** obj = { "a": 10, "b": 20, "c": 30 }  
**Output:** 20

---

## 8. Find Total Price of Products (Easy)

**Slug**: `find-total-price-of-products`

Given an object representing products where the keys are product names and the values are objects containing \`price\` (number) and \`quantity\` (number), calculate and return the total price of all items (sum of price \* quantity for each item).

### Example 1:

**Input:** products = { "apple": { "price": 1.5, "quantity": 4 }, "banana": { "price": 0.8, "quantity": 10 } }  
**Output:** 14  
**Explanation:** (1.5 _ 4) + (0.8 _ 10) = 6 + 8 = 14.

---

## 9. Find Largest Value (Easy)

**Slug**: `find-largest-value`

Given an object with numeric values, find and return the largest value. If the object has no numeric values, return \`null\`.

### Example 1:

**Input:** obj = { "a": 5, "b": 12, "c": 3 }  
**Output:** 12

---

## 10. Find Second Largest Value (Easy)

**Slug**: `find-second-largest-value`

Given an object with numeric values, find and return the second largest unique value. If there are fewer than 2 unique numeric values, return \`null\`.

### Example 1:

**Input:** obj = { "a": 10, "b": 25, "c": 25, "d": 5 }  
**Output:** 10  
**Explanation:** Unique values are 25, 10, 5. The second largest is 10.

---

## 11. Find Largest Value and Key (Easy)

**Slug**: `find-largest-value-and-key`

Given an object with numeric values, find the property with the largest value. Return an object with the format \`{ key: string, value: number }\`. If the object has no numeric values, return \`{ key: null, value: null }\`.

### Example 1:

**Input:** obj = { "a": 10, "b": 20, "c": 5 }  
**Output:** { "key": "b", "value": 20 }

---

## 12. Find Keys Where Value is Greater Than 10 (Easy)

**Slug**: `find-keys-value-greater-than-ten`

Given an object with numeric values, return an array of all keys whose values are strictly greater than 10. The keys should be returned in their original order.

### Example 1:

**Input:** obj = { "a": 5, "b": 12, "c": 8, "d": 15 }  
**Output:** [ "b", "d" ]

---

## 13. Check if Key Exists (Easy)

**Slug**: `check-if-key-exists`

Given an object and a key string, return \`true\` if the key exists as a direct property of the object, and \`false\` otherwise. Do not use built-in search methods; check using the \`in\` operator or \`hasOwnProperty\`.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }, key = "b"  
**Output:** true

### Example 2:

**Input:** obj = { "a": 1 }, key = "z"  
**Output:** false

---

## 14. Check if Value Exists (Easy)

**Slug**: `check-if-value-exists`

Given an object and a target value, return \`true\` if the value exists in the object, and \`false\` otherwise.

### Example 1:

**Input:** obj = { "a": 10, "b": 20 }, value = 20  
**Output:** true

---

## 15. Double Every Value (Easy)

**Slug**: `double-every-value`

Given an object with numeric values, double all of its values in-place and return the modified object.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "a": 2, "b": 4 }

---

## 16. Delete Keys Where Value is Less Than 15 (Easy)

**Slug**: `delete-keys-less-than-fifteen`

Given an object with numeric values, delete all properties whose values are strictly less than 15 in-place. Return the updated object.

### Example 1:

**Input:** obj = { "a": 10, "b": 20, "c": 15 }  
**Output:** { "b": 20, "c": 15 }

---

## 17. Merge Two Objects (Easy)

**Slug**: `objects-merge-two-objects`

Given two objects \`obj1\` and \`obj2\`, return a new object containing all properties of both. If there are duplicate keys, properties from \`obj2\` should overwrite those in \`obj1\`. Do not modify the original objects.

### Example 1:

**Input:** obj1 = { "a": 1 }, obj2 = { "b": 2 }  
**Output:** { "a": 1, "b": 2 }

---

## 18. Swap Keys and Values (Medium)

**Slug**: `swap-keys-and-values`

Given an object, return a new object where the keys and values are swapped (the original values become the new keys, and original keys become the new values). Assume all values are unique and can be converted to strings.

### Example 1:

**Input:** obj = { "a": "x", "b": "y" }  
**Output:** { "x": "a", "y": "b" }

---

## 19. Reverse Object Order (Medium)

**Slug**: `reverse-object-order`

Given an object, return a new object containing the same key-value pairs but in reverse property insertion order (based on \`Object.keys()\`).

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "b": 2, "a": 1 }

---

## 20. Convert Array of Objects into Object (Medium)

**Slug**: `convert-array-of-objects-into-object`

Given an array of objects and a key name \`keyField\`, convert the array into a single object where the keys are the values of \`keyField\` from each object, and the values are the objects themselves (excluding the \`keyField\` property). Assume \`keyField\` value is unique across objects.

### Example 1:

**Input:** arr = [ { "id": "1", "name": "Alice" }, { "id": "2", "name": "Bob" } ], keyField = "id"  
**Output:** { "1": { "name": "Alice" }, "2": { "name": "Bob" } }

---

## 21. Count Keys (Easy)

**Slug**: `count-keys`

Given an object, return the total count of keys present in the object.

### Example 1:

**Input:** obj = { "a": 1, "b": 2, "c": 3 }  
**Output:** 3

---

## 22. Print Keys and Values (Easy)

**Slug**: `print-keys-and-values`

Given an object, return an array of strings formatted as \`"key: value"\` for each property in the object.

### Example 1:

**Input:** obj = { "name": "Alice", "age": 25 }  
**Output:** [ "name: Alice", "age: 25" ]

---

## 23. Object Keys Demystified (Easy)

**Slug**: `object-keys-demo`

Given an object, return an array containing all of its key names. Do not use built-in loops; use \`Object.keys()\`.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ "a", "b" ]

---

## 24. Object Values Demystified (Easy)

**Slug**: `object-values-demo`

Given an object, return an array containing all of its property values. Use \`Object.values()\`.

### Example 1:

**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ 1, 2 ]

---

## 25. Find Keys Where Value is a String (Easy)

**Slug**: `find-keys-value-is-string`

Given an object, return an array of all keys whose values are of type string. The keys should be returned in their original order.

### Example 1:

**Input:** obj = { "a": 1, "b": "hello", "c": true, "d": "world" }  
**Output:** [ "b", "d" ]

---

## 26. Sort Object by Values (Medium)

**Slug**: `sort-object-by-values`

Given an object with numeric values, return a 2D array representing the key-value entries sorted in ascending order by their values.

### Example 1:

**Input:** obj = { "a": 10, "b": 5, "c": 20 }  
**Output:** [ [ "b", 5 ], [ "a", 10 ], [ "c", 20 ] ]

---

## 27. Remove Keys with Duplicate Values (Medium)

**Slug**: `remove-keys-with-duplicate-values`

Given an object, remove all properties with duplicate values in-place so that only their first occurrence is kept. Return the updated object.

### Example 1:

**Input:** obj = { "a": 1, "b": 2, "c": 1, "d": 2 }  
**Output:** { "a": 1, "b": 2 }

---

## 28. Group by Key (Medium)

**Slug**: `group-by-key`

Given an array of objects and a key name \`key\`, group the objects by their value for that key. Return an object where the keys are the unique values, and the values are arrays containing all objects matching that value.

### Example 1:

**Input:** arr = [ { "name": "Alice", "role": "admin" }, { "name": "Bob", "role": "user" }, { "name": "Charlie", "role": "admin" } ], key = "role"  
**Output:** { "admin": [ { "name": "Alice", "role": "admin" }, { "name": "Charlie", "role": "admin" } ], "user": [ { "name": "Bob", "role": "user" } ] }

---

## 29. Find Keys with Odd Values (Easy)

**Slug**: `find-keys-with-odd-values`

Given an object with numeric values, return an array of all keys whose values are odd numbers. The keys should be returned in their original order.

### Example 1:

**Input:** obj = { "a": 2, "b": 3, "c": 4, "d": 5 }  
**Output:** [ "b", "d" ]

---

## 30. Find Keys with Even Values (Easy)

**Slug**: `find-keys-with-even-values`

Given an object with numeric values, return an array of all keys whose values are even numbers. The keys should be returned in their original order.

### Example 1:

**Input:** obj = { "a": 2, "b": 3, "c": 4, "d": 5 }  
**Output:** [ "a", "c" ]

---

## 31. Find Keys with Values Greater Than a Number (Easy)

**Slug**: `find-keys-with-values-greater-than`

Given an object with numeric values and a limit number \`limit\`, return an array of all keys whose values are strictly greater than \`limit\`.

### Example 1:

**Input:** obj = { "a": 5, "b": 15, "c": 10 }, limit = 9  
**Output:** [ "b", "c" ]

---

## 32. Find Keys with Values Less Than a Number (Easy)

**Slug**: `find-keys-with-values-less-than`

Given an object with numeric values and a limit number \`limit\`, return an array of all keys whose values are strictly less than \`limit\`.

### Example 1:

**Input:** obj = { "a": 5, "b": 15, "c": 10 }, limit = 11  
**Output:** [ "a", "c" ]

---

## 33. Deep Clone Object (Medium)

**Slug**: `deep-clone-object`

Write a function \`deepClone(obj)\` that returns a deep copy of the passed object.

The object can contain nested objects, arrays, strings, numbers, booleans, null, and Date instances. It must handle circular references correctly without entering an infinite loop.

### Example:

\`\`\`javascript
const original = { a: 1, b: { c: 2 } };
const clone = deepClone(original);
clone.b.c = 3;
original.b.c; // 2
\`\`\`

---

## 34. Event Emitter Class (Medium)

**Slug**: `event-emitter-class`

Design an \`EventEmitter\` class. It should support subscribing to events, unsubscribing from events, and emitting events.

Methods:

1. \`subscribe(eventName, callback)\`: Registers callback for the event. Returns a subscription object with a \`release()\` method to unsubscribe.
2. \`emit(eventName, args)\`: Calls all registered callbacks for the event with the arguments array. Returns an array of execution results.

### Example:

\`\`\`javascript
const emitter = new EventEmitter();
const sub = emitter.subscribe('click', (x) => x \* 2);
emitter.emit('click', [5]); // [10]
sub.release();
emitter.emit('click', [5]); // []
\`\`\`

---
