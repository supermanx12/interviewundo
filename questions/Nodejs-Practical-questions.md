# Node.js Practical Questions

This document lists the practical questions from the `seed-nodejs.ts` seed file, including their descriptions and difficulty levels.

## 1. Extract Parameter Names Middleware (Easy)

**Slug**: `extract-parameter-names-middleware`

Write a function \`runParamLogger(req, res)\` that simulates the execution of an Express middleware that logs parameter names.

The middleware should:

1. Extract all key names from the request parameters (\`req.params\`).
2. Store these key names as an array in a new property \`req.paramNames\`.
3. If there are no parameters, \`req.paramNames\` should be an empty array.
4. Call a mock \`next()\` function which adds a boolean property \`req.nextCalled = true\`.

Return the modified \`req\` object.

### Example 1:

**Input:** req = { "params": { "userId": "1", "postId": "2" } }  
**Output:** req.paramNames = [ "userId", "postId" ], req.nextCalled = true

---

## 2. Express Middleware Pipeline (Medium)

**Slug**: `express-middleware-pipeline`

Write a function \`runMiddlewarePipeline(req, res, middlewareNames)\` that simulates an Express middleware pipeline.

The function receives a request object \`req\`, a response object \`res\`, and an array of middleware names \`middlewareNames\`.

You must run the middlewares sequentially in the order they appear in the array. Each middleware is a function taking \`(req, res, next)\`.

Implement the following middlewares:

- \`'logger'\`: Sets \`req.logged = true\` and calls \`next()\`.
- \`'auth'\`: If \`req.token\` equals \`"secret"\`, it calls \`next()\`. Otherwise, it sets \`res.status = 401\`, \`res.body = "Unauthorized"\`, and does **not** call \`next()\` (short-circuits).
- \`'timestamp'\`: Sets \`req.timestamp = 123456789\` and calls \`next()\`.

Return an object containing \`{ req, res }\` after the pipeline executes (or short-circuits).

### Example 1:

**Input:** req = {}, res = {}, middlewareNames = ["logger", "timestamp"]  
**Output:** { "req": { "logged": true, "timestamp": 123456789 }, "res": {} }

---

## 3. Hash a String with SHA-256 (Easy)

**Slug**: `hash-string-sha256`

Use Node.js's built-in \`crypto\` module to generate a SHA-256 hash of a given text.

Return the hash as a hexadecimal string.

### Example:

**Input:** text = "hello"  
**Output:** "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"

---

## 4. Parse URL Query Parameters (Easy)

**Slug**: `parse-url-query-params`

Write a function that parses a URL string and returns its query parameters as a key-value object.

You can use Node's built-in \`URL\` API.

### Example:

**Input:** urlString = "https://example.com?name=Alice&age=25"  
**Output:** { "name": "Alice", "age": "25" }

---
