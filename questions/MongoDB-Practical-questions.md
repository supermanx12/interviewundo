# MongoDB Practical Questions

This document lists the 42 new MongoDB query and aggregation problems added to the platform, including their descriptions, difficulty levels, and solution queries.

---

## 1. Find Active Users Over 18 (Easy)

**Description**: Find all documents in the `users` collection where `active` is `true` and `age` is greater than or equal to 18. Return only the fields `name` and `age` (exclude `_id`). Sort the results by `age` in ascending order, and then by `name` in ascending order.
**Solution**:

```javascript
db.users
  .find({ active: true, age: { $gte: 18 } }, { _id: 0, name: 1, age: 1 })
  .sort({ age: 1, name: 1 });
```

---

## 2. Count Users by City (Easy)

**Description**: Group the documents in the `users` collection by the `city` field and return the total count of users in each city. The output documents should contain fields `city` and `totalUsers` (exclude `_id`). Sort the output alphabetically by `city`.
**Solution**:

```javascript
db.users.aggregate([
  { $group: { _id: '$city', totalUsers: { $sum: 1 } } },
  { $project: { city: '$_id', totalUsers: 1, _id: 0 } },
  { $sort: { city: 1 } },
]);
```

---

## 3. Filter Products by Multiple Tags (Easy)

**Description**: Find all products in the `products` collection that contain both `"electronics"` and `"wireless"` in their `tags` array. Return only the `name` and `tags` fields, excluding the `_id` field. Sort by product `name` alphabetically.
**Solution**:

```javascript
db.products
  .find({ tags: { $all: ['electronics', 'wireless'] } }, { _id: 0, name: 1, tags: 1 })
  .sort({ name: 1 });
```

---

## 4. Highest Priced Product per Category (Easy)

**Description**: Group products in the `products` collection by `category` and find the highest product price in each category. The output documents should contain the fields `category` and `maxPrice` (exclude `_id`). Sort the results by `maxPrice` in descending order.
**Solution**:

```javascript
db.products.aggregate([
  { $group: { _id: '$category', maxPrice: { $max: '$price' } } },
  { $project: { category: '$_id', maxPrice: 1, _id: 0 } },
  { $sort: { maxPrice: -1 } },
]);
```

---

## 5. Concatenate First and Last Name (Easy)

**Description**: Project the `firstName` and `lastName` fields in the `users` collection as a single concatenated field named `fullName`, separated by a space (e.g. `"John Doe"`). Exclude the `_id` field. Sort the results alphabetically by `fullName` in ascending order.
**Solution**:

```javascript
db.users.aggregate([
  { $project: { fullName: { $concat: ['$firstName', ' ', '$lastName'] }, _id: 0 } },
  { $sort: { fullName: 1 } },
]);
```

---

## 6. Find Older Employees (Easy)

**Description**: Find all employees in the `employees` collection whose `age` is strictly greater than 50, OR who have been with the company for at least 25 years (`yearsOfService >= 25`). Return only the `name` field, excluding the `_id` field. Sort alphabetically by `name`.
**Solution**:

```javascript
db.employees
  .find({ $or: [{ age: { $gt: 50 } }, { yearsOfService: { $gte: 25 } }] }, { _id: 0, name: 1 })
  .sort({ name: 1 });
```

---

## 7. Calculate Total Inventory Value (Easy)

**Description**: Calculate the total value of all items in the `inventory` collection. The value of an item is calculated as `price * quantity`. The result should be returned as a single document with the field `totalValue` representing the sum of all item values.
**Solution**:

```javascript
db.inventory.aggregate([
  { $group: { _id: null, totalValue: { $sum: { $multiply: ['$price', '$quantity'] } } } },
  { $project: { _id: 0, totalValue: 1 } },
]);
```

---

## 8. Filter Orders by Year (Easy)

**Description**: Find all orders in the `orders` collection that were placed in the year 2023. Return the `orderId` and `date` fields, excluding `_id`. Sort by `date` in ascending order.
**Solution**:

```javascript
db.orders.aggregate([
  { $project: { orderId: 1, date: 1, year: { $year: '$date' }, _id: 0 } },
  { $match: { year: 2023 } },
  { $project: { year: 0 } },
  { $sort: { date: 1 } },
]);
```

---

## 9. Average Rating of Reviews (Easy)

**Description**: Each document in the `products` collection contains a nested array of `reviews`, where each review has a numeric `rating`. Calculate the average rating for each product. Return documents with the product `name` and a new field `averageRating` (exclude `_id`). Sort by `averageRating` in descending order.
**Solution**:

```javascript
db.products.aggregate([
  { $project: { name: 1, averageRating: { $avg: '$reviews.rating' }, _id: 0 } },
  { $sort: { averageRating: -1 } },
]);
```

---

## 10. Find Books with Multiple Authors (Easy)

**Description**: Find all books in the `books` collection where the size of the `authors` array is strictly greater than 3. Return only the `title` and `authors` fields, excluding `_id`. Sort alphabetically by book `title`.
**Solution**:

```javascript
db.books.aggregate([
  {
    $project: {
      title: 1,
      authors: 1,
      numAuthors: { $size: { $ifNull: ['$authors', []] } },
      _id: 0,
    },
  },
  { $match: { numAuthors: { $gt: 3 } } },
  { $project: { numAuthors: 0 } },
  { $sort: { title: 1 } },
]);
```

---

## 11. Retrieve Out of Stock Items (Easy)

**Description**: Find all products in the `products` collection where the `stock` field is either `0`, `null`, or does not exist. Return only the `name` and `stock` fields, excluding `_id`. Sort alphabetically by `name`.
**Solution**:

```javascript
db.products
  .find(
    { $or: [{ stock: 0 }, { stock: null }, { stock: { $exists: false } }] },
    { _id: 0, name: 1, stock: 1 },
  )
  .sort({ name: 1 });
```

---

## 12. Calculate Discounted Price (Easy)

**Description**: Project a new field `discountedPrice` for each product in the `products` collection. The `discountedPrice` should be calculated as the original `price` minus 15% (`price * 0.85`). Return fields `name`, `price`, and `discountedPrice` (exclude `_id`). Sort by product `name` alphabetically.
**Solution**:

```javascript
db.products.aggregate([
  { $project: { name: 1, price: 1, discountedPrice: { $multiply: ['$price', 0.85] }, _id: 0 } },
  { $sort: { name: 1 } },
]);
```

---

## 13. Get List of Unique Categories (Easy)

**Description**: Find all unique categories in the `products` collection. The results should contain only the field `category` (excluding `_id` and any null values). Sort alphabetically by `category`.
**Solution**:

```javascript
db.products.aggregate([
  { $group: { _id: '$category' } },
  { $match: { _id: { $ne: null } } },
  { $project: { category: '$_id', _id: 0 } },
  { $sort: { category: 1 } },
]);
```

---

## 14. Find Top 3 Highest Earners (Easy)

**Description**: Find the top 3 employees in the `employees` collection who have the highest `salary`. Return their `name` and `salary` fields, excluding the `_id` field. Sort the results by `salary` in descending order, then by `name` alphabetically.
**Solution**:

```javascript
db.employees.find({}, { _id: 0, name: 1, salary: 1 }).sort({ salary: -1, name: 1 }).limit(3);
```

---

## 15. Filter by Nested Address Country (Easy)

**Description**: Find all users in the `users` collection whose nested field `address.country` is exactly `"Canada"`. Return their `name` and the nested `address` field (exclude `_id`). Sort alphabetically by `name`.
**Solution**:

```javascript
db.users.find({ 'address.country': 'Canada' }, { _id: 0, name: 1, address: 1 }).sort({ name: 1 });
```

---

## 16. Rename Age Field to Years (Easy)

**Description**: Retrieve all documents from the `users` collection, projecting the field `age` renamed to `years`, and including the field `name` (exclude `_id`). Sort alphabetically by `name`.
**Solution**:

```javascript
db.users.aggregate([{ $project: { name: 1, years: '$age', _id: 0 } }, { $sort: { name: 1 } }]);
```

---

## 17. Calculate Order Quantity Stats (Easy)

**Description**: Find the minimum, maximum, and average value of the `quantity` field across all documents in the `orders` collection. Return a single document with fields `minQty`, `maxQty`, and `avgQty` (exclude `_id`).
**Solution**:

```javascript
db.orders.aggregate([
  {
    $group: {
      _id: null,
      minQty: { $min: '$quantity' },
      maxQty: { $max: '$quantity' },
      avgQty: { $avg: '$quantity' },
    },
  },
  { $project: { _id: 0, minQty: 1, maxQty: 1, avgQty: 1 } },
]);
```

---

## 18. Find Tasks with High Priority (Easy)

**Description**: Find all tasks in the `tasks` collection where `priority` is `"High"` AND `status` is NOT `"Completed"`. Return only fields `title` and `priority` (exclude `_id`). Sort alphabetically by `title`.
**Solution**:

```javascript
db.tasks
  .find({ priority: 'High', status: { $ne: 'Completed' } }, { _id: 0, title: 1, priority: 1 })
  .sort({ title: 1 });
```

---

## 19. Get Character Length of Description (Easy)

**Description**: For each product in the `products` collection, calculate the character length of its `description` field. Return documents with fields `name` and `descLength` (exclude `_id`). Sort by `descLength` in descending order.
**Solution**:

```javascript
db.products.aggregate([
  { $project: { name: 1, descLength: { $strLenCP: { $ifNull: ['$description', ''] } }, _id: 0 } },
  { $sort: { descLength: -1 } },
]);
```

---

## 20. Users with Null or Missing Emails (Easy)

**Description**: Find all users in the `users` collection who have a `null` email OR are missing the `email` field entirely. Return only their `name` field, excluding `_id`. Sort alphabetically by `name`.
**Solution**:

```javascript
db.users
  .find({ $or: [{ email: null }, { email: { $exists: false } }] }, { _id: 0, name: 1 })
  .sort({ name: 1 });
```

---

## 21. Unwind and Count Tag Frequency (Medium)

**Description**: Using the `products` collection, unwind the `tags` array and calculate the frequency/count of each tag across all products. Return documents containing `tag` and `frequency` (exclude `_id`). Sort by `frequency` in descending order, then by `tag` alphabetically in ascending order.
**Solution**:

```javascript
db.products.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', frequency: { $sum: 1 } } },
  { $project: { tag: '$_id', frequency: 1, _id: 0 } },
  { $sort: { frequency: -1, tag: 1 } },
]);
```

---

## 22. Filter Array Elements using $filter (Medium)

**Description**: In the `students` collection, each document contains an array of `scores` (integers). Use the `$filter` operator to return only scores that are greater than or equal to 80. Project `name` and a new field `highScores` containing the filtered array (exclude `_id`). Sort by `name` alphabetically.
**Solution**:

```javascript
db.students.aggregate([
  {
    $project: {
      name: 1,
      highScores: {
        $filter: {
          input: { $ifNull: ['$scores', []] },
          as: 'score',
          cond: { $gte: ['$$score', 80] },
        },
      },
      _id: 0,
    },
  },
  { $sort: { name: 1 } },
]);
```

---

## 23. Calculate Salary Grade (Medium)

**Description**: For each employee in the `employees` collection, determine their salary grade:

- Grade `"A"` if `salary` is 100,000 or more.
- Grade `"B"` if `salary` is between 50,000 (inclusive) and 100,000 (exclusive).
- Grade `"C"` otherwise.
  Return fields `name`, `salary`, and `grade` (exclude `_id`). Sort by `salary` in descending order, then alphabetically by `name`.
  **Solution**:

```javascript
db.employees.aggregate([
  {
    $project: {
      name: 1,
      salary: 1,
      grade: {
        $cond: {
          if: { $gte: ['$salary', 100000] },
          then: 'A',
          else: {
            $cond: {
              if: { $gte: ['$salary', 50000] },
              then: 'B',
              else: 'C',
            },
          },
        },
      },
      _id: 0,
    },
  },
  { $sort: { salary: -1, name: 1 } },
]);
```

---

## 24. Group Orders by Month (Medium)

**Description**: Group all orders in the `orders` collection by the month they were placed. The `date` field is stored as a Date object. Return the fields `month` (1 to 12) and `totalSales` (exclude `_id`). Sort by `month` in ascending order.
**Solution**:

```javascript
db.orders.aggregate([
  { $project: { month: { $month: '$date' }, amount: 1 } },
  { $group: { _id: '$month', totalSales: { $sum: '$amount' } } },
  { $project: { month: '$_id', totalSales: 1, _id: 0 } },
  { $sort: { month: 1 } },
]);
```

---

## 25. Join Customers and Orders (Medium)

**Description**: Perform a join between the `customers` and `orders` collections. Match the `customers.id` with `orders.customer_id`. Return documents containing the customer's `name` and a new field `orderCount` (exclude `_id`). Sort by `orderCount` in descending order, then alphabetically by `name`.
**Solution**:

```javascript
db.customers.aggregate([
  {
    $lookup: {
      from: 'orders',
      localField: 'id',
      foreignField: 'customer_id',
      as: 'customerOrders',
    },
  },
  { $project: { name: 1, orderCount: { $size: '$customerOrders' }, _id: 0 } },
  { $sort: { orderCount: -1, name: 1 } },
]);
```

---

## 26. Highest Scored Subject per Student (Medium)

**Description**: Each document in the `students` collection contains an array of `scores` objects, where each object has fields `subject` (string) and `score` (integer). Find the highest scoring subject and its score for each student. Return documents with the `name` of the student, and fields `subject` and `score` representing their highest scored subject. Exclude `_id`. Sort alphabetically by student `name`.
**Solution**:

```javascript
db.students.aggregate([
  { $unwind: '$scores' },
  { $sort: { 'scores.score': -1 } },
  {
    $group: {
      _id: '$name',
      topSubject: { $first: '$scores' },
    },
  },
  {
    $project: { name: '$_id', subject: '$topSubject.subject', score: '$topSubject.score', _id: 0 },
  },
  { $sort: { name: 1 } },
]);
```

---

## 27. Common Tags Between Preferences (Medium)

**Description**: In the `users` collection, each document contains two arrays: `likes` and `recommended`. Find the intersection (common items) between these two arrays. Project the user `name` and a new field `common` containing the array of common items. Exclude `_id`. Sort the results alphabetically by `name`.
**Solution**:

```javascript
db.users.aggregate([
  { $project: { name: 1, common: { $setIntersection: ['$likes', '$recommended'] }, _id: 0 } },
  { $sort: { name: 1 } },
]);
```

---

## 28. Extract Area Code from Phone (Medium)

**Description**: In the `contacts` collection, each document contains a string field `phone` in the format `XXX-XXX-XXXX`. Extract the area code (the first 3 characters) and return it in a new field named `areaCode`, along with the contact `name`. Exclude `_id`. Sort alphabetically by `name`.
**Solution**:

```javascript
db.contacts.aggregate([
  { $project: { name: 1, areaCode: { $substrCP: ['$phone', 0, 3] }, _id: 0 } },
  { $sort: { name: 1 } },
]);
```

---

## 29. Total Transaction Amount by User (Medium)

**Description**: In the `accounts` collection, each document represents a user account and contains a nested array `transactions` where each transaction document has a field `type` (`"deposit"` or `"withdrawal"`) and `amount` (positive integer). Calculate the net balance for each user by adding deposits and subtracting withdrawals. Return documents with the user's `name` and their net `balance`. Exclude `_id`. Sort by `balance` in descending order, then alphabetically by `name`.
**Solution**:

```javascript
db.accounts.aggregate([
  { $unwind: { path: '$transactions', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      name: 1,
      netAmount: {
        $cond: {
          if: { $eq: ['$transactions.type', 'deposit'] },
          then: '$transactions.amount',
          else: {
            $cond: {
              if: { $eq: ['$transactions.type', 'withdrawal'] },
              then: { $multiply: ['$transactions.amount', -1] },
              else: 0,
            },
          },
        },
      },
    },
  },
  { $group: { _id: '$name', balance: { $sum: '$netAmount' } } },
  { $project: { name: '$_id', balance: 1, _id: 0 } },
  { $sort: { balance: -1, name: 1 } },
]);
```

---

## 30. Filter Tasks Overdue (Medium)

**Description**: Each document in the `projects` collection represents a project and contains a nested array `tasks` where each task has a `title` (string), a `dueDate` (Date object), and a `completed` (boolean) status. Find all projects that have at least one uncompleted task with a `dueDate` before `2023-06-01T00:00:00Z`. Return only the project `name` field, excluding the `_id` field. Sort alphabetically by `name`.
**Solution**:

```javascript
db.projects.aggregate([
  { $unwind: '$tasks' },
  {
    $match: {
      'tasks.completed': false,
      'tasks.dueDate': { $lt: new Date('2023-06-01T00:00:00Z') },
    },
  },
  { $group: { _id: '$name' } },
  { $project: { name: '$_id', _id: 0 } },
  { $sort: { name: 1 } },
]);
```

---

## 31. Average Age of Active Customers (Easy)

**Description**: Find the average age of active customers in the `customers` collection (where `status` is `"active"`). Return the result as a single document with the field `avgAge` (exclude `_id`). If there are no active customers, return an empty array.
**Solution**:

```javascript
db.customers.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: null, avgAge: { $avg: '$age' } } },
  { $project: { avgAge: 1, _id: 0 } },
]);
```

---

## 32. Match Products with Price Limits (Easy)

**Description**: Find all products in the `products` collection whose `price` is between `50` (inclusive) and `150` (inclusive), AND whose `inStock` status is `true`. Return the `name` and `price` fields (exclude `_id`). Sort the results by `price` in ascending order.
**Solution**:

```javascript
db.products
  .find({ price: { $gte: 50, $lte: 150 }, inStock: true }, { _id: 0, name: 1, price: 1 })
  .sort({ price: 1 });
```

---

## 33. Find Top 2 Rated Books (Easy)

**Description**: Find the top 2 books in the `books` collection with the highest `rating`. Return their `title` and `rating` fields (exclude `_id`). Sort the results by `rating` in descending order, then alphabetically by `title`.
**Solution**:

```javascript
db.books.find({}, { _id: 0, title: 1, rating: 1 }).sort({ rating: -1, title: 1 }).limit(2);
```

---

## 34. Count Employees in Department (Easy)

**Description**: Group employees in the `employees` collection by the `department` field, and count the total number of employees in each department. Return the fields `department` and `count` (exclude `_id`). Sort alphabetically by `department`.
**Solution**:

```javascript
db.employees.aggregate([
  { $group: { _id: '$department', count: { $sum: 1 } } },
  { $project: { department: '$_id', count: 1, _id: 0 } },
  { $sort: { department: 1 } },
]);
```

---

## 35. Match Authors by Country (Easy)

**Description**: Find all authors in the `authors` collection whose `country` is either `"USA"` or `"UK"`. Return only the `name` and `country` fields (exclude `_id`). Sort the results alphabetically by `name`.
**Solution**:

```javascript
db.authors
  .find({ country: { $in: ['USA', 'UK'] } }, { _id: 0, name: 1, country: 1 })
  .sort({ name: 1 });
```

---

## 36. Find Products with Tag Count (Easy)

**Description**: For each product in the `products` collection, calculate the number of tags in the `tags` array. Return documents containing fields `name` and a new field `tagCount`. Exclude `_id`. Sort the results by `tagCount` in descending order, then alphabetically by `name`.
**Solution**:

```javascript
db.products.aggregate([
  { $project: { name: 1, tagCount: { $size: { $ifNull: ['$tags', []] } }, _id: 0 } },
  { $sort: { tagCount: -1, name: 1 } },
]);
```

---

## 37. Get Oldest Registered User (Easy)

**Description**: Find the single user in the `users` collection who has the minimum/earliest `registrationDate`. Return their `name` and `registrationDate` fields (exclude `_id`).
**Solution**:

```javascript
db.users.find({}, { _id: 0, name: 1, registrationDate: 1 }).sort({ registrationDate: 1 }).limit(1);
```

---

## 38. Users with Specific Domain (Easy)

**Description**: Find all users in the `users` collection whose `email` ends with `"@example.com"` (case-insensitive). Return only the `name` and `email` fields (exclude `_id`). Sort alphabetically by `name`.
**Solution**:

```javascript
db.users
  .find({ email: { $regex: /@example\.com$/i } }, { _id: 0, name: 1, email: 1 })
  .sort({ name: 1 });
```

---

## 39. Project String Substring (Medium)

**Description**: For each customer in the `customers` collection, extract the first 4 characters of their `idCard` string field. Return a new field named `idPrefix` along with their `name` (exclude `_id`). Sort alphabetically by `name`.
**Solution**:

```javascript
db.customers.aggregate([
  { $project: { name: 1, idPrefix: { $substrCP: ['$idCard', 0, 4] }, _id: 0 } },
  { $sort: { name: 1 } },
]);
```

---

## 40. Calculate Total Sales Value (Easy)

**Description**: Aggregate the `orders` collection and return the total value of all sales. The value of an order is calculated as `price * quantity`. The result should be returned as a single document with the field `totalSales` (exclude `_id`).
**Solution**:

```javascript
db.orders.aggregate([
  { $group: { _id: null, totalSales: { $sum: { $multiply: ['$price', '$quantity'] } } } },
  { $project: { totalSales: 1, _id: 0 } },
]);
```

---

## 41. Calculate Order Age in Days (Medium)

**Description**: Calculate the age in days of each order in the `orders` collection as of `2023-12-01T00:00:00Z`. Return fields `orderId` and a new field `ageInDays` (truncated to integer using `$floor`, exclude `_id`). Sort by `ageInDays` in descending order.
**Solution**:

```javascript
db.orders.aggregate([
  {
    $project: {
      orderId: 1,
      ageInDays: {
        $floor: {
          $divide: [{ $subtract: [new Date('2023-12-01T00:00:00Z'), '$date'] }, 86400000],
        },
      },
      _id: 0,
    },
  },
  { $sort: { ageInDays: -1 } },
]);
```

---

## 42. Users with Sub-Tasks Accomplished (Medium)

**Description**: Each document in the `users` collection contains a nested array of `tasks` where each task document has fields `title` and `done`. Find all users who have accomplished ALL of their tasks (every task has `done: true`). Users with no tasks should also be included. Return only their `name` field (exclude `_id`). Sort alphabetically by `name`.
**Solution**:

```javascript
db.users.find({ 'tasks.done': { $not: { $ne: true } } }, { _id: 0, name: 1 }).sort({ name: 1 });
```
